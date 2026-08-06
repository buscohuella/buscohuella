import { PetRepository } from '@buscohuella/pet-data';
import type { Pet } from '@buscohuella/pet-domain';
import {
  ArrowLeft,
  MapPin,
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
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

const validMoments = new Set([
  'NOW',
  'RECENT',
  'TODAY',
  'YESTERDAY',
  'CUSTOM',
]);

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
      'report.location.pet_load_failed',
      error,
      { petId },
    );
    return null;
  }
}

export default async function LocationPage({
  searchParams,
}: {
  searchParams: Promise<{
    mascota?: string;
    momento?: string;
    fecha?: string;
  }>;
}) {
  const [query, { translate }] =
    await Promise.all([
      searchParams,
      getServerTranslator(),
    ]);

  if (
    !query.mascota ||
    !query.momento ||
    !validMoments.has(query.momento)
  ) {
    notFound();
  }

  const pet: Pet | null =
    await loadSelectedPet(query.mascota);

  if (!pet) {
    notFound();
  }

  const backParams =
    new URLSearchParams({
      mascota: pet.id,
    });

  return (
    <PageContainer className="space-y-6">
      <Link
        href={`/mis-reportes/nuevo/perdida/cuando?${backParams.toString()}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
      >
        <ArrowLeft
          className="size-4"
          aria-hidden="true"
        />
        {translate(
          'reports.location.back',
        )}
      </Link>

      <header>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'reports.location.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate(
            'reports.location.title',
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate(
            'reports.location.description',
            { name: pet.name },
          )}
        </p>
      </header>

      <Card elevated>
        <CardHeader>
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <MapPin
              className="size-6"
              aria-hidden="true"
            />
          </span>
          <CardTitle>
            {translate(
              'reports.location.nextTitle',
            )}
          </CardTitle>
          <CardDescription>
            {translate(
              'reports.location.nextDescription',
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="rounded-xl border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
            {translate(
              'reports.location.savedSummary',
              {
                name: pet.name,
                moment: translate(
                  `reports.incidentTime.summary.${query.momento}`,
                ),
              },
            )}
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
