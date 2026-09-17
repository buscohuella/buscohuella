import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ArchivedReportDeletionError,
  deleteArchivedReportSafely,
} from '../dist/index.js';

const ownerId = '11111111-1111-4111-8111-111111111111';
const authorId = '22222222-2222-4222-8222-222222222222';
const otherOwnerId = '33333333-3333-4333-8333-333333333333';
const reportId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1';
const otherReportId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2';
const firstSightingId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1';
const secondSightingId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2';
const otherSightingId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb9';

function photoId(index) {
  return `cccccccc-cccc-4ccc-8ccc-${index.toString(16).padStart(12, '0')}`;
}

function photoPath(owner, parent, index = 1) {
  return `${owner}/${parent}/${photoId(index)}.webp`;
}

function createDeletionHarness({
  status = 'ARCHIVED',
  reportPhotoPaths = [],
  sightings = [],
  storageFailure = null,
  databaseFailsAt = null,
  includeOtherReportData = false,
} = {}) {
  const reports = new Map([
    [reportId, { ownerId, status }],
    [otherReportId, { ownerId, status: 'ARCHIVED' }],
  ]);
  const sightingRows = new Map();
  const reportPhotoRows = [];
  const sightingPhotoRows = [];
  const reportBlobs = new Set();
  const sightingBlobs = new Set();
  const events = [];
  const finalizerCalls = [];
  const storageCalls = { 'report-photos': 0, 'sighting-photos': 0 };

  for (const path of reportPhotoPaths) {
    reportPhotoRows.push({ reportId, path });
    reportBlobs.add(path);
  }

  for (const sighting of sightings) {
    sightingRows.set(sighting.id, {
      reportId,
      createdBy: sighting.createdBy ?? authorId,
    });
    for (const path of sighting.photoPaths) {
      sightingPhotoRows.push({ sightingId: sighting.id, path });
      sightingBlobs.add(path);
    }
  }

  if (includeOtherReportData) {
    const otherReportPath = photoPath(ownerId, otherReportId, 90);
    const otherSightingPath = photoPath(authorId, otherSightingId, 91);
    reportPhotoRows.push({ reportId: otherReportId, path: otherReportPath });
    sightingRows.set(otherSightingId, {
      reportId: otherReportId,
      createdBy: authorId,
    });
    sightingPhotoRows.push({
      sightingId: otherSightingId,
      path: otherSightingPath,
    });
    reportBlobs.add(otherReportPath);
    sightingBlobs.add(otherSightingPath);
  }

  let currentStorageFailure = storageFailure;
  let databaseFailure = databaseFailsAt;

  async function removeObjects(bucket, paths, blobs) {
    storageCalls[bucket] += 1;
    events.push([`storage:${bucket}`, paths]);
    if (
      currentStorageFailure?.bucket === bucket &&
      currentStorageFailure.call === storageCalls[bucket]
    ) {
      throw new Error('FORCED_STORAGE_FAILURE');
    }
    for (const path of paths) blobs.delete(path);
  }

  const operations = {
    async findOwnedReport(targetReportId, targetOwnerId) {
      events.push('ownership');
      const report = reports.get(targetReportId);
      return report?.ownerId === targetOwnerId
        ? { status: report.status }
        : null;
    },
    async listSightings(targetReportId) {
      events.push('sightings');
      return [...sightingRows]
        .filter(([, sighting]) => sighting.reportId === targetReportId)
        .map(([id, sighting]) => ({ id, createdBy: sighting.createdBy }));
    },
    async listReportPhotos(targetReportId) {
      events.push('report-photos');
      return reportPhotoRows
        .filter((photo) => photo.reportId === targetReportId)
        .map((photo) => ({ storagePath: photo.path }));
    },
    async listSightingPhotos(sightingIds) {
      events.push('sighting-photos');
      const allowedIds = new Set(sightingIds);
      return sightingPhotoRows
        .filter((photo) => allowedIds.has(photo.sightingId))
        .map((photo) => ({
          sightingId: photo.sightingId,
          storagePath: photo.path,
        }));
    },
    async removeSightingPhotoObjects(paths) {
      await removeObjects('sighting-photos', paths, sightingBlobs);
    },
    async removeReportPhotoObjects(paths) {
      await removeObjects('report-photos', paths, reportBlobs);
    },
    async finalizeArchivedReportDeletion(targetReportId, targetOwnerId) {
      events.push('database:finalizer');
      finalizerCalls.push({
        reportId: targetReportId,
        actorUserId: targetOwnerId,
      });
      if (databaseFailure === 'finalizer') {
        throw new Error('FORCED_FINALIZER_FAILURE');
      }

      const report = reports.get(targetReportId);
      if (
        !report ||
        report.ownerId !== targetOwnerId ||
        report.status !== 'ARCHIVED'
      ) {
        return false;
      }

      const deletedIds = new Set();
      for (const [id, sighting] of sightingRows) {
        if (sighting.reportId === targetReportId) {
          sightingRows.delete(id);
          deletedIds.add(id);
        }
      }
      for (let index = sightingPhotoRows.length - 1; index >= 0; index -= 1) {
        if (deletedIds.has(sightingPhotoRows[index].sightingId)) {
          sightingPhotoRows.splice(index, 1);
        }
      }
      reports.delete(targetReportId);
      for (let index = reportPhotoRows.length - 1; index >= 0; index -= 1) {
        if (reportPhotoRows[index].reportId === targetReportId) {
          reportPhotoRows.splice(index, 1);
        }
      }
      return true;
    },
  };

  return {
    operations,
    state: {
      events,
      finalizerCalls,
      reportBlobs,
      reportPhotoRows,
      reports,
      sightingBlobs,
      sightingPhotoRows,
      sightingRows,
      storageCalls,
    },
    clearFailures() {
      currentStorageFailure = null;
      databaseFailure = null;
    },
  };
}

function runDeletion(harness, requestedOwnerId = ownerId) {
  return deleteArchivedReportSafely(harness.operations, {
    reportId,
    ownerId: requestedOwnerId,
  });
}

function assertNoDestructiveCalls(state) {
  assert.equal(
    state.events.some(
      (event) =>
        Array.isArray(event) ||
        (typeof event === 'string' && event.startsWith('database:')),
    ),
    false,
  );
}

function assertTargetDeleted(state) {
  assert.equal(state.reports.has(reportId), false);
  assert.equal(
    state.reportPhotoRows.some((photo) => photo.reportId === reportId),
    false,
  );
  assert.equal(
    [...state.sightingRows.values()].some(
      (sighting) => sighting.reportId === reportId,
    ),
    false,
  );
}

test('elimina un reporte archivado sin fotos ni avistamientos', async () => {
  const harness = createDeletionHarness();

  assert.deepEqual(await runDeletion(harness), {
    status: 'deleted',
    reportPhotoCount: 0,
    sightingCount: 0,
    sightingPhotoCount: 0,
  });
  assertTargetDeleted(harness.state);
});

test('elimina las fotos propias del reporte antes de la base de datos', async () => {
  const path = photoPath(ownerId, reportId).replace('.webp', '.jpg');
  const harness = createDeletionHarness({ reportPhotoPaths: [path] });

  assert.equal((await runDeletion(harness)).reportPhotoCount, 1);
  assert.equal(harness.state.reportBlobs.has(path), false);
  assertTargetDeleted(harness.state);
});

test('elimina una foto perteneciente a un avistamiento', async () => {
  const path = photoPath(authorId, firstSightingId);
  const harness = createDeletionHarness({
    sightings: [{ id: firstSightingId, photoPaths: [path] }],
  });

  assert.equal((await runDeletion(harness)).sightingPhotoCount, 1);
  assert.equal(harness.state.sightingBlobs.has(path), false);
  assertTargetDeleted(harness.state);
});

test('elimina varias fotos, deduplica rutas válidas y limita el grafo objetivo', async () => {
  const firstPath = photoPath(authorId, firstSightingId, 1);
  const secondPath = photoPath(authorId, secondSightingId, 2);
  const harness = createDeletionHarness({
    reportPhotoPaths: [photoPath(ownerId, reportId, 3)],
    sightings: [
      { id: firstSightingId, photoPaths: [firstPath, firstPath] },
      { id: secondSightingId, photoPaths: [secondPath] },
    ],
    includeOtherReportData: true,
  });
  const otherReportPath = photoPath(ownerId, otherReportId, 90);
  const otherSightingPath = photoPath(authorId, otherSightingId, 91);

  const result = await runDeletion(harness);

  assert.equal(result.sightingCount, 2);
  assert.equal(result.sightingPhotoCount, 2);
  assert.equal(harness.state.reportBlobs.has(otherReportPath), true);
  assert.equal(harness.state.sightingBlobs.has(otherSightingPath), true);
  assert.equal(harness.state.reports.has(otherReportId), true);
});

test('aborta una report photo cruzada entre dos reportes del mismo owner', async () => {
  const crossedPath = photoPath(ownerId, otherReportId, 4);
  const harness = createDeletionHarness({ reportPhotoPaths: [crossedPath] });

  await assert.rejects(runDeletion(harness), (error) => {
    assert.ok(error instanceof ArchivedReportDeletionError);
    assert.equal(error.stage, 'path_validation');
    return true;
  });
  assertNoDestructiveCalls(harness.state);
  assert.equal(harness.state.reports.has(reportId), true);
});

test('aborta una sighting photo cuya ruta apunta a otro sighting', async () => {
  const crossedPath = photoPath(authorId, otherSightingId, 5);
  const harness = createDeletionHarness({
    sightings: [{ id: firstSightingId, photoPaths: [crossedPath] }],
    includeOtherReportData: true,
  });

  await assert.rejects(runDeletion(harness), (error) => {
    assert.ok(error instanceof ArchivedReportDeletionError);
    assert.equal(error.stage, 'path_validation');
    return true;
  });
  assertNoDestructiveCalls(harness.state);
});

test('aborta una sighting photo cuyo owner de ruta no coincide con created_by', async () => {
  const harness = createDeletionHarness({
    sightings: [{
      id: firstSightingId,
      createdBy: authorId,
      photoPaths: [photoPath(otherOwnerId, firstSightingId, 6)],
    }],
  });

  await assert.rejects(runDeletion(harness), (error) => {
    assert.ok(error instanceof ArchivedReportDeletionError);
    assert.equal(error.stage, 'path_validation');
    return true;
  });
  assertNoDestructiveCalls(harness.state);
});

test('aborta paths vacíos o que no respetan el formato esperado', async () => {
  const harness = createDeletionHarness({ reportPhotoPaths: [''] });

  await assert.rejects(runDeletion(harness), (error) => {
    assert.equal(error.stage, 'path_validation');
    return true;
  });
  assertNoDestructiveCalls(harness.state);
});

test('un error material de Storage impide cualquier borrado de DB', async () => {
  const sightingPath = photoPath(authorId, firstSightingId, 7);
  const reportPath = photoPath(ownerId, reportId, 8);
  const harness = createDeletionHarness({
    reportPhotoPaths: [reportPath],
    sightings: [{ id: firstSightingId, photoPaths: [sightingPath] }],
    storageFailure: { bucket: 'report-photos', call: 1 },
  });

  await assert.rejects(runDeletion(harness), (error) => {
    assert.equal(error.stage, 'storage_cleanup');
    return true;
  });
  assert.equal(
    harness.state.events.some(
      (event) => typeof event === 'string' && event.startsWith('database:'),
    ),
    false,
  );
  assert.equal(harness.state.sightingBlobs.has(sightingPath), true);
  assert.equal(harness.state.reportBlobs.has(reportPath), true);
});

test('un reintento tolera blobs ya ausentes', async () => {
  const path = photoPath(authorId, firstSightingId, 9);
  const harness = createDeletionHarness({
    sightings: [{ id: firstSightingId, photoPaths: [path] }],
    databaseFailsAt: 'finalizer',
  });

  await assert.rejects(runDeletion(harness));
  assert.equal(harness.state.sightingBlobs.has(path), false);

  harness.clearFailures();
  assert.equal((await runDeletion(harness)).status, 'deleted');
});

test('un error DB posterior expone el estado parcial sin afirmar rollback', async () => {
  const sightingPath = photoPath(authorId, firstSightingId, 10);
  const reportPath = photoPath(ownerId, reportId, 11);
  const harness = createDeletionHarness({
    reportPhotoPaths: [reportPath],
    sightings: [{ id: firstSightingId, photoPaths: [sightingPath] }],
    databaseFailsAt: 'finalizer',
  });

  await assert.rejects(runDeletion(harness), (error) => {
    assert.equal(error.stage, 'database_cleanup_after_storage');
    return true;
  });
  assert.equal(harness.state.reportBlobs.size, 0);
  assert.equal(harness.state.sightingBlobs.size, 0);
  assert.equal(harness.state.sightingRows.has(firstSightingId), true);
  assert.equal(harness.state.reports.has(reportId), true);
});

test('Storage completo invoca el finalizador una vez con el owner autenticado', async () => {
  const harness = createDeletionHarness({
    reportPhotoPaths: [photoPath(ownerId, reportId, 12)],
  });

  assert.equal((await runDeletion(harness)).status, 'deleted');
  assert.deepEqual(harness.state.finalizerCalls, [
    { reportId, actorUserId: ownerId },
  ]);
});

test('ownership y estado bloquean el borrado antes de recolectar datos', async () => {
  const foreignHarness = createDeletionHarness();
  assert.deepEqual(await runDeletion(foreignHarness, otherOwnerId), {
    status: 'not_found',
  });
  assert.deepEqual(foreignHarness.state.events, ['ownership']);

  const activeHarness = createDeletionHarness({ status: 'ACTIVE' });
  assert.deepEqual(await runDeletion(activeHarness), {
    status: 'not_archived',
  });
  assert.deepEqual(activeHarness.state.events, ['ownership']);
});

test('Storage.remove se ejecuta en lotes de como máximo 1000 objetos', async () => {
  const paths = Array.from({ length: 1001 }, (_, index) =>
    photoPath(ownerId, reportId, index + 100),
  );
  const harness = createDeletionHarness({ reportPhotoPaths: paths });

  const result = await runDeletion(harness);
  const batches = harness.state.events.filter(
    (event) => Array.isArray(event) && event[0] === 'storage:report-photos',
  );

  assert.equal(result.reportPhotoCount, 1001);
  assert.deepEqual(batches.map(([, batch]) => batch.length), [1000, 1]);
});

test('el fallo de un lote posterior detiene DB y deja explícito el parcial', async () => {
  const paths = Array.from({ length: 1001 }, (_, index) =>
    photoPath(ownerId, reportId, index + 1200),
  );
  const harness = createDeletionHarness({
    reportPhotoPaths: paths,
    storageFailure: { bucket: 'report-photos', call: 2 },
  });

  await assert.rejects(runDeletion(harness), (error) => {
    assert.equal(error.stage, 'storage_cleanup');
    return true;
  });
  assert.equal(harness.state.reportBlobs.size, 1);
  assert.equal(harness.state.reports.has(reportId), true);
  assert.equal(
    harness.state.events.some(
      (event) => typeof event === 'string' && event.startsWith('database:'),
    ),
    false,
  );
});
