type LogContext = Record<
  string,
  string | number | boolean | null | undefined
>;

const SAFE_ERROR_STAGES = new Set([
  'path_validation',
  'database_preflight',
  'storage_cleanup',
  'database_cleanup_after_storage',
]);
const MAX_LOG_FIELD_LENGTH = 2_000;

function sanitizeLogText(value: string): string {
  return value
    .replace(/\bpostgres(?:ql)?:\/\/[^\s"'<>]+/gi, '[REDACTED_DATABASE_URL]')
    .replace(
      /\bREPORT_CLEANUP_DATABASE_URL\s*[=:]\s*[^\s,;]+/gi,
      'REPORT_CLEANUP_DATABASE_URL=[REDACTED]',
    )
    .replace(/\b(password|passwd|pwd)\s*[=:]\s*[^\s,;]+/gi, '$1=[REDACTED]')
    .slice(0, MAX_LOG_FIELD_LENGTH);
}

function readSafeStringProperty(
  value: unknown,
  property: string,
): string | undefined {
  if (
    (typeof value !== 'object' && typeof value !== 'function') ||
    value === null
  ) {
    return undefined;
  }

  try {
    const candidate = (value as Record<string, unknown>)[property];
    return typeof candidate === 'string'
      ? sanitizeLogText(candidate)
      : undefined;
  } catch {
    return undefined;
  }
}

function normalizeNestedCause(cause: unknown) {
  if (
    (typeof cause !== 'object' && typeof cause !== 'function') ||
    cause === null
  ) {
    return undefined;
  }

  const name = readSafeStringProperty(cause, 'name') ?? 'UnknownError';
  const message = readSafeStringProperty(cause, 'message') ?? 'Unknown error';
  const code = readSafeStringProperty(cause, 'code');

  return { name, message, code };
}

export function logServerError(
  event: string,
  error: unknown,
  context: LogContext = {},
) {
  const code = readSafeStringProperty(error, 'code');
  const stage = readSafeStringProperty(error, 'stage');
  const cause = normalizeNestedCause(
    (typeof error === 'object' || typeof error === 'function') && error !== null
      ? (error as { cause?: unknown }).cause
      : undefined,
  );
  const normalizedError = error instanceof Error
    ? {
        name: sanitizeLogText(error.name),
        message: sanitizeLogText(error.message),
        code,
        stage: stage && SAFE_ERROR_STAGES.has(stage) ? stage : undefined,
        cause,
        stack:
          process.env.NODE_ENV === 'development' && error.stack
            ? sanitizeLogText(error.stack)
            : undefined,
      }
    : {
        name: 'UnknownError',
        message: sanitizeLogText(String(error)),
      };

  console.error(
    JSON.stringify({
      level: 'error',
      event,
      timestamp: new Date().toISOString(),
      error: normalizedError,
      context,
    }),
  );
}
