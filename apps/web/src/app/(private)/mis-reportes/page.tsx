import { PetRepository } from '@buscohuella/pet-data';
import { ReportRepository, type Database as ReportDatabase } from '@buscohuella/report-data';
import type { Report, ReportStatus } from '@buscohuella/report-domain';
import type { SupabaseClient } from '@supabase/supabase-js';
import { CalendarDays, ChevronRight, FileText, ImageOff, MapPin, PawPrint, Plus, ScrollText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { formatDate } from '@/features/i18n/format';
import { getServerTranslator } from '@/features/i18n/server';
import { ReportCardDescription } from '@/features/reports/components/report-card-description';
import { DeleteArchivedReportButton } from '@/features/reports/components/delete-archived-report-button';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

type FilterKey = 'all' | 'drafts' | 'active' | 'paused' | 'resolved' | 'closed' | 'archived';
type Translator = (key: string, values?: Record<string, string | number | boolean>) => string;
const filterStatuses: Record<FilterKey, readonly ReportStatus[] | null> = { all: null, drafts: ['DRAFT'], active: ['ACTIVE'], paused: ['PAUSED'], resolved: ['RESOLVED'], closed: ['CLOSED'], archived: ['ARCHIVED'] };
const statusVariants: Record<ReportStatus, BadgeVariant> = { DRAFT: 'neutral', ACTIVE: 'danger', PAUSED: 'warning', RESOLVED: 'success', CLOSED: 'info', ARCHIVED: 'neutral' };

async function loadOwnReports() {
  const supabase = await createClient();
  const client = supabase as unknown as SupabaseClient<ReportDatabase>;
  const [reports, pets] = await Promise.all([new ReportRepository(client).listOwnReports(), new PetRepository(supabase).listOwnPets()]);
  const photoUrls = new Map<string, string>();
  const petPhotoUrls = new Map<string, string>();
  const reportIds = reports.map((report) => report.id);
  const petIds = reports.flatMap((report) => report.petId ? [report.petId] : []);
  if (reportIds.length > 0) {
    const { data: photos, error } = await client.from('report_photos').select('report_id, storage_path').in('report_id', reportIds).eq('is_primary', true);
    if (error) throw error;
    if (photos?.length) {
      const { data: signed, error: signError } = await supabase.storage.from('report-photos').createSignedUrls(photos.map((photo) => photo.storage_path), 600);
      if (signError) throw signError;
      photos.forEach((photo, index) => { const url = signed[index]?.signedUrl; if (url) photoUrls.set(photo.report_id, url); });
    }
  }
  if (petIds.length > 0) {
    const { data: petPhotos } = await supabase.from('pet_photos').select('pet_id, storage_path').in('pet_id', petIds).eq('is_primary', true);
    if (petPhotos?.length) {
      const { data: signed } = await supabase.storage.from('pet-photos').createSignedUrls(petPhotos.map((photo) => photo.storage_path), 600);
      petPhotos.forEach((photo, index) => { const url = signed?.[index]?.signedUrl; if (url) petPhotoUrls.set(photo.pet_id, url); });
    }
  }
  return { reports, petNames: new Map(pets.map((pet) => [pet.id, pet.name])), photoUrls, petPhotoUrls };
}

export async function MyReportsPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const [query, { locale, translate }] = await Promise.all([searchParams, getServerTranslator()]);
  const selectedFilter = isFilterKey(query.estado) ? query.estado : 'all';
  let data: Awaited<ReturnType<typeof loadOwnReports>>;
  try { data = await loadOwnReports(); } catch (error) {
    logServerError('report.list_own.failed', error);
    return <PageContainer className="space-y-6"><PageHeading translate={translate} showAction={false} /><ErrorState title={translate('reports.list.errorTitle')} description={translate('reports.list.errorDescription')} /></PageContainer>;
  }
  const statuses = filterStatuses[selectedFilter];
  const visibleReports = statuses ? data.reports.filter((report) => statuses.includes(report.status)) : data.reports;
  return <PageContainer className="space-y-6">
    <PageHeading translate={translate} showAction={data.reports.length > 0} />
    <nav aria-label={translate('reports.list.tabsLabel')} className="flex gap-2 overflow-x-auto border-b border-border-soft pb-px">{(Object.keys(filterStatuses) as FilterKey[]).map((filter) => <FilterLink key={filter} filter={filter} count={countForFilter(data.reports, filter)} selected={selectedFilter === filter} label={translate(`reports.list.filters.${filter}`)} />)}</nav>
    {visibleReports.length === 0 ? <EmptyState title={translate(data.reports.length === 0 ? 'reports.list.emptyTitle' : 'reports.list.emptyFilteredTitle')} description={translate(data.reports.length === 0 ? 'reports.list.emptyDescription' : 'reports.list.emptyFilteredDescription')} icon={<ScrollText className="size-7" />} actions={<Link href="/mis-reportes/nuevo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground"><Plus className="size-5" />{translate('reports.list.new')}</Link>} /> : <><p className="text-sm text-muted-foreground" aria-live="polite">{translate(visibleReports.length === 1 ? 'reports.list.countOne' : 'reports.list.countMany', { count: visibleReports.length })}</p><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visibleReports.map((report) => <ReportCard key={report.id} report={report} petName={report.petId ? data.petNames.get(report.petId) ?? null : null} primaryPhotoUrl={data.photoUrls.get(report.id) ?? (report.petId ? data.petPhotoUrls.get(report.petId) ?? null : null)} locale={locale} translate={translate} />)}</div></>}
  </PageContainer>;
}

export default async function LegacyMyReportsPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const query = await searchParams;
  const suffix = query.estado ? `?estado=${encodeURIComponent(query.estado)}` : '';
  redirect(`/mis-avisos/propios${suffix}`);
}
function PageHeading({ translate, showAction }: { translate: Translator; showAction: boolean }) { return <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-primary">{translate('reports.list.eyebrow')}</p><h1 className="mt-1 text-3xl font-bold tracking-tight">{translate('reports.list.title')}</h1><p className="mt-2 max-w-2xl text-muted-foreground">{translate('reports.list.description')}</p></div>{showAction ? <Link href="/mis-reportes/nuevo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground"><Plus className="size-5" />{translate('reports.list.new')}</Link> : null}</header>; }
function ReportCard({ report, petName, primaryPhotoUrl, locale, translate }: { report: Report; petName: string | null; primaryPhotoUrl: string | null; locale: 'es' | 'ca'; translate: Translator }) {
  const title = report.title ?? translate('reports.list.untitled');
  const incident = report.incidentAt ? translate('reports.list.incident', { date: formatDate(report.incidentAt, locale, { dateStyle: 'medium' }) }) : translate('reports.list.incidentUnknown');
  const updated = translate('reports.list.updated', { date: formatDate(report.updatedAt, locale, { dateStyle: 'medium', timeStyle: 'short' }) });
  return <Card className="h-full overflow-hidden"><div className="relative aspect-[16/9] border-b border-border-soft bg-surface-elevated">{primaryPhotoUrl ? <Image src={primaryPhotoUrl} alt={translate('reportVisual.primaryPhotoAlt')} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground"><ImageOff className="size-8" /><span className="text-sm">{translate('reportVisual.noPhoto')}</span></div>}</div><CardHeader><div className="flex flex-wrap items-center gap-2">{!['RESOLVED', 'CLOSED', 'ARCHIVED'].includes(report.status) ? <Badge variant={report.reportType === 'LOST_PET' ? 'danger' : 'info'}>{translate(`reports.list.type.${report.reportType}`)}</Badge> : null}<Badge variant={statusVariants[report.status]}>{translate(`reports.list.status.${report.status}`)}</Badge></div><CardTitle className="pt-2">{title}</CardTitle><div className="text-sm text-muted-foreground">{report.description ? <ReportCardDescription description={report.description} /> : petName ? translate('reports.list.petFallback') : translate('reports.list.noPet')}</div></CardHeader><CardContent className="space-y-4"><dl className="space-y-3 text-sm">{petName ? <InfoRow icon={<PawPrint />} value={petName} /> : null}<InfoRow icon={<MapPin />} label={translate('reportVisual.approximateZone')} value={report.municipalityName || translate('reports.list.municipalityUnknown')} /><InfoRow icon={<CalendarDays />} value={incident} /><InfoRow icon={<FileText />} value={updated} /></dl><Link href={report.status === 'DRAFT' ? `/mis-reportes/${report.id}/fotos` : `/mis-reportes/${report.id}`} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-primary-foreground">{report.status === 'DRAFT' ? translate('reports.list.continueEditing') : translate('reportVisual.manage')}<ChevronRight className="size-4" /></Link>{report.status === 'ARCHIVED' ? <div className="border-t border-border-soft pt-4"><DeleteArchivedReportButton reportId={report.id} title={title} /></div> : null}</CardContent></Card>;
}
function InfoRow({ icon, label, value }: { icon: React.ReactElement; label?: string; value: string }) { return <div className="flex items-start gap-2 text-muted-foreground"><span className="mt-0.5 text-primary [&>svg]:size-4" aria-hidden="true">{icon}</span><dd>{label ? <><span className="block text-xs font-semibold uppercase tracking-wide">{label}</span><span className="text-foreground">{value}</span></> : value}</dd></div>; }
function FilterLink({ filter, count, selected, label }: { filter: FilterKey; count: number; selected: boolean; label: string }) { const href = filter === 'all' ? '/mis-avisos/propios' : `/mis-avisos/propios?estado=${filter}`; return <Link href={href} aria-current={selected ? 'page' : undefined} className={selected ? 'shrink-0 border-b-2 border-primary px-4 py-3 font-semibold text-primary' : 'shrink-0 border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground hover:text-foreground'}>{label} <span className="ml-1 rounded-full bg-surface px-2 py-0.5 text-xs">{count}</span></Link>; }
function countForFilter(reports: Report[], filter: FilterKey) { const statuses = filterStatuses[filter]; return statuses ? reports.filter((report) => statuses.includes(report.status)).length : reports.length; }
function isFilterKey(value: string | undefined): value is FilterKey { return Boolean(value && Object.prototype.hasOwnProperty.call(filterStatuses, value)); }

