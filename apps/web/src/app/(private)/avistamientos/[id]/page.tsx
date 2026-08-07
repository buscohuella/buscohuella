import {
  ArrowLeft,
  Camera,
  Clock3,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Target,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getServerTranslator } from '@/features/i18n/server';
import { OwnerSightingActions } from '@/features/reports/components/owner-sighting-actions';
import { OwnerSightingArchiveAction } from '@/features/reports/components/owner-sighting-archive-action';
import { OwnerSightingStatus } from '@/features/reports/components/owner-sighting-status';
import {
  getOwnedSighting,
  getOwnedSightingArchiveState,
  getOwnedSightingPhotos,
} from '@/features/reports/lib/owner-sightings';
import { getLocalizedPublicReportTitle } from '@/features/reports/lib/public-report-title';

export default async function OwnerSightingDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const [
    { id },
    { locale, translate },
  ] = await Promise.all([
    params,
    getServerTranslator(),
  ]);

  const sighting =
    await getOwnedSighting(id);

  if (!sighting) {
    notFound();
  }

  const [photos, archived] =
    await Promise.all([
      getOwnedSightingPhotos(
        sighting.id,
      ),
      getOwnedSightingArchiveState(
        sighting.id,
      ),
    ]);

  const dateFormatter =
    new Intl.DateTimeFormat(
      locale === 'ca'
        ? 'ca-ES'
        : 'es-ES',
      {
        dateStyle: 'long',
        timeStyle: 'short',
      },
    );

  const reportTitle =
    getLocalizedPublicReportTitle({
      rawTitle:
        sighting.reportTitle,
      reportType: 'LOST_PET',
      petName: sighting.petName,
      translate,
    });

  const locationValue =
    sighting.locationSource ===
    'MANUAL'
      ? sighting.locationLabel ??
        translate(
          'ownerSightings.location.unknown',
        )
      : sighting.exactLatitude !==
            null &&
          sighting.exactLongitude !==
            null
        ? `${sighting.exactLatitude.toFixed(6)}, ${sighting.exactLongitude.toFixed(6)}`
        : translate(
            'ownerSightings.location.gps',
          );

  return (
    <PageContainer className="space-y-6">
      <Link
        href="/avistamientos"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft"
      >
        <ArrowLeft
          className="size-4"
          aria-hidden="true"
        />
        {translate(
          'ownerSightings.detail.back',
        )}
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <OwnerSightingStatus
            status={
              sighting.reviewStatus
            }
            label={translate(
              `ownerSightings.status.${sighting.reviewStatus}`,
            )}
          />
          <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-semibold">
            {translate(
              `ownerSightings.confidence.${sighting.confidence}`,
            )}
          </span>
          {archived ? (
            <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-semibold">
              {translate(
                'ownerSightings.archived',
              )}
            </span>
          ) : null}
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {translate(
            'ownerSightings.detail.title',
          )}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {reportTitle}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <OwnerSightingActions
          sightingId={sighting.id}
          reportId={sighting.reportId}
          currentStatus={
            sighting.reviewStatus
          }
          labels={{
            reviewed: translate(
              'ownerSightings.actions.reviewed',
            ),
            dismissed: translate(
              'ownerSightings.actions.dismissed',
            ),
            flagged: translate(
              'ownerSightings.actions.flagged',
            ),
          }}
        />

        <OwnerSightingArchiveAction
          sightingId={sighting.id}
          reportId={sighting.reportId}
          archived={archived}
          reviewStatus={
            sighting.reviewStatus
          }
          labels={{
            archive: translate(
              'ownerSightings.actions.archive',
            ),
            restore: translate(
              'ownerSightings.actions.restore',
            ),
            unavailable: translate(
              'ownerSightings.actions.archiveUnavailable',
            ),
          }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {translate(
                  'ownerSightings.detail.information',
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-5 sm:grid-cols-2">
                <Info
                  icon={<Clock3 />}
                  label={translate(
                    'ownerSightings.detail.when',
                  )}
                  value={dateFormatter.format(
                    new Date(
                      sighting.observedAt,
                    ),
                  )}
                />
                <Info
                  icon={<MapPin />}
                  label={translate(
                    'ownerSightings.detail.location',
                  )}
                  value={locationValue}
                />
                <Info
                  icon={<Target />}
                  label={translate(
                    'ownerSightings.detail.confidence',
                  )}
                  value={translate(
                    `ownerSightings.confidence.${sighting.confidence}`,
                  )}
                />
                <Info
                  icon={<Camera />}
                  label={translate(
                    'ownerSightings.detail.photos',
                  )}
                  value={translate(
                    'ownerSightings.photosCount',
                    {
                      count:
                        sighting.photoCount,
                    },
                  )}
                />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {translate(
                  'ownerSightings.detail.comment',
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <MessageSquareText
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {sighting.notes ??
                    translate(
                      'ownerSightings.detail.noComment',
                    )}
                </p>
              </div>
            </CardContent>
          </Card>

          {photos.length > 0 ? (
            <section>
              <h2 className="text-xl font-bold">
                {translate(
                  'ownerSightings.detail.gallery',
                )}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {photos.map(
                  (photo, index) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-elevated"
                    >
                      <Image
                        src={
                          photo.signedUrl
                        }
                        alt={
                          photo.altText ??
                          translate(
                            'ownerSightings.detail.photoAlt',
                            {
                              number:
                                index +
                                1,
                            },
                          )
                        }
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ),
                )}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {translate(
                  'ownerSightings.detail.report',
                )}
              </CardTitle>
              <CardDescription>
                {reportTitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/mis-reportes/${sighting.reportId}`}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                {translate(
                  'ownerSightings.detail.manageReport',
                )}
              </Link>
            </CardContent>
          </Card>

          <div className="rounded-xl border border-primary/25 bg-primary-soft/30 p-4">
            <ShieldCheck
              className="size-6 text-primary"
              aria-hidden="true"
            />
            <h2 className="mt-3 font-semibold">
              {translate(
                'ownerSightings.detail.privacyTitle',
              )}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {translate(
                'ownerSightings.detail.privacyDescription',
              )}
            </p>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary [&>svg]:size-5">
        {icon}
      </span>
      <div>
        <dt className="text-sm font-semibold">
          {label}
        </dt>
        <dd className="mt-1 break-words text-sm text-muted-foreground">
          {value}
        </dd>
      </div>
    </div>
  );
}
