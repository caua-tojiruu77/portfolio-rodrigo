const fs = require('node:fs/promises');
const path = require('node:path');
const database = require('./workshopDatabase');

const DEFAULT_CAPACITY = 12;
const PAYPAL_CAPACITY = 6;
const CASH_CAPACITY = 6;
const DEFAULT_RESERVATION_MINUTES = 15;
const CASH_DEPOSIT_AMOUNT = 10;
const CASH_REMAINDER_AMOUNT = 15;
const CASH_RESERVATION_TOTAL_AMOUNT = CASH_DEPOSIT_AMOUNT + CASH_REMAINDER_AMOUNT;
const PUBLIC_CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

// WORKSHOP_USE_DATABASE=false keeps local purchase tests out of the configured
// Postgres database while preserving the existing production default.
function useDatabase() {
  if (process.env.WORKSHOP_USE_DATABASE?.toLowerCase() === 'false') return false;
  return database.isDatabaseConfigured() && !process.env.WORKSHOP_STORAGE_PATH;
}

function resolveStoragePath() {
  return process.env.WORKSHOP_STORAGE_PATH || path.join(process.cwd(), 'data', 'workshop-store.json');
}

async function ensureStoreFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.access(filePath);
  } catch (error) {
    await fs.writeFile(filePath, JSON.stringify({ registrations: [] }, null, 2), 'utf8');
  }
}

async function readStore(filePath = resolveStoragePath()) {
  await ensureStoreFile(filePath);
  const raw = await fs.readFile(filePath, 'utf8');

  try {
    const parsed = JSON.parse(raw || '{"registrations":[]}');
    const sourceRegistrations = Array.isArray(parsed.registrations) ? parsed.registrations : [];
    const usedCodes = new Set(sourceRegistrations.map((entry) => entry.publicCode).filter(Boolean));
    let changed = false;
    const registrations = sourceRegistrations.map((entry) => {
      if (entry.publicCode) return entry;
      const publicCode = generatePublicRegistrationCode(usedCodes);
      usedCodes.add(publicCode);
      changed = true;
      return { ...entry, publicCode };
    });

    if (changed) {
      await fs.writeFile(filePath, JSON.stringify({ registrations }, null, 2), 'utf8');
    }

    return {
      registrations,
    };
  } catch (error) {
    return { registrations: [] };
  }
}

async function withStoreLock(filePath, callback) {
  const lockFile = `${filePath}.lock`;
  const timeoutAt = Date.now() + 5000;

  while (Date.now() < timeoutAt) {
    try {
      const handle = await fs.open(lockFile, 'wx');
      await handle.close();
      break;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }

  try {
    return await callback();
  } finally {
    try {
      await fs.unlink(lockFile);
    } catch (error) {
      // no-op if lock file is already gone
    }
  }
}

async function writeStore(store, filePath = resolveStoragePath()) {
  await ensureStoreFile(filePath);
  await fs.writeFile(filePath, JSON.stringify(store, null, 2), 'utf8');
}

function generateRegistrationId() {
  return `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function generatePublicRegistrationCode(usedCodes = new Set()) {
  let code = '';
  do {
    code = Array.from({ length: 6 }, () => PUBLIC_CODE_ALPHABET[Math.floor(Math.random() * PUBLIC_CODE_ALPHABET.length)]).join('');
  } while (usedCodes.has(code));
  return code;
}

function normalizeRegistration(registration) {
  return {
    id: registration.id || generateRegistrationId(),
    publicCode: registration.publicCode || generatePublicRegistrationCode(),
    workshopId: registration.workshopId,
    participantName: String(registration.participantName || '').trim(),
    email: String(registration.email || '').trim(),
    phone: String(registration.phone || '').trim(),
    status: registration.status || 'pending',
    paymentMethod: registration.paymentMethod || (registration.status === 'reserved_cash' ? 'cash' : 'paypal'),
    cashPaymentStatus: registration.cashPaymentStatus || (registration.status === 'reserved_cash' ? 'pending' : null),
    depositAmount: Number(registration.depositAmount || 0),
    depositStatus: registration.depositStatus || null,
    reservationExpiresAt: registration.reservationExpiresAt || null,
    createdAt: registration.createdAt || Date.now(),
    updatedAt: registration.updatedAt || Date.now(),
    paymentApprovedAt: registration.paymentApprovedAt || null,
    reservationEmailSentAt: registration.reservationEmailSentAt || null,
    confirmationEmailSentAt: registration.confirmationEmailSentAt || null,
    adminNotificationEmailSentAt: registration.adminNotificationEmailSentAt || null,
    cashPaymentEmailSentAt: registration.cashPaymentEmailSentAt || null,
    depositEmailSentAt: registration.depositEmailSentAt || null,
    paypalOrderId: registration.paypalOrderId || null,
    paypalCaptureId: registration.paypalCaptureId || null,
    transactionId: registration.transactionId || null,
    attendanceStatus: registration.attendanceStatus || null,
    attendeeCheckInAt: registration.attendeeCheckInAt || null,
    currency: registration.currency || 'EUR',
    amount: registration.amount || 0,
  };
}

async function expirePendingReservations(filePath = resolveStoragePath()) {
  return withStoreLock(filePath, async () => {
    const store = await readStore(filePath);
    let changed = false;

    for (const registration of store.registrations) {
      if (registration.status === 'expired' && registration.paymentMethod === 'cash' && registration.depositStatus === 'paid') {
        registration.status = 'reserved_cash';
        registration.reservationExpiresAt = null;
        registration.updatedAt = Date.now();
        changed = true;
        continue;
      }

      const isPending = registration.status === 'pending'
        || (registration.status === 'reserved_cash' && registration.depositStatus !== 'paid');
      const expired = Number(registration.reservationExpiresAt || 0) <= Date.now();

      if (isPending && expired) {
        registration.status = 'cancelled';
        registration.updatedAt = Date.now();
        registration.reservationExpiresAt = null;
        changed = true;
      }
    }

    if (changed) {
      await writeStore(store, filePath);
    }

    return store.registrations.filter((entry) => entry.status === 'pending' && Number(entry.reservationExpiresAt || 0) > Date.now());
  });
}

async function getWorkshopMetrics(workshopId, filePath = resolveStoragePath()) {
  const store = await readStore(filePath);
  const workshopRegistrations = store.registrations.filter((entry) => entry.workshopId === workshopId);
  const paypalConfirmedCount = workshopRegistrations.filter((entry) => entry.status === 'paid' && entry.paymentMethod === 'paypal').length;
  const pendingCount = workshopRegistrations.filter((entry) => entry.status === 'pending' && Number(entry.reservationExpiresAt || 0) > Date.now()).length;
  const cashReservedCount = workshopRegistrations.filter((entry) => ['reserved_cash', 'cash_paid'].includes(entry.status) && (entry.status === 'cash_paid' || entry.depositStatus === 'paid' || Number(entry.reservationExpiresAt || 0) > Date.now())).length;
  const expiredCount = workshopRegistrations.filter((entry) => entry.status === 'expired').length;
  const confirmedCount = paypalConfirmedCount + workshopRegistrations.filter((entry) => entry.status === 'cash_paid').length;
  const filledSlots = paypalConfirmedCount + pendingCount + cashReservedCount;
  const availableSlots = Math.max(DEFAULT_CAPACITY - filledSlots, 0);

  return {
    workshopId,
    capacity: DEFAULT_CAPACITY,
    paypalCapacity: PAYPAL_CAPACITY,
    cashCapacity: CASH_CAPACITY,
    paypalConfirmedCount,
    paypalPendingCount: pendingCount,
    paypalAvailableSlots: Math.max(PAYPAL_CAPACITY - paypalConfirmedCount - pendingCount, 0),
    cashReservedCount,
    cashAvailableSlots: Math.max(CASH_CAPACITY - cashReservedCount, 0),
    confirmedCount,
    pendingCount,
    expiredCount,
    filledSlots,
    availableSlots,
    isFull: filledSlots >= DEFAULT_CAPACITY,
  };
}

async function createWorkshopRegistration({
  workshopId,
  participantName,
  email,
  phone,
  status = 'pending',
  paymentMethod,
  reservationExpiresAt,
  currency = 'EUR',
  amount = 0,
}, filePath = resolveStoragePath()) {
  return withStoreLock(filePath, async () => {
    const store = await readStore(filePath);
    const normalizedWorkshopId = String(workshopId || '').trim();
    const normalizedName = String(participantName || '').trim();
    const normalizedEmail = String(email || '').trim();
    const normalizedPhone = String(phone || '').trim();

    if (!normalizedWorkshopId || !normalizedName || !normalizedEmail || !normalizedPhone) {
      throw new Error('All registration fields are required.');
    }

    const activeRegistrations = store.registrations.filter((entry) => entry.workshopId === normalizedWorkshopId && entry.status !== 'cancelled' && entry.status !== 'expired');
    const paypalConfirmedCount = activeRegistrations.filter((entry) => entry.status === 'paid' && entry.paymentMethod === 'paypal').length;
    const paypalPendingCount = activeRegistrations.filter((entry) => entry.status === 'pending' && Number(entry.reservationExpiresAt || 0) > Date.now()).length;
    const cashReservedCount = activeRegistrations.filter((entry) => ['reserved_cash', 'cash_paid'].includes(entry.status) && (entry.status === 'cash_paid' || entry.depositStatus === 'paid' || Number(entry.reservationExpiresAt || 0) > Date.now())).length;

    const selectedPaymentMethod = paymentMethod || (status === 'reserved_cash' ? 'cash' : 'paypal');
    const isCashReservation = status === 'reserved_cash' || selectedPaymentMethod === 'cash';
    const isReservationAttempt = status === 'pending' || isCashReservation;
    const shouldBlockNewRegistration = isReservationAttempt || status === 'paid' || status === 'cash_paid';

    if (shouldBlockNewRegistration && paypalConfirmedCount + paypalPendingCount + cashReservedCount >= DEFAULT_CAPACITY) {
      throw new Error('This workshop is full and cannot accept new registrations.');
    }

    if (isCashReservation && cashReservedCount >= CASH_CAPACITY) {
      throw new Error('The six in-person payment reservations are already full.');
    }

    if (!isCashReservation && (status === 'pending' || status === 'paid') && paypalConfirmedCount + paypalPendingCount >= PAYPAL_CAPACITY) {
      throw new Error('The six PayPal reservations are already full.');
    }

    const usedCodes = new Set(store.registrations.map((entry) => entry.publicCode).filter(Boolean));
    const registration = normalizeRegistration({
      id: generateRegistrationId(),
      publicCode: generatePublicRegistrationCode(usedCodes),
      workshopId: normalizedWorkshopId,
      participantName: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      status,
      paymentMethod: selectedPaymentMethod,
      cashPaymentStatus: isCashReservation ? 'pending' : null,
      depositAmount: isCashReservation ? CASH_DEPOSIT_AMOUNT : 0,
      depositStatus: isCashReservation ? 'pending' : null,
      reservationExpiresAt: reservationExpiresAt || (status === 'pending' ? Date.now() + DEFAULT_RESERVATION_MINUTES * 60 * 1000 : null),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currency,
      amount: isCashReservation ? CASH_RESERVATION_TOTAL_AMOUNT : amount,
    });

    store.registrations.push(registration);
    await writeStore(store, filePath);

    return registration;
  });
}

async function updateWorkshopRegistration({
  registrationId,
  workshopId,
  patch,
}, filePath = resolveStoragePath()) {
  return withStoreLock(filePath, async () => {
    const store = await readStore(filePath);

    const registration = store.registrations.find((entry) => {
      if (registrationId) return entry.id === registrationId;
      if (workshopId) return entry.workshopId === workshopId && entry.paypalOrderId === patch.paypalOrderId;
      return false;
    });

    if (!registration) {
      throw new Error('Registration was not found.');
    }

    Object.assign(registration, patch, {
      updatedAt: Date.now(),
    });

    await writeStore(store, filePath);
    return registration;
  });
}

/**
 * @param {{registrationId?: string, workshopId?: string, paypalOrderId?: string|null, paypalCaptureId?: string|null, transactionId?: string|null}} options
 */
async function confirmWorkshopRegistration({
  registrationId,
  workshopId,
  paypalOrderId,
  paypalCaptureId,
  transactionId,
}, filePath = resolveStoragePath()) {
  return withStoreLock(filePath, async () => {
    const store = await readStore(filePath);

    const registration = store.registrations.find((entry) => {
      if (registrationId) return entry.id === registrationId;
      if (workshopId && paypalOrderId) return entry.workshopId === workshopId && entry.paypalOrderId === paypalOrderId;
      return false;
    });

    if (!registration) {
      throw new Error('Registration not found for payment confirmation.');
    }

    if (registration.status === 'paid') {
      return registration;
    }

    if (registration.paymentMethod !== 'paypal' || registration.status !== 'pending') {
      throw new Error('Only pending online registrations can be confirmed by payment.');
    }

    const currentMetrics = await getWorkshopMetrics(registration.workshopId, filePath);
    if (currentMetrics.paypalConfirmedCount >= PAYPAL_CAPACITY) {
      const hasAnyPaidSeat = registration.status === 'paid';
      if (!hasAnyPaidSeat) {
        throw new Error('Workshop capacity is full. The reservation cannot be confirmed.');
      }
    }

    registration.status = 'paid';
    registration.paymentMethod = 'paypal';
    registration.paypalOrderId = paypalOrderId || registration.paypalOrderId;
    registration.paypalCaptureId = paypalCaptureId || registration.paypalCaptureId;
    registration.transactionId = transactionId || registration.transactionId || paypalCaptureId || paypalOrderId;
    registration.paymentApprovedAt = Date.now();
    registration.confirmedAt = Date.now();
    registration.reservationExpiresAt = null;
    registration.updatedAt = Date.now();

    await writeStore(store, filePath);
    return registration;
  });
}

async function markCashPayment({ registrationId, cashPaymentStatus }, filePath = resolveStoragePath()) {
  return withStoreLock(filePath, async () => {
    const store = await readStore(filePath);
    const registration = store.registrations.find((entry) => entry.id === registrationId);

    if (!registration || registration.paymentMethod !== 'cash' || !['reserved_cash', 'cash_paid'].includes(registration.status)) {
      throw new Error('Cash reservation could not be found.');
    }

    if (!['pending', 'paid'].includes(cashPaymentStatus)) {
      throw new Error('Cash payment status must be pending or paid.');
    }

    if (cashPaymentStatus === 'paid' && registration.depositStatus !== 'paid') {
      throw new Error('The €10 PayPal deposit must be confirmed before recording the cash balance.');
    }

    registration.cashPaymentStatus = cashPaymentStatus;
    registration.status = cashPaymentStatus === 'paid' ? 'cash_paid' : 'reserved_cash';
    registration.paymentApprovedAt = cashPaymentStatus === 'paid' ? Date.now() : null;
    registration.attendanceStatus = cashPaymentStatus === 'paid' ? 'present' : registration.attendanceStatus;
    registration.attendeeCheckInAt = cashPaymentStatus === 'paid' ? Date.now() : registration.attendeeCheckInAt;
    registration.updatedAt = Date.now();
    await writeStore(store, filePath);
    return registration;
  });
}

async function confirmCashDeposit({ registrationId, paypalOrderId, paypalCaptureId, transactionId }, filePath = resolveStoragePath()) {
  return withStoreLock(filePath, async () => {
    const store = await readStore(filePath);
    const registration = store.registrations.find((entry) => entry.id === registrationId);

    if (!registration || registration.paymentMethod !== 'cash' || registration.status !== 'reserved_cash') {
      throw new Error('Cash reservation could not be found.');
    }

    if (registration.depositStatus === 'paid') return registration;

    registration.amount = CASH_RESERVATION_TOTAL_AMOUNT;
    registration.depositAmount = CASH_DEPOSIT_AMOUNT;
    registration.depositStatus = 'paid';
    registration.paymentApprovedAt = Date.now();
    registration.reservationExpiresAt = null;
    registration.paypalOrderId = paypalOrderId || registration.paypalOrderId;
    registration.paypalCaptureId = paypalCaptureId || registration.paypalCaptureId;
    registration.transactionId = transactionId || registration.transactionId || paypalCaptureId || paypalOrderId;
    registration.updatedAt = Date.now();
    await writeStore(store, filePath);
    return registration;
  });
}

async function cancelWorkshopRegistration({ registrationId }, filePath = resolveStoragePath()) {
  return withStoreLock(filePath, async () => {
    const store = await readStore(filePath);
    const registration = store.registrations.find((entry) => entry.id === registrationId);

    if (!registration) {
      throw new Error('Registration could not be found.');
    }

    registration.status = 'cancelled';
    registration.reservationExpiresAt = null;
    registration.updatedAt = Date.now();
    await writeStore(store, filePath);
    return registration;
  });
}

async function markAttendance({ registrationId, attendanceStatus }, filePath = resolveStoragePath()) {
  return withStoreLock(filePath, async () => {
    const store = await readStore(filePath);
    const registration = store.registrations.find((entry) => entry.id === registrationId);

    if (!registration) {
      throw new Error('Registration could not be found.');
    }

    if (attendanceStatus !== null && !['present', 'absent'].includes(attendanceStatus)) {
      throw new Error('Attendance status must be pending, present, or absent.');
    }

    registration.attendanceStatus = attendanceStatus;
    registration.attendeeCheckInAt = attendanceStatus === 'present' ? Date.now() : null;
    registration.updatedAt = Date.now();

    await writeStore(store, filePath);
    return registration;
  });
}

async function listWorkshopRegistrations(filePath = resolveStoragePath()) {
  const store = await readStore(filePath);
  return [...store.registrations].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
}

async function listActiveWorkshopRegistrations(filePath = resolveStoragePath()) {
  await expirePendingReservations(filePath);
  const registrations = await listWorkshopRegistrations(filePath);
  return registrations.filter((entry) => !['cancelled', 'expired'].includes(entry.status));
}

async function getWorkshopRegistrationById(registrationId, filePath = resolveStoragePath()) {
  const store = await readStore(filePath);
  return store.registrations.find((entry) => entry.id === registrationId) || null;
}

module.exports = {
  DEFAULT_CAPACITY,
  DEFAULT_RESERVATION_MINUTES,
  PAYPAL_CAPACITY,
  CASH_CAPACITY,
  CASH_DEPOSIT_AMOUNT,
  CASH_REMAINDER_AMOUNT,
  CASH_RESERVATION_TOTAL_AMOUNT,
  expirePendingReservations: (...args) => useDatabase() ? database.expireAll() : expirePendingReservations(...args),
  getWorkshopMetrics: (...args) => useDatabase() ? database.metrics(...args) : getWorkshopMetrics(...args),
  createWorkshopRegistration: (...args) => useDatabase() ? database.create(...args) : createWorkshopRegistration(...args),
  updateWorkshopRegistration: (...args) => useDatabase() ? database.update(...args) : updateWorkshopRegistration(...args),
  confirmWorkshopRegistration: (...args) => useDatabase() ? database.confirm(...args) : confirmWorkshopRegistration(...args),
  markCashPayment: (...args) => useDatabase() ? database.cashPayment(...args) : markCashPayment(...args),
  confirmCashDeposit: (...args) => useDatabase() ? database.confirmDeposit(...args) : confirmCashDeposit(...args),
  cancelWorkshopRegistration: (...args) => useDatabase() ? database.cancel(...args) : cancelWorkshopRegistration(...args),
  markAttendance: (...args) => useDatabase() ? database.attendance(...args) : markAttendance(...args),
  listWorkshopRegistrations: (...args) => useDatabase() ? database.list(...args) : listWorkshopRegistrations(...args),
  listActiveWorkshopRegistrations: (...args) => useDatabase() ? database.listActive(...args) : listActiveWorkshopRegistrations(...args),
  getWorkshopRegistrationById: (...args) => useDatabase() ? database.byId(...args) : getWorkshopRegistrationById(...args),
  readStore,
  writeStore,
  generateRegistrationId,
  generatePublicRegistrationCode,
  resolveStoragePath,
};
