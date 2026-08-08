'use client';

import { Crosshair, LoaderCircle, Send } from 'lucide-react';
import { useActionState, useMemo, useState } from 'react';
import { useTranslations } from '@/features/i18n/i18n-provider';
import { createSightingAction } from '@/features/reports/actions/create-sighting';
import { initialCreateSightingState } from '@/features/reports/types/create-sighting-state';
import { LocationPicker } from '@/features/maps/components/location-picker';

type Mode = 'GPS' | 'MANUAL';
type Coordinates = { latitude: number; longitude: number };
const localNow = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export function CreateSightingForm({ reportId }: { reportId: string }) {
  const { t } = useTranslations('sightingCreate');
  const [mode, setMode] = useState<Mode>('GPS');
  const [coords, setCoords] = useState({ latitude: '', longitude: '' });
  const [manualCoordinates, setManualCoordinates] = useState<Coordinates | null>(null);
  const [locationLabel, setLocationLabel] = useState('');
  const [gps, setGps] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [state, action, pending] = useActionState(createSightingAction, initialCreateSightingState);
 const maxDate = useMemo(
  () => localNow(),
  [],
);

  function locate() {
    if (!navigator.geolocation) return setGps('error');
    setGps('loading');
    navigator.geolocation.getCurrentPosition(
      ({ coords: value }) => {
        setCoords({ latitude: String(value.latitude), longitude: String(value.longitude) });
        setGps('ready');
      },
      () => setGps('error'),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  }

  return <form action={action} className="space-y-6">
    <input type="hidden" name="reportId" value={reportId} />
    <input type="hidden" name="latitude" value={coords.latitude} />
    <input type="hidden" name="longitude" value={coords.longitude} />
    <input type="hidden" name="locationLabel" value={locationLabel} />

    <Field label={t('fields.when')} help={t('fields.whenHelp')} htmlFor="observedAt">
      <input id="observedAt" name="observedAt" type="datetime-local" required max={maxDate} defaultValue={maxDate} className="min-h-12 w-full rounded-lg border border-border bg-background px-3" />
    </Field>

    <fieldset className="space-y-3">
      <legend className="font-semibold">{t('location.title')}</legend>
      <p className="text-sm text-muted-foreground">{t('location.description')}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {(['GPS', 'MANUAL'] as Mode[]).map((option) => <label key={option} className={`cursor-pointer rounded-xl border p-4 ${mode === option ? 'border-primary bg-primary-soft/30' : 'border-border bg-surface'}`}>
          <input className="sr-only" type="radio" name="locationSource" value={option} checked={mode === option} onChange={() => setMode(option)} />
          <strong className="block">{t(`location.options.${option}.label`)}</strong>
          <span className="mt-1 block text-sm text-muted-foreground">{t(`location.options.${option}.description`)}</span>
        </label>)}
      </div>
    </fieldset>

    {mode === 'GPS' ? <div className="rounded-xl border border-border bg-surface p-4">
      <button type="button" onClick={locate} disabled={gps === 'loading'} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-60">
        {gps === 'loading' ? <LoaderCircle className="size-5 animate-spin" /> : <Crosshair className="size-5" />}
        {t(gps === 'ready' ? 'location.gpsReady' : 'location.useGps')}
      </button>
      {gps === 'ready' ? <p className="mt-3 text-sm text-primary">{t('location.gpsSuccess')}</p> : null}
      {gps === 'error' ? <p className="mt-3 text-sm text-danger">{t('location.gpsError')}</p> : null}
    </div> : <LocationPicker
      value={manualCoordinates}
      onChange={(value) => {
        setManualCoordinates(value);
        setCoords({ latitude: String(value.latitude), longitude: String(value.longitude) });
      }}
      label={locationLabel}
      onLabelChange={setLocationLabel}
    />}

    <fieldset className="space-y-3">
      <legend className="font-semibold">{t('confidence.title')}</legend>
      {['CERTAIN', 'LIKELY', 'UNSURE'].map((option) => <label key={option} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-4">
        <input type="radio" name="confidence" value={option} required defaultChecked={option === 'LIKELY'} className="mt-1 size-5 accent-primary" />
        <span><strong className="block">{t(`confidence.options.${option}.label`)}</strong><span className="mt-1 block text-sm text-muted-foreground">{t(`confidence.options.${option}.description`)}</span></span>
      </label>)}
    </fieldset>

    <Field label={t('fields.notes')} help={t('fields.notesHelp')} htmlFor="notes">
      <textarea id="notes" name="notes" maxLength={1000} rows={5} placeholder={t('fields.notesPlaceholder')} className="w-full rounded-lg border border-border bg-background p-3" />
    </Field>

    {state.status === 'error' ? <div role="alert" className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">{state.message}</div> : null}
    <button type="submit" disabled={pending || (mode === 'GPS' && gps !== 'ready') || (mode === 'MANUAL' && !manualCoordinates)} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-danger px-5 font-semibold text-white disabled:opacity-60 sm:w-auto">
      {pending ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-5" />}{t(pending ? 'submitting' : 'submit')}
    </button>
  </form>;
}

function Field({ label, help, htmlFor, children }: { label: string; help: string; htmlFor: string; children: React.ReactNode }) {
  return <div><label htmlFor={htmlFor} className="block font-semibold">{label}</label><p className="mt-1 text-sm text-muted-foreground">{help}</p><div className="mt-2">{children}</div></div>;
}
