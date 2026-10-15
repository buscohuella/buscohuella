import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import ts from 'typescript';

const source = readFileSync(
  new URL('../src/lib/server-logger.ts', import.meta.url),
  'utf8',
);
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { logServerError } = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`
);

test('registra stage y causa saneada sin secretos, stack ni campos arbitrarios', () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const originalConsoleError = console.error;
  const logEntries = [];

  try {
    process.env.NODE_ENV = 'production';
    console.error = (...args) => logEntries.push(args);

    const cause = Object.assign(
      new Error(
        'Connection failed for postgresql://cleanup:super-secret@db.example/postgres password=hunter2',
      ),
      {
        code: '28P01',
        connectionString: 'postgresql://cleanup:super-secret@db.example/postgres',
        detail: { password: 'hunter2' },
      },
    );
    const error = Object.assign(
      new Error('Report cleanup database preflight failed'),
      {
        name: 'ArchivedReportDeletionError',
        stage: 'database_preflight',
        cause,
        arbitrary: { secret: 'must-not-be-logged' },
      },
    );

    logServerError('report.delete_archived.database_preflight_failed', error, {
      reportId: 'report-id',
    });
  } finally {
    console.error = originalConsoleError;
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }
  }

  assert.equal(logEntries.length, 1);
  const payload = JSON.parse(logEntries[0][0]);

  assert.equal(payload.error.name, 'ArchivedReportDeletionError');
  assert.equal(payload.error.stage, 'database_preflight');
  assert.deepEqual(Object.keys(payload.error.cause).sort(), [
    'code',
    'message',
    'name',
  ]);
  assert.equal(payload.error.cause.name, 'Error');
  assert.equal(payload.error.cause.code, '28P01');
  assert.match(payload.error.cause.message, /\[REDACTED_DATABASE_URL\]/);
  assert.doesNotMatch(JSON.stringify(payload), /super-secret|hunter2/);
  assert.equal('stack' in payload.error, false);
  assert.equal('arbitrary' in payload.error, false);
  assert.equal('connectionString' in payload.error.cause, false);
  assert.equal('detail' in payload.error.cause, false);
});

test('sanea mensajes de errores no Error sin perder el contenido útil', () => {
  const originalConsoleError = console.error;
  const logEntries = [];

  try {
    console.error = (...args) => logEntries.push(args);

    logServerError(
      'test.non_error',
      'fallo postgresql://cleanup:secret@db.example/postgres password=hunter2',
    );
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(logEntries.length, 1);

  const payload = JSON.parse(logEntries[0][0]);

  assert.equal(payload.error.name, 'UnknownError');
  assert.match(payload.error.message, /\[REDACTED_DATABASE_URL\]/);
  assert.doesNotMatch(payload.error.message, /secret|hunter2/);
});
