import {
  Camera,
  ChevronRight,
  Eye,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getServerTranslator } from '@/features/i18n/server';
import { OwnerSightingStatus } from '@/features/reports/components/owner-sighting-status';
import {
  listOwnedSightings,
} from '@/features/reports/lib/owner-sightings';
import { getLocalizedPublicReportTitle } from '@/features/reports/lib/public-report-title';

export default async function OwnerSightingsPage() {
  const [
    sightings,
    { locale, translate },
  ] = await Promise.all([
    listOwnedSightings(),
    getServerTranslator(),
  ]);

  const dateFormatter =
    new Intl.DateTimeFormat(
      locale === 'ca'
        ? 'ca-ES'
        : 'es-ES',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    );

  const pending =
    sightings.filter(
      (item) =>
        item.reviewStatus ===
        'PENDING',
    ).length;

  const reviewed =
    sightings.filter(
      (item) =>
        item.reviewStatus ===
        'ACCEPTED',
    ).length;

  return (
    <PageContainer className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'ownerSightings.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate(
            'ownerSightings.title',
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate(
            'ownerSightings.description',
          )}
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Summary
          value={sightings.length}
          label={translate(
            'ownerSightings.summary.total',
          )}
        />
        <Summary
          value={pending}
          label={translate(
            'ownerSightings.summary.new',
          )}
        />
        <Summary
          value={reviewed}
          label={translate(
            'ownerSightings.summary.reviewed',
          )}
        />
      </div>

      {sightings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {translate(
                'ownerSightings.empty.title',
              )}
            </CardTitle>
            <CardDescription>
              {translate(
                'ownerSightings.empty.description',
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {sightings.map(
            (sighting) => {
              const reportTitle =
                getLocalizedPublicReportTitle({
                  rawTitle:
                    sighting.reportTitle,
                  reportType:
                    'LOST_PET',
                  petName:
                    sighting.petName,
                  translate,
                });

              const location =
                sighting.locationSource ===
                'MANUAL'
                  ? sighting.locationLabel
                  : translate(
                      'ownerSightings.location.gps',
                    );

              return (
                <Card
                  key={sighting.id}
                  elevated={
                    sighting.reviewStatus ===
                    'PENDING'
                  }
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle>
                          {reportTitle}
                        </CardTitle>
                        <CardDescription>
                          {dateFormatter.format(
                            new Date(
                              sighting.observedAt,
                            ),
                          )}
                        </CardDescription>
                      </div>

                      <OwnerSightingStatus
                        status={
                          sighting.reviewStatus
                        }
                        label={translate(
                          `ownerSightings.status.${sighting.reviewStatus}`,
                        )}
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <MapPin
                          className="size-4"
                          aria-hidden="true"
                        />
                        {location}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Eye
                          className="size-4"
                          aria-hidden="true"
                        />
                        {translate(
                          `ownerSightings.confidence.${sighting.confidence}`,
                        )}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Camera
                          className="size-4"
                          aria-hidden="true"
                        />
                        {translate(
                          'ownerSightings.photosCount',
                          {
                            count:
                              sighting.photoCount,
                          },
                        )}
                      </span>
                    </div>

                    {sighting.notes ? (
                      <p className="line-clamp-2 text-sm">
                        {sighting.notes}
                      </p>
                    ) : null}

                    <Link
                      href={`/avistamientos/${sighting.id}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
                    >
                      {translate(
                        'ownerSightings.open',
                      )}
                      <ChevronRight
                        className="size-4"
                        aria-hidden="true"
                      />
                    </Link>
                  </CardContent>
                </Card>
              );
            },
          )}
        </div>
      )}
    </PageContainer>
  );
}

function Summary({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-2xl font-bold">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
