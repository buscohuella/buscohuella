import { PetRepository } from '@buscohuella/pet-data';
import {
  ReportRepository,
} from '@buscohuella/report-data';
import type {
  Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  Report,
  ReportStatus,
} from '@buscohuella/report-domain';
import {
  CalendarDays,
  ChevronRight,
  FileText,
  MapPin,
  PawPrint,
  Plus,
  ScrollText,
} from 'lucide-react';
import Link from 'next/link';
import type { SupabaseClient } from '@supabase/supabase-js';

import { PageContainer } from '@/components/layout/page-container';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { formatDate } from '@/features/i18n/format';
import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

type FilterKey =
  | 'all'
  | 'drafts'
  | 'active'
  | 'paused'
  | 'resolved'
  | 'closed'
  | 'archived';

const filterStatuses: Record<
  FilterKey,
  readonly ReportStatus[] | null
> = {
  all: null,
  drafts: ['DRAFT'],
  active: ['ACTIVE'],
  paused: ['PAUSED'],
  resolved: ['RESOLVED'],
  closed: ['CLOSED'],
  archived: ['ARCHIVED'],
};

const statusVariants: Record<
  ReportStatus,
  BadgeVariant
> = {
  DRAFT: 'neutral',
  ACTIVE: 'danger',
  PAUSED: 'warning',
  RESOLVED: 'success',
  CLOSED: 'info',
  ARCHIVED: 'neutral',
};

async function loadOwnReports() {
  const supabase = await createClient();
  const reportRepository =
    new ReportRepository(
      supabase as unknown as SupabaseClient<ReportDatabase>,
    );
  const petRepository =
    new PetRepository(supabase);

  const [reports, pets] = await Promise.all([
    reportRepository.listOwnReports(),
    petRepository.listOwnPets(),
  ]);

  return {
    reports,
    petNames: new Map(
      pets.map((pet) => [pet.id, pet.name]),
    ),
  };
}

export default async function MyReportsPage({
  searchParams,
}: {
  searchParams: Promise<{
    estado?: string;
  }>;
}) {
  const [query, { locale, translate }] =
    await Promise.all([
      searchParams,
      getServerTranslator(),
    ]);

  const selectedFilter = isFilterKey(
    query.estado,
  )
    ? query.estado
    : 'all';

  let data: Awaited<
    ReturnType<typeof loadOwnReports>
  >;

  try {
    data = await loadOwnReports();
  } catch (error) {
    logServerError(
      'report.list_own.failed',
      error,
    );

    return (
      <PageContainer className="space-y-6">
        <PageHeading translate={translate} showAction={false} />
        <ErrorState
          title={translate(
            'reports.list.errorTitle',
          )}
          description={translate(
            'reports.list.errorDescription',
          )}
        />
      </PageContainer>
    );
  }

  const allowedStatuses =
    filterStatuses[selectedFilter];

  const visibleReports = allowedStatuses
    ? data.reports.filter((report) =>
        allowedStatuses.includes(report.status),
      )
    : data.reports;

  return (
    <PageContainer className="space-y-6">
      <PageHeading translate={translate} showAction={data.reports.length > 0} />

      <nav
        aria-label={translate(
          'reports.list.tabsLabel',
        )}
        className="flex gap-2 overflow-x-auto border-b border-border-soft pb-px"
      >
        {(
          Object.keys(
            filterStatuses,
          ) as FilterKey[]
        ).map((filter) => {
          const count = countForFilter(
            data.reports,
            filter,
          );

          return (
            <FilterLink
              key={filter}
              filter={filter}
              count={count}
              selected={
                selectedFilter === filter
              }
              label={translate(
                `reports.list.filters.${filter}`,
              )}
            />
          );
        })}
      </nav>

      {visibleReports.length === 0 ? (
        <EmptyState
          title={translate(
            data.reports.length === 0
              ? 'reports.list.emptyTitle'
              : 'reports.list.emptyFilteredTitle',
          )}
          description={translate(
            data.reports.length === 0
              ? 'reports.list.emptyDescription'
              : 'reports.list.emptyFilteredDescription',
          )}
          icon={
            <ScrollText className="size-7" />
          }
          actions={
            <Link
              href="/mis-reportes/nuevo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
            >
              <Plus
                className="size-5"
                aria-hidden="true"
              />
              {translate(
                'reports.list.new',
              )}
            </Link>
          }
        />
      ) : (
        <>
          <p
            className="text-sm text-muted-foreground"
            aria-live="polite"
          >
            {translate(
              visibleReports.length === 1
                ? 'reports.list.countOne'
                : 'reports.list.countMany',
              {
                count:
                  visibleReports.length,
              },
            )}
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleReports.map(
              (report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  petName={
                    report.petId
                      ? data.petNames.get(
                          report.petId,
                        ) ?? null
                      : null
                  }
                  locale={locale}
                  translate={translate}
                />
              ),
            )}
          </div>
        </>
      )}
    </PageContainer>
  );
}

function PageHeading({
  translate,
  showAction,
}: {
  translate: (
    key: string,
    values?: Record<
      string,
      string | number | boolean
    >,
  ) => string;
  showAction: boolean;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'reports.list.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate(
            'reports.list.title',
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate(
            'reports.list.description',
          )}
        </p>
      </div>

      {showAction ? (
        <Link
          href="/mis-reportes/nuevo"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          <Plus
            className="size-5"
            aria-hidden="true"
          />
          {translate('reports.list.new')}
        </Link>
      ) : null}
    </header>
  );
}

function ReportCard({
  report,
  petName,
  locale,
  translate,
}: {
  report: Report;
  petName: string | null;
  locale: 'es' | 'ca';
  translate: (
    key: string,
    values?: Record<
      string,
      string | number | boolean
    >,
  ) => string;

}) {
  const title =
    report.title ||
    translate('reports.list.untitled');

  const incidentLabel = report.incidentAt
    ? translate('reports.list.incident', {
        date: formatDate(
          report.incidentAt,
          locale,
          { dateStyle: 'medium' },
        ),
      })
    : translate(
        'reports.list.incidentUnknown',
      );

  const updatedLabel = translate(
    'reports.list.updated',
    {
      date: formatDate(
        report.updatedAt,
        locale,
        {
          dateStyle: 'medium',
          timeStyle: 'short',
        },
      ),
    },
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={
              report.reportType ===
              'LOST_PET'
                ? 'danger'
                : 'info'
            }
          >
            {translate(
              `reports.list.type.${report.reportType}`,
            )}
          </Badge>

          <Badge
            variant={
              statusVariants[
                report.status
              ]
            }
          >
            {translate(
              `reports.list.status.${report.status}`,
            )}
          </Badge>
        </div>

        <CardTitle className="pt-2">
          {title}
        </CardTitle>

        <CardDescription>
          {report.description ||
            (petName
              ? translate(
                  'reports.list.petFallback',
                )
              : translate(
                  'reports.list.noPet',
                ))}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <dl className="space-y-3 text-sm">
          {petName ? (
            <InfoRow
              icon={<PawPrint />}
              value={petName}
            />
          ) : null}

          <InfoRow
            icon={<MapPin />}
            value={
              report.municipalityName ||
              translate(
                'reports.list.municipalityUnknown',
              )
            }
          />

          <InfoRow
            icon={<CalendarDays />}
            value={incidentLabel}
          />

          <InfoRow
            icon={<FileText />}
            value={updatedLabel}
          />
        </dl>

        <div className="flex justify-end border-t border-border-soft pt-4">
          {report.status === 'DRAFT' ? (
            <Link
              href={`/mis-reportes/${report.id}/fotos`}
              aria-label={translate(
                'reports.list.continueEditingAria',
                { title },
              )}
              className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
            >
              {translate(
                'reports.list.continueEditing',
              )}
              <ChevronRight
                className="size-4"
                aria-hidden="true"
              />
            </Link>
          ) : (
            <Link
              href={`/mis-reportes/${report.id}`}
              aria-label={translate(
                'reports.list.openReportAria',
                { title },
              )}
              className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
            >
              {translate(
                'reports.list.openReport',
              )}
              <ChevronRight
                className="size-4"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon,
  value,
}: {
  icon: React.ReactElement;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 text-muted-foreground">
      <span
        className="mt-0.5 text-primary [&>svg]:size-4"
        aria-hidden="true"
      >
        {icon}
      </span>
      <dd>{value}</dd>
    </div>
  );
}

function FilterLink({
  filter,
  count,
  selected,
  label,
}: {
  filter: FilterKey;
  count: number;
  selected: boolean;
  label: string;
}) {
  const href =
    filter === 'all'
      ? '/mis-reportes'
      : `/mis-reportes?estado=${filter}`;

  return (
    <Link
      href={href}
      aria-current={
        selected ? 'page' : undefined
      }
      className={
        selected
          ? 'shrink-0 border-b-2 border-primary px-4 py-3 font-semibold text-primary'
          : 'shrink-0 border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft'
      }
    >
      {label}{' '}
      <span className="ml-1 rounded-full bg-surface px-2 py-0.5 text-xs">
        {count}
      </span>
    </Link>
  );
}

function countForFilter(
  reports: Report[],
  filter: FilterKey,
) {
  const statuses =
    filterStatuses[filter];

  return statuses
    ? reports.filter((report) =>
        statuses.includes(report.status),
      ).length
    : reports.length;
}

function isFilterKey(
  value: string | undefined,
): value is FilterKey {
  return Boolean(
    value &&
      Object.prototype.hasOwnProperty.call(
        filterStatuses,
        value,
      ),
  );
}
