import {
  ReportRepository,
  type Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  ArrowLeft,
  Camera,
  Check,
  CircleAlert,
  Eye,
  MapPin,
  PawPrint,
  Radio,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getServerTranslator } from '@/features/i18n/server';
import {
  PublishReportForm,
} from '@/features/reports/components/publish-report-form';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

async function loadPublishData(
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

  if (report.status !== 'DRAFT') {
    notFound();
  }

  const { count, error } =
    await reportClient
      .from('report_photos')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('report_id', reportId);

  if (error) {
    throw error;
  }

  return {
    report,
    photoCount: count ?? 0,
  };
}

export default async function PublishReportPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const [{ id }, { translate }] =
    await Promise.all([
      params,
      getServerTranslator(),
    ]);

  let data;

  try {
    data = await loadPublishData(id);
  } catch (error) {
    logServerError(
      'report.publish_page.load_failed',
      error,
      { reportId: id },
    );
    notFound();
  }

  const hasLocation = Boolean(
    data.report.publicLocation ||
      data.report.municipalityName,
  );
  const hasDescription =
    Boolean(
      data.report.description &&
        data.report.description.trim()
          .length >= 10,
    );
  const hasPet = Boolean(
    data.report.petId,
  );
  const canPublish =
    hasLocation &&
    hasDescription &&
    hasPet;

  return (
    <PageContainer className="space-y-6">
      <Link
        href={`/mis-reportes/${id}/fotos`}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
      >
        <ArrowLeft
          className="size-4"
          aria-hidden="true"
        />
        {translate(
          'reports.publish.back',
        )}
      </Link>

      <header>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'reports.publish.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate(
            'reports.publish.title',
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate(
            'reports.publish.description',
          )}
        </p>
      </header>

      <Card elevated>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">
              {translate(
                'reports.publish.draft',
              )}
            </Badge>
            <Badge variant="danger">
              {translate(
                'reports.list.type.LOST_PET',
              )}
            </Badge>
          </div>

          <CardTitle className="pt-2">
            {data.report.title}
          </CardTitle>
          <CardDescription>
            {data.report.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-3 sm:grid-cols-2">
          <ChecklistItem
            complete={hasPet}
            icon={<PawPrint />}
            label={translate(
              'reports.publish.checks.pet',
            )}
          />
          <ChecklistItem
            complete={hasLocation}
            icon={<MapPin />}
            label={translate(
              'reports.publish.checks.location',
            )}
          />
          <ChecklistItem
            complete={hasDescription}
            icon={<Eye />}
            label={translate(
              'reports.publish.checks.description',
            )}
          />
          <ChecklistItem
            complete={
              data.photoCount > 0
            }
            optional
            icon={<Camera />}
            label={translate(
              'reports.publish.checks.photos',
              {
                count: data.photoCount,
              },
            )}
            optionalLabel={translate(
              'reports.publish.optional',
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
            <Radio
              className="size-6"
              aria-hidden="true"
            />
          </span>
          <CardTitle>
            {translate(
              'reports.publish.visibilityTitle',
            )}
          </CardTitle>
          <CardDescription>
            {translate(
              'reports.publish.visibilityDescription',
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {canPublish ? (
            <PublishReportForm
              reportId={id}
            />
          ) : (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4"
            >
              <CircleAlert
                className="mt-0.5 size-5 shrink-0 text-warning"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold">
                  {translate(
                    'reports.publish.incompleteTitle',
                  )}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {translate(
                    'reports.publish.incompleteDescription',
                  )}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function ChecklistItem({
  complete,
  optional = false,
  icon,
  label,
  optionalLabel,
}: {
  complete: boolean;
  optional?: boolean;
  icon: React.ReactNode;
  label: string;
  optionalLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
      <span
        className={[
          'flex size-10 shrink-0 items-center justify-center rounded-full [&>svg]:size-5',
          complete
            ? 'bg-primary-soft text-primary'
            : optional
              ? 'bg-surface-elevated text-muted-foreground'
              : 'bg-warning/10 text-warning',
        ].join(' ')}
        aria-hidden="true"
      >
        {complete ? (
          <Check className="size-5" />
        ) : (
          icon
        )}
      </span>

      <div>
        <p className="font-medium">
          {label}
        </p>
        {optional ? (
          <p className="text-xs text-muted-foreground">
            {optionalLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
