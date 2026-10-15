import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import ts from 'typescript';

const source = readFileSync(
  new URL(
    '../src/services/database/report-cleanup-core.ts',
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
const databaseModule = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`
);

const {
  createArchivedReportCleanupDatabase,
  createArchivedReportFinalizer,
  ReportCleanupDatabaseConfigurationError,
  ReportCleanupDatabasePreflightError,
} = databaseModule;

const reportId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1';
const actorUserId = '11111111-1111-4111-8111-111111111111';

test('falla de forma segura cuando falta la credencial y no crea cliente', async () => {
  let clientsCreated = 0;
  const finalize = createArchivedReportFinalizer({
    createClient() {
      clientsCreated += 1;
      throw new Error('SHOULD_NOT_CREATE_CLIENT');
    },
    getDatabaseUrl: () => undefined,
    getSslMode: () => undefined,
  });

  await assert.rejects(
    finalize(reportId, actorUserId),
    ReportCleanupDatabaseConfigurationError,
  );
  assert.equal(clientsCreated, 0);
});

test('rechaza una configuraciÃ³n TLS desconocida antes de conectar', async () => {
  let clientsCreated = 0;
  const finalize = createArchivedReportFinalizer({
    createClient() {
      clientsCreated += 1;
      throw new Error('SHOULD_NOT_CREATE_CLIENT');
    },
    getDatabaseUrl: () => 'postgresql://server-only.invalid/postgres',
    getSslMode: () => 'prefer',
  });

  await assert.rejects(
    finalize(reportId, actorUserId),
    ReportCleanupDatabaseConfigurationError,
  );
  assert.equal(clientsCreated, 0);
});

test('usa un pool conservador y vincula report y actor como parÃ¡metros', async () => {
  const configs = [];
  const queries = [];
  const finalize = createArchivedReportFinalizer({
    createClient(config) {
      configs.push(config);
      return {
        async query(query) {
          queries.push(query);
          return { rows: [{ deleted: true }] };
        },
      };
    },
    getDatabaseUrl: () => 'postgresql://server-only.invalid/postgres',
    getSslMode: () => undefined,
  });

  assert.equal(await finalize(reportId, actorUserId), true);
  assert.equal(await finalize(reportId, actorUserId), true);
  assert.equal(configs.length, 1);
  assert.equal(configs[0].max, 1);
  assert.deepEqual(configs[0].ssl, { rejectUnauthorized: false });
  assert.deepEqual(queries[0].values, [reportId, actorUserId]);
  assert.match(
    queries[0].text,
    /private\.finalize_archived_report_deletion/,
  );
});

test('el preflight conecta sin modificar datos y verifica EXECUTE para current_user', async () => {
  const configs = [];
  const queries = [];
  const cleanup = createArchivedReportCleanupDatabase({
    createClient(config) {
      configs.push(config);
      return {
        async query(query) {
          queries.push(query);
          return query.text.includes('has_function_privilege')
            ? { rows: [{ can_execute: true }] }
            : { rows: [{ deleted: true }] };
        },
      };
    },
    getDatabaseUrl: () => 'postgresql://server-only.invalid/postgres',
    getSslMode: () => 'require',
  });

  await cleanup.preflightArchivedReportDeletion();
  assert.equal(
    await cleanup.finalizeArchivedReportDeletion(reportId, actorUserId),
    true,
  );

  assert.equal(configs.length, 1);
  assert.equal(queries.length, 2);
  assert.match(queries[0].text, /has_function_privilege/);
  assert.match(queries[0].text, /current_user/);
  assert.match(
    queries[0].text,
    /private\.finalize_archived_report_deletion\(uuid, uuid\)/,
  );
  assert.equal(queries[0].values, undefined);
  assert.doesNotMatch(
    queries[0].text,
    /select\s+private\.finalize_archived_report_deletion/i,
  );
});

test('el preflight falla explÃ­citamente cuando current_user no puede ejecutar', async () => {
  const cleanup = createArchivedReportCleanupDatabase({
    createClient() {
      return {
        async query() {
          return { rows: [{ can_execute: false }] };
        },
      };
    },
    getDatabaseUrl: () => 'postgresql://server-only.invalid/postgres',
    getSslMode: () => 'disable',
  });

  await assert.rejects(
    cleanup.preflightArchivedReportDeletion(),
    ReportCleanupDatabasePreflightError,
  );
});

test('no confirma Ã©xito si la funciÃ³n privada no devuelve deleted=true', async () => {
  const finalize = createArchivedReportFinalizer({
    createClient() {
      return {
        async query() {
          return { rows: [] };
        },
      };
    },
    getDatabaseUrl: () => 'postgresql://server-only.invalid/postgres',
    getSslMode: () => 'disable',
  });

  assert.equal(await finalize(reportId, actorUserId), false);
});

test('el adaptador sensible mantiene el marcador server-only', () => {
  const adapter = readFileSync(
    new URL('../src/services/database/report-cleanup.ts', import.meta.url),
    'utf8',
  );

  assert.match(adapter, /^import 'server-only';/);
  assert.match(adapter, /REPORT_CLEANUP_DATABASE_URL/);
  assert.match(adapter, /preflightArchivedReportDeletion/);
  assert.doesNotMatch(adapter, /NEXT_PUBLIC_/);
});

test('la acciÃ³n toma actor_user_id de getUser y no del formulario', () => {
  const action = readFileSync(
    new URL(
      '../src/features/reports/actions/delete-archived-report.ts',
      import.meta.url,
    ),
    'utf8',
  );

  assert.match(action, /ownerId: user\.id/);
  assert.match(action, /preflightDatabaseCleanup/);
  assert.match(action, /report\.delete_archived\.database_preflight_failed/);
  assert.doesNotMatch(action, /formData\.get\(['"]actorUserId['"]\)/);
});
