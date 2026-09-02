import type { Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';

import { PageContainer } from '@/components/layout/page-container';
import { getServerTranslator } from '@/features/i18n/server';
import {
  PublicMap,
  type PublicMapReport,
} from '@/features/maps/components/public-map';
import { createClient } from '@/services/supabase/server';

type RpcResult = {
  data: Array<{
    id: string;
    report_type: 'LOST_PET' | 'FOUND_ANIMAL';
    title: string;
    description: string;
    municipality_name: string | null;
    public_location_precision: string;
    latitude: number | null;
    longitude: number | null;
    incident_at: string | null;
  }> | null;
  error: { message?: string } | null;
};

function getPublicReportsRpc(client: SupabaseClient<ReportDatabase>) {
  return client.rpc.bind(client) as unknown as (
    functionName: 'get_public_reports',
    args: {
      filter_species_id: null;
      filter_report_type: null;
      result_limit: number;
    },
  ) => Promise<RpcResult>;
}

async function loadPublicMapReports(): Promise<PublicMapReport[]> {
  const supabase = await createClient();
  const client = supabase as unknown as SupabaseClient<ReportDatabase>;
  const { data, error } = await getPublicReportsRpc(client)(
    'get_public_reports',
    {
      filter_species_id: null,
      filter_report_type: null,
      result_limit: 100,
    },
  );

  if (error) {
    throw error;
  }

  return (data ?? []).map((report) => ({
    id: report.id,
    reportType: report.report_type,
    title: report.title,
    description: report.description,
    municipalityName: report.municipality_name,
    publicLocationPrecision: report.public_location_precision,
    latitude: report.latitude,
    longitude: report.longitude,
    incidentAt: report.incident_at,
  }));
}

export default async function PublicMapPage() {
  const { translate } = await getServerTranslator();
  const reports = await loadPublicMapReports();

  return (
    <PageContainer className="space-y-7 py-6 sm:py-10">
      <header>
        <p className="text-sm font-semibold text-primary">
          {translate('publicReport.list.eyebrow')}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          {translate('publicReport.list.mapTitle')}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {translate('publicReport.list.description')}
        </p>
      </header>
      <PublicMap
        reports={reports.filter((report) => report.reportType === 'LOST_PET')}
        labels={{
          active: translate('publicReport.active'),
          description: translate('publicReport.list.description'),
          emptyDescription: translate('publicReport.list.emptyDescription'),
          emptyTitle: translate('publicReport.list.emptyTitle'),
          found: translate('publicReport.type.FOUND_ANIMAL'),
          lost: translate('publicReport.type.LOST_PET'),
          locationError: translate('publicReport.list.locationError'),
          locationTitle: translate('publicReport.list.locationTitle'),
          markOnMap: translate('publicReport.list.markOnMap'),
          markingOnMap: translate('publicReport.list.markingOnMap'),
    addressPlaceholder: translate('publicReport.list.addressPlaceholder'),
    chooseOnMap: translate('publicReport.list.chooseOnMap'),
    clearLocation: translate('publicReport.list.clearLocation'),
          mapUnavailable: translate('publicReport.list.mapUnavailable'),
          listTitle: translate('publicReport.list.mapListTitle'),
          petLabel: translate('publicReport.details.name'),
          recent: translate('publicReport.list.recent'),
          radiusAll: translate('publicReport.list.radiusAll'),
          radiusUnit: translate('publicReport.list.radiusUnit'),
          sortTitle: translate('publicReport.list.sortTitle'),
          title: translate('publicReport.list.mapPanelTitle'),
          useLocation: translate('publicReport.list.useLocation'),
          usingLocation: translate('publicReport.list.usingLocation'),
          searching: translate('publicReport.list.searching'),
          unknownLocation: translate('publicReport.details.unknown'),
          viewNotice: translate('publicReport.list.viewNotice'),
        }}
      />
    </PageContainer>
  );
}
