'use client';

import {
  Archive,
  CirclePause,
  CirclePlay,
  CircleX,
  LoaderCircle,
  PartyPopper,
} from 'lucide-react';
import {
  useActionState,
  useEffect,
} from 'react';
import { useRouter } from 'next/navigation';

import { useTranslations } from '@/features/i18n/i18n-provider';
import {
  manageReportLifecycleAction,
} from '@/features/reports/actions/report-lifecycle';
import {
  initialReportLifecycleState,
} from '@/features/reports/types/report-lifecycle-state';

type ReportStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'PAUSED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ARCHIVED';

export function ReportLifecycleActions({
  reportId,
  status,
}: {
  reportId: string;
  status: ReportStatus;
}) {
  const router = useRouter();
  const { t } = useTranslations('reports');
  const [state, action, pending] =
    useActionState(
      manageReportLifecycleAction,
      initialReportLifecycleState,
    );

  useEffect(() => {
    if (
      state.status === 'success'
    ) {
      router.refresh();
    }
  }, [router, state]);

  return (
    <div className="space-y-5">
      {state.status !== 'idle' ? (
        <div
          role={
            state.status === 'error'
              ? 'alert'
              : 'status'
          }
          className={[
            'rounded-xl border p-4 text-sm',
            state.status === 'error'
              ? 'border-danger/30 bg-danger/10 text-danger'
              : 'border-primary/30 bg-primary-soft/30 text-primary',
          ].join(' ')}
        >
          {state.message}
        </div>
      ) : null}

      {status === 'ACTIVE' ? (
        <SimpleAction
          reportId={reportId}
          actionName="PAUSE"
          icon={<CirclePause />}
          title={t(
            'detail.actions.pauseTitle',
          )}
          description={t(
            'detail.actions.pauseDescription',
          )}
          button={t(
            'detail.actions.pauseButton',
          )}
          pending={pending}
          formAction={action}
        />
      ) : null}

      {status === 'PAUSED' ? (
        <SimpleAction
          reportId={reportId}
          actionName="REACTIVATE"
          icon={<CirclePlay />}
          title={t(
            'detail.actions.reactivateTitle',
          )}
          description={t(
            'detail.actions.reactivateDescription',
          )}
          button={t(
            'detail.actions.reactivateButton',
          )}
          pending={pending}
          formAction={action}
        />
      ) : null}

      {status === 'ACTIVE' ||
      status === 'PAUSED' ? (
        <>
          <ResolveAction
            reportId={reportId}
            pending={pending}
            formAction={action}
          />
          <CloseAction
            reportId={reportId}
            pending={pending}
            formAction={action}
          />
        </>
      ) : null}

      {status === 'RESOLVED' ||
      status === 'CLOSED' ? (
        <SimpleAction
          reportId={reportId}
          actionName="ARCHIVE"
          icon={<Archive />}
          title={t(
            'detail.actions.archiveTitle',
          )}
          description={t(
            'detail.actions.archiveDescription',
          )}
          button={t(
            'detail.actions.archiveButton',
          )}
          pending={pending}
          formAction={action}
        />
      ) : null}

      {status === 'ARCHIVED' ? (
        <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">
          {t(
            'detail.actions.archivedDescription',
          )}
        </p>
      ) : null}
    </div>
  );
}

function SimpleAction({
  reportId,
  actionName,
  icon,
  title,
  description,
  button,
  pending,
  formAction,
}: {
  reportId: string;
  actionName:
    | 'PAUSE'
    | 'REACTIVATE'
    | 'ARCHIVE';
  icon: React.ReactNode;
  title: string;
  description: string;
  button: string;
  pending: boolean;
  formAction: (
    payload: FormData,
  ) => void;
}) {
  return (
    <form
      action={formAction}
      className="rounded-xl border border-border bg-surface p-4"
    >
      <input
        type="hidden"
        name="reportId"
        value={reportId}
      />
      <input
        type="hidden"
        name="action"
        value={actionName}
      />

      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary [&>svg]:size-5">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 font-semibold hover:bg-surface-elevated disabled:opacity-60"
      >
        {pending ? (
          <LoaderCircle
            className="size-4 animate-spin"
            aria-hidden="true"
          />
        ) : null}
        {button}
      </button>
    </form>
  );
}

function ResolveAction({
  reportId,
  pending,
  formAction,
}: {
  reportId: string;
  pending: boolean;
  formAction: (
    payload: FormData,
  ) => void;
}) {
  const { t } = useTranslations('reports');

  return (
    <form
      action={formAction}
      className="rounded-xl border border-primary/30 bg-primary-soft/20 p-4"
    >
      <input
        type="hidden"
        name="reportId"
        value={reportId}
      />
      <input
        type="hidden"
        name="action"
        value="RESOLVE"
      />

      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <PartyPopper
            className="size-5"
            aria-hidden="true"
          />
        </span>
        <div>
          <h3 className="font-semibold">
            {t(
              'detail.actions.resolveTitle',
            )}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              'detail.actions.resolveDescription',
            )}
          </p>
        </div>
      </div>

      <label
        htmlFor="resolution-type"
        className="mt-4 block text-sm font-semibold"
      >
        {t(
          'detail.actions.resolutionType',
        )}
      </label>
      <select
        id="resolution-type"
        name="resolutionType"
        required
        defaultValue=""
        className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3"
      >
        <option
          value=""
          disabled
        >
          {t(
            'detail.actions.selectResolution',
          )}
        </option>
        <option value="REUNITED">
          {t(
            'detail.resolutions.REUNITED',
          )}
        </option>
        <option value="OWNER_LOCATED">
          {t(
            'detail.resolutions.OWNER_LOCATED',
          )}
        </option>
        <option value="SAFE_WITH_FINDER">
          {t(
            'detail.resolutions.SAFE_WITH_FINDER',
          )}
        </option>
        <option value="TRANSFERRED_TO_AUTHORITY">
          {t(
            'detail.resolutions.TRANSFERRED_TO_AUTHORITY',
          )}
        </option>
        <option value="TRANSFERRED_TO_SHELTER">
          {t(
            'detail.resolutions.TRANSFERRED_TO_SHELTER',
          )}
        </option>
        <option value="OTHER">
          {t(
            'detail.resolutions.OTHER',
          )}
        </option>
      </select>

      <label
        htmlFor="resolution-notes"
        className="mt-4 block text-sm font-semibold"
      >
        {t(
          'detail.actions.notesOptional',
        )}
      </label>
      <textarea
        id="resolution-notes"
        name="notes"
        maxLength={2000}
        rows={3}
        className="mt-2 w-full rounded-lg border border-border bg-background p-3"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-60"
      >
        {pending ? (
          <LoaderCircle
            className="size-4 animate-spin"
            aria-hidden="true"
          />
        ) : null}
        {t(
          'detail.actions.resolveButton',
        )}
      </button>
    </form>
  );
}

function CloseAction({
  reportId,
  pending,
  formAction,
}: {
  reportId: string;
  pending: boolean;
  formAction: (
    payload: FormData,
  ) => void;
}) {
  const { t } = useTranslations('reports');

  return (
    <form
      action={formAction}
      className="rounded-xl border border-danger/30 bg-danger/5 p-4"
    >
      <input
        type="hidden"
        name="reportId"
        value={reportId}
      />
      <input
        type="hidden"
        name="action"
        value="CLOSE"
      />

      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
          <CircleX
            className="size-5"
            aria-hidden="true"
          />
        </span>
        <div>
          <h3 className="font-semibold">
            {t(
              'detail.actions.closeTitle',
            )}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              'detail.actions.closeDescription',
            )}
          </p>
        </div>
      </div>

      <label
        htmlFor="closure-reason"
        className="mt-4 block text-sm font-semibold"
      >
        {t(
          'detail.actions.closureReason',
        )}
      </label>
      <textarea
        id="closure-reason"
        name="notes"
        minLength={3}
        maxLength={1000}
        rows={3}
        required
        className="mt-2 w-full rounded-lg border border-border bg-background p-3"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-danger px-4 font-semibold text-white disabled:opacity-60"
      >
        {pending ? (
          <LoaderCircle
            className="size-4 animate-spin"
            aria-hidden="true"
          />
        ) : null}
        {t(
          'detail.actions.closeButton',
        )}
      </button>
    </form>
  );
}
