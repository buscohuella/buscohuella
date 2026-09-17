import 'server-only';

import { Pool } from 'pg';

import { createArchivedReportFinalizer } from './report-cleanup-core';

export const finalizeArchivedReportDeletion = createArchivedReportFinalizer({
  createClient: (config) => new Pool(config),
  getDatabaseUrl: () => process.env.REPORT_CLEANUP_DATABASE_URL,
  getSslMode: () => process.env.REPORT_CLEANUP_DATABASE_SSL,
});
