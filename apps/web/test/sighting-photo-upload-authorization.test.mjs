import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import ts from 'typescript';

const source = readFileSync(
  new URL(
    '../src/features/reports/lib/sighting-photo-upload-authorization.ts',
    import.meta.url,
  ),
  'utf8',
);
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { canUploadSightingPhoto } = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`
);

test('permite al contributor autor subir a un report ACTIVE publicado ajeno', async () => {
  const calls = [];
  const client = {
    async rpc(name, args) {
      calls.push({ name, args });
      return { data: true, error: null };
    },
  };

  assert.equal(
    await canUploadSightingPhoto(
      client,
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    ),
    true,
  );
  assert.deepEqual(calls, [{
    name: 'can_manage_sighting_photo_storage',
    args: {
      target_sighting_id:
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    },
  }]);
});

test('deniega cuando el helper falla o no autoriza', async () => {
  for (const result of [
    { data: false, error: null },
    { data: true, error: new Error('RPC_FAILED') },
  ]) {
    assert.equal(
      await canUploadSightingPhoto(
        { async rpc() { return result; } },
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
      ),
      false,
    );
  }
});

test('la Server Action no consulta reports con el JWT del contributor', () => {
  const action = readFileSync(
    new URL(
      '../src/features/reports/actions/sighting-photos.ts',
      import.meta.url,
    ),
    'utf8',
  );

  assert.match(action, /canUploadSightingPhoto/);
  assert.doesNotMatch(action, /\.from\(['"]reports['"]\)/);
});
