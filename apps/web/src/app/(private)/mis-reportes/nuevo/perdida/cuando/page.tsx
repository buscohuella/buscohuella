import { PetRepository } from '@buscohuella/pet-data';
import type { Pet } from '@buscohuella/pet-domain';
import {
  ArrowLeft,
  Clock3,
  PawPrint,
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
import { IncidentTimeStep } from '@/features/reports/components/incident-time-step';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

async function loadSelectedPet(
  petId: string,
) {
  const supabase = await createClient();
  const repository =
    new PetRepository(supabase);

  try {
    const pet =
      await repository.getOwnPetById(petId);

    return pet.status === 'ACTIVE'
      ? pet
      : null;
  } catch (error) {
    logServerError(
      'report.incident_time.pet_load_failed',
      error,
      { petId },
    );
    return null;
  }
}

export default async function IncidentTimePage({
  searchParams,
}: {
  searchParams: Promise<{
    mascota?: string;
  }>;
}) {
  const [query, { translate }] =
    await Promise.all([
      searchParams,
      getServerTranslator(),
    ]);

  if (!query.mascota) {
    notFound();
  }

  const pet: Pet | null =
    await loadSelectedPet(query.mascota);

  if (!pet) {
    notFound();
  }

  return (
    <PageContainer className="space-y-6">
      <Link
        href={`/mis-reportes/nuevo/perdida?mascota=${encodeURIComponent(
          pet.id,
        )}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
      >
        <ArrowLeft
          className="size-4"
          aria-hidden="true"
        />
        {translate(
          'reports.incidentTime.back',
        )}
      </Link>

      <header>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'reports.incidentTime.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate(
            'reports.incidentTime.title',
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate(
            'reports.incidentTime.description',
            { name: pet.name },
          )}
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">
              <PawPrint
                className="size-5"
                aria-hidden="true"
              />
            </span>
            <div>
              <CardTitle>
                {pet.name}
              </CardTitle>
              <CardDescription>
                {translate(
                  'reports.incidentTime.petSelected',
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card elevated>
        <CardHeader>
          <span className="mb-2 flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Clock3
              className="size-5"
              aria-hidden="true"
            />
          </span>
          <CardTitle>
            {translate(
              'reports.incidentTime.question',
            )}
          </CardTitle>
          <CardDescription>
            {translate(
              'reports.incidentTime.questionHelp',
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IncidentTimeStep petId={pet.id} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
