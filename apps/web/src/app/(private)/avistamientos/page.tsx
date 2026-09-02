import {
  Archive,
  Camera,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
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
import { OwnerSightingArchiveAction } from '@/features/reports/components/owner-sighting-archive-action';
import { OwnerSightingStatus } from '@/features/reports/components/owner-sighting-status';
import {
  getOwnedSightingsSummary,
  listOwnedSightingsPage,
  type OwnerSightingFilters,
} from '@/features/reports/lib/owner-sightings';

const PAGE_SIZE = 20;

const STATUS_VALUES = [
  'ALL',
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'FLAGGED',
] as const;

const ARCHIVE_VALUES = [
  'ACTIVE',
  'ARCHIVED',
  'ALL',
] as const;

const SORT_VALUES = [
  'RECENT',
  'OLDEST',
  'CONFIDENCE',
  'PHOTOS',
] as const;

type SearchParams = {
  estado?: string;
  vista?: string;
  fotos?: string;
  orden?: string;
  pagina?: string;
};

function valueFrom<
  T extends readonly string[],
>(
  candidate: string | undefined,
  values: T,
  fallback: T[number],
): T[number] {
  return values.includes(
    candidate as T[number],
  )
    ? (candidate as T[number])
    : fallback;
}

function positiveInteger(
  value: string | undefined,
  fallback: number,
) {
  const parsed = Number(value);

  return Number.isInteger(parsed) &&
    parsed > 0
    ? parsed
    : fallback;
}

function searchHref(
  current: SearchParams,
  updates: Partial<SearchParams>,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries({
    ...current,
    ...updates,
  })) {
    if (
      value &&
      value !== 'ALL' &&
      !(
        key === 'pagina' &&
        value === '1'
      )
    ) {
      params.set(key, value);
    }
  }

  const query = params.toString();

  return query
    ? `/avistamientos?${query}`
    : '/avistamientos';
}

export default async function OwnerSightingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw = await searchParams;

  const status = valueFrom(
    raw.estado?.toUpperCase(),
    STATUS_VALUES,
    'ALL',
  );
  const archive = valueFrom(
    raw.vista?.toUpperCase(),
    ARCHIVE_VALUES,
    'ACTIVE',
  );
  const sort = valueFrom(
    raw.orden?.toUpperCase(),
    SORT_VALUES,
    'RECENT',
  );
  const page = positiveInteger(
    raw.pagina,
    1,
  );
  const hasPhotos =
    raw.fotos === '1'
      ? true
      : null;

  const filters: OwnerSightingFilters =
    {
      status,
      archive,
      sort,
      hasPhotos,
      page,
      pageSize: PAGE_SIZE,
    };

  const [
    result,
    summary,
    { locale, translate },
  ] = await Promise.all([
    listOwnedSightingsPage(filters),
    getOwnedSightingsSummary(),
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

  const totalPages = Math.max(
    Math.ceil(
      result.total /
        result.pageSize,
    ),
    1,
  );

  const currentSearch: SearchParams =
    {
      estado:
        status === 'ALL'
          ? undefined
          : status.toLowerCase(),
      vista:
        archive === 'ACTIVE'
          ? undefined
          : archive.toLowerCase(),
      fotos:
        hasPhotos
          ? '1'
          : undefined,
      orden:
        sort === 'RECENT'
          ? undefined
          : sort.toLowerCase(),
      pagina:
        page > 1
          ? String(page)
          : undefined,
    };

  return (
    <PageContainer className="space-y-6">
      <Breadcrumbs
        label={translate('noticesHub.breadcrumbs.label')}
        items={[
          { href: '/', label: translate('noticesHub.breadcrumbs.home') },
          { href: '/mis-avisos', label: translate('noticesHub.breadcrumbs.section') },
          { label: translate('noticesHub.breadcrumbs.received') },
        ]}
      />
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Summary
          value={summary.active}
          label={translate(
            'ownerSightings.summary.active',
          )}
        />
        <Summary
          value={summary.pending}
          label={translate(
            'ownerSightings.summary.new',
          )}
          emphasized={
            summary.pending > 0
          }
        />
        <Summary
          value={summary.flagged}
          label={translate(
            'ownerSightings.summary.flagged',
          )}
        />
        <Summary
          value={summary.archived}
          label={translate(
            'ownerSightings.summary.archived',
          )}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Filter
              className="size-5 text-primary"
              aria-hidden="true"
            />
            <div>
              <CardTitle>
                {translate(
                  'ownerSightings.filters.title',
                )}
              </CardTitle>
              <CardDescription>
                {translate(
                  'ownerSightings.filters.description',
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterRow
            label={translate(
              'ownerSightings.filters.status',
            )}
            items={STATUS_VALUES.map(
              (value) => ({
                active:
                  value === status,
                href: searchHref(
                  currentSearch,
                  {
                    estado:
                      value === 'ALL'
                        ? undefined
                        : value.toLowerCase(),
                    pagina: undefined,
                  },
                ),
                label: translate(
                  `ownerSightings.filters.statusOptions.${value}`,
                ),
              }),
            )}
          />

          <FilterRow
            label={translate(
              'ownerSightings.filters.view',
            )}
            items={ARCHIVE_VALUES.map(
              (value) => ({
                active:
                  value === archive,
                href: searchHref(
                  currentSearch,
                  {
                    vista:
                      value === 'ACTIVE'
                        ? undefined
                        : value.toLowerCase(),
                    pagina: undefined,
                  },
                ),
                label: translate(
                  `ownerSightings.filters.viewOptions.${value}`,
                ),
              }),
            )}
          />

          <FilterRow
            label={translate(
              'ownerSightings.filters.sort',
            )}
            items={SORT_VALUES.map(
              (value) => ({
                active:
                  value === sort,
                href: searchHref(
                  currentSearch,
                  {
                    orden:
                      value === 'RECENT'
                        ? undefined
                        : value.toLowerCase(),
                    pagina: undefined,
                  },
                ),
                label: translate(
                  `ownerSightings.filters.sortOptions.${value}`,
                ),
              }),
            )}
          />

          <Link
            href={searchHref(
              currentSearch,
              {
                fotos:
                  hasPhotos
                    ? undefined
                    : '1',
                pagina: undefined,
              },
            )}
            className={
              hasPhotos
                ? 'inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground'
                : 'inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated'
            }
          >
            <Camera
              className="size-4"
              aria-hidden="true"
            />
            {translate(
              'ownerSightings.filters.withPhotos',
            )}
          </Link>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {translate(
            'ownerSightings.results',
            {
              count: result.total,
            },
          )}
        </p>

        {archive === 'ARCHIVED' ? (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Archive
              className="size-4"
              aria-hidden="true"
            />
            {translate(
              'ownerSightings.archivedView',
            )}
          </span>
        ) : null}
      </div>

      {result.sightings.length ===
      0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {translate(
                'ownerSightings.emptyFiltered.title',
              )}
            </CardTitle>
            <CardDescription>
              {translate(
                'ownerSightings.emptyFiltered.description',
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {result.sightings.map(
            (sighting) => {
              const reportTitle = sighting.reportTitle;

              const location =
                sighting.locationSource ===
                'MANUAL'
                  ? sighting.locationLabel
                  : translate(
                      'ownerSightings.location.gps',
                    );

              const archived =
                Boolean(
                  sighting.archivedAt,
                );

              return (
                <Card
                  key={sighting.id}
                  elevated={
                    sighting.reviewStatus ===
                      'PENDING' &&
                    !archived
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

                      <div className="flex flex-wrap gap-2">
                        <OwnerSightingStatus
                          status={
                            sighting.reviewStatus
                          }
                          label={translate(
                            `ownerSightings.status.${sighting.reviewStatus}`,
                          )}
                        />
                        {archived ? (
                          <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-semibold">
                            {translate(
                              'ownerSightings.archived',
                            )}
                          </span>
                        ) : null}
                      </div>
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

                    <div className="flex flex-wrap items-center gap-3">
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

                      <OwnerSightingArchiveAction
                        sightingId={
                          sighting.id
                        }
                        reportId={
                          sighting.reportId
                        }
                        archived={
                          archived
                        }
                        reviewStatus={
                          sighting.reviewStatus
                        }
                        labels={{
                          archive:
                            translate(
                              'ownerSightings.actions.archive',
                            ),
                          restore:
                            translate(
                              'ownerSightings.actions.restore',
                            ),
                          unavailable:
                            translate(
                              'ownerSightings.actions.archiveUnavailable',
                            ),
                        }}
                      />
                    </div>
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
            'ownerSightings.pagination.label',
          )}
          className="flex items-center justify-between gap-4"
        >
          {page > 1 ? (
            <Link
              href={searchHref(
                currentSearch,
                {
                  pagina: String(
                    page - 1,
                  ),
                },
              )}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated"
            >
              <ChevronLeft
                className="size-4"
                aria-hidden="true"
              />
              {translate(
                'ownerSightings.pagination.previous',
              )}
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-muted-foreground">
            {translate(
              'ownerSightings.pagination.page',
              {
                page,
                total: totalPages,
              },
            )}
          </span>

          {page < totalPages ? (
            <Link
              href={searchHref(
                currentSearch,
                {
                  pagina: String(
                    page + 1,
                  ),
                },
              )}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated"
            >
              {translate(
                'ownerSightings.pagination.next',
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

function FilterRow({
  label,
  items,
}: {
  label: string;
  items: Array<{
    label: string;
    href: string;
    active: boolean;
  }>;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={
              item.active
                ? 'inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground'
                : 'inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated'
            }
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Summary({
  value,
  label,
  emphasized = false,
}: {
  value: number;
  label: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={
        emphasized
          ? 'rounded-xl border border-primary/30 bg-primary-soft/40 p-4'
          : 'rounded-xl border border-border bg-surface p-4'
      }
    >
      <p className="text-2xl font-bold">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
