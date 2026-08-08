'use client';

import {
  CalendarClock,
  Check,
  ClipboardCheck,
  Images,
  LoaderCircle,
  MapPin,
  PawPrint,
  ShieldCheck,
} from 'lucide-react';
import {
  useActionState,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

import { useTranslations } from '@/features/i18n/i18n-provider';
import { createLostReportDraftAction } from '@/features/reports/actions/create-lost-report-draft';
import {
  readLostReportDetails,
  lostReportDetailsStorageKey,
  type LostReportDetails,
} from '@/features/reports/lib/lost-report-details';
import {
  readLostReportLocation,
  lostReportLocationStorageKey,
  type LostReportLocation,
} from '@/features/reports/lib/lost-report-location';
import {
  initialCreateLostReportDraftState,
} from '@/features/reports/types/create-lost-report-draft-state';

export function LostReportReview({
  petId,
  petName,
  moment,
  exactDate,
}: {
  petId: string;
  petName: string;
  moment: string;
  exactDate?: string;
}) {
  const router = useRouter();
  const { t } = useTranslations('reports');
  const [location, setLocation] =
    useState<LostReportLocation | null>(
      null,
    );
  const [details, setDetails] =
    useState<LostReportDetails | null>(
      null,
    );
  const [ready, setReady] =
    useState(false);

  const [state, formAction, pending] =
    useActionState(
      createLostReportDraftAction,
      initialCreateLostReportDraftState,
    );

  useEffect(() => {
    const frameId =
      window.requestAnimationFrame(() => {
        setLocation(
          readLostReportLocation(),
        );
        setDetails(
          readLostReportDetails(),
        );
        setReady(true);
      });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (
      state.status !== 'success'
    ) {
      return;
    }

    window.sessionStorage.removeItem(
      lostReportLocationStorageKey,
    );
    window.sessionStorage.removeItem(
      lostReportDetailsStorageKey,
    );

    router.replace(
      `/mis-reportes?creado=1`,
    );
  }, [router, state]);

  if (!ready) {
    return (
      <div
        className="flex min-h-32 items-center justify-center gap-3 text-muted-foreground"
        aria-live="polite"
      >
        <LoaderCircle
          className="size-5 animate-spin"
          aria-hidden="true"
        />
        {t('review.loading')}
      </div>
    );
  }

  if (!location || !details) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-danger/30 bg-danger/10 p-4"
      >
        <p className="font-semibold text-danger">
          {t(
            'review.missingTitle',
          )}
        </p>
        <p className="mt-1 text-sm text-danger">
          {t(
            'review.missingDescription',
          )}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="petId"
        value={petId}
      />
      <input
        type="hidden"
        name="moment"
        value={moment}
      />
      <input
        type="hidden"
        name="exactDate"
        value={exactDate ?? ''}
      />
      <input
        type="hidden"
        name="description"
        value={details.description}
      />
      <input
        type="hidden"
        name="hasCollarOrHarness"
        value={String(
          details.hasCollarOrHarness,
        )}
      />
      <input
        type="hidden"
        name="needsMedication"
        value={String(
          details.needsMedication,
        )}
      />
      <input
        type="hidden"
        name="isFearful"
        value={String(
          details.isFearful,
        )}
      />
      <input
        type="hidden"
        name="isFriendly"
        value={String(
          details.isFriendly,
        )}
      />
      <input
        type="hidden"
        name="usePetPhotos"
        value={String(
          details.usePetPhotos,
        )}
      />
      <input
        type="hidden"
        name="locationSource"
        value={location.source}
      />

      {location.source === 'GPS' ||
      (location.exactLatitude !== undefined &&
        location.exactLongitude !== undefined &&
        location.publicLatitude !== undefined &&
        location.publicLongitude !== undefined) ? (
        <>
          <input
            type="hidden"
            name="exactLatitude"
            value={location.exactLatitude ?? ''}
          />
          <input
            type="hidden"
            name="exactLongitude"
            value={location.exactLongitude ?? ''}
          />
          <input
            type="hidden"
            name="publicLatitude"
            value={location.publicLatitude ?? ''}
          />
          <input
            type="hidden"
            name="publicLongitude"
            value={location.publicLongitude ?? ''}
          />
        </>
      ) : (
        <>
          <input type="hidden" name="placeLabel" value={location.placeLabel} />
          <input type="hidden" name="municipalityName" value={location.municipalityName ?? ''} />
        </>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard
          icon={<PawPrint />}
          title={t(
            'review.sections.pet',
          )}
        >
          <p className="font-semibold">
            {petName}
          </p>
        </SummaryCard>

        <SummaryCard
          icon={<CalendarClock />}
          title={t(
            'review.sections.moment',
          )}
        >
          <p>
            {t(
              `incidentTime.summary.${moment}`,
            )}
          </p>
        </SummaryCard>

        <SummaryCard
          icon={<MapPin />}
          title={t(
            'review.sections.location',
          )}
        >
          <p>
            {location.source === 'GPS'
              ? t(
                  'review.locationGps',
                  {
                    latitude:
                      location.publicLatitude,
                    longitude:
                      location.publicLongitude,
                  },
                )
              : location.placeLabel}
          </p>
        </SummaryCard>

        <SummaryCard
          icon={<Images />}
          title={t(
            'review.sections.photos',
          )}
        >
          <p>
            {t(
              details.usePetPhotos
                ? 'review.photosYes'
                : 'review.photosNo',
            )}
          </p>
        </SummaryCard>
      </div>

      <SummaryCard
        icon={<ClipboardCheck />}
        title={t(
          'review.sections.description',
        )}
      >
        <p className="whitespace-pre-wrap">
          {details.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {details.hasCollarOrHarness ? (
            <DetailTag
              label={t(
                'description.form.hasCollar',
              )}
            />
          ) : null}
          {details.needsMedication ? (
            <DetailTag
              label={t(
                'description.form.needsMedication',
              )}
            />
          ) : null}
          {details.isFearful ? (
            <DetailTag
              label={t(
                'description.form.isFearful',
              )}
            />
          ) : null}
          {details.isFriendly ? (
            <DetailTag
              label={t(
                'description.form.isFriendly',
              )}
            />
          ) : null}
        </div>
      </SummaryCard>

      <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary-soft/30 p-4 text-sm">
        <ShieldCheck
          className="mt-0.5 size-5 shrink-0 text-primary"
          aria-hidden="true"
        />
        <p>
          {t(
            'review.draftPrivacy',
          )}
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
        <p className="text-sm text-muted-foreground">
          {t(
            'review.createHint',
          )}
        </p>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft disabled:cursor-wait disabled:opacity-65"
        >
          {pending ? (
            <LoaderCircle
              className="size-5 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Check
              className="size-5"
              aria-hidden="true"
            />
          )}
          {t(
            pending
              ? 'review.creating'
              : 'review.createDraft',
          )}
        </button>
      </div>
    </form>
  );
}

function SummaryCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary [&>svg]:size-5">
          {icon}
        </span>
        <h2 className="font-semibold">
          {title}
        </h2>
      </div>
      <div className="mt-3 text-sm text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function DetailTag({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
      {label}
    </span>
  );
}
