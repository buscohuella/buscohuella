import { ArrowLeft, Eye, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getServerTranslator } from '@/features/i18n/server';
import { CreateSightingForm } from '@/features/reports/components/create-sighting-form';
import { getPublicReport } from '@/features/reports/lib/public-report';

export default async function CreateSightingPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { translate }] = await Promise.all([params, getServerTranslator()]);
  const report = await getPublicReport(id);
  if (!report) notFound();
  return <PageContainer className="space-y-6 py-6 sm:py-10">
    <Link href={`/reportes/${id}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary"><ArrowLeft className="size-4" />{translate('sightingCreate.back')}</Link>
    <header><p className="text-sm font-semibold text-danger">{translate('sightingCreate.eyebrow')}</p><h1 className="mt-1 text-3xl font-bold tracking-tight">{translate('sightingCreate.title')}</h1><p className="mt-2 max-w-2xl text-muted-foreground">{translate('sightingCreate.description', { title: report.title })}</p></header>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Card elevated><CardHeader><span className="mb-2 flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger"><Eye className="size-6" /></span><CardTitle>{translate('sightingCreate.formTitle')}</CardTitle><CardDescription>{translate('sightingCreate.formDescription')}</CardDescription></CardHeader><CardContent><CreateSightingForm reportId={id} /></CardContent></Card>
      <aside className="h-fit rounded-xl border border-primary/25 bg-primary-soft/30 p-4"><ShieldCheck className="size-6 text-primary" /><h2 className="mt-3 font-semibold">{translate('sightingCreate.privacy.title')}</h2><p className="mt-2 text-sm text-muted-foreground">{translate('sightingCreate.privacy.description')}</p></aside>
    </div>
  </PageContainer>;
}
