'use client';

import {
  PET_LIMITS,
  type PetPhotoWithSignedUrl,
} from '@buscohuella/pet-domain';
import {
  ImagePlus,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/features/i18n/i18n-provider';

import { uploadPetPhotoAction } from '../actions/upload-pet-photo';
import { PetPhotoControls } from './pet-photo-controls';
import { PetPhotoLightbox } from './pet-photo-lightbox';

type PendingStatus =
  | 'ready'
  | 'uploading'
  | 'success'
  | 'error';

interface PendingPhoto {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  altText: string;
  status: PendingStatus;
  message?: string;
}

interface SelectionMessage {
  tone: 'success' | 'error';
  text: string;
}

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export function PetPhotoGallery({
  petId,
  petName,
  photos,
  canManage,
}: {
  petId: string;
  petName: string;
  photos: PetPhotoWithSignedUrl[];
  canManage: boolean;
}) {
  const router = useRouter();
  const { t } = useTranslations('pets');
  const fileInputRef =
    useRef<HTMLInputElement>(null);
  const pendingRef =
    useRef<PendingPhoto[]>([]);
  const [pending, setPending] =
    useState<PendingPhoto[]>([]);
  const [
    selectionMessage,
    setSelectionMessage,
  ] =
    useState<SelectionMessage | null>(
      null,
    );
  const [isUploading, setIsUploading] =
    useState(false);
  const [
    lightboxIndex,
    setLightboxIndex,
  ] = useState<number | null>(null);

  const remainingSlots = Math.max(
    0,
    PET_LIMITS.photosMaxCount -
      photos.length,
  );

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(
    () => () => {
      pendingRef.current.forEach(
        (photo) =>
          URL.revokeObjectURL(
            photo.previewUrl,
          ),
      );
    },
    [],
  );

  async function handleFiles(
    files: FileList | null,
  ) {
    if (!files?.length) return;

    setSelectionMessage(null);
    const available = Math.max(
      0,
      remainingSlots - pending.length,
    );

    if (available === 0) {
      setSelectionMessage({
        tone: 'error',
        text: t('photos.limitReached', {
          max: PET_LIMITS.photosMaxCount,
        }),
      });
      return;
    }

    const selected =
      Array.from(files).slice(
        0,
        available,
      );
    const rejectedCount =
      files.length - selected.length;
    const prepared: PendingPhoto[] = [];

    for (const file of selected) {
      if (
        !ACCEPTED_TYPES.includes(
          file.type as (typeof ACCEPTED_TYPES)[number],
        )
      ) {
        setSelectionMessage({
          tone: 'error',
          text: t(
            'photos.invalidClientType',
            { file: file.name },
          ),
        });
        continue;
      }

      if (
        file.size >
        PET_LIMITS.photoMaxSizeBytes
      ) {
        setSelectionMessage({
          tone: 'error',
          text: t(
            'photos.clientTooLarge',
            { file: file.name },
          ),
        });
        continue;
      }

      try {
        const dimensions =
          await readImageDimensions(file);

        prepared.push({
          id: crypto.randomUUID(),
          file,
          previewUrl:
            URL.createObjectURL(file),
          width: dimensions.width,
          height: dimensions.height,
          altText: '',
          status: 'ready',
        });
      } catch {
        setSelectionMessage({
          tone: 'error',
          text: t(
            'photos.cannotRead',
            { file: file.name },
          ),
        });
      }
    }

    if (rejectedCount > 0) {
      setSelectionMessage({
        tone: 'error',
        text: t(
          'photos.selectionTruncated',
          {
            count: available,
            max:
              PET_LIMITS.photosMaxCount,
          },
        ),
      });
    }

    setPending((current) => [
      ...current,
      ...prepared,
    ]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function removePending(id: string) {
    setPending((current) => {
      const target = current.find(
        (photo) => photo.id === id,
      );
      if (target) {
        URL.revokeObjectURL(
          target.previewUrl,
        );
      }
      return current.filter(
        (photo) => photo.id !== id,
      );
    });
  }

  function updateAltText(
    id: string,
    altText: string,
  ) {
    setPending((current) =>
      current.map((photo) =>
        photo.id === id
          ? { ...photo, altText }
          : photo,
      ),
    );
  }

  async function uploadPendingPhotos() {
    if (
      !pending.length ||
      isUploading
    ) {
      return;
    }

    setIsUploading(true);
    setSelectionMessage(null);
    let uploadedCount = 0;

    for (const photo of pending) {
      if (photo.status === 'success') {
        continue;
      }

      setPending((current) =>
        current.map((item) =>
          item.id === photo.id
            ? {
                ...item,
                status: 'uploading',
                message: undefined,
              }
            : item,
        ),
      );

      const formData = new FormData();
      formData.set('petId', petId);
      formData.set(
        'photo',
        photo.file,
      );
      formData.set(
        'width',
        String(photo.width),
      );
      formData.set(
        'height',
        String(photo.height),
      );
      formData.set(
        'altText',
        photo.altText,
      );

      const result =
        await uploadPetPhotoAction(
          formData,
        );

      if (
        result.status === 'success'
      ) {
        uploadedCount += 1;
      }

      setPending((current) =>
        current.map((item) =>
          item.id === photo.id
            ? {
                ...item,
                status:
                  result.status ===
                  'success'
                    ? 'success'
                    : 'error',
                message:
                  result.message ??
                  t(
                    'photos.uploadError',
                  ),
              }
            : item,
        ),
      );
    }

    setIsUploading(false);

    if (uploadedCount > 0) {
      setSelectionMessage({
        tone: 'success',
        text: t(
          uploadedCount === 1
            ? 'photos.uploadedOne'
            : 'photos.uploadedMany',
          { count: uploadedCount },
        ),
      });

      setPending((current) => {
        const failed = current.filter(
          (photo) =>
            photo.status !== 'success',
        );

        current
          .filter(
            (photo) =>
              photo.status ===
              'success',
          )
          .forEach((photo) =>
            URL.revokeObjectURL(
              photo.previewUrl,
            ),
          );

        return failed;
      });

      router.refresh();
    }
  }

  const fallbackAlt = t(
    'photos.photoAlt',
    { name: petName },
  );

  return (
    <section
      aria-labelledby="pet-photos-title"
      className="space-y-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="pet-photos-title"
            className="text-xl font-semibold"
          >
            {t('photos.title')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('photos.summary', {
              count: photos.length,
              max:
                PET_LIMITS.photosMaxCount,
            })}
          </p>
        </div>

        {canManage &&
        remainingSlots > 0 ? (
          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated px-5 text-sm font-semibold hover:bg-surface-hover focus-within:ring-4 focus-within:ring-focus-soft">
            <ImagePlus
              className="size-5"
              aria-hidden="true"
            />
            {t('photos.add')}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(event) =>
                void handleFiles(
                  event.target.files,
                )
              }
            />
          </label>
        ) : null}
      </div>

      {selectionMessage ? (
        <Alert
          variant={
            selectionMessage.tone ===
            'error'
              ? 'danger'
              : 'success'
          }
        >
          {selectionMessage.text}
        </Alert>
      ) : null}

      {photos.length ? (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map(
              (photo, index) => (
                <li
                  key={photo.id}
                  className="overflow-hidden rounded-xl border border-border-soft bg-surface-elevated shadow-[var(--shadow-sm)]"
                >
                  <button
                    type="button"
                    aria-label={t(
                      'photos.openGallery',
                      {
                        description:
                          photo.altText ||
                          fallbackAlt,
                      },
                    )}
                    onClick={() =>
                      setLightboxIndex(
                        index,
                      )
                    }
                    className="group relative block aspect-[4/3] w-full overflow-hidden bg-black/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        photo.signedUrl
                      }
                      alt={
                        photo.altText ||
                        fallbackAlt
                      }
                      className="size-full object-contain p-2 transition-transform duration-200 group-hover:scale-[1.02]"
                      loading="lazy"
                    />

                    <span className="absolute inset-x-3 bottom-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      {t(
                        'photos.viewPhoto',
                      )}
                    </span>

                    {photo.isPrimary ? (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface-elevated/95 px-3 py-1.5 text-xs font-semibold shadow-[var(--shadow-sm)]">
                        <Star
                          className="size-4 text-primary"
                          aria-hidden="true"
                        />
                        {t(
                          'photos.cover',
                        )}
                      </span>
                    ) : null}
                  </button>

                  <div className="space-y-4 p-4">
                    <div>
                      <p className="truncate text-sm font-semibold">
                        {photo.altText ||
                          fallbackAlt}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {photo.width &&
                        photo.height
                          ? t(
                              'photos.dimensions',
                              {
                                width:
                                  photo.width,
                                height:
                                  photo.height,
                              },
                            )
                          : t(
                              'photos.noDimensions',
                            )}
                      </p>
                    </div>

                    {canManage ? (
                      <PetPhotoControls
                        petId={petId}
                        petName={petName}
                        photo={photo}
                        photoCount={
                          photos.length
                        }
                      />
                    ) : null}
                  </div>
                </li>
              ),
            )}
          </ul>

          <PetPhotoLightbox
            photos={photos}
            activeIndex={
              lightboxIndex
            }
            petName={petName}
            onClose={() =>
              setLightboxIndex(null)
            }
            onChange={
              setLightboxIndex
            }
          />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
          <ImagePlus
            className="mx-auto size-10 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-4 font-semibold">
            {t('photos.emptyTitle')}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {t(
              'photos.emptyDescription',
              { name: petName },
            )}
          </p>
        </div>
      )}

      {pending.length ? (
        <div className="space-y-4 rounded-xl border border-border-soft bg-surface p-5">
          <div>
            <h3 className="font-semibold">
              {t(
                'photos.pendingTitle',
              )}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                'photos.pendingDescription',
              )}
            </p>
          </div>

          <ul className="grid gap-4 md:grid-cols-2">
            {pending.map((photo) => (
              <li
                key={photo.id}
                className="rounded-xl border border-border-soft bg-surface-elevated p-4"
              >
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      photo.previewUrl
                    }
                    alt=""
                    className="size-24 shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {photo.file.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatBytes(
                        photo.file.size,
                      )}{' '}
                      · {photo.width} ×{' '}
                      {photo.height} px
                    </p>

                    <Field
                      htmlFor={`photo-alt-${photo.id}`}
                      label={t(
                        'photos.altText',
                      )}
                    >
                      <Input
                        id={`photo-alt-${photo.id}`}
                        value={
                          photo.altText
                        }
                        maxLength={
                          PET_LIMITS.photoAltTextMaxLength
                        }
                        disabled={
                          photo.status ===
                            'uploading' ||
                          photo.status ===
                            'success'
                        }
                        placeholder={t(
                          'photos.shortAltPlaceholder',
                          {
                            name: petName,
                          },
                        )}
                        onChange={(
                          event,
                        ) =>
                          updateAltText(
                            photo.id,
                            event.target
                              .value,
                          )
                        }
                      />
                    </Field>
                  </div>

                  <button
                    type="button"
                    aria-label={t(
                      'photos.removePending',
                      {
                        file:
                          photo.file
                            .name,
                      },
                    )}
                    disabled={
                      photo.status ===
                        'uploading' ||
                      photo.status ===
                        'success'
                    }
                    onClick={() =>
                      removePending(
                        photo.id,
                      )
                    }
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger-soft disabled:opacity-50"
                  >
                    <Trash2
                      className="size-5"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {photo.status !==
                'ready' ? (
                  <Alert
                    className="mt-3"
                    variant={
                      photo.status ===
                      'error'
                        ? 'danger'
                        : 'info'
                    }
                  >
                    {photo.status ===
                    'uploading'
                      ? t(
                          'photos.uploadingOne',
                        )
                      : photo.message}
                  </Alert>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="flex justify-end">
            <Button
              type="button"
              isLoading={isUploading}
              loadingText={t(
                'photos.uploadingMany',
              )}
              onClick={() =>
                void uploadPendingPhotos()
              }
            >
              <Upload
                className="size-5"
                aria-hidden="true"
              />
              {t(
                pending.length === 1
                  ? 'photos.uploadButtonOne'
                  : 'photos.uploadButtonMany',
                {
                  count:
                    pending.length,
                },
              )}
            </Button>
          </div>
        </div>
      ) : null}

      {!canManage ? (
        <p className="text-sm text-muted-foreground">
          {t(
            'photos.restoreToManage',
          )}
        </p>
      ) : null}
    </section>
  );
}

async function readImageDimensions(
  file: File,
) {
  if ('createImageBitmap' in window) {
    const bitmap =
      await createImageBitmap(file);
    try {
      return {
        width: bitmap.width,
        height: bitmap.height,
      };
    } finally {
      bitmap.close();
    }
  }

  const url =
    URL.createObjectURL(file);

  try {
    return await new Promise<{
      width: number;
      height: number;
    }>((resolve, reject) => {
      const image = new Image();
      image.onload = () =>
        resolve({
          width:
            image.naturalWidth,
          height:
            image.naturalHeight,
        });
      image.onerror = () =>
        reject(
          new Error(
            'IMAGE_READ_FAILED',
          ),
        );
      image.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(
      1,
      Math.round(bytes / 1024),
    )} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}
