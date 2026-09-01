import {
  Archive,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  Flag,
  MapPin,
  MessageSquareText,
  PauseCircle,
  PawPrint,
  PlayCircle,
  Send,
  XCircle,
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
import {
  getMySighting,
  getMySightingPhotos,
  getMySightingTimeline,
  type MySightingTimelineEvent,
} from '@/features/reports/lib/my-sightings';

export default async function MySightingDetailPage({
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
    await getMySighting(id);

  if (!sighting) {
    notFound();
  }

  const [photos, timeline] =
    await Promise.all([
      getMySightingPhotos(
        sighting.id,
      ),
      getMySightingTimeline(
        sighting.id,
      ),
    ]);

  const formatter =
    new Intl.DateTimeFormat(
      locale === 'ca'
        ? 'ca-ES'
        : 'es-ES',
      {
        dateStyle: 'long',
        timeStyle: 'short',
      },
    );

  const title = sighting.reportTitle;

  const resolved =
    sighting.reportStatus ===
      'RESOLVED' ||
    sighting.reportStatus ===
      'CLOSED' ||
    sighting.reportStatus ===
      'ARCHIVED';

  const location =
    sighting.locationSource ===
    'MANUAL'
      ? sighting.locationLabel ??
        translate(
          'mySightings.locationUnknown',
        )
      : sighting.exactLatitude !==
            null &&
          sighting.exactLongitude !==
            null
        ? `${sighting.exactLatitude.toFixed(6)}, ${sighting.exactLongitude.toFixed(6)}`
        : translate(
            'mySightings.gpsLocation',
          );

  return (
    <PageContainer className="space-y-6">
      <Link
        href="/mis-avistamientos"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft"
      >
        <ArrowLeft
          className="size-4"
          aria-hidden="true"
        />
        {translate(
          'mySightings.detail.back',
        )}
      </Link>

      <header>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
          {resolved
            ? translate(
                'mySightings.reportResolved',
              )
            : translate(
                `mySightings.status.${sighting.reviewStatus}`,
              )}
        </span>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {translate(
            'mySightings.detail.title',
          )}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {title}
        </p>
      </header>

      {resolved ? (
        <div className="rounded-xl border border-primary/30 bg-primary-soft/40 p-4">
          <div className="flex gap-3">
            <PawPrint
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold">
                {translate(
                  'mySightings.resolved.title',
                )}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {translate(
                  'mySightings.resolved.description',
                )}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {translate(
                  'mySightings.detail.information',
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-5 sm:grid-cols-2">
                <Info
                  icon={<Clock3 />}
                  label={translate(
                    'mySightings.detail.when',
                  )}
                  value={formatter.format(
                    new Date(
                      sighting.observedAt,
                    ),
                  )}
                />
                <Info
                  icon={<MapPin />}
                  label={translate(
                    'mySightings.detail.location',
                  )}
                  value={location}
                />
                <Info
                  icon={<CheckCircle2 />}
                  label={translate(
                    'mySightings.detail.review',
                  )}
                  value={translate(
                    `mySightings.status.${sighting.reviewStatus}`,
                  )}
                />
                <Info
                  icon={<Camera />}
                  label={translate(
                    'mySightings.detail.photos',
                  )}
                  value={translate(
                    'mySightings.photos',
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
                  'mySightings.detail.myComment',
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
                      'mySightings.detail.noComment',
                    )}
                </p>
              </div>
            </CardContent>
          </Card>

          {photos.length > 0 ? (
            <section>
              <h2 className="text-xl font-bold">
                {translate(
                  'mySightings.detail.gallery',
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
                            'mySightings.detail.photoAlt',
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
                  'mySightings.detail.followUp',
                )}
              </CardTitle>
              <CardDescription>
                {translate(
                  'mySightings.detail.followUpDescription',
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timeline.length > 0 ? (
                <ol className="space-y-0">
                  {timeline.map(
                    (
                      event,
                      index,
                    ) => (
                      <TimelineItem
                        key={
                          event.key
                        }
                        event={event}
                        date={formatter.format(
                          new Date(
                            event.createdAt,
                          ),
                        )}
                        label={timelineLabel(
                          event,
                          translate,
                        )}
                        last={
                          index ===
                          timeline.length -
                            1
                        }
                      />
                    ),
                  )}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {translate(
                    'mySightings.timeline.empty',
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          <Link
            href={`/reportes/${sighting.reportId}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated"
          >
            {translate(
              'mySightings.detail.openReport',
            )}
          </Link>

          {!resolved ? (
            <Link
              href={`/reportes/${sighting.reportId}/avistamiento/${sighting.id}/fotos`}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              {translate(
                'mySightings.detail.managePhotos',
              )}
            </Link>
          ) : null}
        </aside>
      </div>
    </PageContainer>
  );
}

function timelineLabel(
  event: MySightingTimelineEvent,
  translate: (
    key: string,
  ) => string,
) {
  if (
    event.type ===
      'SIGHTING_REVIEWED' &&
    event.reviewStatus
  ) {
    return translate(
      `mySightings.timeline.review.${event.reviewStatus}`,
    );
  }

  return translate(
    `mySightings.timeline.event.${event.type}`,
  );
}

function renderTimelineIcon(
  event: MySightingTimelineEvent,
) {
  const iconProps = {
    className: 'size-4',
    'aria-hidden': true,
  } as const;

  if (
    event.type ===
    'SIGHTING_CREATED'
  ) {
    return <Send {...iconProps} />;
  }

  if (
    event.type ===
    'SIGHTING_REVIEWED'
  ) {
    if (
      event.reviewStatus ===
      'REJECTED'
    ) {
      return <XCircle {...iconProps} />;
    }

    if (
      event.reviewStatus ===
      'FLAGGED'
    ) {
      return <Flag {...iconProps} />;
    }

    return (
      <CheckCircle2
        {...iconProps}
      />
    );
  }

  if (event.type === 'PAUSED') {
    return (
      <PauseCircle
        {...iconProps}
      />
    );
  }

  if (
    event.type ===
    'REACTIVATED'
  ) {
    return (
      <PlayCircle
        {...iconProps}
      />
    );
  }

  if (
    event.type === 'ARCHIVED'
  ) {
    return (
      <Archive
        {...iconProps}
      />
    );
  }

  return <PawPrint {...iconProps} />;
}

function TimelineItem({
  event,
  label,
  date,
  last,
}: {
  event: MySightingTimelineEvent;
  label: string;
  date: string;
  last: boolean;
}) {
  return (
    <li className="relative flex gap-3 pb-5">
      {!last ? (
        <span
          className="absolute left-[0.9375rem] top-8 h-[calc(100%-1rem)] w-px bg-border"
          aria-hidden="true"
        />
      ) : null}

      <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        {renderTimelineIcon(
          event,
        )}
      </span>

      <div className="pt-1">
        <p className="text-sm font-semibold">
          {label}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {date}
        </p>
      </div>
    </li>
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

