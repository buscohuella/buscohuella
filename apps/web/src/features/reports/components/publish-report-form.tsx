'use client';

import {
  CheckCircle2,
  LoaderCircle,
  Radio,
} from 'lucide-react';
import { useActionState } from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';
import {
  publishReportAction,
} from '@/features/reports/actions/publish-report';
import {
  initialPublishReportState,
} from '@/features/reports/types/publish-report-state';

export function PublishReportForm({
  reportId,
}: {
  reportId: string;
}) {
  const { t } = useTranslations('reports');
  const [state, action, pending] =
    useActionState(
      publishReportAction,
      initialPublishReportState,
    );

  return (
    <form
      action={action}
      className="space-y-4"
    >
      <input
        type="hidden"
        name="reportId"
        value={reportId}
      />

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-4">
        <input
          type="checkbox"
          name="confirmation"
          required
          className="mt-1 size-5 rounded border-border accent-primary"
        />

        <span>
          <strong className="block">
            {t(
              'publish.confirmationTitle',
            )}
          </strong>
          <span className="mt-1 block text-sm text-muted-foreground">
            {t(
              'publish.confirmationDescription',
            )}
          </span>
        </span>
      </label>

      {state.status === 'error' ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger"
        >
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-danger px-5 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {pending ? (
          <LoaderCircle
            className="size-5 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Radio
            className="size-5"
            aria-hidden="true"
          />
        )}

        {t(
          pending
            ? 'publish.publishing'
            : 'publish.publishButton',
        )}
      </button>

      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <CheckCircle2
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        {t('publish.afterPublish')}
      </p>
    </form>
  );
}
