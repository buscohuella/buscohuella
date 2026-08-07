import type {
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
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
import { getServerTranslator } from '@/features/i18n/server';
import { deleteSightingPhotoAction } from '@/features/reports/actions/sighting-photos';
import { SightingPhotoUploadForm } from '@/features/reports/components/sighting-photo-upload-form';
import type {
  ReportDatabaseWithSightingPhotos,
} from '@/features/reports/lib/sighting-photo-database';
import { createClient } from '@/services/supabase/server';

const BUCKET = 'sighting-photos';
const MAX_PHOTOS = 5;

type PageProps = {
  params: Promise<{
    id: string;
    sightingId: string;
  }>;
};

type SignedUrlResult = {
  signedUrl: string | null;
};

export default async function SightingPhotosPage({
  params,
}: PageProps) {
  const [
    {
      id: reportId,
      sightingId,
    },
    { translate },
  ] = await Promise.all([
    params,
    getServerTranslator(),
  ]);

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const client =
    supabase as unknown as
      SupabaseClient<ReportDatabaseWithSightingPhotos>;

  const { data: sighting } =
    await client
      .from('sightings')
      .select(
        'id, report_id, created_by',
      )
      .eq('id', sightingId)
      .eq('report_id', reportId)
      .eq('created_by', user.id)
      .single();

  if (!sighting) {
    notFound();
  }

  const { data: photos } =
    await client
      .from('sighting_photos')
      .select(
        'id, storage_path, alt_text, position',
      )
      .eq(
        'sighting_id',
        sightingId,
      )
      .order('position', {
        ascending: true,
      })
      .order('created_at', {
        ascending: true,
      });

  const rows = photos ?? [];

  let signed: SignedUrlResult[] =
    [];

  if (rows.length > 0) {
    const result =
      await supabase.storage
        .from(BUCKET)
        .createSignedUrls(
          rows.map(
            (photo) =>
              photo.storage_path,
          ),
          900,
        );

    signed =
      result.data ?? [];
  }

  return (
    <PageContainer className="space-y-6 py-6 sm:py-10">
      <Link
        href={`/reportes/${reportId}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft"
      >
        <ArrowLeft
          className="size-4"
          aria-hidden="true"
        />
        {translate(
          'sightingPhotos.back',
        )}
      </Link>

      <header>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'sightingPhotos.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate(
            'sightingPhotos.title',
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate(
            'sightingPhotos.description',
          )}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Card elevated>
            <CardHeader>
              <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Camera
                  className="size-6"
                  aria-hidden="true"
                />
              </span>

              <CardTitle>
                {translate(
                  'sightingPhotos.formTitle',
                )}
              </CardTitle>

              <CardDescription>
                {translate(
                  'sightingPhotos.formDescription',
                  {
                    count: rows.length,
                    max: MAX_PHOTOS,
                  },
                )}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SightingPhotoUploadForm
                reportId={reportId}
                sightingId={sightingId}
                disabled={
                  rows.length >=
                  MAX_PHOTOS
                }
              />
            </CardContent>
          </Card>

          {rows.length > 0 ? (
            <section
              aria-labelledby="sighting-photo-gallery-title"
            >
              <h2
                id="sighting-photo-gallery-title"
                className="text-xl font-bold"
              >
                {translate(
                  'sightingPhotos.galleryTitle',
                )}
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {rows.map(
                  (photo, index) => {
                    const url =
                      signed[index]
                        ?.signedUrl;

                    if (!url) {
                      return null;
                    }

                    return (
                      <article
                        key={photo.id}
                        className="overflow-hidden rounded-xl border border-border bg-surface"
                      >
                        <div className="relative aspect-square bg-surface-elevated">
                          <Image
                            src={url}
                            alt={
                              photo.alt_text ||
                              translate(
                                'sightingPhotos.photoAlt',
                                {
                                  number:
                                    index +
                                    1,
                                },
                              )
                            }
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>

                        <form
                          action={
                            deleteSightingPhotoAction
                          }
                          className="p-2"
                        >
                          <input
                            type="hidden"
                            name="reportId"
                            value={
                              reportId
                            }
                          />
                          <input
                            type="hidden"
                            name="sightingId"
                            value={
                              sightingId
                            }
                          />
                          <input
                            type="hidden"
                            name="photoId"
                            value={
                              photo.id
                            }
                          />

                          <button
                            type="submit"
                            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-danger hover:bg-danger/10"
                          >
                            <Trash2
                              className="size-4"
                              aria-hidden="true"
                            />
                            {translate(
                              'sightingPhotos.delete',
                            )}
                          </button>
                        </form>
                      </article>
                    );
                  },
                )}
              </div>
            </section>
          ) : null}

          <Link
            href={
              `/reportes/${reportId}` +
              '?avistamiento=creado'
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground"
          >
            <CheckCircle2
              className="size-5"
              aria-hidden="true"
            />
            {translate(
              rows.length > 0
                ? 'sightingPhotos.finish'
                : 'sightingPhotos.skip',
            )}
          </Link>
        </div>

        <aside className="h-fit rounded-xl border border-primary/25 bg-primary-soft/30 p-4">
          <ShieldCheck
            className="size-6 text-primary"
            aria-hidden="true"
          />
          <h2 className="mt-3 font-semibold">
            {translate(
              'sightingPhotos.privacyTitle',
            )}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {translate(
              'sightingPhotos.privacyDescription',
            )}
          </p>
        </aside>
      </div>
    </PageContainer>
  );
}
