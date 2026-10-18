'use client';

import {
  ArrowRight,
  Check,
  Crosshair,
  LoaderCircle,
  MapPin,
  PencilLine,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useMemo, useRef, useState } from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';
import {
  LocationPicker,
  reverseGeocodeCoordinates,
  type ResolvedLocation,
} from '@/features/maps/components/location-picker';
import { createFoundReportDraftAction } from '@/features/reports/actions/create-found-report-draft';
import {
  approximateCoordinate,
  type ReportDraftLocation,
} from '@/features/reports/lib/lost-report-location';
import { localDateTimeToIso } from '@/features/reports/lib/sighting-datetime';
import type { FoundAnimalCareStatus } from '@/features/reports/lib/found-report-details';
import type { ReportIncidentMoment } from '@/features/reports/lib/report-draft-input';
import { initialCreateFoundReportDraftState } from '@/features/reports/types/create-found-report-draft-state';

type SpeciesOption = {
  id: number;
  name: string;
};

type LocationMode = 'GPS' | 'MANUAL';

const MOMENTS: ReportIncidentMoment[] = ['NOW', 'RECENT', 'TODAY', 'YESTERDAY', 'CUSTOM'];

const CARE_STATUSES: FoundAnimalCareStatus[] = ['IN_CARE', 'LOCATED'];

export function FoundReportQuickForm({ species }: { species: SpeciesOption[] }) {
  const router = useRouter();
  const { t } = useTranslations('reports');
  const locationSectionRef = useRef<HTMLFieldSetElement>(null);
  const [state, formAction, pending] = useActionState(
    createFoundReportDraftAction,
    initialCreateFoundReportDraftState,
  );
  const [moment, setMoment] = useState<ReportIncidentMoment | null>(null);
  const [customDateTime, setCustomDateTime] = useState('');
  const [careStatus, setCareStatus] = useState<FoundAnimalCareStatus | null>(null);
  const [locationMode, setLocationMode] = useState<LocationMode | null>(null);
  const [location, setLocation] = useState<ReportDraftLocation | null>(null);
  const [manualPlace, setManualPlace] = useState('');
  const [manualCoordinates, setManualCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [gpsPlace, setGpsPlace] = useState<string | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const maxDateTime = useMemo(() => toLocalDateTimeValue(new Date()), []);
  const exactDate = customDateTime ? localDateTimeToIso(customDateTime) : null;

  useEffect(() => {
    if (state.status === 'success') {
      router.replace(`/mis-reportes/${state.reportId}/fotos`);
    }
  }, [router, state]);

  function requestCurrentLocation() {
    setLocationMode('GPS');
    setLocation(null);
    setLocationError(false);

    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }

    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const exactLatitude = position.coords.latitude;
        const exactLongitude = position.coords.longitude;
        const nextLocation: ReportDraftLocation = {
          source: 'GPS',
          exactLatitude,
          exactLongitude,
          publicLatitude: approximateCoordinate(exactLatitude),
          publicLongitude: approximateCoordinate(exactLongitude),
          accuracyMeters: Number.isFinite(position.coords.accuracy)
            ? Math.round(position.coords.accuracy)
            : null,
          capturedAt: new Date().toISOString(),
        };

        setLocation(nextLocation);
        setGpsStatus('ready');

        void reverseGeocodeCoordinates({
          latitude: exactLatitude,
          longitude: exactLongitude,
        })
          .then((resolved) => {
            if (!resolved) return;
            setGpsPlace(resolved.label);
            setLocation({
              ...nextLocation,
              placeLabel: resolved.label,
              municipalityName: resolved.municipalityName,
            });
          })
          .catch(() => undefined);
      },
      () => setGpsStatus('error'),
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 30_000 },
    );
  }

  function selectManualLocation() {
    setLocationMode('MANUAL');
    setLocation(location?.source === 'MANUAL' ? location : null);
    setLocationError(false);
  }

  function handleManualLocationResolved(resolved: ResolvedLocation) {
    setManualPlace(resolved.label);
    setManualCoordinates(resolved.coordinates);
    setLocation({
      source: 'MANUAL',
      placeLabel: resolved.label,
      municipalityName: resolved.municipalityName,
      exactLatitude: resolved.coordinates.latitude,
      exactLongitude: resolved.coordinates.longitude,
      publicLatitude: approximateCoordinate(resolved.coordinates.latitude),
      publicLongitude: approximateCoordinate(resolved.coordinates.longitude),
      capturedAt: new Date().toISOString(),
    });
    setLocationError(false);
  }

  return (
    <form
      action={formAction}
      className="space-y-8"
      onSubmit={(event) => {
        if (location) return;
        event.preventDefault();
        setLocationError(true);
        locationSectionRef.current?.focus();
      }}
    >
      <input type="hidden" name="moment" value={moment ?? ''} />
      <input type="hidden" name="exactDate" value={exactDate ?? ''} />
      <input type="hidden" name="careStatus" value={careStatus ?? ''} />
      <input type="hidden" name="locationSource" value={location?.source ?? ''} />
      <input type="hidden" name="placeLabel" value={location?.placeLabel ?? ''} />
      <input type="hidden" name="municipalityName" value={location?.municipalityName ?? ''} />
      <input type="hidden" name="exactLatitude" value={location?.exactLatitude ?? ''} />
      <input type="hidden" name="exactLongitude" value={location?.exactLongitude ?? ''} />
      <input type="hidden" name="publicLatitude" value={location?.publicLatitude ?? ''} />
      <input type="hidden" name="publicLongitude" value={location?.publicLongitude ?? ''} />

      <div>
        <label htmlFor="found-species" className="font-semibold">
          {t('found.quick.speciesLabel')}
        </label>
        <select
          id="found-species"
          name="speciesId"
          required
          defaultValue=""
          className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          <option value="" disabled>
            {t('found.quick.speciesPlaceholder')}
          </option>
          {species.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-3">
        <legend className="font-semibold">{t('found.quick.momentLabel')}</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MOMENTS.map((value) => (
            <label
              key={value}
              className={[
                'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3',
                moment === value
                  ? 'border-primary bg-primary-soft/40'
                  : 'border-border bg-surface hover:border-primary/30',
              ].join(' ')}
            >
              <input
                type="radio"
                name="momentOption"
                value={value}
                required
                checked={moment === value}
                onChange={() => setMoment(value)}
                className="size-5 accent-primary"
              />
              <span className="font-medium">{t(`incidentTime.summary.${value}`)}</span>
            </label>
          ))}
        </div>
        {moment === 'CUSTOM' ? (
          <div>
            <label htmlFor="found-exact-date" className="sr-only">
              {t('incidentTime.customLabel')}
            </label>
            <input
              id="found-exact-date"
              type="datetime-local"
              value={customDateTime}
              max={maxDateTime}
              required
              onChange={(event) => setCustomDateTime(event.target.value)}
              className="min-h-12 w-full rounded-lg border border-border bg-background px-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft sm:max-w-sm"
            />
          </div>
        ) : null}
      </fieldset>

      <fieldset
        ref={locationSectionRef}
        tabIndex={-1}
        aria-invalid={locationError || undefined}
        aria-describedby={locationError ? 'found-location-error' : undefined}
        className="space-y-3 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
      >
        <legend className="font-semibold">{t('found.quick.locationLabel')}</legend>
        <p className="text-sm text-muted-foreground">{t('found.quick.locationHelp')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={locationOptionClass(locationMode === 'GPS')}>
            <input
              type="radio"
              name="locationModeOption"
              value="GPS"
              checked={locationMode === 'GPS'}
              disabled={gpsStatus === 'loading'}
              onChange={requestCurrentLocation}
              className="size-5 accent-primary"
            />
            {gpsStatus === 'loading' ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Crosshair className="size-5" aria-hidden="true" />
            )}
            <span>{t('location.gpsTitle')}</span>
          </label>
          <label className={locationOptionClass(locationMode === 'MANUAL')}>
            <input
              type="radio"
              name="locationModeOption"
              value="MANUAL"
              checked={locationMode === 'MANUAL'}
              onChange={selectManualLocation}
              className="size-5 accent-primary"
            />
            <PencilLine className="size-5" aria-hidden="true" />
            <span>{t('location.manualTitle')}</span>
          </label>
        </div>

        {locationMode === 'MANUAL' ? (
          <LocationPicker
            value={manualCoordinates}
            onChange={setManualCoordinates}
            label={manualPlace}
            onLabelChange={setManualPlace}
            onQueryChange={() => {
              setManualCoordinates(null);
              setLocation(null);
            }}
            onResolved={handleManualLocationResolved}
          />
        ) : null}

        {gpsStatus === 'error' ? (
          <div role="alert" className="flex gap-2 rounded-lg bg-danger/10 p-3 text-sm text-danger">
            <TriangleAlert className="size-5 shrink-0" aria-hidden="true" />
            {t('location.errors.generic')}
          </div>
        ) : null}

        {location ? (
          <div className="flex items-start gap-3 rounded-lg bg-primary-soft/40 p-3 text-sm">
            <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold">{t('location.confirmedTitle')}</p>
              <p className="text-muted-foreground">
                {location.source === 'GPS'
                  ? (gpsPlace ?? t('found.quick.approximateLocationReady'))
                  : location.placeLabel}
              </p>
            </div>
          </div>
        ) : null}

        {locationError ? (
          <p id="found-location-error" role="alert" className="text-sm text-danger">
            {t('found.quick.locationError')}
          </p>
        ) : null}

        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          {t('found.quick.privacy')}
        </p>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-semibold">{t('found.care.title')}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {CARE_STATUSES.map((value) => (
            <label
              key={value}
              className={[
                'flex min-h-20 cursor-pointer items-start gap-3 rounded-xl border p-4',
                careStatus === value
                  ? 'border-primary bg-primary-soft/40'
                  : 'border-border bg-surface hover:border-primary/30',
              ].join(' ')}
            >
              <input
                type="radio"
                name="careStatusOption"
                value={value}
                required
                checked={careStatus === value}
                onChange={() => setCareStatus(value)}
                className="mt-1 size-5 accent-primary"
              />
              <span>
                <strong className="block">{t(`found.care.options.${value}.label`)}</strong>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {t(`found.care.options.${value}.description`)}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="found-description" className="font-semibold">
          {t('found.quick.descriptionLabel')}
        </label>
        <p id="found-description-help" className="mt-1 text-sm text-muted-foreground">
          {t('found.quick.descriptionHelp')}
        </p>
        <textarea
          id="found-description"
          name="description"
          rows={3}
          maxLength={500}
          aria-describedby="found-description-help found-description-count"
          onChange={(event) => setDescriptionLength(event.target.value.length)}
          className="mt-2 w-full rounded-lg border border-border bg-background p-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        />
        <p id="found-description-count" className="mt-1 text-sm text-muted-foreground">
          {t('found.quick.characterCount', { count: descriptionLength, max: 500 })}
        </p>
      </div>

      {state.status === 'error' ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger"
        >
          {state.message}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t('found.quick.nextHint')}</p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? (
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="size-5" aria-hidden="true" />
          )}
          {t(pending ? 'found.quick.saving' : 'found.quick.continue')}
          {!pending ? <ArrowRight className="size-5" aria-hidden="true" /> : null}
        </button>
      </div>
    </form>
  );
}

function locationOptionClass(selected: boolean) {
  return [
    'flex min-h-14 items-center justify-center gap-3 rounded-xl border px-4 font-semibold',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft disabled:opacity-60',
    selected
      ? 'border-primary bg-primary-soft/40 text-primary'
      : 'border-border bg-surface hover:border-primary/30',
  ].join(' ');
}

function toLocalDateTimeValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
