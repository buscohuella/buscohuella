import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const globalsCss = readFileSync(
  new URL('../src/app/globals.css', import.meta.url),
  'utf8',
);

test('el color heredado de los enlaces permanece en la capa base', () => {
  assert.match(
    globalsCss,
    /@layer\s+base\s*\{\s*a\s*\{\s*color:\s*inherit;\s*\}\s*\}/u,
    'las utilidades text-* deben poder prevalecer sobre el color base del enlace',
  );
});
