'use client';

import {
  ArrowRight,
  Crosshair,
  LoaderCircle,
  MapPin,
  PencilLine,
  RotateCcw,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useState,
} from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';
import { LocationPicker, reverseGeocodeCoordinates, type ResolvedLocation } from '@/features/maps/components/location-picker';
import {
  approximateCoordinate,
  lostReportLocationStorageKey,
  readLostReportLocation,
  saveLostReportLocation,
  type LostReportLocation,
} from '@/features/reports/lib/lost-report-location';

type Mode = 'GPS' | 'MANUAL';

export function IncidentLocationStep({
  petId,
  moment,
  exactDate,
}: {
  petId: string;
  moment: string;
  exactDate?: string;
}) {
  const router = useRouter();
  const { t } = useTranslations('reports');
  const [mode, setMode] =
    useState<Mode | null>(null);
  const [location, setLocation] =
    useState<LostReportLocation | null>(null);
  const [manualPlace, setManualPlace] =
    useState('');
  const [manualCoordinates, setManualCoordinates] =
    useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsPlace, setGpsPlace] = useState<string | null>(null);
  const [isLocating, setIsLocating] =
    useState(false);
  const [errorKey, setErrorKey] =
    useState<string | null>(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(
      () => {
        const stored =
          readLostReportLocation();

        if (!stored) {
          return;
        }

        setLocation(stored);
        setMode(stored.source);

        if (stored.source === 'GPS') {
          setGpsPlace(stored.placeLabel ?? null);
        }

        if (stored.source === 'MANUAL') {
          setManualPlace(stored.placeLabel);
          if (
            stored.exactLatitude !== undefined &&
            stored.exactLongitude !== undefined
          ) {
            setManualCoordinates({
              latitude: stored.exactLatitude,
              longitude: stored.exactLongitude,
            });
          }
        }
      },
    );

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  function requestCurrentLocation() {
    setMode('GPS');
    setErrorKey(null);

    if (!navigator.geolocation) {
      setErrorKey(
        'location.errors.unsupported',
      );
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const exactLatitude =
          position.coords.latitude;
        const exactLongitude =
          position.coords.longitude;

        const nextLocation: LostReportLocation =
          {
            source: 'GPS',
            exactLatitude,
            exactLongitude,
            publicLatitude:
              approximateCoordinate(
                exactLatitude,
              ),
            publicLongitude:
              approximateCoordinate(
                exactLongitude,
              ),
            accuracyMeters:
              Number.isFinite(
                position.coords.accuracy,
              )
                ? Math.round(
                    position.coords.accuracy,
                  )
                : null,
            capturedAt:
              new Date().toISOString(),
          };

        saveLostReportLocation(
          nextLocation,
        );
        setLocation(nextLocation);
        setIsLocating(false);

        void reverseGeocodeCoordinates({
          latitude: exactLatitude,
          longitude: exactLongitude,
        }).then((resolved) => {
          if (!resolved) return;
          const resolvedLocation: LostReportLocation = {
            ...nextLocation,
            placeLabel: resolved.label,
            municipalityName: resolved.municipalityName,
          };
          saveLostReportLocation(resolvedLocation);
          setGpsPlace(resolved.label);
          setLocation(resolvedLocation);
        }).catch(() => undefined);
      },
      (error) => {
        setIsLocating(false);

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setErrorKey(
            'location.errors.denied',
          );
          return;
        }

        if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          setErrorKey(
            'location.errors.unavailable',
          );
          return;
        }

        if (
          error.code ===
          error.TIMEOUT
        ) {
          setErrorKey(
            'location.errors.timeout',
          );
          return;
        }

        setErrorKey(
          'location.errors.generic',
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 12_000,
        maximumAge: 30_000,
      },
    );
  }

  function selectManualMode() {
    setMode('MANUAL');
    setErrorKey(null);

    if (location?.source === 'GPS') {
      setLocation(null);
    }
  }

  function handleManualLocationResolved(resolved: ResolvedLocation) {
    const nextLocation: LostReportLocation = {
      source: 'MANUAL',
      placeLabel: resolved.label,
      municipalityName: resolved.municipalityName,
      exactLatitude: resolved.coordinates.latitude,
      exactLongitude: resolved.coordinates.longitude,
      publicLatitude: approximateCoordinate(resolved.coordinates.latitude),
      publicLongitude: approximateCoordinate(resolved.coordinates.longitude),
      capturedAt: new Date().toISOString(),
    };

    setManualPlace(resolved.label);
    setManualCoordinates(resolved.coordinates);
    saveLostReportLocation(nextLocation);
    setLocation(nextLocation);
    setErrorKey(null);
  }

  function resetLocation() {
    window.sessionStorage.removeItem(
      lostReportLocationStorageKey,
    );
    setLocation(null);
    setManualPlace('');
    setManualCoordinates(null);
    setGpsPlace(null);
    setMode(null);
    setErrorKey(null);
  }

  function continueToDescription() {
    if (!location) {
      return;
    }

    const params = new URLSearchParams({
      mascota: petId,
      momento: moment,
    });

    if (exactDate) {
      params.set('fecha', exactDate);
    }

    router.push(
      `/mis-reportes/nuevo/perdida/descripcion?${params.toString()}`,
    );
  }

  return (
    <div className="space-y-6">
      <div
        role="radiogroup"
        aria-label={t(
          'location.methodLabel',
        )}
        className="grid gap-3 sm:grid-cols-2"
      >
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'GPS'}
          onClick={requestCurrentLocation}
          disabled={isLocating}
          className={[
            'flex min-h-28 items-start gap-4 rounded-xl border p-4 text-left',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
            mode === 'GPS'
              ? 'border-primary bg-primary-soft/40'
              : 'border-border bg-surface hover:border-primary/30 hover:bg-surface-hover',
          ].join(' ')}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {isLocating ? (
              <LoaderCircle
                className="size-5 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Crosshair
                className="size-5"
                aria-hidden="true"
              />
            )}
          </span>

          <span>
            <strong className="block">
              {t(
                isLocating
                  ? 'location.gpsLocating'
                  : 'location.gpsTitle',
              )}
            </strong>
            <span className="mt-1 block text-sm text-muted-foreground">
              {t(
                'location.gpsDescription',
              )}
            </span>
          </span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={mode === 'MANUAL'}
          onClick={selectManualMode}
          className={[
            'flex min-h-28 items-start gap-4 rounded-xl border p-4 text-left',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
            mode === 'MANUAL'
              ? 'border-primary bg-primary-soft/40'
              : 'border-border bg-surface hover:border-primary/30 hover:bg-surface-hover',
          ].join(' ')}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-primary">
            <PencilLine
              className="size-5"
              aria-hidden="true"
            />
          </span>

          <span>
            <strong className="block">
              {t(
                'location.manualTitle',
              )}
            </strong>
            <span className="mt-1 block text-sm text-muted-foreground">
              {t(
                'location.manualDescription',
              )}
            </span>
          </span>
        </button>
      </div>

      {mode === 'MANUAL' ? (
        <div className="rounded-xl border border-border bg-surface p-4">
          <label
            htmlFor="manual-place"
            className="font-semibold"
          >
            {t(
              'location.manualLabel',
            )}
          </label>

          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              'location.manualHelp',
            )}
          </p>

           <div className="mt-4">
             <LocationPicker
               value={manualCoordinates}
               onChange={setManualCoordinates}
               label={manualPlace}
               onLabelChange={setManualPlace}
               onQueryChange={() => {
                 setManualCoordinates(null);
                 if (location?.source === 'MANUAL') {
                   setLocation(null);
                 }
               }}
               onResolved={handleManualLocationResolved}
             />
           </div>
        </div>
      ) : null}

      {errorKey ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger"
        >
          <TriangleAlert
            className="mt-0.5 size-5 shrink-0"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold">
              {t(
                'location.errorTitle',
              )}
            </p>
            <p className="mt-1">
              {t(errorKey)}
            </p>
          </div>
        </div>
      ) : null}

      {location ? (
        <div
          className="rounded-xl border border-primary/30 bg-primary-soft/30 p-5"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MapPin
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {t(
                  'location.confirmedTitle',
                )}
              </p>

              {location.source === 'GPS' ? (
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {gpsPlace ? <p>{gpsPlace}</p> : null}
                  <p>
                    {t(
                      'location.gpsConfirmed',
                      {
                        latitude:
                          location.publicLatitude,
                        longitude:
                          location.publicLongitude,
                      },
                    )}
                  </p>

                  {location.accuracyMeters ? (
                    <p>
                      {t(
                        'location.accuracy',
                        {
                          meters:
                            location.accuracyMeters,
                        },
                      )}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  {location.placeLabel}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-surface/80 p-3 text-sm text-muted-foreground">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              {t(
                location.source === 'GPS'
                  ? 'location.privacyGps'
                  : 'location.privacyManual',
              )}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
        {location ? (
          <button
            type="button"
            onClick={resetLocation}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            <RotateCcw
              className="size-4"
              aria-hidden="true"
            />
            {t(
              'location.change',
            )}
          </button>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t(
              'location.selectHint',
            )}
          </p>
        )}

        <button
          type="button"
          disabled={!location}
          onClick={continueToDescription}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t(
            'location.continue',
          )}
          <ArrowRight
            className="size-5"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
