'use client';

import type { PetPhotoWithSignedUrl } from '@buscohuella/pet-domain';
import {
  ArrowLeft,
  ArrowRight,
  Pencil,
  Star,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useState,
  useTransition,
} from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Field } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/features/i18n/i18n-provider';

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
  const { t } = useTranslations('pets');
  const [isPending, startTransition] =
    useTransition();
  const [isEditing, setIsEditing] =
    useState(false);
  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);
  const [altText, setAltText] = useState(
    photo.altText ?? '',
  );
  const [message, setMessage] =
    useState<string | null>(null);
  const [isError, setIsError] =
    useState(false);

  function runAction(
    action: (
      formData: FormData,
    ) => Promise<{
      status:
        | 'idle'
        | 'success'
        | 'error';
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
      setIsError(
        result.status === 'error',
      );

      if (result.status === 'success') {
        onSuccess?.();
        router.refresh();
      }
    });
  }

  function movePhoto(
    direction: 'before' | 'after',
  ) {
    runAction(
      reorderPetPhotosAction,
      (formData) =>
        formData.set(
          'direction',
          direction,
        ),
    );
  }

  const positionValues = {
    current: photo.position + 1,
    total: photoCount,
  };

  return (
    <div className="space-y-3">
      <div
        aria-label={t(
          'photos.currentOrder',
          positionValues,
        )}
        className="flex flex-wrap items-center gap-2 rounded-lg border border-border-soft bg-surface p-3"
      >
        <span className="mr-auto text-xs font-semibold text-muted-foreground">
          {t(
            'photos.position',
            positionValues,
          )}
        </span>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={
            isPending ||
            photo.position === 0
          }
          aria-label={t(
            'photos.moveBeforeAria',
            positionValues,
          )}
          onClick={() =>
            movePhoto('before')
          }
        >
          <ArrowLeft
            className="size-4"
            aria-hidden="true"
          />
          {t('photos.moveBefore')}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={
            isPending ||
            photo.position >=
              photoCount - 1
          }
          aria-label={t(
            'photos.moveAfterAria',
            positionValues,
          )}
          onClick={() =>
            movePhoto('after')
          }
        >
          {t('photos.moveAfter')}
          <ArrowRight
            className="size-4"
            aria-hidden="true"
          />
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
              runAction(
                setPrimaryPetPhotoAction,
              )
            }
          >
            <Star
              className="size-4"
              aria-hidden="true"
            />
            {t('photos.useAsCover')}
          </Button>
        ) : null}

        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={() => {
            setMessage(null);
            setIsEditing(
              (current) => !current,
            );
          }}
        >
          <Pencil
            className="size-4"
            aria-hidden="true"
          />
          {t(
            isEditing
              ? 'photos.cancelEditing'
              : 'photos.editDescription',
          )}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isPending}
          className="text-danger hover:bg-danger/10"
          onClick={() =>
            setIsDeleteOpen(true)
          }
        >
          <Trash2
            className="size-4"
            aria-hidden="true"
          />
          {t('photos.delete')}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-3 rounded-lg border border-border-soft bg-surface p-3">
          <Field
            htmlFor={`saved-photo-alt-${photo.id}`}
            label={t('photos.altText')}
            description={t(
              'photos.altTextHint',
            )}
          >
            <Textarea
              id={`saved-photo-alt-${photo.id}`}
              value={altText}
              maxLength={300}
              rows={3}
              disabled={isPending}
              placeholder={t(
                'photos.altPlaceholder',
                { name: petName },
              )}
              onChange={(event) =>
                setAltText(
                  event.target.value,
                )
              }
            />
          </Field>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {altText.length}/300
            </span>
            <Button
              type="button"
              size="sm"
              isLoading={isPending}
              loadingText={t(
                'photos.savingDescription',
              )}
              onClick={() =>
                runAction(
                  updatePetPhotoAltTextAction,
                  (formData) =>
                    formData.set(
                      'altText',
                      altText,
                    ),
                  () =>
                    setIsEditing(false),
                )
              }
            >
              {t(
                'photos.saveDescription',
              )}
            </Button>
          </div>
        </div>
      ) : null}

      {message ? (
        <Alert
          variant={
            isError
              ? 'danger'
              : 'success'
          }
        >
          {message}
        </Alert>
      ) : null}

      <ConfirmationDialog
        open={isDeleteOpen}
        title={t(
          'photos.deleteDialogTitle',
        )}
        description={t(
          photo.isPrimary
            ? 'photos.deleteCoverDescription'
            : 'photos.deleteDescription',
          { name: petName },
        )}
        confirmLabel={t(
          'photos.deleteConfirm',
        )}
        confirmVariant="danger"
        isPending={isPending}
        icon={
          <Trash2
            className="size-5"
            aria-hidden="true"
          />
        }
        onCancel={() =>
          setIsDeleteOpen(false)
        }
        onConfirm={() =>
          runAction(
            deletePetPhotoAction,
            undefined,
            () =>
              setIsDeleteOpen(false),
          )
        }
      />
    </div>
  );
}
