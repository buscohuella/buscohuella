import { PetRepository } from '@buscohuella/pet-data';
import type { Pet } from '@buscohuella/pet-domain';
import {
  AlertCircle,
  Archive,
  ChevronRight,
  PawPrint,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/services/supabase/server';

const statusLabels: Record<Pet['status'], string> = {
  ACTIVE: 'Activa',
  ARCHIVED: 'Archivada',
  DECEASED: 'Fallecida',
};

const statusClasses: Record<Pet['status'], string> = {
  ACTIVE: 'bg-primary-soft text-primary',
  ARCHIVED: 'bg-surface text-muted-foreground',
  DECEASED: 'bg-danger/10 text-danger',
};

function EmptyPetsState() {
  return (
    <Card elevated>
      <CardHeader className="items-start">
        <span className="mb-3 flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <PawPrint className="size-7" aria-hidden="true" />
        </span>
        <CardTitle>Todavía no has registrado mascotas</CardTitle>
        <CardDescription className="max-w-2xl">
          Crea la primera ficha para guardar sus datos, identificación y fotografías.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/mis-mascotas/nueva" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-white hover:bg-primary-hover">
          <Plus className="size-5" aria-hidden="true" />
          Registrar mascota
        </Link>
      </CardContent>
    </Card>
  );
}

function PetsErrorState() {
  return (
    <Card elevated>
      <CardHeader>
        <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
          <AlertCircle className="size-6" aria-hidden="true" />
        </span>
        <CardTitle>No hemos podido cargar tus mascotas</CardTitle>
        <CardDescription>Inténtalo de nuevo dentro de unos instantes.</CardDescription>
      </CardHeader>
    </Card>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  return (
    <Link href={`/mis-mascotas/${pet.id}`} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
      <Card className="h-full transition-[border-color,box-shadow,transform] duration-150 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-[var(--shadow-md)]">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <PawPrint className="size-6" aria-hidden="true" />
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[pet.status]}`}>
              {statusLabels[pet.status]}
            </span>
          </div>
          <CardTitle className="pt-3">{pet.name}</CardTitle>
          <CardDescription>{pet.breed || 'Raza no especificada'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3 border-t border-border-soft pt-4 text-sm">
            <span className="text-muted-foreground">
              {pet.hasMicrochip ? 'Con microchip' : 'Sin microchip indicado'}
            </span>
            <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function PetsPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>;
}) {
  const query = await searchParams;
  const supabase = await createClient();
  const repository = new PetRepository(supabase);

  let pets: Pet[];

  try {
    pets = await repository.listOwnPets();
  } catch {
    return (
      <PageContainer className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">Área privada</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Mis mascotas</h1>
        </header>
        <PetsErrorState />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      {query.archived === '1' ? (
        <div role="status" className="rounded-lg border border-success/30 bg-primary-soft p-4 text-sm font-medium text-success">
          La mascota se ha archivado correctamente.
        </div>
      ) : null}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Área privada</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Mis mascotas</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Gestiona sus datos, identificación, privacidad y fotografías.</p>
        </div>
        {pets.length > 0 ? (
          <Link href="/mis-mascotas/nueva" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-white hover:bg-primary-hover">
            <Plus className="size-5" aria-hidden="true" />
            Nueva mascota
          </Link>
        ) : null}
      </header>

      {pets.length === 0 ? (
        <EmptyPetsState />
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Archive className="size-4" aria-hidden="true" />
            <span>{pets.length} {pets.length === 1 ? 'mascota registrada' : 'mascotas registradas'}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
          </div>
        </>
      )}
    </PageContainer>
  );
}
