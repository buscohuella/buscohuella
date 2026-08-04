'use client';

import {
  PET_LIMITS,
  type PetPhotoWithSignedUrl,
} from '@buscohuella/pet-domain';
import {
  ImagePlus,
  LoaderCircle,
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

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { uploadPetPhotoAction } from '../actions/upload-pet-photo';
import { PetPhotoControls } from './pet-photo-controls';
import { PetPhotoLightbox } from './pet-photo-lightbox';

type PendingStatus = 'ready' | 'uploading' | 'success' | 'error';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef<PendingPhoto[]>([]);

  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const [selectionMessage, setSelectionMessage] = useState<string | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(
    null,
  );

  const remainingSlots = Math.max(
    0,
    PET_LIMITS.photosMaxCount - photos.length,
  );

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((photo) =>
        URL.revokeObjectURL(photo.previewUrl),
      );
    };
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    setSelectionMessage(null);

    const available = Math.max(0, remainingSlots - pending.length);

    if (available === 0) {
      setSelectionMessage(
        'No puedes añadir más fotografías. El máximo es 10.',
      );
      return;
    }

    const selected = Array.from(files).slice(0, available);
    const rejectedCount = files.length - selected.length;
    const prepared: PendingPhoto[] = [];

    for (const file of selected) {
      if (
        !ACCEPTED_TYPES.includes(
          file.type as (typeof ACCEPTED_TYPES)[number],
        )
      ) {
        setSelectionMessage(
          `${file.name} no es JPEG, PNG o WebP.`,
        );
        continue;
      }

      if (file.size > PET_LIMITS.photoMaxSizeBytes) {
        setSelectionMessage(
          `${file.name} supera el límite de 8 MB.`,
        );
        continue;
      }

      try {
        const dimensions = await readImageDimensions(file);

        prepared.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          width: dimensions.width,
          height: dimensions.height,
          altText: '',
          status: 'ready',
        });
      } catch {
        setSelectionMessage(
          `No se ha podido leer la imagen ${file.name}.`,
        );
      }
    }

    if (rejectedCount > 0) {
      setSelectionMessage(
        `Solo se han preparado ${available} archivos porque el máximo es 10 fotografías.`,
      );
    }

    setPending((current) => [...current, ...prepared]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function removePending(id: string) {
    setPending((current) => {
      const target = current.find((photo) => photo.id === id);

      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return current.filter((photo) => photo.id !== id);
    });
  }

  function updateAltText(id: string, altText: string) {
    setPending((current) =>
      current.map((photo) =>
        photo.id === id ? { ...photo, altText } : photo,
      ),
    );
  }

  async function uploadPendingPhotos() {
    if (!pending.length || isUploading) return;

    setIsUploading(true);
    setSelectionMessage(null);

    let uploadedCount = 0;

    for (const photo of pending) {
      if (photo.status === 'success') continue;

      setPending((current) =>
        current.map((item) =>
          item.id === photo.id
            ? { ...item, status: 'uploading', message: undefined }
            : item,
        ),
      );

      const formData = new FormData();
      formData.set('petId', petId);
      formData.set('photo', photo.file);
      formData.set('width', String(photo.width));
      formData.set('height', String(photo.height));
      formData.set('altText', photo.altText);

      const result = await uploadPetPhotoAction(formData);

      if (result.status === 'success') {
        uploadedCount += 1;

        setPending((current) =>
          current.map((item) =>
            item.id === photo.id
              ? {
                  ...item,
                  status: 'success',
                  message: result.message,
                }
              : item,
          ),
        );
      } else {
        setPending((current) =>
          current.map((item) =>
            item.id === photo.id
              ? {
                  ...item,
                  status: 'error',
                  message:
                    result.message ??
                    'No se ha podido subir la fotografía.',
                }
              : item,
          ),
        );
      }
    }

    setIsUploading(false);

    if (uploadedCount > 0) {
      setSelectionMessage(
        `${uploadedCount} ${
          uploadedCount === 1 ? 'fotografía subida' : 'fotografías subidas'
        } correctamente.`,
      );

      setPending((current) => {
        const failed = current.filter(
          (photo) => photo.status !== 'success',
        );

        current
          .filter((photo) => photo.status === 'success')
          .forEach((photo) => URL.revokeObjectURL(photo.previewUrl));

        return failed;
      });

      router.refresh();
    }
  }

  return (
    <section aria-labelledby="pet-photos-title" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="pet-photos-title"
            className="text-xl font-semibold text-foreground"
          >
            Fotografías
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {photos.length} de {PET_LIMITS.photosMaxCount} fotografías.
            La primera se usa como portada.
          </p>
        </div>

        {canManage && remainingSlots > 0 ? (
          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated px-5 text-sm font-semibold text-foreground hover:bg-surface focus-within:ring-4 focus-within:ring-primary/20">
            <ImagePlus className="size-5" aria-hidden="true" />
            Añadir fotografías
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(event) => void handleFiles(event.target.files)}
            />
          </label>
        ) : null}
      </div>

      {selectionMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-border-soft bg-surface p-4 text-sm text-foreground"
        >
          {selectionMessage}
        </div>
      ) : null}

      {photos.length ? (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <li
                key={photo.id}
                className="overflow-hidden rounded-xl border border-border-soft bg-surface-elevated shadow-[var(--shadow-sm)]"
              >
                <button
                  type="button"
                  aria-label={`Abrir ${photo.altText || `fotografía de ${petName}`} en la galería`}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative block aspect-[4/3] w-full overflow-hidden bg-black/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.signedUrl}
                    alt={photo.altText || `Fotografía de ${petName}`}
                    className="size-full object-contain p-2 transition-transform duration-200 group-hover:scale-[1.02]"
                    loading="lazy"
                  />

                  <span className="absolute inset-x-3 bottom-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    Ver fotografía
                  </span>

                  {photo.isPrimary ? (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface-elevated/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-[var(--shadow-sm)]">
                      <Star
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                      Portada
                    </span>
                  ) : null}
                </button>

                <div className="space-y-4 p-4">
                  <div>
                    <p className="truncate text-sm font-semibold">
                      {photo.altText || `Fotografía de ${petName}`}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {photo.width && photo.height
                        ? `${photo.width} × ${photo.height} px`
                        : 'Dimensiones no disponibles'}
                    </p>
                  </div>

                  {canManage ? (
                    <PetPhotoControls
                      petId={petId}
                      petName={petName}
                      photo={photo}
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <PetPhotoLightbox
            photos={photos}
            activeIndex={lightboxIndex}
            petName={petName}
            onClose={() => setLightboxIndex(null)}
            onChange={setLightboxIndex}
          />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
          <ImagePlus
            className="mx-auto size-10 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-4 font-semibold">
            Aún no hay fotografías
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Añade imágenes claras desde diferentes ángulos. Serán útiles
            para identificar a {petName} si alguna vez se pierde.
          </p>
        </div>
      )}

      {pending.length ? (
        <div className="space-y-4 rounded-xl border border-border-soft bg-surface p-5">
          <div>
            <h3 className="font-semibold">Preparadas para subir</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Revisa las imágenes y añade una descripción breve cuando
              aporte información útil.
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
                    src={photo.previewUrl}
                    alt=""
                    className="size-24 shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {photo.file.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatBytes(photo.file.size)} · {photo.width} ×{' '}
                      {photo.height} px
                    </p>

                    <label
                      htmlFor={`photo-alt-${photo.id}`}
                      className="mt-3 block text-xs font-semibold"
                    >
                      Texto alternativo
                    </label>
                    <input
                      id={`photo-alt-${photo.id}`}
                      type="text"
                      value={photo.altText}
                      maxLength={PET_LIMITS.photoAltTextMaxLength}
                      disabled={
                        photo.status === 'uploading' ||
                        photo.status === 'success'
                      }
                      placeholder={`Ej.: ${petName} de frente`}
                      onChange={(event) =>
                        updateAltText(photo.id, event.target.value)
                      }
                      className="mt-1 min-h-10 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:opacity-60"
                    />
                  </div>

                  <button
                    type="button"
                    aria-label={`Quitar ${photo.file.name}`}
                    disabled={
                      photo.status === 'uploading' ||
                      photo.status === 'success'
                    }
                    onClick={() => removePending(photo.id)}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger/15 disabled:opacity-50"
                  >
                    <Trash2 className="size-5" aria-hidden="true" />
                  </button>
                </div>

                {photo.status !== 'ready' ? (
                  <p
                    role={photo.status === 'error' ? 'alert' : 'status'}
                    className={cn(
                      'mt-3 text-sm',
                      photo.status === 'error'
                        ? 'font-medium text-danger'
                        : 'text-muted-foreground',
                    )}
                  >
                    {photo.status === 'uploading'
                      ? 'Subiendo...'
                      : photo.message}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="flex justify-end">
            <Button
              type="button"
              disabled={isUploading}
              onClick={() => void uploadPendingPhotos()}
            >
              {isUploading ? (
                <LoaderCircle
                  className="size-5 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Upload className="size-5" aria-hidden="true" />
              )}
              {isUploading
                ? 'Subiendo fotografías...'
                : `Subir ${pending.length} ${
                    pending.length === 1
                      ? 'fotografía'
                      : 'fotografías'
                  }`}
            </Button>
          </div>
        </div>
      ) : null}

      {!canManage ? (
        <p className="text-sm text-muted-foreground">
          Restaura la ficha para volver a gestionar sus fotografías.
        </p>
      ) : null}
    </section>
  );
}

async function readImageDimensions(file: File) {
  if ('createImageBitmap' in window) {
    const bitmap = await createImageBitmap(file);

    try {
      return {
        width: bitmap.width,
        height: bitmap.height,
      };
    } finally {
      bitmap.close();
    }
  }

  const url = URL.createObjectURL(file);

  try {
    return await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const image = new Image();

        image.onload = () =>
          resolve({
            width: image.naturalWidth,
            height: image.naturalHeight,
          });
        image.onerror = () => reject(new Error('IMAGE_READ_FAILED'));
        image.src = url;
      },
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
