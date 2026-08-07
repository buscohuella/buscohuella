import {
  ReportRepository,
  type Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  ArrowLeft,
  CalendarClock,
  FileText,
  History,
  MapPin,
  PawPrint,
  Images,
  Settings2,
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
import { CompactReportHistory } from '@/features/reports/components/compact-report-history';
import { EditReportLink } from '@/features/reports/components/edit-report-link';
import {
  ReportLifecycleActions,
} from '@/features/reports/components/report-lifecycle-actions';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

async function loadReportDetail(
  reportId: string,
) {
  const supabase = await createClient();
  const reportClient =
    supabase as unknown as
      SupabaseClient<ReportDatabase>;
  const repository =
    new ReportRepository(reportClient);

  const report =
    await repository.getOwnReportById(
      reportId,
    );

  const [{ data: events, error }, { data: primaryPhoto, error: photoError }] = await Promise.all([
    reportClient
      .from('report_events')
      .select(
        'id, event_type, from_status, to_status, metadata, created_at',
      )
      .eq('report_id', reportId)
      .order('created_at', {
        ascending: false,
      })
      .limit(30),
    reportClient
      .from('report_photos')
      .select('storage_path')
      .eq('report_id', reportId)
      .eq('is_primary', true)
      .maybeSingle(),
  ]);

  if (error) throw error;
  if (photoError) throw photoError;

  let primaryPhotoUrl: string | null = null;
  if (primaryPhoto) {
    const { data: signed, error: signError } = await supabase.storage
      .from('report-photos')
      .createSignedUrl(primaryPhoto.storage_path, 600);
    if (signError) throw signError;
    primaryPhotoUrl = signed.signedUrl;
  }

  return { report, events: events ?? [], primaryPhotoUrl };
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const [{ id }, { locale, translate }] =
    await Promise.all([
      params,
      getServerTranslator(),
    ]);

  let data;

  try {
    data =
      await loadReportDetail(id);
  } catch (error) {
    logServerError(
      'report.detail.load_failed',
      error,
      { reportId: id },
    );
    notFound();
  }

  if (data.report.status === 'DRAFT') {
    return (
      <PageContainer className="space-y-6">
        <Link
          href="/mis-reportes"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft"
        >
          <ArrowLeft
            className="size-4"
            aria-hidden="true"
          />
          {translate(
            'reports.detail.back',
          )}
        </Link>

        <Card elevated>
          <CardHeader>
            <CardTitle>
              {translate(
                'reports.detail.draftTitle',
              )}
            </CardTitle>
            <CardDescription>
              {translate(
                'reports.detail.draftDescription',
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={`/mis-reportes/${id}/fotos`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 font-semibold text-primary-foreground"
            >
              {translate(
                'reports.list.continueEditing',
              )}
            </Link>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

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

  return (
    <PageContainer className="space-y-6">
      <Link
        href="/mis-reportes"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
      >
        <ArrowLeft
          className="size-4"
          aria-hidden="true"
        />
        {translate(
          'reports.detail.back',
        )}
      </Link>

      {data.primaryPhotoUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
          <Image src={data.primaryPhotoUrl} alt={translate('reportVisual.primaryPhotoAlt')} fill unoptimized sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
        </div>
      ) : null}

      <header>
        <div className="flex flex-wrap items-center gap-2">
          {!['RESOLVED', 'CLOSED', 'ARCHIVED'].includes(
            data.report.status,
          ) ? (
            <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
              {translate(
                `reports.list.type.${data.report.reportType}`,
              )}
            </span>
          ) : null}
          <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-semibold">
            {translate(
              `reports.list.status.${data.report.status}`,
            )}
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {data.report.title}
        </h1>
        <p className="mt-2 max-w-3xl whitespace-pre-wrap text-muted-foreground">
          {data.report.description}
        </p>

        {data.report.status === 'ACTIVE' ||
        data.report.status === 'PAUSED' ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <EditReportLink
              reportId={id}
              label={translate(
                'reportEdit.title',
              )}
            />
            <Link
              href={`/mis-reportes/${id}/fotos`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 font-semibold text-foreground hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
            >
              <Images
                className="size-4"
                aria-hidden="true"
              />
              {translate(
                'reports.photos.title',
              )}
            </Link>
          </div>
        ) : null}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {translate(
                  'reports.detail.informationTitle',
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  icon={<PawPrint />}
                  label={translate(
                    'reports.detail.pet',
                  )}
                  value={
                    data.report.petId ??
                    translate(
                      'reports.detail.notAvailable',
                    )
                  }
                />
                <DetailItem
                  icon={<MapPin />}
                  label={translate(
                    'reports.detail.location',
                  )}
                  value={
                    data.report.municipalityName ??
                    translate(
                      'reports.detail.approximateLocation',
                    )
                  }
                />
                <DetailItem
                  icon={<CalendarClock />}
                  label={translate(
                    'reports.detail.incidentAt',
                  )}
                  value={
                    data.report.incidentAt
                      ? dateFormatter.format(
                          new Date(
                            data.report.incidentAt,
                          ),
                        )
                      : translate(
                          'reports.detail.approximateMoment',
                        )
                  }
                />
                <DetailItem
                  icon={<FileText />}
                  label={translate(
                    'reports.detail.publishedAt',
                  )}
                  value={
                    data.report.publishedAt
                      ? dateFormatter.format(
                          new Date(
                            data.report.publishedAt,
                          ),
                        )
                      : translate(
                          'reports.detail.notAvailable',
                        )
                  }
                />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <History
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
                <CardTitle>
                  {translate(
                    'reportVisual.historyRecent',
                  )}
                </CardTitle>
              </div>
              <CardDescription>
                {translate(
                  'reportVisual.historyDescription',
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompactReportHistory
                events={data.events}
                translate={translate}
                formatDate={(value) =>
                  dateFormatter.format(new Date(value))
                }
              />
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Settings2
                className="size-5 text-primary"
                aria-hidden="true"
              />
              <CardTitle>
                {translate(
                  'reports.detail.managementTitle',
                )}
              </CardTitle>
            </div>
            <CardDescription>
              {translate(
                'reports.detail.managementDescription',
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportLifecycleActions
              reportId={id}
              status={data.report.status}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function DetailItem({
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

