import {
  ArrowLeft,
  ArrowRight,
  Star,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';

import {
  deleteReportPhotoAction,
  moveReportPhotoAction,
  setReportPrimaryPhotoAction,
} from '@/features/reports/actions/report-photos';

export type ReportPhotoView = {
  id: string;
  signedUrl: string;
  altText: string | null;
  isPrimary: boolean;
};

export function ReportPhotoGallery({
  reportId,
  photos,
  labels,
}: {
  reportId: string;
  photos: ReportPhotoView[];
  labels: {
    primary: string;
    setPrimary: string;
    moveLeft: string;
    moveRight: string;
    remove: string;
    fallbackAlt: string;
  };
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <article
          key={photo.id}
          className="overflow-hidden rounded-xl border border-border bg-surface"
        >
          <div className="relative aspect-square">
            <Image
              src={photo.signedUrl}
              alt={
                photo.altText ||
                `${labels.fallbackAlt} ${index + 1}`
              }
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover"
            />

            {photo.isPrimary ? (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                <Star
                  className="size-3.5 fill-current"
                  aria-hidden="true"
                />
                {labels.primary}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 p-3">
            {!photo.isPrimary ? (
              <form
                action={
                  setReportPrimaryPhotoAction
                }
              >
                <input
                  type="hidden"
                  name="reportId"
                  value={reportId}
                />
                <input
                  type="hidden"
                  name="photoId"
                  value={photo.id}
                />
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 text-sm font-semibold hover:bg-primary-soft"
                >
                  <Star
                    className="size-4"
                    aria-hidden="true"
                  />
                  {labels.setPrimary}
                </button>
              </form>
            ) : null}

            <form
              action={moveReportPhotoAction}
            >
              <input
                type="hidden"
                name="reportId"
                value={reportId}
              />
              <input
                type="hidden"
                name="photoId"
                value={photo.id}
              />
              <input
                type="hidden"
                name="direction"
                value="LEFT"
              />
              <button
                type="submit"
                disabled={index === 0}
                aria-label={labels.moveLeft}
                className="flex size-10 items-center justify-center rounded-lg hover:bg-surface-elevated disabled:opacity-30"
              >
                <ArrowLeft
                  className="size-4"
                  aria-hidden="true"
                />
              </button>
            </form>

            <form
              action={moveReportPhotoAction}
            >
              <input
                type="hidden"
                name="reportId"
                value={reportId}
              />
              <input
                type="hidden"
                name="photoId"
                value={photo.id}
              />
              <input
                type="hidden"
                name="direction"
                value="RIGHT"
              />
              <button
                type="submit"
                disabled={
                  index ===
                  photos.length - 1
                }
                aria-label={labels.moveRight}
                className="flex size-10 items-center justify-center rounded-lg hover:bg-surface-elevated disabled:opacity-30"
              >
                <ArrowRight
                  className="size-4"
                  aria-hidden="true"
                />
              </button>
            </form>

            <form
              action={
                deleteReportPhotoAction
              }
              className="ml-auto"
            >
              <input
                type="hidden"
                name="reportId"
                value={reportId}
              />
              <input
                type="hidden"
                name="photoId"
                value={photo.id}
              />
              <button
                type="submit"
                aria-label={labels.remove}
                className="flex size-10 items-center justify-center rounded-lg text-danger hover:bg-danger/10"
              >
                <Trash2
                  className="size-4"
                  aria-hidden="true"
                />
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
