import {
  ReportRepository,
  type Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  ArrowLeft,
  Pencil,
} from 'lucide-react';
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
import { EditReportForm } from '@/features/reports/components/edit-report-form';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

async function loadEditableReport(
  reportId: string,
) {
  const supabase = await createClient();
  const client =
    supabase as unknown as
      SupabaseClient<ReportDatabase>;
  const repository =
    new ReportRepository(client);

  const report =
    await repository.getOwnReportById(
      reportId,
    );

  if (
    !['ACTIVE', 'PAUSED'].includes(
      report.status,
    )
  ) {
    notFound();
  }

  return report;
}

export default async function EditReportPage({
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

  let report;

  try {
    report =
      await loadEditableReport(id);
  } catch (error) {
    logServerError(
      'report.edit.load_failed',
      error,
      { reportId: id },
    );
    notFound();
  }

  return (
    <PageContainer className="space-y-6">
      <Link
        href={`/mis-reportes/${id}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft"
      >
        <ArrowLeft
          className="size-4"
          aria-hidden="true"
        />
        {translate(
          'reportEdit.back',
        )}
      </Link>

      <header>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'reportEdit.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate(
            'reportEdit.title',
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate(
            'reportEdit.description',
          )}
        </p>
      </header>

      <Card elevated>
        <CardHeader>
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Pencil
              className="size-6"
              aria-hidden="true"
            />
          </span>
          <CardTitle>
            {translate(
              'reportEdit.formTitle',
            )}
          </CardTitle>
          <CardDescription>
            {translate(
              'reportEdit.formDescription',
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <EditReportForm
            report={{
              id: report.id,
              title:
                report.title ?? '',
              description:
                report.description ??
                '',
              municipalityName:
                report.municipalityName ??
                '',
              contactMode:
                report.contactMode as
                  | 'PLATFORM_ONLY'
                  | 'PUBLIC_PHONE'
                  | 'PUBLIC_EMAIL',
              publicPhone:
                report.publicPhone ??
                '',
              publicEmail:
                report.publicEmail ??
                '',
            }}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
