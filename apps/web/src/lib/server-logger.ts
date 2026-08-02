type LogContext = Record<
  string,
  string | number | boolean | null | undefined
>;

export function logServerError(
  event: string,
  error: unknown,
  context: LogContext = {},
) {
  const normalizedError =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack:
            process.env.NODE_ENV === 'development'
              ? error.stack
              : undefined,
        }
      : {
          name: 'UnknownError',
          message: String(error),
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
