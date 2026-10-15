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
  rows: Array<{
    can_execute?: boolean;
    deleted?: boolean;
  }>;
};

export type ReportCleanupDatabaseClient = {
  query(config: {
    text: string;
    values?: [string, string];
  }): Promise<ReportCleanupQueryResult>;
};

export class ReportCleanupDatabaseConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReportCleanupDatabaseConfigurationError';
  }
}

export class ReportCleanupDatabasePreflightError extends Error {
  readonly code = 'REPORT_CLEANUP_EXECUTE_DENIED';

  constructor() {
    super('The cleanup database role cannot execute the archived report finalizer');
    this.name = 'ReportCleanupDatabasePreflightError';
  }
}

type ReportCleanupDatabaseDependencies = {
  createClient: (
    config: ReportCleanupDatabaseConfig,
  ) => ReportCleanupDatabaseClient;
  getDatabaseUrl: () => string | undefined;
  getSslMode: () => string | undefined;
};

export function createArchivedReportCleanupDatabase(
  dependencies: ReportCleanupDatabaseDependencies,
) {
  let client: ReportCleanupDatabaseClient | undefined;

  function getClient(): ReportCleanupDatabaseClient {
    if (client) return client;

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

    client = dependencies.createClient({
      application_name: 'buscohuella-report-cleanup',
      allowExitOnIdle: true,
      connectionString,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 10_000,
      max: 1,
      ssl: sslMode === 'disable' ? false : { rejectUnauthorized: true },
    });

    return client;
  }

  async function preflightArchivedReportDeletion(): Promise<void> {
    const result = await getClient().query({
      text: `select has_function_privilege(
        current_user,
        'private.finalize_archived_report_deletion(uuid, uuid)',
        'EXECUTE'
      ) as can_execute`,
    });

    if (result.rows[0]?.can_execute !== true) {
      throw new ReportCleanupDatabasePreflightError();
    }
  }

  async function finalizeArchivedReportDeletion(
    reportId: string,
    actorUserId: string,
  ): Promise<boolean> {
    const result = await getClient().query({
      text: `select private.finalize_archived_report_deletion(
        $1::uuid,
        $2::uuid
      ) as deleted`,
      values: [reportId, actorUserId],
    });

    return result.rows[0]?.deleted === true;
  }

  return {
    finalizeArchivedReportDeletion,
    preflightArchivedReportDeletion,
  };
}

export function createArchivedReportFinalizer(
  dependencies: ReportCleanupDatabaseDependencies,
) {
  return createArchivedReportCleanupDatabase(dependencies)
    .finalizeArchivedReportDeletion;
}
