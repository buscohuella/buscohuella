import { PetRepository } from '@buscohuella/pet-data';
import type { Pet } from '@buscohuella/pet-domain';
import {
  ArrowLeft,
  CalendarDays,
  Dna,
  PawPrint,
  Pencil,
  Ruler,
  ShieldCheck,
  Weight,
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
import { ArchivePetButton } from '@/features/pets/components/archive-pet-button';
import { RestorePetButton } from '@/features/pets/components/restore-pet-button';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

const sexLabels: Record<Pet['sex'], string> = {
  FEMALE: 'Hembra',
  MALE: 'Macho',
  UNKNOWN: 'No indicado',
};

const sizeLabels: Record<Pet['size'], string> = {
  TINY: 'Muy pequeño',
  SMALL: 'Pequeño',
  MEDIUM: 'Mediano',
  LARGE: 'Grande',
  GIANT: 'Gigante',
  UNKNOWN: 'No indicado',
};

async function loadPet(id: string): Promise<Pet | null> {
  try {
    const supabase = await createClient();
    const repository = new PetRepository(supabase);
    return await repository.getOwnPetById(id);
  } catch (error) {
    logServerError('pet.detail.load_failed', error, { petId: id });
    return null;
  }
}

export default async function PetDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    created?: string;
    updated?: string;
  }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const pet = await loadPet(id);

  if (!pet) notFound();

  const successMessage =
    query.created === '1'
      ? `${pet.name} se ha registrado correctamente.`
      : query.updated === '1'
        ? `Los datos de ${pet.name} se han actualizado correctamente.`
        : null;

  return (
    <PageContainer className="space-y-6">
      {successMessage ? (
        <div
          role="status"
          className="rounded-lg border border-success/30 bg-primary-soft p-4 text-sm font-medium text-success"
        >
          {successMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={
            pet.status === 'ARCHIVED'
              ? '/mis-mascotas?estado=archivadas'
              : '/mis-mascotas?estado=activas'
          }
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a mis mascotas
        </Link>

        {pet.status === 'ACTIVE' ? (
          <Link
            href={`/mis-mascotas/${pet.id}/editar`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated px-5 text-sm font-semibold text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <Pencil className="size-4" aria-hidden="true" />
            Editar mascota
          </Link>
        ) : null}
      </div>

      <header className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <PawPrint className="size-7" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-primary">
            Ficha privada
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {pet.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {pet.breed || 'Raza no especificada'}
          </p>
        </div>
      </header>

      {pet.status === 'ARCHIVED' ? (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
          Esta ficha está archivada. Puedes consultarla, pero debes
          restaurarla para volver a editarla.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard title="Sexo" value={sexLabels[pet.sex]} icon={<Dna className="size-5" aria-hidden="true" />} />
        <InfoCard title="Tamaño" value={sizeLabels[pet.size]} icon={<Ruler className="size-5" aria-hidden="true" />} />
        <InfoCard title="Peso" value={pet.weightKg !== null ? `${pet.weightKg} kg` : 'No indicado'} icon={<Weight className="size-5" aria-hidden="true" />} />
        <InfoCard title="Nacimiento" value={pet.birthDate || 'No indicado'} icon={<CalendarDays className="size-5" aria-hidden="true" />} />
        <InfoCard title="Microchip" value={pet.hasMicrochip ? 'Registrado' : 'No indicado'} icon={<ShieldCheck className="size-5" aria-hidden="true" />} />
        <InfoCard title="Color" value={pet.primaryColor || 'No indicado'} icon={<PawPrint className="size-5" aria-hidden="true" />} />
      </div>

      {(pet.description || pet.distinctiveFeatures) ? (
        <Card elevated>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
            <CardDescription>
              Información útil para identificar a {pet.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {pet.description ? (
              <div>
                <h2 className="text-sm font-semibold">
                  Descripción general
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                  {pet.description}
                </p>
              </div>
            ) : null}
            {pet.distinctiveFeatures ? (
              <div>
                <h2 className="text-sm font-semibold">
                  Rasgos distintivos
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                  {pet.distinctiveFeatures}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Gestión de la ficha</CardTitle>
          <CardDescription>
            {pet.status === 'ARCHIVED'
              ? 'Restaura la ficha para volver a gestionarla como activa.'
              : 'Archivar oculta la mascota de la gestión activa sin borrar su historial.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pet.status === 'ARCHIVED' ? (
            <RestorePetButton petId={pet.id} petName={pet.name} />
          ) : (
            <ArchivePetButton petId={pet.id} petName={pet.name} />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader>
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
          {icon}
        </span>
        <CardTitle className="pt-2 text-base">{title}</CardTitle>
        <CardDescription>{value}</CardDescription>
      </CardHeader>
    </Card>
  );
}
