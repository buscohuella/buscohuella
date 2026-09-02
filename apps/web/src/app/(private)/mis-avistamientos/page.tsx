import {
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getServerTranslator } from '@/features/i18n/server';
import {
  listMySightingsPage,
} from '@/features/reports/lib/my-sightings';

const PAGE_SIZE = 20;

const STATUS_VALUES = [
  'ALL',
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'FLAGGED',
] as const;

type SearchParams = {
  estado?: string;
  pagina?: string;
};

function statusValue(
  value: string | undefined,
) {
  const upper =
    value?.toUpperCase();

  return STATUS_VALUES.includes(
    upper as typeof STATUS_VALUES[number],
  )
    ? (upper as typeof STATUS_VALUES[number])
    : 'ALL';
}

function positivePage(
  value: string | undefined,
) {
  const parsed = Number(value);

  return Number.isInteger(parsed) &&
    parsed > 0
    ? parsed
    : 1;
}

function hrefFor(
  status: string,
  page = 1,
) {
  const params =
    new URLSearchParams();

  if (status !== 'ALL') {
    params.set(
      'estado',
      status.toLowerCase(),
    );
  }

  if (page > 1) {
    params.set(
      'pagina',
      String(page),
    );
  }

  const query =
    params.toString();

  return query
    ? `/mis-avistamientos?${query}`
    : '/mis-avistamientos';
}

export default async function MySightingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw =
    await searchParams;
  const status =
    statusValue(raw.estado);
  const page =
    positivePage(raw.pagina);

  const [
    result,
    { locale, translate },
  ] = await Promise.all([
    listMySightingsPage({
      status,
      page,
      pageSize: PAGE_SIZE,
    }),
    getServerTranslator(),
  ]);

  const formatter =
    new Intl.DateTimeFormat(
      locale === 'ca'
        ? 'ca-ES'
        : 'es-ES',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    );

  const totalPages =
    Math.max(
      Math.ceil(
        result.total /
          result.pageSize,
      ),
      1,
    );

  return (
    <PageContainer className="space-y-6">
      <Breadcrumbs
        label={translate('noticesHub.breadcrumbs.label')}
        items={[
          { href: '/', label: translate('noticesHub.breadcrumbs.home') },
          { href: '/mis-avisos', label: translate('noticesHub.breadcrumbs.section') },
          { label: translate('noticesHub.breadcrumbs.sent') },
        ]}
      />
      <header>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'mySightings.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate(
            'mySightings.title',
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate(
            'mySightings.description',
          )}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {STATUS_VALUES.map(
          (value) => (
            <Link
              key={value}
              href={hrefFor(
                value,
              )}
              className={
                value === status
                  ? 'inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground'
                  : 'inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated'
              }
            >
              {translate(
                `mySightings.filters.${value}`,
              )}
            </Link>
          ),
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {translate(
          'mySightings.results',
          {
            count:
              result.total,
          },
        )}
      </p>

      {result.sightings.length ===
      0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {translate(
                'mySightings.empty.title',
              )}
            </CardTitle>
            <CardDescription>
              {translate(
                'mySightings.empty.description',
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {result.sightings.map(
            (sighting) => {
              const title = sighting.reportTitle;

              const resolved =
                sighting.reportStatus ===
                  'RESOLVED' ||
                sighting.reportStatus ===
                  'CLOSED' ||
                sighting.reportStatus ===
                  'ARCHIVED';

              return (
                <Card
                  key={sighting.id}
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle>
                          {title}
                        </CardTitle>
                        <CardDescription>
                          {formatter.format(
                            new Date(
                              sighting.observedAt,
                            ),
                          )}
                        </CardDescription>
                      </div>

                      <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-semibold">
                        {resolved
                          ? translate(
                              'mySightings.reportResolved',
                            )
                          : translate(
                              `mySightings.status.${sighting.reviewStatus}`,
                            )}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <MapPin
                          className="size-4"
                          aria-hidden="true"
                        />
                        {sighting.locationSource ===
                        'MANUAL'
                          ? sighting.locationLabel ??
                            translate(
                              'mySightings.locationUnknown',
                            )
                          : translate(
                              'mySightings.gpsLocation',
                            )}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Camera
                          className="size-4"
                          aria-hidden="true"
                        />
                        {translate(
                          'mySightings.photos',
                          {
                            count:
                              sighting.photoCount,
                          },
                        )}
                      </span>
                    </div>

                    <Link
                      href={`/mis-avistamientos/${sighting.id}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
                    >
                      {translate(
                        'mySightings.open',
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

      {totalPages > 1 ? (
        <nav
          aria-label={translate(
            'mySightings.pagination.label',
          )}
          className="flex items-center justify-between gap-4"
        >
          {page > 1 ? (
            <Link
              href={hrefFor(
                status,
                page - 1,
              )}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated"
            >
              <ChevronLeft
                className="size-4"
                aria-hidden="true"
              />
              {translate(
                'mySightings.pagination.previous',
              )}
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-muted-foreground">
            {translate(
              'mySightings.pagination.page',
              {
                page,
                total:
                  totalPages,
              },
            )}
          </span>

          {page < totalPages ? (
            <Link
              href={hrefFor(
                status,
                page + 1,
              )}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated"
            >
              {translate(
                'mySightings.pagination.next',
              )}
              <ChevronRight
                className="size-4"
                aria-hidden="true"
              />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </PageContainer>
  );
}
