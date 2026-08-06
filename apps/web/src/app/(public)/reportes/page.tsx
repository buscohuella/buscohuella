import {
  type Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  CalendarClock,
  ImageOff,
  MapPin,
  PawPrint,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { getServerTranslator } from '@/features/i18n/server';
import { getLocalizedPublicReportTitle } from '@/features/reports/lib/public-report-title';
import { createClient } from '@/services/supabase/server';

type PublicReportRow = {
  id: string;
  report_type:
    | 'LOST_PET'
    | 'FOUND_ANIMAL';
  species_id: number;
  title: string;
  description: string;
  incident_at: string | null;
  municipality_name: string | null;
  primary_photo_id: string | null;
  published_at: string;
};

type RpcResult = {
  data: PublicReportRow[] | null;
  error: {
    message?: string;
  } | null;
};

function getRpc(
  client: SupabaseClient<ReportDatabase>,
) {
  return client.rpc.bind(
    client,
  ) as unknown as (
    functionName: 'get_public_reports',
    args: {
      filter_species_id: null;
      filter_report_type: null;
      result_limit: number;
    },
  ) => Promise<RpcResult>;
}

async function loadPublicReports() {
  const supabase = await createClient();
  const client =
    supabase as unknown as
      SupabaseClient<ReportDatabase>;
  const { data, error } = await getRpc(
    client,
  )('get_public_reports', {
    filter_species_id: null,
    filter_report_type: null,
    result_limit: 100,
  });

  if (error) {
    throw error;
  }

  const reports = data ?? [];
  const photoIds = reports
    .map(
      (report) =>
        report.primary_photo_id,
    )
    .filter(
      (id): id is string =>
        Boolean(id),
    );
  const photoUrls =
    new Map<string, string>();

  if (photoIds.length > 0) {
    const {
      data: photos,
      error: photoError,
    } = await client
      .from('report_photos')
      .select('id, storage_path')
      .in('id', photoIds);

    if (photoError) {
      throw photoError;
    }

    if (photos?.length) {
      const {
        data: signed,
        error: signError,
      } = await supabase.storage
        .from('report-photos')
        .createSignedUrls(
          photos.map(
            (photo) =>
              photo.storage_path,
          ),
          900,
        );

      if (signError) {
        throw signError;
      }

      photos.forEach(
        (photo, index) => {
          const url =
            signed[index]?.signedUrl;
          if (url) {
            photoUrls.set(
              photo.id,
              url,
            );
          }
        },
      );
    }
  }

  return {
    reports,
    photoUrls,
  };
}

export default async function PublicReportsPage() {
  const [{ locale, translate }, data] =
    await Promise.all([
      getServerTranslator(),
      loadPublicReports(),
    ]);
  const formatter =
    new Intl.DateTimeFormat(
      locale === 'ca'
        ? 'ca-ES'
        : 'es-ES',
      { dateStyle: 'medium' },
    );

  return (
    <PageContainer className="space-y-7 py-6 sm:py-10">
      <header>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'publicReport.list.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          {translate(
            'publicReport.list.title',
          )}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {translate(
            'publicReport.list.description',
          )}
        </p>
      </header>

      {data.reports.length === 0 ? (
        <EmptyState
          title={translate(
            'publicReport.list.emptyTitle',
          )}
          description={translate(
            'publicReport.list.emptyDescription',
          )}
          icon={<PawPrint className="size-7" />}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.reports.map(
            (report) => {
              const photoUrl =
                report.primary_photo_id
                  ? data.photoUrls.get(
                      report.primary_photo_id,
                    ) ?? null
                  : null;

              const displayTitle =
                getLocalizedPublicReportTitle({
                  rawTitle: report.title,
                  reportType: report.report_type,
                  translate,
                });

              return (
                <Link
                  key={report.id}
                  href={`/reportes/${report.id}`}
                  className="group rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
                >
                  <Card className="h-full overflow-hidden transition-transform group-hover:-translate-y-0.5">
                    <div className="relative aspect-[16/9] border-b border-border bg-surface-elevated">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={displayTitle}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                          <ImageOff className="size-8" />
                          <span className="text-sm">
                            {translate(
                              'publicReport.list.noPhoto',
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
                          {translate(
                            `publicReport.type.${report.report_type}`,
                          )}
                        </span>
                        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                          {translate(
                            'publicReport.active',
                          )}
                        </span>
                      </div>
                      <CardTitle className="pt-2">
                        {displayTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <Info
                        icon={<MapPin />}
                        value={
                          report.municipality_name ??
                          translate(
                            'publicReport.details.unknown',
                          )
                        }
                      />
                      <Info
                        icon={<CalendarClock />}
                        value={
                          report.incident_at
                            ? formatter.format(
                                new Date(
                                  report.incident_at,
                                ),
                              )
                            : translate(
                                'publicReport.details.approximateTime',
                              )
                        }
                      />
                    </CardContent>
                  </Card>
                </Link>
              );
            },
          )}
        </div>
      )}
    </PageContainer>
  );
}

function Info({
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
      <span>{value}</span>
    </div>
  );
}
