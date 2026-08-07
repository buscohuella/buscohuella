import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import { reviewOwnedSightingAction } from '@/features/reports/actions/review-sighting';

export function OwnerSightingActions({
  sightingId,
  reportId,
  currentStatus,
  labels,
}: {
  sightingId: string;
  reportId: string;
  currentStatus:
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'FLAGGED';
  labels: {
    reviewed: string;
    dismissed: string;
    flagged: string;
  };
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus !==
      'ACCEPTED' ? (
        <ActionForm
          sightingId={sightingId}
          reportId={reportId}
          status="ACCEPTED"
          label={labels.reviewed}
          icon={
            <CheckCircle2 />
          }
        />
      ) : null}

      {currentStatus !==
      'REJECTED' ? (
        <ActionForm
          sightingId={sightingId}
          reportId={reportId}
          status="REJECTED"
          label={labels.dismissed}
          icon={<XCircle />}
        />
      ) : null}

      {currentStatus !==
      'FLAGGED' ? (
        <ActionForm
          sightingId={sightingId}
          reportId={reportId}
          status="FLAGGED"
          label={labels.flagged}
          icon={
            <AlertTriangle />
          }
        />
      ) : null}
    </div>
  );
}

function ActionForm({
  sightingId,
  reportId,
  status,
  label,
  icon,
}: {
  sightingId: string;
  reportId: string;
  status:
    | 'ACCEPTED'
    | 'REJECTED'
    | 'FLAGGED';
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <form
      action={
        reviewOwnedSightingAction
      }
    >
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
        name="status"
        value={status}
      />
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated [&>svg]:size-4"
      >
        {icon}
        {label}
      </button>
    </form>
  );
}
