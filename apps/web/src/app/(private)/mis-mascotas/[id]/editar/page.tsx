import { PetRepository } from '@buscohuella/pet-data';
import type {
  Pet,
  PetBreed,
  PetSpecies,
} from '@buscohuella/pet-domain';
import { AlertCircle, Pencil } from 'lucide-react';
import { notFound } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EditPetForm } from '@/features/pets/components/edit-pet-form';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

async function loadEditData(id: string): Promise<{
  pet: Pet;
  species: PetSpecies[];
  breeds: PetBreed[];
} | null> {
  try {
    const supabase = await createClient();
    const repository = new PetRepository(supabase);

    const [pet, species] = await Promise.all([
      repository.getOwnPetById(id),
      repository.listEnabledSpecies(),
    ]);

    const breeds = (
      await Promise.all(
        species.map((item) =>
          repository.listEnabledBreeds(item.id),
        ),
      )
    ).flat();

    return { pet, species, breeds };
  } catch (error) {
    logServerError('pet.edit.load_failed', error, { petId: id });
    return null;
  }
}

export default async function EditPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadEditData(id);

  if (!data) notFound();

  if (data.pet.status !== 'ACTIVE') {
    return (
      <PageContainer className="space-y-6">
        <Card elevated>
          <CardHeader>
            <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <AlertCircle className="size-6" aria-hidden="true" />
            </span>
            <CardTitle>Esta ficha no se puede editar</CardTitle>
            <CardDescription>
              Restaura la mascota antes de modificar sus datos.
            </CardDescription>
          </CardHeader>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">
          Mis mascotas
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          Editar {data.pet.name}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Actualiza su ficha y normaliza la raza cuando sea posible.
        </p>
      </header>

      <Card elevated>
        <CardHeader>
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Pencil className="size-6" aria-hidden="true" />
          </span>
          <CardTitle>Datos de la mascota</CardTitle>
          <CardDescription>
            Las fichas antiguas conservan su raza hasta que elijas
            una opción del catálogo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditPetForm
            pet={data.pet}
            species={data.species}
            breeds={data.breeds}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
