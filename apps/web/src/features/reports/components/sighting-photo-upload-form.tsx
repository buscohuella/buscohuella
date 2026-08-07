'use client';

import { ImagePlus, LoaderCircle } from 'lucide-react';
import { useActionState } from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';
import { uploadSightingPhotoAction } from '@/features/reports/actions/sighting-photos';
import { initialSightingPhotoActionState } from '@/features/reports/types/sighting-photo-action-state';

export function SightingPhotoUploadForm({ reportId, sightingId, disabled }: {
  reportId: string;
  sightingId: string;
  disabled: boolean;
}) {
  const { t } = useTranslations('sightingPhotos');
  const [state, action, pending] = useActionState(uploadSightingPhotoAction, initialSightingPhotoActionState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="reportId" value={reportId} />
      <input type="hidden" name="sightingId" value={sightingId} />
      <div>
        <label htmlFor="sighting-photo" className="block font-semibold">{t('fileLabel')}</label>
        <p className="mt-1 text-sm text-muted-foreground">{t('fileHelp')}</p>
        <input
          id="sighting-photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          disabled={disabled || pending}
          className="mt-3 block w-full rounded-lg border border-border bg-background p-3 text-sm"
        />
      </div>
      <div>
        <label htmlFor="sighting-photo-alt" className="block font-semibold">{t('altLabel')}</label>
        <input
          id="sighting-photo-alt"
          name="altText"
          type="text"
          maxLength={200}
          disabled={disabled || pending}
          placeholder={t('altPlaceholder')}
          className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-3"
        />
      </div>
      {state.status !== 'idle' ? (
        <div role={state.status === 'error' ? 'alert' : 'status'} className={state.status === 'error' ? 'rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger' : 'rounded-xl border border-primary/30 bg-primary-soft/30 p-3 text-sm text-primary'}>
          {state.message}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={disabled || pending}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <ImagePlus className="size-5" aria-hidden="true" />}
        {t(pending ? 'uploading' : 'upload')}
      </button>
    </form>
  );
}
