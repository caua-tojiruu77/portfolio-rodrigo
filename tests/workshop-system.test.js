const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');

const { getWorkshopMetrics, createWorkshopRegistration, expirePendingReservations, markCashPayment, confirmCashDeposit, cancelWorkshopRegistration, listActiveWorkshopRegistrations, listWorkshopRegistrations } = require('../utils/workshopStore');

async function createTempStore() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'workshops-'));
  const file = path.join(dir, 'workshop-store.json');
  process.env.WORKSHOP_STORAGE_PATH = file;
  return { dir, file };
}

test('it blocks the 13th confirmed registration and keeps a temporary booking count', async () => {
  const { file } = await createTempStore();
  const workshopId = 'handstand-beginners';

  await fs.writeFile(file, JSON.stringify({ registrations: [] }, null, 2));

  for (let i = 0; i < 6; i += 1) {
    const reg = await createWorkshopRegistration({
      workshopId,
      participantName: `Participant ${i + 1}`,
      email: `person${i + 1}@example.com`,
      phone: `+1555${i}`,
      status: 'paid',
    });

    assert.equal(reg.status, 'paid');
  }

  const metrics = await getWorkshopMetrics(workshopId);
  assert.equal(metrics.paypalConfirmedCount, 6);
  assert.equal(metrics.paypalAvailableSlots, 0);
  assert.equal(metrics.availableSlots, 6);
  assert.equal(metrics.isFull, false);

  await assert.rejects(
    () => createWorkshopRegistration({
      workshopId,
      participantName: 'Participant 13',
      email: 'person13@example.com',
      phone: '+155513',
      status: 'paid',
    }),
    /limit|full|capacity/i,
  );
});

test('it expires pending reservations and frees the slot again', async () => {
  const { file } = await createTempStore();
  const workshopId = 'handstand-beginners';

  await fs.writeFile(file, JSON.stringify({ registrations: [] }, null, 2));

  const pending = await createWorkshopRegistration({
    workshopId,
    participantName: 'Pending user',
    email: 'pending@example.com',
    phone: '+1555pending',
    status: 'pending',
    reservationExpiresAt: Date.now() - 1000,
  }, file);

  assert.equal(pending.status, 'pending');

  await expirePendingReservations(file);
  const metrics = await getWorkshopMetrics(workshopId, file);
  assert.equal(metrics.pendingCount, 0);
  assert.equal(metrics.availableSlots, 12);
  assert.equal(metrics.confirmedCount, 0);
});

test('it prevents two simultaneous last-seat reservations from both succeeding', async () => {
  const { file } = await createTempStore();
  const workshopId = 'handstand-beginners';

  await fs.writeFile(file, JSON.stringify({ registrations: [] }, null, 2));

  for (let i = 0; i < 5; i += 1) {
    await createWorkshopRegistration({
      workshopId,
      participantName: `Seat ${i + 1}`,
      email: `seat${i + 1}@example.com`,
      phone: `+1555${i}`,
      status: 'paid',
    }, file);
  }

  const attempts = await Promise.allSettled([
    createWorkshopRegistration({
      workshopId,
      participantName: 'User A',
      email: 'a@example.com',
      phone: '+1555001',
      status: 'pending',
    }, file),
    createWorkshopRegistration({
      workshopId,
      participantName: 'User B',
      email: 'b@example.com',
      phone: '+1555002',
      status: 'pending',
    }, file),
  ]);

  const successes = attempts.filter((result) => result.status === 'fulfilled').length;
  assert.equal(successes, 1);

  const metrics = await getWorkshopMetrics(workshopId, file);
  assert.equal(metrics.paypalConfirmedCount, 5);
  assert.equal(metrics.pendingCount, 1);
  assert.equal(metrics.paypalAvailableSlots, 0);
  assert.equal(metrics.availableSlots, 6);
});

test('it keeps six cash reservations separate from six PayPal seats', async () => {
  const { file } = await createTempStore();
  const workshopId = 'handstand-beginners';

  await fs.writeFile(file, JSON.stringify({ registrations: [] }, null, 2));

  for (let i = 0; i < 6; i += 1) {
    await createWorkshopRegistration({
      workshopId,
      participantName: `Cash ${i + 1}`,
      email: `cash${i + 1}@example.com`,
      phone: `+1666${i}`,
      status: 'reserved_cash',
      paymentMethod: 'cash',
      reservationExpiresAt: Date.now() + 60_000,
    }, file);
  }

  const metrics = await getWorkshopMetrics(workshopId, file);
  assert.equal(metrics.cashReservedCount, 6);
  assert.equal(metrics.cashAvailableSlots, 0);
  assert.equal(metrics.availableSlots, 6);

  await assert.rejects(
    () => createWorkshopRegistration({
      workshopId,
      participantName: 'Cash 7',
      email: 'cash7@example.com',
      phone: '+16667',
      status: 'reserved_cash',
      paymentMethod: 'cash',
    }, file),
    /six in-person|full/i,
  );
});

test('it records cash payment and releases a cancelled in-person reservation', async () => {
  const { file } = await createTempStore();
  const registration = await createWorkshopRegistration({
    workshopId: 'handstand-beginners',
    participantName: 'Cash attendee',
    email: 'cash-attendee@example.com',
    phone: '+1777000',
    status: 'reserved_cash',
    paymentMethod: 'cash',
    reservationExpiresAt: Date.now() + 60_000,
  }, file);

  await confirmCashDeposit({ registrationId: registration.id, paypalOrderId: 'order_cash', paypalCaptureId: 'capture_cash' }, file);
  const paid = await markCashPayment({ registrationId: registration.id, cashPaymentStatus: 'paid' }, file);
  assert.equal(paid.status, 'cash_paid');
  assert.equal(paid.attendanceStatus, 'present');
  assert.ok(paid.attendeeCheckInAt);
  assert.equal((await getWorkshopMetrics('handstand-beginners', file)).cashReservedCount, 1);

  await cancelWorkshopRegistration({ registrationId: registration.id }, file);
  const metrics = await getWorkshopMetrics('handstand-beginners', file);
  assert.equal(metrics.cashReservedCount, 0);
  assert.equal(metrics.cashAvailableSlots, 6);
});

test('cancelled and expired registrations leave active operations but remain in history', async () => {
  const { file } = await createTempStore();
  const registration = await createWorkshopRegistration({
    workshopId: 'handstand-beginners',
    participantName: 'Historical attendee',
    email: 'history@example.com',
    phone: '+1777001',
    status: 'reserved_cash',
    paymentMethod: 'cash',
    reservationExpiresAt: Date.now() + 60_000,
  }, file);

  await cancelWorkshopRegistration({ registrationId: registration.id }, file);
  assert.equal((await listActiveWorkshopRegistrations(file)).some((entry) => entry.id === registration.id), false);
  assert.equal((await listWorkshopRegistrations(file)).some((entry) => entry.id === registration.id), true);
});

test('it assigns unique six-character public codes without replacing internal IDs', async () => {
  const { file } = await createTempStore();
  const first = await createWorkshopRegistration({
    workshopId: 'handstand-beginners',
    participantName: 'Code One',
    email: 'code-one@example.com',
    phone: '+1777002',
    status: 'reserved_cash',
    paymentMethod: 'cash',
    reservationExpiresAt: Date.now() + 60_000,
  }, file);
  const second = await createWorkshopRegistration({
    workshopId: 'handstand-beginners',
    participantName: 'Code Two',
    email: 'code-two@example.com',
    phone: '+1777003',
    status: 'reserved_cash',
    paymentMethod: 'cash',
    reservationExpiresAt: Date.now() + 60_000,
  }, file);

  assert.match(first.publicCode, /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
  assert.match(second.publicCode, /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
  assert.notEqual(first.publicCode, second.publicCode);
  assert.match(first.id, /^ws-/);
});

test('PayPal online payments use the six online seats', async () => {
  const { file } = await createTempStore();
  for (let i = 0; i < 5; i += 1) {
    await createWorkshopRegistration({
      workshopId: 'handstand-beginners',
      participantName: `Online ${i + 1}`,
      email: `online${i + 1}@example.com`,
      phone: `+1888${i}`,
      status: 'paid',
      paymentMethod: 'paypal',
    }, file);
  }

  const metrics = await getWorkshopMetrics('handstand-beginners', file);
  assert.equal(metrics.paypalConfirmedCount, 5);
  assert.equal(metrics.paypalAvailableSlots, 1);
});

test('cash reservation requires a deposit and stays reserved after the deposit is paid', async () => {
  const { file } = await createTempStore();
  const registration = await createWorkshopRegistration({
    workshopId: 'handstand-beginners',
    participantName: 'Deposit attendee',
    email: 'deposit@example.com',
    phone: '+1888000',
    status: 'reserved_cash',
    paymentMethod: 'cash',
    reservationExpiresAt: Date.now() + 60_000,
  }, file);

  assert.equal(registration.depositAmount, 10);
  assert.equal(registration.amount, 25);
  assert.equal(registration.depositStatus, 'pending');
  const confirmed = await confirmCashDeposit({ registrationId: registration.id, paypalOrderId: 'order_test', paypalCaptureId: 'capture_test' }, file);
  assert.equal(confirmed.status, 'reserved_cash');
  assert.equal(confirmed.depositStatus, 'paid');
  assert.equal(confirmed.paypalOrderId, 'order_test');
  assert.equal(confirmed.paypalCaptureId, 'capture_test');
  assert.equal((await getWorkshopMetrics('handstand-beginners', file)).cashReservedCount, 1);
});
