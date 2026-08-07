'use client';

import {
  Archive,
  ArchiveRestore,
  LoaderCircle,
} from 'lucide-react';
import { useActionState } from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';
import { archiveOwnedSightingAction } from '@/features/reports/actions/archive-sighting';
import { initialArchiveSightingState } from '@/features/reports/types/archive-sighting-state';

export function OwnerSightingArchiveAction({
  sightingId,
  reportId,
  archived,
  reviewStatus,
  labels,
}: {
  sightingId: string;
  reportId: string;
  archived: boolean;
  reviewStatus:
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'FLAGGED';
  labels: {
    archive: string;
    restore: string;
    unavailable: string;
  };
}) {
  const { t } = useTranslations(
    'ownerSightings',
  );
  const [state, action, pending] =
    useActionState(
      archiveOwnedSightingAction,
      initialArchiveSightingState,
    );

  const canArchive =
    reviewStatus === 'ACCEPTED' ||
    reviewStatus === 'REJECTED';

  if (!archived && !canArchive) {
    return (
      <p className="text-sm text-muted-foreground">
        {labels.unavailable}
      </p>
    );
  }

  const Icon = archived
    ? ArchiveRestore
    : Archive;

  const feedback =
    state.status === 'idle'
      ? null
      : state.status === 'success'
        ? state.operation === 'archive'
          ? t(
              'archiveFeedback.archived',
            )
          : t(
              'archiveFeedback.restored',
            )
        : state.operation === 'archive'
          ? t(
              'archiveFeedback.archiveError',
            )
          : t(
              'archiveFeedback.restoreError',
            );

  return (
    <div className="space-y-2">
      <form action={action}>
        <input
          type="hidden"
          name="sightingId"
          value={sightingId}
        />
        <input
          type="hidden"
          name="reportId"
          value={reportId}
        />
        <input
          type="hidden"
          name="archived"
          value={
            archived
              ? 'false'
              : 'true'
          }
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <LoaderCircle
              className="size-4 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Icon
              className="size-4"
              aria-hidden="true"
            />
          )}
          {pending
            ? t(
                'archiveFeedback.processing',
              )
            : archived
              ? labels.restore
              : labels.archive}
        </button>
      </form>

      {feedback ? (
        <p
          role={
            state.status === 'error'
              ? 'alert'
              : 'status'
          }
          className={
            state.status === 'error'
              ? 'text-sm font-medium text-danger'
              : 'text-sm font-medium text-primary'
          }
        >
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
