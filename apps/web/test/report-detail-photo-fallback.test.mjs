import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(
  new URL(
    '../src/app/(private)/mis-reportes/[id]/page.tsx',
    import.meta.url,
  ),
  'utf8',
);

test('un fallo al firmar la foto primaria no convierte un reporte existente en 404', () => {
  assert.doesNotMatch(
    source,
    /if \(signError\) throw signError;/,
  );

  assert.match(
    source,
    /report\.detail\.primary_photo_sign_failed/,
  );

  assert.match(
    source,
    /primaryPhotoUrl = signed\.signedUrl/,
  );
});
