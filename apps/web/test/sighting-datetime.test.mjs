import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(
  new URL('../src/features/reports/lib/sighting-datetime.ts', import.meta.url),
  'utf8',
);

const helperModule = await import(
  `data:text/javascript;base64,${Buffer.from(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
  ).toString('base64')}`,
);

const { localDateTimeToIso } = helperModule;

test('convierte un datetime-local de Barcelona a un instante ISO inequívoco', () => {
  const previousTimezone = process.env.TZ;
  process.env.TZ = 'Europe/Madrid';

  try {
    assert.equal(
      localDateTimeToIso('2026-10-14T19:53'),
      '2026-10-14T17:53:00.000Z',
    );
  } finally {
    process.env.TZ = previousTimezone;
  }
});

test('rechaza un valor de fecha vacío o inválido', () => {
  assert.equal(localDateTimeToIso(''), null);
  assert.equal(localDateTimeToIso('no-es-una-fecha'), null);
});

test('el formulario envía observedAt como ISO convertido y no como datetime-local crudo', async () => {
  const formSource = await readFile(
    new URL('../src/features/reports/components/create-sighting-form.tsx', import.meta.url),
    'utf8',
  );

  assert.match(
    formSource,
    /localDateTimeToIso\(observedAtLocal\)/,
  );

  assert.match(
    formSource,
    /type="hidden"\s+name="observedAt"\s+value=\{observedAt\}/,
  );

  assert.match(
    formSource,
    /id="observedAt"\s+type="datetime-local"[^>]*value=\{observedAtLocal\}/,
  );

  assert.doesNotMatch(
    formSource,
    /name="observedAt"\s+type="datetime-local"/,
  );
});
