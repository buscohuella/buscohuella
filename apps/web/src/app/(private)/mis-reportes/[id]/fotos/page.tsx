import {
  REPORT_LIMITS,
} from '@buscohuella/report-domain';
import {
  ReportRepository,
  type Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
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
import { getServerTranslator } from '@/features/i18n/server';
import {
  ReportPhotoGallery,
} from '@/features/reports/components/report-photo-gallery';
import {
  ReportPhotoUploader,
} from '@/features/reports/components/report-photo-uploader';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

const REPORT_PHOTOS_BUCKET =
  'report-photos';

async function loadData(
  reportId: string,
) {
  const supabase = await createClient();
  const reportClient =
    supabase as unknown as
      SupabaseClient<ReportDatabase>;
  const repository =
    new ReportRepository(reportClient);

  const report =
    await repository.getOwnReportById(
      reportId,
    );

  if (
    !['DRAFT', 'ACTIVE', 'PAUSED'].includes(
      report.status,
    )
  ) {
    notFound();
  }

  const { data: photos, error } =
    await reportClient
      .from('report_photos')
      .select('*')
      .eq('report_id', reportId)
      .order('position', {
        ascending: true,
      })
      .order('created_at', {
        ascending: true,
      });

  if (error) {
    throw error;
  }

  const storedPhotos = photos ?? [];

  if (storedPhotos.length === 0) {
    return {
      report,
      photos: [],
    };
  }

  const {
    data: signed,
    error: signError,
  } = await supabase.storage
    .from(REPORT_PHOTOS_BUCKET)
    .createSignedUrls(
      storedPhotos.map(
        (photo) => photo.storage_path,
      ),
      600,
    );

  if (signError) {
    throw signError;
  }

  return {
    report,
    photos: storedPhotos.map(
      (photo, index) => {
        const signedUrl =
          signed[index]?.signedUrl;

        if (!signedUrl) {
          throw new Error(
            'Missing signed URL for report photo',
          );
        }

        return {
          id: photo.id,
          signedUrl,
          altText: photo.alt_text,
          isPrimary:
            photo.is_primary,
        };
      },
    ),
  };
}

export default async function ReportPhotosPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const [{ id }, { translate }] =
    await Promise.all([
      params,
      getServerTranslator(),
    ]);

  let data;

  try {
    data = await loadData(id);
  } catch (error) {
    logServerError(
      'report.photos.load_failed',
      error,
      { reportId: id },
    );
    notFound();
  }

  const isDraft =
    data.report.status === 'DRAFT';
  const backHref = isDraft
    ? '/mis-reportes'
    : `/mis-reportes/${id}`;
  const nextHref = isDraft
    ? `/mis-reportes/${id}/publicar`
    : `/mis-reportes/${id}`;
  const nextLabel = isDraft
    ? translate(
        'reports.photos.continueToPublish',
      )
    : translate('reportEdit.back');

  return (
    <PageContainer className="space-y-6">
      <Link
        href={backHref}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
      >
        <ArrowLeft
          className="size-4"
          aria-hidden="true"
        />
        {translate(
          'reports.photos.back',
        )}
      </Link>

      <header>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'reports.photos.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate(
            'reports.photos.title',
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate(
            'reports.photos.description',
          )}
        </p>
      </header>

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
              'reports.photos.uploadTitle',
            )}
          </CardTitle>
          <CardDescription>
            {translate(
              'reports.photos.uploadDescription',
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ReportPhotoUploader
            reportId={id}
            currentCount={
              data.photos.length
            }
            maxCount={
              REPORT_LIMITS.reportPhotosMaxCount
            }
          />
        </CardContent>
      </Card>

      {data.photos.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            {translate(
              'reports.photos.galleryTitle',
            )}
          </h2>

          <ReportPhotoGallery
            reportId={id}
            photos={data.photos}
            labels={{
              primary: translate(
                'reports.photos.primary',
              ),
              setPrimary: translate(
                'reports.photos.setPrimary',
              ),
              moveLeft: translate(
                'reports.photos.moveLeft',
              ),
              moveRight: translate(
                'reports.photos.moveRight',
              ),
              remove: translate(
                'reports.photos.remove',
              ),
              fallbackAlt: translate(
                'reports.photos.fallbackAlt',
              ),
            }}
          />
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center">
          <p className="font-semibold">
            {translate(
              'reports.photos.emptyTitle',
            )}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {translate(
              'reports.photos.emptyDescription',
            )}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Link
          href={nextHref}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          <CheckCircle2
            className="size-5"
            aria-hidden="true"
          />
          {nextLabel}
        </Link>
      </div>
    </PageContainer>
  );
}
