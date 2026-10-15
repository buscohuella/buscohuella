import 'server-only';

import { Pool } from 'pg';

import { createArchivedReportCleanupDatabase } from './report-cleanup-core';

const archivedReportCleanupDatabase = createArchivedReportCleanupDatabase({
  createClient: (config) => new Pool(config),
  getDatabaseUrl: () => process.env.REPORT_CLEANUP_DATABASE_URL,
  getSslMode: () => process.env.REPORT_CLEANUP_DATABASE_SSL,
});

export const finalizeArchivedReportDeletion =
  archivedReportCleanupDatabase.finalizeArchivedReportDeletion;
export const preflightArchivedReportDeletion =
  archivedReportCleanupDatabase.preflightArchivedReportDeletion;
