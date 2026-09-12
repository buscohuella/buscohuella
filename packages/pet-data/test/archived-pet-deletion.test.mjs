import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ArchivedPetDeletionError,
  deleteArchivedPetSafely,
} from '../dist/index.js';

const ownerId = 'd3b15052-d063-4a51-8600-266abfdd93bd';
const otherOwnerId = '84ca8d44-604b-4fc5-a9f7-e6823ab31f7e';
const petId = '0dbe6274-e93c-420f-b6ce-7928adfe8e54';

function createDeletionHarness({
  status = 'ARCHIVED',
  photoCount = 0,
  blockingDependencies = 0,
  storageFails = false,
  databaseFails = false,
} = {}) {
  const pets = new Map([[petId, { id: petId, ownerId, status }]]);
  const metadata = new Map();
  const blobs = new Set();
  const dependencies = new Set();
  const events = [];

  for (let index = 0; index < photoCount; index += 1) {
    const path = `${ownerId}/${petId}/photo-${index}.webp`;
    metadata.set(path, { petId, storagePath: path });
    blobs.add(path);
  }

  for (let index = 0; index < blockingDependencies; index += 1) {
    dependencies.add(`report-${index}`);
  }

  let shouldFailStorage = storageFails;
  let shouldFailDatabase = databaseFails;

  const operations = {
    async findOwnedPet(targetPetId, targetOwnerId) {
      events.push('ownership');
      const pet = pets.get(targetPetId);
      return pet?.ownerId === targetOwnerId ? { status: pet.status } : null;
    },
    async hasBlockingDependencies() {
      events.push('dependencies');
      return dependencies.size > 0;
    },
    async listPhotoStoragePaths() {
      events.push('photos');
      return [...metadata.values()].map((photo) => photo.storagePath);
    },
    async removePhotoObjects(paths) {
      events.push('storage');
      if (shouldFailStorage) throw new Error('FORCED_STORAGE_FAILURE');
      for (const path of paths) blobs.delete(path);
    },
    async deleteArchivedPetRecord(targetPetId, targetOwnerId) {
      events.push('database');
      if (shouldFailDatabase) throw new Error('FORCED_DATABASE_FAILURE');

      const pet = pets.get(targetPetId);
      if (
        !pet ||
        pet.ownerId !== targetOwnerId ||
        pet.status !== 'ARCHIVED' ||
        dependencies.size > 0
      ) {
        return false;
      }

      for (const [path, photo] of metadata) {
        if (photo.petId === targetPetId) metadata.delete(path);
      }
      pets.delete(targetPetId);
      return true;
    },
  };

  return {
    operations,
    state: { pets, metadata, blobs, events },
    allowDatabase() {
      shouldFailDatabase = false;
    },
  };
}

async function runDeletion(harness, requestedOwnerId = ownerId) {
  return deleteArchivedPetSafely(harness.operations, {
    petId,
    ownerId: requestedOwnerId,
  });
}

function assertFullyDeleted(state) {
  assert.equal(state.pets.has(petId), false);
  assert.equal(state.metadata.size, 0, 'no deben quedar filas pet_photos');
  assert.equal(state.blobs.size, 0, 'no deben quedar blobs pet-photos');
}

test('elimina una mascota archivada sin fotografías', async () => {
  const harness = createDeletionHarness();

  assert.deepEqual(await runDeletion(harness), {
    status: 'deleted',
    photoCount: 0,
  });
  assert.deepEqual(harness.state.events, [
    'ownership',
    'dependencies',
    'photos',
    'database',
  ]);
  assertFullyDeleted(harness.state);
});

test('elimina Storage antes que DB para una mascota con una fotografía', async () => {
  const harness = createDeletionHarness({ photoCount: 1 });

  assert.deepEqual(await runDeletion(harness), {
    status: 'deleted',
    photoCount: 1,
  });
  assert.deepEqual(harness.state.events, [
    'ownership',
    'dependencies',
    'photos',
    'storage',
    'database',
  ]);
  assertFullyDeleted(harness.state);
});

test('elimina todos los objetos y metadatos de una mascota con N fotografías', async () => {
  const harness = createDeletionHarness({ photoCount: 4 });

  const result = await runDeletion(harness);

  assert.equal(result.status, 'deleted');
  assert.equal(result.photoCount, 4);
  assertFullyDeleted(harness.state);
});

test('un usuario que no es owner no puede iniciar el borrado', async () => {
  const harness = createDeletionHarness({ photoCount: 1 });

  assert.deepEqual(await runDeletion(harness, otherOwnerId), {
    status: 'not_found',
  });
  assert.deepEqual(harness.state.events, ['ownership']);
  assert.equal(harness.state.pets.has(petId), true);
  assert.equal(harness.state.metadata.size, 1);
  assert.equal(harness.state.blobs.size, 1);
});

test('una mascota no archivada conserva DB y Storage', async () => {
  const harness = createDeletionHarness({ status: 'ACTIVE', photoCount: 1 });

  assert.deepEqual(await runDeletion(harness), { status: 'not_archived' });
  assert.deepEqual(harness.state.events, ['ownership']);
  assert.equal(harness.state.pets.has(petId), true);
  assert.equal(harness.state.metadata.size, 1);
  assert.equal(harness.state.blobs.size, 1);
});

test('las dependencias bloquean el borrado sin eliminar historial', async () => {
  const harness = createDeletionHarness({
    photoCount: 1,
    blockingDependencies: 1,
  });

  assert.deepEqual(await runDeletion(harness), {
    status: 'blocked_by_dependencies',
  });
  assert.deepEqual(harness.state.events, ['ownership', 'dependencies']);
  assert.equal(harness.state.pets.has(petId), true);
  assert.equal(harness.state.metadata.size, 1);
  assert.equal(harness.state.blobs.size, 1);
});

test('un fallo de Storage conserva mascota, metadata y blobs en DB/Storage', async () => {
  const harness = createDeletionHarness({ photoCount: 2, storageFails: true });

  await assert.rejects(runDeletion(harness), (error) => {
    assert.ok(error instanceof ArchivedPetDeletionError);
    assert.equal(error.stage, 'storage_cleanup');
    return true;
  });
  assert.deepEqual(harness.state.events, [
    'ownership',
    'dependencies',
    'photos',
    'storage',
  ]);
  assert.equal(harness.state.pets.has(petId), true);
  assert.equal(harness.state.metadata.size, 2);
  assert.equal(harness.state.blobs.size, 2);
});

test('un fallo de DB tras Storage es observable y el flujo puede reintentarse', async () => {
  const harness = createDeletionHarness({ photoCount: 2, databaseFails: true });

  await assert.rejects(runDeletion(harness), (error) => {
    assert.ok(error instanceof ArchivedPetDeletionError);
    assert.equal(error.stage, 'database_delete_after_storage');
    return true;
  });
  assert.equal(harness.state.pets.has(petId), true);
  assert.equal(harness.state.metadata.size, 2);
  assert.equal(harness.state.blobs.size, 0);

  harness.allowDatabase();
  assert.equal((await runDeletion(harness)).status, 'deleted');
  assertFullyDeleted(harness.state);
});
