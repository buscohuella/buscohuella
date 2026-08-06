import { PetRepository } from '@buscohuella/pet-data';
import type { Pet, PetBreed, PetSpecies } from '@buscohuella/pet-domain';
import { Pencil } from 'lucide-react';
import { notFound } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { getServerTranslator } from '@/features/i18n/server';
import { EditPetForm } from '@/features/pets/components/edit-pet-form';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

async function loadEditData(id: string): Promise<{
  pet: Pet; species: PetSpecies[]; breeds: PetBreed[];
} | null> {
  try {
    const supabase = await createClient();
    const repository = new PetRepository(supabase);
    const [pet, species] = await Promise.all([
      repository.getOwnPetById(id),
      repository.listEnabledSpecies(),
    ]);
    const breeds = (await Promise.all(
      species.map((item) => repository.listEnabledBreeds(item.id)),
    )).flat();
    return { pet, species, breeds };
  } catch (error) {
    logServerError('pet.edit.load_failed', error, { petId: id });
    return null;
  }
}

export default async function EditPetPage({ params }: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, { translate }] = await Promise.all([
    params,
    getServerTranslator(),
  ]);
  const data = await loadEditData(id);
  if (!data) notFound();

  if (data.pet.status !== 'ACTIVE') {
    return (
      <PageContainer className="space-y-6">
        <ErrorState
          title={translate('pets.edit.blockedTitle')}
          description={translate('pets.edit.blockedDescription')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">
          {translate('pets.edit.eyebrow')}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate('pets.edit.title', { name: data.pet.name })}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate('pets.edit.description')}
        </p>
      </header>

      <Card elevated>
        <CardHeader>
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Pencil className="size-6" aria-hidden="true" />
          </span>
          <CardTitle>{translate('pets.edit.cardTitle')}</CardTitle>
          <CardDescription>{translate('pets.edit.cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <EditPetForm pet={data.pet} species={data.species} breeds={data.breeds} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
