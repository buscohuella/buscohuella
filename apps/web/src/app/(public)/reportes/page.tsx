import { type Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import { getServerTranslator } from '@/features/i18n/server';
import { PublicReportsList } from '@/features/reports/components/public-reports-list';
import { createClient } from '@/services/supabase/server';

function toPublicReportType(value: string): 'LOST_PET' | 'FOUND_ANIMAL' {
  if (value === 'LOST_PET' || value === 'FOUND_ANIMAL') {
    return value;
  }

  throw new Error('Unexpected public report type: ' + value);
}
async function loadPublicReports() {
  const supabase = await createClient();
  const client = supabase as unknown as SupabaseClient<ReportDatabase>;
  const { data, error } = await client.rpc('get_public_reports', { result_limit: 100 });

  if (error) {
    throw error;
  }

  const reports = data ?? [];
  const photoIds = reports
    .map((report) => report.primary_photo_id)
    .filter((id): id is string => Boolean(id));
  const photoUrls = new Map<string, string>();

  if (photoIds.length > 0) {
    const { data: photos, error: photoError } = await client
      .from('report_photos')
      .select('id, storage_path')
      .in('id', photoIds);

    if (photoError) {
      throw photoError;
    }

    if (photos?.length) {
      const { data: signed, error: signError } = await supabase.storage
        .from('report-photos')
        .createSignedUrls(
          photos.map((photo) => photo.storage_path),
          900,
        );

      if (signError) {
        throw signError;
      }

      photos.forEach((photo, index) => {
        const url = signed[index]?.signedUrl;
        if (url) {
          photoUrls.set(photo.id, url);
        }
      });
    }
  }

  return {
    reports,
    photoUrls,
  };
}

export async function PublicReportsPage() {
  const [{ translate }, data] = await Promise.all([getServerTranslator(), loadPublicReports()]);
  return (
    <PageContainer className="space-y-7 py-6 sm:py-10">
      <header>
        <p className="text-sm font-semibold text-primary">
          {translate('publicReport.list.eyebrow')}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          {translate('publicReport.list.title')}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {translate('publicReport.list.description')}
        </p>
      </header>

      <PublicReportsList
        labels={{
          active: translate('publicReport.active'),
          all: translate('publicReport.list.filterAll'),
          clearLocation: translate('publicReport.list.clearLocation'),
          addressPlaceholder: translate('publicReport.list.addressPlaceholder'),
          found: translate('publicReport.type.FOUND_ANIMAL'),
          lost: translate('publicReport.type.LOST_PET'),
          noPhoto: translate('publicReport.list.noPhoto'),
          recent: translate('publicReport.list.recent'),
          filterTitle: translate('publicReport.list.filterTitle'),
          sortTitle: translate('publicReport.list.sortTitle'),
          locationTitle: translate('publicReport.list.locationTitle'),
          useLocation: translate('publicReport.list.useLocation'),
          usingLocation: translate('publicReport.list.usingLocation'),
          searching: translate('publicReport.list.searching'),
          radiusUnit: translate('publicReport.list.radiusUnit'),
          radiusAll: translate('publicReport.list.radiusAll'),
          unknownLocation: translate('publicReport.details.unknown'),
          approximateTime: translate('publicReport.details.approximateTime'),
          resultOne: translate('publicReport.list.resultOne'),
          resultMany: translate('publicReport.list.resultMany'),
          viewNotice: translate('publicReport.list.viewNotice'),
          emptyTitle: translate('publicReport.list.emptyTitle'),
          emptyDescription: translate('publicReport.list.emptyDescription'),
        }}
        reports={data.reports.map((report) => ({
          id: report.id,
          reportType: toPublicReportType(report.report_type),
          title: report.title,
          municipalityName: report.municipality_name,
          incidentAt: report.incident_at,
          latitude: report.latitude,
          longitude: report.longitude,
          photoUrl: report.primary_photo_id
            ? (data.photoUrls.get(report.primary_photo_id) ?? null)
            : null,
        }))}
      />
    </PageContainer>
  );
}

export default function LegacyPublicReportsPage() {
  redirect('/explorar-avisos');
}
