import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(
  new URL(
    '../src/features/reports/lib/lost-report-photo-copy.ts',
    import.meta.url,
  ),
  'utf8',
);
const photoCopyModule = await import(
  `data:text/javascript;base64,${Buffer.from(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
  ).toString('base64')}`,
);
const {
  copyPetPhotosToReport,
  createDraftWithOptionalPetPhotos,
  PetPhotoCopyError,
  rollbackFailedDraft,
} = photoCopyModule;

const userId =
  '11111111-1111-4111-8111-111111111111';
const petId =
  '22222222-2222-4222-8222-222222222222';
const reportId =
  '33333333-3333-4333-8333-333333333333';

const petPhotos = [
  {
    storagePath: `${userId}/${petId}/secondary.jpg`,
    position: 0,
    isPrimary: false,
    altText: 'Luna de perfil',
    mimeType: 'image/jpeg',
    fileSizeBytes: 120,
    width: 1200,
    height: 800,
  },
  {
    storagePath: `${userId}/${petId}/primary.webp`,
    position: 1,
    isPrimary: true,
    altText: 'Primer plano de Luna',
    mimeType: 'image/webp',
    fileSizeBytes: 240,
    width: 900,
    height: 900,
  },
];

function createCopyHarness({
  failMetadataAt = -1,
  failStorageCleanup = false,
} = {}) {
  const uploaded = new Set();
  const metadata = new Map();
  const inserted = [];
  const removedPaths = [];
  const deletedIds = [];
  const cleanupFailures = [];
  let generatedId = 0;

  return {
    uploaded,
    metadata,
    inserted,
    removedPaths,
    deletedIds,
    cleanupFailures,
    dependencies: {
      userId,
      petId,
      reportId,
      async listPetPhotos(targetPetId) {
        assert.equal(targetPetId, petId);
        return petPhotos;
      },
      async downloadPetPhoto(storagePath) {
        assert.ok(
          petPhotos.some(
            (photo) =>
              photo.storagePath ===
              storagePath,
          ),
        );
        return new Blob([
          new Uint8Array(120),
        ]);
      },
      async uploadReportPhoto(input) {
        uploaded.add(input.storagePath);
      },
      async insertReportPhotoMetadata(
        value,
      ) {
        inserted.push(value);

        if (
          inserted.length - 1 ===
          failMetadataAt
        ) {
          throw new Error(
            'FORCED_METADATA_FAILURE',
          );
        }

        metadata.set(value.id, value);
      },
      async removeReportPhotos(paths) {
        removedPaths.push([...paths]);

        if (failStorageCleanup) {
          throw new Error(
            'FORCED_STORAGE_CLEANUP_FAILURE',
          );
        }

        for (const path of paths) {
          uploaded.delete(path);
        }
      },
      async deleteReportPhotoMetadata(ids) {
        deletedIds.push([...ids]);
        for (const id of ids) {
          metadata.delete(id);
        }
      },
      generatePhotoId() {
        generatedId += 1;
        return `44444444-4444-4444-8444-44444444444${generatedId}`;
      },
      onCleanupFailure(stage, error) {
        cleanupFailures.push({
          stage,
          error,
        });
      },
    },
  };
}

test('usePetPhotos=false crea el borrador sin intentar copiar fotos', async () => {
  const calls = [];

  const createdReportId =
    await createDraftWithOptionalPetPhotos({
      usePetPhotos: false,
      async createDraft() {
        calls.push('create');
        return reportId;
      },
      async copyPetPhotos() {
        calls.push('copy');
      },
      async rollbackDraft() {
        calls.push('rollback');
        return true;
      },
    });

  assert.equal(createdReportId, reportId);
  assert.deepEqual(calls, ['create']);
});

test('copia fotos existentes conservando asociación, posición, principal, alt y metadata', async () => {
  const harness = createCopyHarness();

  await copyPetPhotosToReport(
    harness.dependencies,
  );

  assert.equal(harness.uploaded.size, 2);
  assert.equal(harness.metadata.size, 2);
  assert.deepEqual(
    harness.inserted.map((photo) => ({
      reportId: photo.reportId,
      position: photo.position,
      isPrimary: photo.isPrimary,
      altText: photo.altText,
      mimeType: photo.mimeType,
      fileSizeBytes:
        photo.fileSizeBytes,
      width: photo.width,
      height: photo.height,
    })),
    [
      {
        reportId,
        position: 0,
        isPrimary: false,
        altText: 'Luna de perfil',
        mimeType: 'image/jpeg',
        fileSizeBytes: 120,
        width: 1200,
        height: 800,
      },
      {
        reportId,
        position: 1,
        isPrimary: true,
        altText: 'Primer plano de Luna',
        mimeType: 'image/webp',
        fileSizeBytes: 240,
        width: 900,
        height: 900,
      },
    ],
  );
  assert.match(
    harness.inserted[0].storagePath,
    /\.jpg$/,
  );
  assert.match(
    harness.inserted[1].storagePath,
    /\.webp$/,
  );
});

test('un fallo parcial de copia limpia Storage y metadata y compensa el DRAFT', async () => {
  const harness = createCopyHarness({
    failMetadataAt: 1,
  });
  const calls = [];

  await assert.rejects(
    () =>
      createDraftWithOptionalPetPhotos({
        usePetPhotos: true,
        async createDraft() {
          calls.push('create');
          return reportId;
        },
        async copyPetPhotos() {
          calls.push('copy');
          await copyPetPhotosToReport(
            harness.dependencies,
          );
        },
        async rollbackDraft() {
          calls.push('rollback');
          return true;
        },
      }),
    (error) => {
      assert.ok(
        error instanceof
          PetPhotoCopyError,
      );
      assert.equal(
        error.cleanupCompleted,
        true,
      );
      return true;
    },
  );

  assert.deepEqual(calls, [
    'create',
    'copy',
    'rollback',
  ]);
  assert.equal(harness.uploaded.size, 0);
  assert.equal(harness.metadata.size, 0);
  assert.equal(
    harness.removedPaths[0].length,
    2,
  );
  assert.equal(
    harness.deletedIds[0].length,
    2,
  );
});

test('si falla limpiar Storage no borra metadata ni cambia el estado del DRAFT', async () => {
  const harness = createCopyHarness({
    failMetadataAt: 1,
    failStorageCleanup: true,
  });
  let rollbackCalls = 0;

  await assert.rejects(
    () =>
      createDraftWithOptionalPetPhotos({
        usePetPhotos: true,
        async createDraft() {
          return reportId;
        },
        async copyPetPhotos() {
          await copyPetPhotosToReport(
            harness.dependencies,
          );
        },
        async rollbackDraft() {
          rollbackCalls += 1;
          return true;
        },
      }),
    (error) => {
      assert.equal(
        error.cleanupCompleted,
        false,
      );
      return true;
    },
  );

  assert.equal(rollbackCalls, 0);
  assert.equal(harness.deletedIds.length, 0);
  assert.equal(harness.metadata.size, 1);
  assert.equal(
    harness.cleanupFailures[0].stage,
    'storage',
  );
});

test('la compensación respeta close, archive y finalización DB', async () => {
  const calls = [];

  const completed =
    await rollbackFailedDraft({
      async closeDraft() {
        calls.push('close');
      },
      async archiveDraft() {
        calls.push('archive');
      },
      async finalizeArchivedReportDeletion() {
        calls.push('database');
      },
      onRollbackFailure() {
        calls.push('failure');
      },
    });

  assert.equal(completed, true);
  assert.deepEqual(calls, [
    'close',
    'archive',
    'database',
  ]);
});

test('un fallo de compensación se registra y detiene los pasos posteriores', async () => {
  const calls = [];

  const completed =
    await rollbackFailedDraft({
      async closeDraft() {
        calls.push('close');
      },
      async archiveDraft() {
        calls.push('archive');
        throw new Error(
          'FORCED_ARCHIVE_FAILURE',
        );
      },
      async finalizeArchivedReportDeletion() {
        calls.push('database');
      },
      onRollbackFailure(stage) {
        calls.push(`failure:${stage}`);
      },
    });

  assert.equal(completed, false);
  assert.deepEqual(calls, [
    'close',
    'archive',
    'failure:archive',
  ]);
});
