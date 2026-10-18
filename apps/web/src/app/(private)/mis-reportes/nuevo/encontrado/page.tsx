import { PetRepository } from '@buscohuella/pet-data';
import type { PetSpecies } from '@buscohuella/pet-domain';
import { ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { getServerTranslator } from '@/features/i18n/server';
import { FoundReportQuickForm } from '@/features/reports/components/found-report-quick-form';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

async function loadSpecies() {
  const supabase = await createClient();
  return new PetRepository(supabase).listEnabledSpecies({ mvpOnly: true });
}

export default async function FoundAnimalPage() {
  const { translate } = await getServerTranslator();
  let species: PetSpecies[];

  try {
    species = await loadSpecies();
  } catch (error) {
    logServerError('report.found.species_load_failed', error);
    return (
      <PageContainer className="space-y-6">
        <BackLink label={translate('reports.found.quick.back')} />
        <PageHeading translate={translate} />
        <ErrorState
          title={translate('reports.found.species.errorTitle')}
          description={translate('reports.found.species.errorDescription')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <BackLink label={translate('reports.found.quick.back')} />
      <PageHeading translate={translate} />
      <Card elevated>
        <CardHeader>
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Zap className="size-6" aria-hidden="true" />
          </span>
          <CardTitle>{translate('reports.found.quick.formTitle')}</CardTitle>
          <CardDescription>{translate('reports.found.quick.formDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <FoundReportQuickForm
            species={species.map((item) => ({
              id: item.id,
              name: translate(`pets.form.speciesOptions.${item.code}`),
            }))}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function BackLink({ label }: { label: string }) {
  return (
    <Link
      href="/mis-reportes/nuevo"
      className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

function PageHeading({ translate }: { translate: Translator }) {
  return (
    <header>
      <p className="text-sm font-semibold text-primary">
        {translate('reports.found.quick.eyebrow')}
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">
        {translate('reports.found.quick.title')}
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {translate('reports.found.quick.description')}
      </p>
    </header>
  );
}

type Translator = (key: string, values?: Record<string, string | number | boolean>) => string;
