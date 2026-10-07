import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(
  new URL(
    '../src/features/pets/lib/upload-pet-photo-batch.ts',
    import.meta.url,
  ),
  'utf8',
);
const gallerySource = await readFile(
  new URL(
    '../src/features/pets/components/pet-photo-gallery.tsx',
    import.meta.url,
  ),
  'utf8',
);
const nextConfigSource = await readFile(
  new URL('../next.config.ts', import.meta.url),
  'utf8',
);
const transpiled = ts.transpileModule(
  source,
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { uploadPetPhotoBatch } =
  await import(
    `data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`
  );

test('la galería usa el controlador resiliente y la build incluye libvips', () => {
  assert.match(
    gallerySource,
    /await uploadPetPhotoBatch\(/,
  );
  assert.match(
    gallerySource,
    /unexpectedErrorMessage: t\(\s*'photos\.uploadRetry'/,
  );
  assert.match(
    gallerySource,
    /pending\.filter\(\s*\(photo\) =>\s*photo\.status !==\s*'success'/,
  );
  assert.match(
    nextConfigSource,
    /outputFileTracingRoot/,
  );
  assert.match(
    nextConfigSource,
    /@img\+sharp-libvips-\*\/node_modules\/@img\/sharp-libvips-\*\/lib\/\*\*\/\*/,
  );
});

function createHarness(results) {
  const loading = [];
  const calls = [];
  const statuses = new Map();

  return {
    loading,
    calls,
    statuses,
    options: {
      items: results.map((_, index) => ({
        id: String(index + 1),
      })),
      async upload(item) {
        calls.push(item.id);
        const result =
          results[Number(item.id) - 1];

        if (result instanceof Error) {
          throw result;
        }

        return result;
      },
      onStatus(item, status) {
        statuses.set(item.id, status);
      },
      setUploading(value) {
        loading.push(value);
      },
      unexpectedErrorMessage:
        'No se ha podido subir. Vuelve a intentarlo.',
    },
  };
}

test('una excepción inesperada deja la foto en error recuperable y limpia el loading', async () => {
  const harness = createHarness([
    new Error('SERVER_ACTION_FAILED'),
  ]);

  const uploaded =
    await uploadPetPhotoBatch(
      harness.options,
    );

  assert.equal(uploaded, 0);
  assert.deepEqual(harness.loading, [
    true,
    false,
  ]);
  assert.deepEqual(
    harness.statuses.get('1'),
    {
      status: 'error',
      message:
        'No se ha podido subir. Vuelve a intentarlo.',
    },
  );
});

test('un error individual no bloquea las demás fotos del lote', async () => {
  const harness = createHarness([
    new Error('FIRST_FAILED'),
    {
      status: 'error',
      message: 'Archivo rechazado.',
    },
    {
      status: 'success',
      message: 'Subida correcta.',
    },
  ]);

  const uploaded =
    await uploadPetPhotoBatch(
      harness.options,
    );

  assert.equal(uploaded, 1);
  assert.deepEqual(harness.calls, [
    '1',
    '2',
    '3',
  ]);
  assert.equal(
    harness.statuses.get('1').status,
    'error',
  );
  assert.equal(
    harness.statuses.get('2').status,
    'error',
  );
  assert.equal(
    harness.statuses.get('3').status,
    'success',
  );
});

test('el flujo exitoso conserva mensajes y recuento', async () => {
  const harness = createHarness([
    {
      status: 'success',
      message: 'Primera subida.',
    },
    {
      status: 'success',
      message: 'Segunda subida.',
    },
  ]);

  const uploaded =
    await uploadPetPhotoBatch(
      harness.options,
    );

  assert.equal(uploaded, 2);
  assert.deepEqual(harness.loading, [
    true,
    false,
  ]);
  assert.equal(
    harness.statuses.get('1').message,
    'Primera subida.',
  );
  assert.equal(
    harness.statuses.get('2').message,
    'Segunda subida.',
  );
});

test('una foto fallida se puede volver a intentar', async () => {
  const item = { id: '1' };
  const loading = [];
  const statuses = [];
  let attempts = 0;
  const options = {
    items: [item],
    async upload() {
      attempts += 1;

      if (attempts === 1) {
        throw new Error('FIRST_ATTEMPT_FAILED');
      }

      return {
        status: 'success',
        message: 'Reintento correcto.',
      };
    },
    onStatus(_item, status) {
      statuses.push(status);
    },
    setUploading(value) {
      loading.push(value);
    },
    unexpectedErrorMessage:
      'Error recuperable.',
  };

  assert.equal(
    await uploadPetPhotoBatch(options),
    0,
  );
  assert.equal(
    await uploadPetPhotoBatch(options),
    1,
  );
  assert.equal(attempts, 2);
  assert.equal(
    statuses.at(-1).status,
    'success',
  );
  assert.deepEqual(loading, [
    true,
    false,
    true,
    false,
  ]);
});

test('finally limpia el loading incluso si falla la actualización de estado', async () => {
  const loading = [];

  await assert.rejects(
    () =>
      uploadPetPhotoBatch({
        items: [{ id: '1' }],
        async upload() {
          return {
            status: 'success',
          };
        },
        onStatus() {
          throw new Error(
            'STATUS_UPDATE_FAILED',
          );
        },
        setUploading(value) {
          loading.push(value);
        },
        unexpectedErrorMessage:
          'Error recuperable.',
      }),
    /STATUS_UPDATE_FAILED/,
  );

  assert.deepEqual(loading, [
    true,
    false,
  ]);
});
