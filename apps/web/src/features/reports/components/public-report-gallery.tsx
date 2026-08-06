import Image from 'next/image';

import type {
  PublicReportPhoto,
} from '@/features/reports/lib/public-report';

export function PublicReportGallery({
  photos,
  fallbackAlt,
}: {
  photos: PublicReportPhoto[];
  fallbackAlt: string;
}) {
  if (photos.length === 0) {
    return null;
  }

  const primary =
    photos.find(
      (photo) => photo.isPrimary,
    ) ?? photos[0];
  const remaining = photos.filter(
    (photo) =>
      photo.id !== primary.id,
  );

  return (
    <section
      aria-label={fallbackAlt}
      className="space-y-3"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface-elevated sm:aspect-[16/9]">
        <Image
          src={primary.signedUrl}
          alt={
            primary.altText ??
            fallbackAlt
          }
          fill
          unoptimized
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover"
        />
      </div>

      {remaining.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {remaining.map(
            (photo, index) => (
              <div
                key={photo.id}
                className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-elevated"
              >
                <Image
                  src={photo.signedUrl}
                  alt={
                    photo.altText ??
                    `${fallbackAlt} ${
                      index + 2
                    }`
                  }
                  fill
                  unoptimized
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
            ),
          )}
        </div>
      ) : null}
    </section>
  );
}
