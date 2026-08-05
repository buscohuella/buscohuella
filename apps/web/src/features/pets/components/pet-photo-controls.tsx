'use client';

import type { PetPhotoWithSignedUrl } from '@buscohuella/pet-domain';
import {
  ArrowLeft,
  ArrowRight,
  Pencil,
  Star,
  Trash2,
} from 'lucide-react';
import {
  useState,
  useTransition,
} from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

import {
  deletePetPhotoAction,
  reorderPetPhotosAction,
  setPrimaryPetPhotoAction,
  updatePetPhotoAltTextAction,
} from '../actions/manage-pet-photo';

export function PetPhotoControls({
  petId,
  petName,
  photo,
  photoCount,
}: {
  petId: string;
  petName: string;
  photo: PetPhotoWithSignedUrl;
  photoCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [altText, setAltText] = useState(photo.altText ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  function runAction(
    action: (formData: FormData) => Promise<{
      status: 'idle' | 'success' | 'error';
      message?: string;
    }>,
    extra?: (formData: FormData) => void,
    onSuccess?: () => void,
  ) {
    setMessage(null);
    setIsError(false);

    startTransition(async () => {
      const formData = new FormData();
      formData.set('petId', petId);
      formData.set('photoId', photo.id);
      extra?.(formData);

      const result = await action(formData);
      setMessage(result.message ?? null);
      setIsError(result.status === 'error');

      if (result.status === 'success') {
        onSuccess?.();
        router.refresh();
      }
    });
  }

  function movePhoto(direction: 'before' | 'after') {
    runAction(
      reorderPetPhotosAction,
      (formData) => formData.set('direction', direction),
    );
  }

  return (
    <div className="space-y-3">
      <div
        aria-label={`Orden actual: posición ${photo.position + 1}`}
        className="flex flex-wrap items-center gap-2 rounded-lg border border-border-soft bg-surface p-3"
      >
        <span className="mr-auto text-xs font-semibold text-muted-foreground">
          Posición {photo.position + 1} de {photoCount}
        </span>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isPending || photo.position === 0}
          aria-label={`Mover esta fotografía antes. Posición actual ${photo.position + 1} de ${photoCount}`}
          onClick={() => movePhoto('before')}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Mover antes
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={
            isPending || photo.position >= photoCount - 1
          }
          aria-label={`Mover esta fotografía después. Posición actual ${photo.position + 1} de ${photoCount}`}
          onClick={() => movePhoto('after')}
        >
          Mover después
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {!photo.isPrimary ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={isPending}
            onClick={() =>
              runAction(setPrimaryPetPhotoAction)
            }
          >
            <Star className="size-4" aria-hidden="true" />
            Usar como portada
          </Button>
        ) : null}

        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={() => {
            setMessage(null);
            setIsEditing((current) => !current);
          }}
        >
          <Pencil className="size-4" aria-hidden="true" />
          {isEditing ? 'Cancelar edición' : 'Editar descripción'}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isPending}
          className="text-danger hover:bg-danger/10"
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Eliminar
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-2 rounded-lg border border-border-soft bg-surface p-3">
          <label
            htmlFor={`saved-photo-alt-${photo.id}`}
            className="block text-sm font-semibold"
          >
            Texto alternativo
          </label>
          <textarea
            id={`saved-photo-alt-${photo.id}`}
            value={altText}
            maxLength={300}
            rows={3}
            disabled={isPending}
            placeholder={`Describe brevemente a ${petName} en esta fotografía`}
            onChange={(event) => setAltText(event.target.value)}
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:opacity-60"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {altText.length}/300
            </span>
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() =>
                runAction(
                  updatePetPhotoAltTextAction,
                  (formData) => formData.set('altText', altText),
                  () => setIsEditing(false),
                )
              }
            >
              Guardar descripción
            </Button>
          </div>
        </div>
      ) : null}

      {message ? (
        <p
          role={isError ? 'alert' : 'status'}
          aria-live="polite"
          className={
            isError
              ? 'text-sm font-medium text-danger'
              : 'text-sm text-success'
          }
        >
          {message}
        </p>
      ) : null}

      <ConfirmationDialog
        open={isDeleteOpen}
        title="Eliminar fotografía"
        description={
          photo.isPrimary
            ? `Eliminarás la portada actual de ${petName}. La primera fotografía restante pasará a ser la nueva portada.`
            : `Eliminarás esta fotografía de ${petName}. Esta acción no se puede deshacer.`
        }
        confirmLabel="Eliminar definitivamente"
        confirmVariant="danger"
        isPending={isPending}
        icon={<Trash2 className="size-5" aria-hidden="true" />}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() =>
          runAction(
            deletePetPhotoAction,
            undefined,
            () => setIsDeleteOpen(false),
          )
        }
      />
    </div>
  );
}
