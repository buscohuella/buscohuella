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

interface PetPrimaryPhoto {
  signedUrl: string;
  altText: string | null;
}

function EmptyPetsState({ archived }: { archived: boolean }) {
  return (
    <Card elevated>
      <CardHeader className="items-start">
        <span className="mb-3 flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
          {archived ? (
            <Archive className="size-7" aria-hidden="true" />
          ) : (
            <PawPrint className="size-7" aria-hidden="true" />
          )}
        </span>
        <CardTitle>
          {archived
            ? 'No tienes mascotas archivadas'
            : 'Todavía no has registrado mascotas activas'}
        </CardTitle>
        <CardDescription className="max-w-2xl">
          {archived
            ? 'Cuando archives una ficha aparecerá aquí y podrás restaurarla.'
            : 'Crea una ficha para guardar sus datos, identificación y fotografías.'}
        </CardDescription>
      </CardHeader>
      {!archived ? (
        <CardContent>
          <Link
            href="/mis-mascotas/nueva"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <Plus className="size-5" aria-hidden="true" />
            Registrar mascota
          </Link>
        </CardContent>
      ) : null}
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
        <CardDescription>
          Inténtalo de nuevo dentro de unos instantes.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function PetCard({
  pet,
  primaryPhoto,
}: {
  pet: Pet;
  primaryPhoto?: PetPrimaryPhoto;
}) {
  return (
    <Link
      href={`/mis-mascotas/${pet.id}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
    >
      <Card className="h-full overflow-hidden transition-[border-color,box-shadow,transform] duration-150 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-[var(--shadow-md)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
          {primaryPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryPhoto.signedUrl}
              alt={
                primaryPhoto.altText ||
                `Fotografía principal de ${pet.name}`
              }
              className="size-full object-contain p-2 transition-transform duration-200 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-primary">
              <PawPrint className="size-16" aria-hidden="true" />
              <span className="sr-only">
                {pet.name} todavía no tiene fotografía de portada
              </span>
            </span>
          )}

          <span className="absolute right-3 top-3 rounded-full bg-surface-elevated/95 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-[var(--shadow-sm)]">
            {pet.status === 'ARCHIVED' ? 'Archivada' : 'Activa'}
          </span>
        </div>

        <CardHeader>
          <CardTitle>{pet.name}</CardTitle>
          <CardDescription>
            {pet.breed || 'Raza no especificada'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between gap-3 border-t border-border-soft pt-4 text-sm">
            <span className="text-muted-foreground">
              {pet.hasMicrochip
                ? 'Con microchip'
                : 'Sin microchip indicado'}
            </span>
            <ChevronRight
              className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

async function loadPrimaryPhotos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pets: Pet[],
): Promise<Map<string, PetPrimaryPhoto>> {
  const result = new Map<string, PetPrimaryPhoto>();

  if (!pets.length) return result;

  const { data: rows, error } = await supabase
    .from('pet_photos')
    .select('pet_id, storage_path, alt_text')
    .in(
      'pet_id',
      pets.map((pet) => pet.id),
    )
    .eq('is_primary', true);

  if (error || !rows?.length) return result;

  const { data: signedRows, error: signedError } =
    await supabase.storage
      .from('pet-photos')
      .createSignedUrls(
        rows.map((row) => row.storage_path),
        60 * 10,
      );

  if (signedError) return result;

  rows.forEach((row, index) => {
    const signedUrl = signedRows[index]?.signedUrl;

    if (signedUrl) {
      result.set(row.pet_id, {
        signedUrl,
        altText: row.alt_text,
      });
    }
  });

  return result;
}

export default async function PetsPage({
  searchParams,
}: {
  searchParams: Promise<{
    estado?: string;
    archived?: string;
    restored?: string;
  }>;
}) {
  const query = await searchParams;
  const selectedState =
    query.estado === 'archivadas' ? 'archivadas' : 'activas';

  const supabase = await createClient();
  const repository = new PetRepository(supabase);

  let pets: Pet[];

  try {
    pets = await repository.listOwnPets();
  } catch {
    return (
      <PageContainer className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            Área privada
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Mis mascotas
          </h1>
        </header>
        <PetsErrorState />
      </PageContainer>
    );
  }

  const activePets = pets.filter((pet) => pet.status === 'ACTIVE');
  const archivedPets = pets.filter(
    (pet) => pet.status === 'ARCHIVED',
  );
  const visiblePets =
    selectedState === 'archivadas' ? archivedPets : activePets;
  const primaryPhotos = await loadPrimaryPhotos(supabase, visiblePets);

  return (
    <PageContainer className="space-y-6">
      {query.archived === '1' ? (
        <div
          role="status"
          className="rounded-lg border border-success/30 bg-primary-soft p-4 text-sm font-medium text-success"
        >
          La mascota se ha archivado correctamente.
        </div>
      ) : null}

      {query.restored === '1' ? (
        <div
          role="status"
          className="rounded-lg border border-success/30 bg-primary-soft p-4 text-sm font-medium text-success"
        >
          La mascota se ha restaurado correctamente.
        </div>
      ) : null}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            Área privada
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Mis mascotas
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Gestiona sus datos, identificación, privacidad y fotografías.
          </p>
        </div>

        <Link
          href="/mis-mascotas/nueva"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <Plus className="size-5" aria-hidden="true" />
          Nueva mascota
        </Link>
      </header>

      <nav
        aria-label="Estados de mascotas"
        className="flex flex-wrap gap-2 border-b border-border-soft"
      >
        <StateTab
          href="/mis-mascotas?estado=activas"
          label="Activas"
          count={activePets.length}
          selected={selectedState === 'activas'}
        />
        <StateTab
          href="/mis-mascotas?estado=archivadas"
          label="Archivadas"
          count={archivedPets.length}
          selected={selectedState === 'archivadas'}
        />
      </nav>

      {visiblePets.length === 0 ? (
        <EmptyPetsState archived={selectedState === 'archivadas'} />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {visiblePets.length}{' '}
            {visiblePets.length === 1 ? 'mascota' : 'mascotas'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visiblePets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                primaryPhoto={primaryPhotos.get(pet.id)}
              />
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}

function StateTab({
  href,
  label,
  count,
  selected,
}: {
  href: string;
  label: string;
  count: number;
  selected: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={selected ? 'page' : undefined}
      className={
        selected
          ? 'border-b-2 border-primary px-4 py-3 font-semibold text-primary'
          : 'border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground hover:text-foreground'
      }
    >
      {label}{' '}
      <span className="ml-1 rounded-full bg-surface px-2 py-0.5 text-xs">
        {count}
      </span>
    </Link>
  );
}
