export function didInvalidSubmissionComplete({
  hasErrors,
  isPending,
  wasPending,
}: {
  hasErrors: boolean;
  isPending: boolean;
  wasPending: boolean;
}): boolean {
  return wasPending && !isPending && hasErrors;
}
