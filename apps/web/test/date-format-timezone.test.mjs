import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const configSource = await readFile(
  new URL('../src/features/i18n/config.ts', import.meta.url),
  'utf8',
);

const configUrl = `data:text/javascript;base64,${Buffer.from(
  ts.transpileModule(configSource, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
).toString('base64')}`;

const formatSource = (
  await readFile(
    new URL('../src/features/i18n/format.ts', import.meta.url),
    'utf8',
  )
).replace("'./config'", `'${configUrl}'`);

const formatModule = await import(
  `data:text/javascript;base64,${Buffer.from(
    ts.transpileModule(formatSource, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
  ).toString('base64')}`,
);

const { formatDate } = formatModule;

test('formatea horas de la Beta en Europe/Madrid aunque el servidor esté en UTC', () => {
  const previousTimezone = process.env.TZ;
  process.env.TZ = 'UTC';

  try {
    assert.equal(
      formatDate('2026-10-14T19:37:00.000Z', 'es', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }),
      '21:37',
    );
  } finally {
    process.env.TZ = previousTimezone;
  }
});
