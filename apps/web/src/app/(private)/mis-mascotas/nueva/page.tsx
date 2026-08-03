import { PetRepository } from '@buscohuella/pet-data';
import type {
  PetBreed,
  PetSpecies,
} from '@buscohuella/pet-domain';
import { AlertCircle, PawPrint } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreatePetForm } from '@/features/pets/components/create-pet-form';
import { createClient } from '@/services/supabase/server';

async function loadCatalogs(): Promise<{
  species: PetSpecies[];
  breeds: PetBreed[];
} | null> {
  try {
    const supabase = await createClient();
    const repository = new PetRepository(supabase);
    const species = await repository.listEnabledSpecies({
      mvpOnly: true,
    });

    const breeds = (
      await Promise.all(
        species.map((item) =>
          repository.listEnabledBreeds(item.id, {
            mvpOnly: true,
          }),
        ),
      )
    ).flat();

    return { species, breeds };
  } catch {
    return null;
  }
}

export default async function NewPetPage() {
  const catalogs = await loadCatalogs();

  if (!catalogs) {
    return <NewPetErrorState />;
  }

  return (
    <PageContainer className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">
          Mis mascotas
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          Registrar mascota
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Crea su ficha privada y selecciona su raza desde el
          catálogo cuando la conozcas.
        </p>
      </header>

      <Card elevated>
        <CardHeader>
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <PawPrint className="size-6" aria-hidden="true" />
          </span>
          <CardTitle>Datos de la mascota</CardTitle>
          <CardDescription>
            Solo son obligatorios el tipo de animal y el nombre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePetForm
            species={catalogs.species}
            breeds={catalogs.breeds}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function NewPetErrorState() {
  return (
    <PageContainer className="space-y-6">
      <Card elevated>
        <CardHeader>
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <AlertCircle className="size-6" aria-hidden="true" />
          </span>
          <CardTitle>No hemos podido preparar el formulario</CardTitle>
          <CardDescription>
            No se han podido cargar los catálogos de animales y razas.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
