import {
  PetPhotoRepository,
  PetRepository,
} from '@buscohuella/pet-data';
import type {
  Pet,
  PetPhotoWithSignedUrl,
} from '@buscohuella/pet-domain';
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
import { Alert } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDate, formatNumber } from '@/features/i18n/format';
import { getServerTranslator } from '@/features/i18n/server';
import { ArchivePetButton } from '@/features/pets/components/archive-pet-button';
import { PetPhotoGallery } from '@/features/pets/components/pet-photo-gallery';
import { RestorePetButton } from '@/features/pets/components/restore-pet-button';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

async function loadPetDetail(id: string): Promise<{
  pet: Pet;
  photos: PetPhotoWithSignedUrl[];
} | null> {
  try {
    const supabase = await createClient();
    const petRepository = new PetRepository(supabase);
    const photoRepository = new PetPhotoRepository(supabase);
    const pet = await petRepository.getOwnPetById(id);

    try {
      const photos =
        await photoRepository.listPetPhotosWithSignedUrls(id);

      return { pet, photos };
    } catch (error) {
      logServerError('pet.photos.load_failed', error, {
        petId: id,
      });

      return { pet, photos: [] };
    }
  } catch (error) {
    logServerError('pet.detail.load_failed', error, {
      petId: id,
    });
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
  const [{ id }, query, { locale, translate }] =
    await Promise.all([
      params,
      searchParams,
      getServerTranslator(),
    ]);

  const detail = await loadPetDetail(id);

  if (!detail) notFound();

  const { pet, photos } = detail;

  const successMessage =
    query.created === '1'
      ? translate('pets.detail.created', {
          name: pet.name,
        })
      : query.updated === '1'
        ? translate('pets.detail.updated', {
            name: pet.name,
          })
        : null;

  const backHref =
    pet.status === 'ARCHIVED'
      ? '/mis-mascotas?estado=archivadas'
      : '/mis-mascotas?estado=activas';

  return (
    <PageContainer className="space-y-6">
      {successMessage ? (
        <Alert variant="success">
          {successMessage}
        </Alert>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          <ArrowLeft
            className="size-4"
            aria-hidden="true"
          />
          {translate('pets.detail.back')}
        </Link>

        {pet.status === 'ACTIVE' ? (
          <Link
            href={`/mis-mascotas/${pet.id}/editar`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated px-5 text-sm font-semibold hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            <Pencil
              className="size-4"
              aria-hidden="true"
            />
            {translate('pets.detail.edit')}
          </Link>
        ) : null}
      </div>

      <header className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <PawPrint
            className="size-7"
            aria-hidden="true"
          />
        </span>
        <div>
          <p className="text-sm font-semibold text-primary">
            {translate('pets.detail.eyebrow')}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {pet.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {pet.breed ||
              translate('pets.list.breedUnknown')}
          </p>
        </div>
      </header>

      {pet.status === 'ARCHIVED' ? (
        <Alert variant="info">
          {translate('pets.detail.archivedNotice')}
        </Alert>
      ) : null}

      <Card elevated>
        <CardContent className="pt-5">
          <PetPhotoGallery
            petId={pet.id}
            petName={pet.name}
            photos={photos}
            canManage={pet.status === 'ACTIVE'}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard
          title={translate('pets.detail.sex')}
          value={translate(
            `pets.form.sexOptions.${pet.sex}`,
          )}
          icon={
            <Dna
              className="size-5"
              aria-hidden="true"
            />
          }
        />
        <InfoCard
          title={translate('pets.detail.size')}
          value={translate(
            `pets.form.sizeOptions.${pet.size}`,
          )}
          icon={
            <Ruler
              className="size-5"
              aria-hidden="true"
            />
          }
        />
        <InfoCard
          title={translate('pets.detail.weight')}
          value={
            pet.weightKg !== null
              ? translate('pets.detail.weightValue', {
                  value: formatNumber(
                    pet.weightKg,
                    locale,
                    {
                      maximumFractionDigits: 2,
                    },
                  ),
                })
              : translate('pets.detail.notProvided')
          }
          icon={
            <Weight
              className="size-5"
              aria-hidden="true"
            />
          }
        />
        <InfoCard
          title={translate('pets.detail.birth')}
          value={
            pet.birthDate
              ? formatDate(pet.birthDate, locale, {
                  dateStyle: 'medium',
                })
              : translate('pets.detail.notProvided')
          }
          icon={
            <CalendarDays
              className="size-5"
              aria-hidden="true"
            />
          }
        />
        <InfoCard
          title={translate('pets.detail.microchip')}
          value={translate(
            pet.hasMicrochip
              ? 'pets.detail.microchipRegistered'
              : 'pets.detail.notProvided',
          )}
          icon={
            <ShieldCheck
              className="size-5"
              aria-hidden="true"
            />
          }
        />
        <InfoCard
          title={translate('pets.detail.color')}
          value={
            pet.primaryColor ||
            translate('pets.detail.notProvided')
          }
          icon={
            <PawPrint
              className="size-5"
              aria-hidden="true"
            />
          }
        />
      </div>

      {pet.description ||
      pet.distinctiveFeatures ? (
        <Card elevated>
          <CardHeader>
            <CardTitle>
              {translate(
                'pets.detail.descriptionTitle',
              )}
            </CardTitle>
            <CardDescription>
              {translate(
                'pets.detail.descriptionSubtitle',
                { name: pet.name },
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {pet.description ? (
              <div>
                <h2 className="text-sm font-semibold">
                  {translate(
                    'pets.detail.generalDescription',
                  )}
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                  {pet.description}
                </p>
              </div>
            ) : null}

            {pet.distinctiveFeatures ? (
              <div>
                <h2 className="text-sm font-semibold">
                  {translate(
                    'pets.detail.distinctiveFeatures',
                  )}
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
          <CardTitle>
            {translate(
              'pets.management.title',
            )}
          </CardTitle>
          <CardDescription>
            {translate(
              pet.status === 'ARCHIVED'
                ? 'pets.management.archivedDescription'
                : 'pets.management.activeDescription',
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pet.status === 'ARCHIVED' ? (
            <RestorePetButton
              petId={pet.id}
              petName={pet.name}
            />
          ) : (
            <ArchivePetButton
              petId={pet.id}
              petName={pet.name}
            />
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
        <CardTitle className="pt-2 text-base">
          {title}
        </CardTitle>
        <CardDescription>{value}</CardDescription>
      </CardHeader>
    </Card>
  );
}
