const fs = require('node:fs/promises');
const path = require('node:path');

const DEFAULT_CAPACITY = 12;
const DEFAULT_RESERVATION_MINUTES = 15;

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
    return {
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations : [],
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

function normalizeRegistration(registration) {
  return {
    id: registration.id || generateRegistrationId(),
    workshopId: registration.workshopId,
    participantName: String(registration.participantName || '').trim(),
    email: String(registration.email || '').trim(),
    phone: String(registration.phone || '').trim(),
    status: registration.status || 'pending',
    reservationExpiresAt: registration.reservationExpiresAt || null,
    createdAt: registration.createdAt || Date.now(),
    updatedAt: registration.updatedAt || Date.now(),
    paymentApprovedAt: registration.paymentApprovedAt || null,
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
      const isPending = registration.status === 'pending';
      const expired = Number(registration.reservationExpiresAt || 0) <= Date.now();

      if (isPending && expired) {
        registration.status = 'expired';
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
  const confirmedCount = workshopRegistrations.filter((entry) => entry.status === 'paid').length;
  const pendingCount = workshopRegistrations.filter((entry) => entry.status === 'pending' && Number(entry.reservationExpiresAt || 0) > Date.now()).length;
  const expiredCount = workshopRegistrations.filter((entry) => entry.status === 'expired').length;
  const filledSlots = confirmedCount + pendingCount;
  const availableSlots = Math.max(DEFAULT_CAPACITY - filledSlots, 0);

  return {
    workshopId,
    capacity: DEFAULT_CAPACITY,
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
    const confirmedCount = activeRegistrations.filter((entry) => entry.status === 'paid').length;
    const pendingCount = activeRegistrations.filter((entry) => entry.status === 'pending' && Number(entry.reservationExpiresAt || 0) > Date.now()).length;

    const isReservationAttempt = status === 'pending';
    const shouldBlockNewRegistration = isReservationAttempt || status === 'paid';

    if (shouldBlockNewRegistration && confirmedCount + pendingCount >= DEFAULT_CAPACITY) {
      throw new Error('This workshop is full and cannot accept new registrations.');
    }

    const registration = normalizeRegistration({
      id: generateRegistrationId(),
      workshopId: normalizedWorkshopId,
      participantName: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      status,
      reservationExpiresAt: reservationExpiresAt || (status === 'pending' ? Date.now() + DEFAULT_RESERVATION_MINUTES * 60 * 1000 : null),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currency,
      amount,
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

    const currentMetrics = await getWorkshopMetrics(registration.workshopId, filePath);
    if (currentMetrics.confirmedCount + currentMetrics.pendingCount >= DEFAULT_CAPACITY) {
      const hasAnyPaidSeat = registration.status === 'paid';
      if (!hasAnyPaidSeat) {
        throw new Error('Workshop capacity is full. The reservation cannot be confirmed.');
      }
    }

    registration.status = 'paid';
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

async function markAttendance({ registrationId, attendanceStatus }, filePath = resolveStoragePath()) {
  return withStoreLock(filePath, async () => {
    const store = await readStore(filePath);
    const registration = store.registrations.find((entry) => entry.id === registrationId);

    if (!registration) {
      throw new Error('Registration could not be found.');
    }

    if (!['present', 'absent'].includes(attendanceStatus)) {
      throw new Error('Attendance status must be present or absent.');
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

async function getWorkshopRegistrationById(registrationId, filePath = resolveStoragePath()) {
  const store = await readStore(filePath);
  return store.registrations.find((entry) => entry.id === registrationId) || null;
}

module.exports = {
  DEFAULT_CAPACITY,
  DEFAULT_RESERVATION_MINUTES,
  expirePendingReservations,
  getWorkshopMetrics,
  createWorkshopRegistration,
  updateWorkshopRegistration,
  confirmWorkshopRegistration,
  markAttendance,
  listWorkshopRegistrations,
  getWorkshopRegistrationById,
  readStore,
  writeStore,
  generateRegistrationId,
  resolveStoragePath,
};
