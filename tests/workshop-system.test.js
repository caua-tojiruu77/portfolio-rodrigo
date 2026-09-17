const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');

const { getWorkshopMetrics, createWorkshopRegistration, expirePendingReservations } = require('../utils/workshopStore');

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

  for (let i = 0; i < 12; i += 1) {
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
  assert.equal(metrics.confirmedCount, 12);
  assert.equal(metrics.availableSlots, 0);
  assert.equal(metrics.isFull, true);

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

  for (let i = 0; i < 11; i += 1) {
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
  assert.equal(metrics.confirmedCount, 11);
  assert.equal(metrics.pendingCount, 1);
  assert.equal(metrics.availableSlots, 0);
});
