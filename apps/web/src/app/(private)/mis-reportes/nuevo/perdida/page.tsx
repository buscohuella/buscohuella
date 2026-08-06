import { PetRepository } from '@buscohuella/pet-data';
import type { Pet } from '@buscohuella/pet-domain';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  PawPrint,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
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
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

async function loadActivePets() {
  const supabase = await createClient();
  const repository =
    new PetRepository(supabase);
  const pets = await repository.listOwnPets();

  return pets.filter(
    (pet) => pet.status === 'ACTIVE',
  );
}

export default async function SelectLostPetPage({
  searchParams,
}: {
  searchParams: Promise<{
    mascota?: string;
  }>;
}) {
  const [query, { translate }] =
    await Promise.all([
      searchParams,
      getServerTranslator(),
    ]);

  let pets: Pet[];

  try {
    pets = await loadActivePets();
  } catch (error) {
    logServerError(
      'report.lost_pet_selection.load_failed',
      error,
    );

    return (
      <PageContainer className="space-y-6">
        <BackLink translate={translate} />
        <PageHeading translate={translate} />
        <ErrorState
          title={translate(
            'reports.lostPet.errorTitle',
          )}
          description={translate(
            'reports.lostPet.errorDescription',
          )}
        />
      </PageContainer>
    );
  }

  const selectedPet =
    pets.find(
      (pet) => pet.id === query.mascota,
    ) ?? null;

  return (
    <PageContainer className="space-y-6">
      <BackLink translate={translate} />
      <PageHeading translate={translate} />

      {pets.length === 0 ? (
        <EmptyState
          icon={<PawPrint className="size-7" />}
          title={translate(
            'reports.lostPet.emptyTitle',
          )}
          description={translate(
            'reports.lostPet.emptyDescription',
          )}
          actions={
            <Link
              href="/mis-mascotas/nueva"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
            >
              <Plus
                className="size-5"
                aria-hidden="true"
              />
              {translate(
                'reports.lostPet.registerPet',
              )}
            </Link>
          }
        />
      ) : (
        <>
          <div
            role="radiogroup"
            aria-label={translate(
              'reports.lostPet.groupLabel',
            )}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {pets.map((pet) => (
              <PetSelectionCard
                key={pet.id}
                pet={pet}
                selected={
                  selectedPet?.id === pet.id
                }
                translate={translate}
              />
            ))}
          </div>

          {selectedPet ? (
            <Card
              elevated
              className="border-primary/30"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Check
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <CardTitle>
                      {translate(
                        'reports.lostPet.selectedTitle',
                      )}
                    </CardTitle>
                    <CardDescription>
                      {translate(
                        'reports.lostPet.selectedDescription',
                        {
                          name:
                            selectedPet.name,
                        },
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {translate(
                    'reports.lostPet.nextHint',
                  )}
                </p>

                <button
                  type="button"
                  disabled
                  aria-describedby="lost-pet-next-hint"
                  className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 font-semibold text-muted-foreground opacity-75"
                >
                  {translate(
                    'reports.lostPet.continue',
                  )}
                  <ArrowRight
                    className="size-5"
                    aria-hidden="true"
                  />
                </button>

                <span
                  id="lost-pet-next-hint"
                  className="sr-only"
                >
                  {translate(
                    'reports.lostPet.nextUnavailable',
                  )}
                </span>
              </CardContent>
            </Card>
          ) : (
            <p
              className="rounded-xl border border-dashed border-border bg-surface p-4 text-center text-sm text-muted-foreground"
              aria-live="polite"
            >
              {translate(
                'reports.lostPet.selectHint',
              )}
            </p>
          )}
        </>
      )}
    </PageContainer>
  );
}

function BackLink({
  translate,
}: {
  translate: Translator;
}) {
  return (
    <Link
      href="/mis-reportes/nuevo"
      className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
    >
      <ArrowLeft
        className="size-4"
        aria-hidden="true"
      />
      {translate(
        'reports.lostPet.back',
      )}
    </Link>
  );
}

function PageHeading({
  translate,
}: {
  translate: Translator;
}) {
  return (
    <header>
      <p className="text-sm font-semibold text-primary">
        {translate(
          'reports.lostPet.eyebrow',
        )}
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">
        {translate(
          'reports.lostPet.title',
        )}
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {translate(
          'reports.lostPet.description',
        )}
      </p>
    </header>
  );
}

function PetSelectionCard({
  pet,
  selected,
  translate,
}: {
  pet: Pet;
  selected: boolean;
  translate: Translator;
}) {
  const href =
    `/mis-reportes/nuevo/perdida?mascota=${encodeURIComponent(
      pet.id,
    )}`;

  return (
    <Link
      href={href}
      role="radio"
      aria-checked={selected}
      aria-label={translate(
        'reports.lostPet.selectAria',
        { name: pet.name },
      )}
      className="rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
    >
      <Card
        elevated={selected}
        className={
          selected
            ? 'h-full border-primary/50 bg-primary-soft/30'
            : 'h-full transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-md)]'
        }
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <PawPrint
                className="size-6"
                aria-hidden="true"
              />
            </span>

            {selected ? (
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check
                  className="size-4"
                  aria-hidden="true"
                />
              </span>
            ) : null}
          </div>

          <CardTitle className="pt-2">
            {pet.name}
          </CardTitle>

          <CardDescription>
            {pet.breed ||
              translate(
                'reports.lostPet.breedUnknown',
              )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral">
              {translate(
                `pets.form.sexOptions.${pet.sex}`,
              )}
            </Badge>
            <Badge variant="neutral">
              {translate(
                `pets.form.sizeOptions.${pet.size}`,
              )}
            </Badge>
            {pet.hasMicrochip ? (
              <Badge variant="success">
                <ShieldCheck
                  className="mr-1 size-3.5"
                  aria-hidden="true"
                />
                {translate(
                  'reports.lostPet.microchip',
                )}
              </Badge>
            ) : null}
          </div>

          {pet.primaryColor ? (
            <p className="text-sm text-muted-foreground">
              {translate(
                'reports.lostPet.color',
                {
                  color:
                    pet.primaryColor,
                },
              )}
            </p>
          ) : null}

          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            {translate(
              selected
                ? 'reports.lostPet.selected'
                : 'reports.lostPet.select',
            )}
            <ArrowRight
              className="size-4"
              aria-hidden="true"
            />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

type Translator = (
  key: string,
  values?: Record<
    string,
    string | number | boolean
  >,
) => string;
