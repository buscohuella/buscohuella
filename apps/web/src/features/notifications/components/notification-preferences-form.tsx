'use client';

import { BellRing, Check, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { updateNotificationPreferencesAction } from '@/features/notifications/actions/update-notification-preferences';
import { useTranslations } from '@/features/i18n/i18n-provider';

export function NotificationPreferencesForm({
  initialSightings,
  initialReportUpdates,
}: {
  initialSightings: boolean;
  initialReportUpdates: boolean;
}) {
  const { t } = useTranslations('profile');
  const router = useRouter();
  const [sightings, setSightings] = useState(initialSightings);
  const [reportUpdates, setReportUpdates] = useState(initialReportUpdates);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  function save(nextSightings: boolean, nextReportUpdates: boolean) {
    setError(false);
    startTransition(async () => {
      try {
        await updateNotificationPreferencesAction(nextSightings, nextReportUpdates);
        router.refresh();
      } catch {
        setError(true);
      }
    });
  }

  function updateSightings(value: boolean) {
    setSightings(value);
    save(value, reportUpdates);
  }

  function updateReportUpdates(value: boolean) {
    setReportUpdates(value);
    save(sightings, value);
  }

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-border-soft p-4 transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary-soft">
        <input type="checkbox" checked={sightings} onChange={(event) => updateSightings(event.target.checked)} disabled={pending} className="mt-1 size-5 accent-primary" />
        <span className="flex-1"><span className="flex items-center gap-2 font-semibold"><BellRing className="size-5 text-primary" aria-hidden="true" />{t('contactSettings.sightingsTitle')}</span><span className="mt-1 block text-sm leading-6 text-muted-foreground">{t('contactSettings.sightingsDescription')}</span></span>
        {sightings ? <Check className="mt-1 size-5 text-primary" aria-hidden="true" /> : null}
      </label>
      <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-border-soft p-4 transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary-soft">
        <input type="checkbox" checked={reportUpdates} onChange={(event) => updateReportUpdates(event.target.checked)} disabled={pending} className="mt-1 size-5 accent-primary" />
        <span className="flex-1"><span className="flex items-center gap-2 font-semibold"><BellRing className="size-5 text-primary" aria-hidden="true" />{t('contactSettings.reportUpdatesTitle')}</span><span className="mt-1 block text-sm leading-6 text-muted-foreground">{t('contactSettings.reportUpdatesDescription')}</span></span>
        {reportUpdates ? <Check className="mt-1 size-5 text-primary" aria-hidden="true" /> : null}
      </label>
      <div className="flex items-start gap-3 rounded-xl border border-border-soft bg-surface p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div><p className="font-semibold">{t('contactSettings.essentialTitle')}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{t('contactSettings.essentialDescription')}</p></div>
      </div>
      <p className="text-sm text-muted-foreground" role="status" aria-live="polite">{error ? t('contactSettings.error') : pending ? t('contactSettings.saving') : t('contactSettings.saved')}</p>
    </div>
  );
}
