export type ReportCleanupDatabaseConfig = {
  application_name: string;
  allowExitOnIdle: boolean;
  connectionString: string;
  connectionTimeoutMillis: number;
  idleTimeoutMillis: number;
  max: number;
  ssl: false | { rejectUnauthorized: true };
};

type ReportCleanupQueryResult = {
  rows: Array<{ deleted: boolean }>;
};

export type ReportCleanupDatabaseClient = {
  query(config: {
    text: string;
    values: [string, string];
  }): Promise<ReportCleanupQueryResult>;
};

export class ReportCleanupDatabaseConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReportCleanupDatabaseConfigurationError';
  }
}

export function createArchivedReportFinalizer(dependencies: {
  createClient: (
    config: ReportCleanupDatabaseConfig,
  ) => ReportCleanupDatabaseClient;
  getDatabaseUrl: () => string | undefined;
  getSslMode: () => string | undefined;
}) {
  let client: ReportCleanupDatabaseClient | undefined;

  return async function finalizeArchivedReportDeletion(
    reportId: string,
    actorUserId: string,
  ): Promise<boolean> {
    const connectionString = dependencies.getDatabaseUrl()?.trim();

    if (!connectionString) {
      throw new ReportCleanupDatabaseConfigurationError(
        'REPORT_CLEANUP_DATABASE_URL is not configured',
      );
    }

    const sslMode = dependencies.getSslMode()?.trim() || 'require';

    if (sslMode !== 'require' && sslMode !== 'disable') {
      throw new ReportCleanupDatabaseConfigurationError(
        'REPORT_CLEANUP_DATABASE_SSL must be require or disable',
      );
    }

    client ??= dependencies.createClient({
      application_name: 'buscohuella-report-cleanup',
      allowExitOnIdle: true,
      connectionString,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 10_000,
      max: 1,
      ssl: sslMode === 'disable' ? false : { rejectUnauthorized: true },
    });

    const result = await client.query({
      text: `select private.finalize_archived_report_deletion(
        $1::uuid,
        $2::uuid
      ) as deleted`,
      values: [reportId, actorUserId],
    });

    return result.rows[0]?.deleted === true;
  };
}
