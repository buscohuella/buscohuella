import type { Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageContainer } from '@/components/layout/page-container';
import { getServerTranslator } from '@/features/i18n/server';
import {
  PublicMap,
  type PublicMapSpeciesFilter,
  type PublicMapReport,
} from '@/features/maps/components/public-map';
import { createClient } from '@/services/supabase/server';

function toPublicReportType(value: string): 'LOST_PET' | 'FOUND_ANIMAL' {
  if (value === 'LOST_PET' || value === 'FOUND_ANIMAL') {
    return value;
  }

  throw new Error('Unexpected public report type: ' + value);
}
async function loadPublicMapReports(speciesLabels: {
  all: string;
  dog: string;
  cat: string;
  other: string;
}): Promise<{ reports: PublicMapReport[]; speciesFilters: PublicMapSpeciesFilter[] }> {
  const supabase = await createClient();
  const client = supabase as unknown as SupabaseClient<ReportDatabase>;
  const [{ data, error }, { data: species, error: speciesError }] = await Promise.all([
    client.rpc('get_public_reports', { result_limit: 100 }),
    supabase
      .from('pet_species')
      .select('id, code')
      .eq('is_enabled', true)
      .eq('mvp_enabled', true)
      .order('sort_order'),
  ]);

  if (error) {
    throw error;
  }
  if (speciesError) {
    throw speciesError;
  }

  const speciesRows = species ?? [];
  const dogId = speciesRows.find((item) => item.code === 'DOG')?.id;
  const catId = speciesRows.find((item) => item.code === 'CAT')?.id;
  const otherIds = speciesRows
    .filter((item) => item.code !== 'DOG' && item.code !== 'CAT')
    .map((item) => item.id);

  return {
    reports: (data ?? []).map((report) => ({
      id: report.id,
      reportType: toPublicReportType(report.report_type),
      speciesId: report.species_id,
      title: report.title,
      description: report.description,
      municipalityName: report.municipality_name,
      publicLocationPrecision: report.public_location_precision,
      latitude: report.latitude,
      longitude: report.longitude,
      incidentAt: report.incident_at,
    })),
    speciesFilters: [
      { key: 'all', label: speciesLabels.all, ids: speciesRows.map((item) => item.id) },
      ...(dogId === undefined
        ? []
        : [{ key: 'dog' as const, label: speciesLabels.dog, ids: [dogId] }]),
      ...(catId === undefined
        ? []
        : [{ key: 'cat' as const, label: speciesLabels.cat, ids: [catId] }]),
      { key: 'other' as const, label: speciesLabels.other, ids: otherIds },
    ],
  };
}

export default async function PublicMapPage() {
  const { translate } = await getServerTranslator();
  const speciesLabels = {
    all: translate('publicReport.list.speciesAll'),
    dog: translate('pets.form.speciesOptions.DOG'),
    cat: translate('pets.form.speciesOptions.CAT'),
    other: translate('pets.form.speciesOptions.OTHER'),
  };
  const { reports, speciesFilters } = await loadPublicMapReports(speciesLabels);

  return (
    <PageContainer className="space-y-7 py-6 sm:py-10">
      <Breadcrumbs
        label={translate('common.navigation.publicLabel')}
        items={[
          { href: '/', label: translate('noticesHub.breadcrumbs.home') },
          { label: translate('publicReport.list.mapTitle') },
        ]}
      />
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
        reports={reports}
        speciesFilters={speciesFilters}
        labels={{
          active: translate('publicReport.active'),
          description: translate('publicReport.list.description'),
          emptyDescription: translate('publicReport.list.emptyDescription'),
          emptyTitle: translate('publicReport.list.emptyTitle'),
          found: translate('publicReport.type.FOUND_ANIMAL'),
          lost: translate('publicReport.type.LOST_PET'),
          locationError: translate('publicReport.list.locationError'),
          locationSecureError: translate('publicReport.list.locationSecureError'),
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
          sortRecent: translate('publicReport.list.recent'),
          sortNearest: translate('publicReport.list.sortNearest'),
          title: translate('publicReport.list.mapPanelTitle'),
          useLocation: translate('publicReport.list.useLocation'),
          useLocationShort: translate('publicReport.list.useLocationShort'),
          recenterLocation: translate('publicReport.list.recenterLocation'),
          moreFilters: translate('publicReport.list.moreFilters'),
          closeFilters: translate('publicReport.list.closeFilters'),
          usingLocation: translate('publicReport.list.usingLocation'),
          searching: translate('publicReport.list.searching'),
          unknownLocation: translate('publicReport.details.unknown'),
          viewNotice: translate('publicReport.list.viewNotice'),
          sightingCtaTitle: translate('publicReport.list.sightingCtaTitle'),
          sightingCtaDescription: translate('publicReport.list.sightingCtaDescription'),
          sightingCtaAction: translate('publicReport.list.sightingCtaAction'),
          sightingCtaActionSelected: translate('publicReport.list.sightingCtaActionSelected'),
          sightingCtaSelectNotice: translate('publicReport.list.sightingCtaSelectNotice'),
        }}
      />
    </PageContainer>
  );
}
