const { Pool } = require('pg');

const DEFAULT_CAPACITY = 12;
const PAYPAL_CAPACITY = 6;
const CASH_CAPACITY = 6;
const DEFAULT_RESERVATION_MINUTES = 15;
const CASH_DEPOSIT_AMOUNT = 10;
const CASH_RESERVATION_TOTAL_AMOUNT = 25;

function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!isDatabaseConfigured()) throw new Error('DATABASE_URL is not configured.');
  if (!global.__workshopPgPool) {
    global.__workshopPgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return global.__workshopPgPool;
}

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id, publicCode: row.public_code, workshopId: row.workshop_id,
    participantName: row.participant_name, email: row.email, phone: row.phone,
    status: row.status, paymentMethod: row.payment_method,
    cashPaymentStatus: row.cash_payment_status, depositAmount: Number(row.deposit_amount || 0),
    depositStatus: row.deposit_status, reservationExpiresAt: row.reservation_expires_at ? Number(row.reservation_expires_at) : null,
    createdAt: Number(row.created_at), updatedAt: Number(row.updated_at),
    paymentApprovedAt: row.payment_approved_at ? Number(row.payment_approved_at) : null,
    reservationEmailSentAt: row.reservation_email_sent_at ? Number(row.reservation_email_sent_at) : null,
    confirmationEmailSentAt: row.confirmation_email_sent_at ? Number(row.confirmation_email_sent_at) : null,
    adminNotificationEmailSentAt: row.admin_notification_email_sent_at ? Number(row.admin_notification_email_sent_at) : null,
    cashPaymentEmailSentAt: row.cash_payment_email_sent_at ? Number(row.cash_payment_email_sent_at) : null,
    depositEmailSentAt: row.deposit_email_sent_at ? Number(row.deposit_email_sent_at) : null,
    paypalOrderId: row.paypal_order_id, paypalCaptureId: row.paypal_capture_id, transactionId: row.transaction_id,
    attendanceStatus: row.attendance_status, attendeeCheckInAt: row.attendee_check_in_at ? Number(row.attendee_check_in_at) : null,
    currency: row.currency, amount: Number(row.amount || 0),
  };
}

async function inTransaction(callback) {
  const client = await getPool().connect();
  try { await client.query('BEGIN'); const result = await callback(client); await client.query('COMMIT'); return result; }
  catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}

async function expire(client, workshopId) {
  const args = [Date.now()];
  const filter = workshopId ? 'and workshop_id = $2' : '';
  if (workshopId) args.push(workshopId);
  await client.query(`update public.workshop_registrations set status = 'reserved_cash', reservation_expires_at = null, updated_at = $1 where status = 'expired' and payment_method = 'cash' and deposit_status = 'paid' ${filter}`, args);
  await client.query(`update public.workshop_registrations set status = 'expired', reservation_expires_at = null, updated_at = $1 where (status = 'pending' or (status = 'reserved_cash' and coalesce(deposit_status, 'pending') <> 'paid')) and reservation_expires_at <= $1 ${filter}`, args);
}

async function metrics(workshopId) {
  await inTransaction((client) => expire(client, workshopId));
  const { rows } = await getPool().query(`select
    count(*) filter (where status = 'paid' and payment_method = 'paypal')::int as paypal_confirmed,
    count(*) filter (where status = 'pending' and reservation_expires_at > $2)::int as paypal_pending,
    count(*) filter (where status in ('reserved_cash', 'cash_paid') and (status = 'cash_paid' or deposit_status = 'paid' or reservation_expires_at > $2))::int as cash_reserved,
    count(*) filter (where status = 'expired')::int as expired_count
    from public.workshop_registrations where workshop_id = $1`, [workshopId, Date.now()]);
  const row = rows[0]; const paypalConfirmedCount = row.paypal_confirmed; const pendingCount = row.paypal_pending; const cashReservedCount = row.cash_reserved;
  const filledSlots = paypalConfirmedCount + pendingCount + cashReservedCount;
  return { workshopId, capacity: DEFAULT_CAPACITY, paypalCapacity: PAYPAL_CAPACITY, cashCapacity: CASH_CAPACITY,
    paypalConfirmedCount, paypalPendingCount: pendingCount, paypalAvailableSlots: Math.max(PAYPAL_CAPACITY - paypalConfirmedCount - pendingCount, 0),
    cashReservedCount, cashAvailableSlots: Math.max(CASH_CAPACITY - cashReservedCount, 0), confirmedCount: paypalConfirmedCount + (await getPool().query("select count(*)::int as count from public.workshop_registrations where workshop_id = $1 and status = 'cash_paid'", [workshopId])).rows[0].count,
    pendingCount, expiredCount: row.expired_count, filledSlots, availableSlots: Math.max(DEFAULT_CAPACITY - filledSlots, 0), isFull: filledSlots >= DEFAULT_CAPACITY };
}

function registrationId() { return `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }
function publicCode() { const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''); }

async function create(input) {
  const workshopId = String(input.workshopId || '').trim(); const participantName = String(input.participantName || '').trim();
  const email = String(input.email || '').trim(); const phone = String(input.phone || '').trim();
  if (!workshopId || !participantName || !email || !phone) throw new Error('All registration fields are required.');
  const paymentMethod = input.paymentMethod || (input.status === 'reserved_cash' ? 'cash' : 'paypal');
  const isCash = paymentMethod === 'cash' || input.status === 'reserved_cash'; const status = input.status || 'pending'; const now = Date.now();
  return inTransaction(async (client) => {
    await client.query('select pg_advisory_xact_lock(hashtext($1))', [workshopId]); await expire(client, workshopId);
    const { rows } = await client.query(`select count(*) filter (where status = 'paid' and payment_method = 'paypal')::int as paid, count(*) filter (where status = 'pending' and reservation_expires_at > $2)::int as pending, count(*) filter (where status in ('reserved_cash', 'cash_paid'))::int as cash from public.workshop_registrations where workshop_id = $1`, [workshopId, now]);
    const counts = rows[0]; if (counts.paid + counts.pending + counts.cash >= DEFAULT_CAPACITY) throw new Error('This workshop is full and cannot accept new registrations.');
    if (isCash && counts.cash >= CASH_CAPACITY) throw new Error('The six in-person payment reservations are already full.');
    if (!isCash && counts.paid + counts.pending >= PAYPAL_CAPACITY) throw new Error('The six PayPal reservations are already full.');
    let code; for (let tries = 0; tries < 5; tries += 1) { code = publicCode(); const exists = await client.query('select 1 from public.workshop_registrations where public_code = $1', [code]); if (!exists.rowCount) break; }
    const values = [registrationId(), code, workshopId, participantName, email, phone, status, paymentMethod, isCash ? 'pending' : null, isCash ? CASH_DEPOSIT_AMOUNT : 0, isCash ? 'pending' : null, input.reservationExpiresAt || (status === 'pending' ? now + DEFAULT_RESERVATION_MINUTES * 60_000 : now + 48 * 60 * 60_000), now, now, input.currency || 'EUR', isCash ? CASH_RESERVATION_TOTAL_AMOUNT : Number(input.amount || 0)];
    const result = await client.query(`insert into public.workshop_registrations (id, public_code, workshop_id, participant_name, email, phone, status, payment_method, cash_payment_status, deposit_amount, deposit_status, reservation_expires_at, created_at, updated_at, currency, amount) values (${values.map((_, index) => `$${index + 1}`).join(', ')}) returning *`, values);
    return mapRow(result.rows[0]);
  });
}

const patchColumns = { publicCode: 'public_code', status: 'status', paymentMethod: 'payment_method', cashPaymentStatus: 'cash_payment_status', depositAmount: 'deposit_amount', depositStatus: 'deposit_status', reservationExpiresAt: 'reservation_expires_at', paymentApprovedAt: 'payment_approved_at', reservationEmailSentAt: 'reservation_email_sent_at', confirmationEmailSentAt: 'confirmation_email_sent_at', adminNotificationEmailSentAt: 'admin_notification_email_sent_at', cashPaymentEmailSentAt: 'cash_payment_email_sent_at', depositEmailSentAt: 'deposit_email_sent_at', paypalOrderId: 'paypal_order_id', paypalCaptureId: 'paypal_capture_id', transactionId: 'transaction_id', attendanceStatus: 'attendance_status', attendeeCheckInAt: 'attendee_check_in_at', amount: 'amount' };
async function update({ registrationId, workshopId, patch }) {
  const entries = Object.entries(patch || {}).filter(([key]) => patchColumns[key]); if (!entries.length) throw new Error('No valid registration fields were provided.');
  const values = entries.map(([, value]) => value); const assignments = entries.map(([key], index) => `${patchColumns[key]} = $${index + 1}`); values.push(Date.now()); assignments.push(`updated_at = $${values.length}`);
  const where = registrationId ? `id = $${values.length + 1}` : `workshop_id = $${values.length + 1} and paypal_order_id = $${values.length + 2}`; values.push(registrationId || workshopId); if (!registrationId) values.push(patch.paypalOrderId);
  const result = await getPool().query(`update public.workshop_registrations set ${assignments.join(', ')} where ${where} returning *`, values); if (!result.rowCount) throw new Error('Registration was not found.'); return mapRow(result.rows[0]);
}
async function byId(id) { const result = await getPool().query('select * from public.workshop_registrations where id = $1', [id]); return mapRow(result.rows[0]); }
async function confirm({ registrationId, paypalOrderId, paypalCaptureId, transactionId }) { const registration = await byId(registrationId); if (!registration) throw new Error('Registration not found for payment confirmation.'); if (registration.status === 'paid') return registration; if (registration.paymentMethod !== 'paypal' || registration.status !== 'pending') throw new Error('Only pending online registrations can be confirmed by payment.'); return update({ registrationId, patch: { status: 'paid', paypalOrderId, paypalCaptureId, transactionId: transactionId || paypalCaptureId || paypalOrderId, paymentApprovedAt: Date.now(), reservationExpiresAt: null } }); }
async function confirmDeposit({ registrationId, paypalOrderId, paypalCaptureId, transactionId }) { const registration = await byId(registrationId); if (!registration || registration.paymentMethod !== 'cash' || registration.status !== 'reserved_cash') throw new Error('Cash reservation could not be found.'); if (registration.depositStatus === 'paid') return registration; return update({ registrationId, patch: { depositStatus: 'paid', depositAmount: CASH_DEPOSIT_AMOUNT, reservationExpiresAt: null, paypalOrderId, paypalCaptureId, transactionId: transactionId || paypalCaptureId || paypalOrderId } }); }
async function cashPayment({ registrationId, cashPaymentStatus }) { const registration = await byId(registrationId); if (!registration || registration.paymentMethod !== 'cash' || !['reserved_cash', 'cash_paid'].includes(registration.status)) throw new Error('Cash reservation could not be found.'); if (cashPaymentStatus === 'paid' && registration.depositStatus !== 'paid') throw new Error('The €10 PayPal deposit must be confirmed before recording the cash balance.'); const paidAt = cashPaymentStatus === 'paid' ? Date.now() : null; return update({ registrationId, patch: { cashPaymentStatus, status: cashPaymentStatus === 'paid' ? 'cash_paid' : 'reserved_cash', paymentApprovedAt: paidAt, attendanceStatus: cashPaymentStatus === 'paid' ? 'present' : registration.attendanceStatus, attendeeCheckInAt: cashPaymentStatus === 'paid' ? paidAt : registration.attendeeCheckInAt } }); }
async function cancel({ registrationId }) { if (!await byId(registrationId)) throw new Error('Registration could not be found.'); return update({ registrationId, patch: { status: 'cancelled', reservationExpiresAt: null } }); }
async function attendance({ registrationId, attendanceStatus }) { if (attendanceStatus !== null && !['present', 'absent'].includes(attendanceStatus)) throw new Error('Attendance status must be pending, present, or absent.'); if (!await byId(registrationId)) throw new Error('Registration could not be found.'); return update({ registrationId, patch: { attendanceStatus, attendeeCheckInAt: attendanceStatus === 'present' ? Date.now() : null } }); }
async function expireAll() { return inTransaction(async (client) => { await expire(client); const result = await client.query("select * from public.workshop_registrations where status = 'pending' and reservation_expires_at > $1 order by created_at desc", [Date.now()]); return result.rows.map(mapRow); }); }
async function list() { const result = await getPool().query('select * from public.workshop_registrations order by created_at desc'); return result.rows.map(mapRow); }
async function listActive() { await expireAll(); return (await list()).filter((entry) => !['cancelled', 'expired'].includes(entry.status)); }

module.exports = { isDatabaseConfigured, metrics, create, update, byId, confirm, confirmDeposit, cashPayment, cancel, attendance, expireAll, list, listActive };
