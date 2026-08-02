import { PetRepository } from '@buscohuella/pet-data';
import type { PetSpecies } from '@buscohuella/pet-domain';
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

async function loadSpecies(): Promise<PetSpecies[] | null> {
  try {
    const supabase = await createClient();
    const repository = new PetRepository(supabase);

    return await repository.listEnabledSpecies({
      mvpOnly: true,
    });
  } catch {
    return null;
  }
}

export default async function NewPetPage() {
  const species = await loadSpecies();

  if (!species) {
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
          Crea su ficha privada. Más adelante podrás añadir
          fotografías y vincularla a reportes.
        </p>
      </header>

      <Card elevated>
        <CardHeader>
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <PawPrint className="size-6" aria-hidden="true" />
          </span>
          <CardTitle>Datos de la mascota</CardTitle>
          <CardDescription>
            Los campos obligatorios están limitados al tipo de
            animal y el nombre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePetForm species={species} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function NewPetErrorState() {
  return (
    <PageContainer className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">
          Mis mascotas
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          Registrar mascota
        </h1>
      </header>

      <Card elevated>
        <CardHeader>
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <AlertCircle className="size-6" aria-hidden="true" />
          </span>
          <CardTitle>
            No hemos podido preparar el formulario
          </CardTitle>
          <CardDescription>
            No se ha podido cargar el catálogo de animales.
            Inténtalo de nuevo dentro de unos instantes.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
