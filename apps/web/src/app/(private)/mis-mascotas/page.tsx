import { PetRepository } from '@buscohuella/pet-data';
import type { Pet } from '@buscohuella/pet-domain';
import {
  Archive,
  ChevronRight,
  PawPrint,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import { Alert } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { getServerTranslator } from '@/features/i18n/server';
import { createClient } from '@/services/supabase/server';

interface PetPrimaryPhoto {
  signedUrl: string;
  altText: string | null;
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
  const [query, { translate }] =
    await Promise.all([
      searchParams,
      getServerTranslator(),
    ]);

  const selectedState =
    query.estado === 'archivadas'
      ? 'archivadas'
      : 'activas';

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
            {translate('pets.list.eyebrow')}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {translate('pets.list.title')}
          </h1>
        </header>

        <ErrorState
          title={translate(
            'pets.list.errorTitle',
          )}
          description={translate(
            'pets.list.errorDescription',
          )}
        />
      </PageContainer>
    );
  }

  const activePets = pets.filter(
    (pet) => pet.status === 'ACTIVE',
  );
  const archivedPets = pets.filter(
    (pet) => pet.status === 'ARCHIVED',
  );
  const visiblePets =
    selectedState === 'archivadas'
      ? archivedPets
      : activePets;

  const primaryPhotos = await loadPrimaryPhotos(
    supabase,
    visiblePets,
  );

  return (
    <PageContainer className="space-y-6">
      {query.archived === '1' ? (
        <Alert variant="success">
          {translate(
            'pets.list.archivedSuccess',
          )}
        </Alert>
      ) : null}

      {query.restored === '1' ? (
        <Alert variant="success">
          {translate(
            'pets.list.restoredSuccess',
          )}
        </Alert>
      ) : null}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            {translate('pets.list.eyebrow')}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {translate('pets.list.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {translate(
              'pets.list.description',
            )}
          </p>
        </div>

        <Link
          href="/mis-mascotas/nueva"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          <Plus
            className="size-5"
            aria-hidden="true"
          />
          {translate('pets.list.new')}
        </Link>
      </header>

      <nav
        aria-label={translate(
          'pets.list.tabsLabel',
        )}
        className="flex flex-wrap gap-2 border-b border-border-soft"
      >
        <StateTab
          href="/mis-mascotas?estado=activas"
          label={translate(
            'pets.list.activeTab',
          )}
          count={activePets.length}
          selected={
            selectedState === 'activas'
          }
        />
        <StateTab
          href="/mis-mascotas?estado=archivadas"
          label={translate(
            'pets.list.archivedTab',
          )}
          count={archivedPets.length}
          selected={
            selectedState === 'archivadas'
          }
        />
      </nav>

      {visiblePets.length === 0 ? (
        <EmptyState
          title={translate(
            selectedState === 'archivadas'
              ? 'pets.list.emptyArchivedTitle'
              : 'pets.list.emptyActiveTitle',
          )}
          description={translate(
            selectedState === 'archivadas'
              ? 'pets.list.emptyArchivedDescription'
              : 'pets.list.emptyActiveDescription',
          )}
          icon={
            selectedState === 'archivadas' ? (
              <Archive className="size-7" />
            ) : (
              <PawPrint className="size-7" />
            )
          }
          actions={
            selectedState === 'activas' ? (
              <Link
                href="/mis-mascotas/nueva"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
              >
                <Plus
                  className="size-5"
                  aria-hidden="true"
                />
                {translate(
                  'pets.list.register',
                )}
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <p
            className="text-sm text-muted-foreground"
            aria-live="polite"
          >
            {translate(
              visiblePets.length === 1
                ? 'pets.list.countOne'
                : 'pets.list.countMany',
              { count: visiblePets.length },
            )}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visiblePets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                primaryPhoto={primaryPhotos.get(
                  pet.id,
                )}
                translate={translate}
              />
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}

function PetCard({
  pet,
  primaryPhoto,
  translate,
}: {
  pet: Pet;
  primaryPhoto?: PetPrimaryPhoto;
  translate: (
    key: string,
    values?: Record<
      string,
      string | number | boolean
    >,
  ) => string;
}) {
  return (
    <Link
      href={`/mis-mascotas/${pet.id}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
    >
      <Card className="h-full overflow-hidden transition-[border-color,box-shadow,transform] duration-150 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-[var(--shadow-md)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          {primaryPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryPhoto.signedUrl}
              alt={
                primaryPhoto.altText ||
                translate(
                  'pets.list.primaryPhotoAlt',
                  { name: pet.name },
                )
              }
              className="size-full object-contain p-2 transition-transform duration-200 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-primary">
              <PawPrint
                className="size-16"
                aria-hidden="true"
              />
              <span className="sr-only">
                {translate(
                  'pets.list.noPhoto',
                  { name: pet.name },
                )}
              </span>
            </span>
          )}

          <span className="absolute right-3 top-3 rounded-full bg-surface-elevated/95 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-[var(--shadow-sm)]">
            {translate(
              pet.status === 'ARCHIVED'
                ? 'pets.list.statusArchived'
                : 'pets.list.statusActive',
            )}
          </span>
        </div>

        <CardHeader>
          <CardTitle>{pet.name}</CardTitle>
          <CardDescription>
            {pet.breed ||
              translate(
                'pets.list.breedUnknown',
              )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between gap-3 border-t border-border-soft pt-4 text-sm">
            <span className="text-muted-foreground">
              {translate(
                pet.hasMicrochip
                  ? 'pets.list.microchipYes'
                  : 'pets.list.microchipNo',
              )}
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
      aria-current={
        selected ? 'page' : undefined
      }
      className={
        selected
          ? 'border-b-2 border-primary px-4 py-3 font-semibold text-primary'
          : 'border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft'
      }
    >
      {label}{' '}
      <span className="ml-1 rounded-full bg-surface px-2 py-0.5 text-xs">
        {count}
      </span>
    </Link>
  );
}
