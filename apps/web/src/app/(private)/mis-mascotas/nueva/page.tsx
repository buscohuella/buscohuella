import { PetRepository } from '@buscohuella/pet-data';
import type { PetBreed, PetSpecies } from '@buscohuella/pet-domain';
import { PawPrint } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { getServerTranslator } from '@/features/i18n/server';
import { CreatePetForm } from '@/features/pets/components/create-pet-form';
import { createClient } from '@/services/supabase/server';

async function loadCatalogs(): Promise<{ species: PetSpecies[]; breeds: PetBreed[] } | null> {
  try {
    const supabase = await createClient();
    const repository = new PetRepository(supabase);
    const species = await repository.listEnabledSpecies({ mvpOnly: true });
    const breeds = (await Promise.all(
      species.map((item) =>
        repository.listEnabledBreeds(item.id, { mvpOnly: true }),
      ),
    )).flat();
    return { species, breeds };
  } catch {
    return null;
  }
}

export default async function NewPetPage() {
  const [catalogs, { translate }] = await Promise.all([
    loadCatalogs(),
    getServerTranslator(),
  ]);

  if (!catalogs) {
    return (
      <PageContainer className="space-y-6">
        <ErrorState
          title={translate('pets.create.loadErrorTitle')}
          description={translate('pets.create.loadErrorDescription')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">
          {translate('pets.create.eyebrow')}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate('pets.create.title')}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate('pets.create.description')}
        </p>
      </header>

      <Card elevated>
        <CardHeader>
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <PawPrint className="size-6" aria-hidden="true" />
          </span>
          <CardTitle>{translate('pets.create.cardTitle')}</CardTitle>
          <CardDescription>{translate('pets.create.cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePetForm species={catalogs.species} breeds={catalogs.breeds} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
