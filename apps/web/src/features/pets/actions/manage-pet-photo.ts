'use server';

import {
  PetDomainError,
  reorderPetPhotosSchema,
  updatePetPhotoSchema,
} from '@buscohuella/pet-domain';
import {
  PetPhotoRepository,
  PetRepository,
} from '@buscohuella/pet-data';
import { revalidatePath } from 'next/cache';

import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import type { PetPhotoActionState } from '../types/pet-photo-action-state';

function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

async function getContext(formData: FormData) {
  const { translate } = await getServerTranslator();
  const petId = getString(formData, 'petId');
  const photoId = getString(formData, 'photoId');

  if (!petId || !photoId) {
    return {
      error: {
        status: 'error',
        message: translate('pets.photos.identifyPhoto'),
      } satisfies PetPhotoActionState,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: {
        status: 'error',
        message: translate('pets.result.sessionExpired'),
      } satisfies PetPhotoActionState,
    };
  }

  try {
    const petRepository = new PetRepository(supabase);
    const pet = await petRepository.getOwnPetById(petId);

    if (pet.status !== 'ACTIVE') {
      return {
        error: {
          status: 'error',
          message: translate('pets.photos.restoreBeforeManage'),
        } satisfies PetPhotoActionState,
      };
    }

    return {
      supabase,
      user,
      petId,
      photoId,
      translate,
    };
  } catch (error) {
    logServerError('pet.photo.context_failed', error, {
      petId,
      photoId,
      userId: user.id,
    });

    return {
      error: {
        status: 'error',
        message: translate('pets.photos.validateError'),
      } satisfies PetPhotoActionState,
    };
  }
}

function revalidatePetPhotos(petId: string) {
  revalidatePath(`/mis-mascotas/${petId}`);
  revalidatePath('/mis-mascotas');
}

type PhotoLogContext = Record<
  string,
  string | number | boolean | null | undefined
>;

function mapError(
  event: string,
  error: unknown,
  context: PhotoLogContext,
  fallback: string,
  translate: (key: string) => string,
): PetPhotoActionState {
  logServerError(event, error, context);

  if (error instanceof PetDomainError) {
    if (error.code === 'PET_NOT_FOUND') {
      return {
        status: 'error',
        message: translate('pets.photos.photoMissing'),
      };
    }

    if (error.code === 'PET_FORBIDDEN') {
      return {
        status: 'error',
        message: translate('pets.photos.permissionOrOrder'),
      };
    }
  }

  return { status: 'error', message: fallback };
}

export async function setPrimaryPetPhotoAction(
  formData: FormData,
): Promise<PetPhotoActionState> {
  const context = await getContext(formData);
  if ('error' in context && context.error) return context.error;

  const { supabase, petId, photoId, user, translate } = context;

  try {
    const repository = new PetPhotoRepository(supabase);
    await repository.setPrimaryPhoto(photoId);
    revalidatePetPhotos(petId);

    return {
      status: 'success',
      message: translate('pets.photos.coverUpdated'),
      photoId,
    };
  } catch (error) {
    return mapError(
      'pet.photo.set_primary_failed',
      error,
      { userId: user.id, petId, photoId },
      translate('pets.photos.coverError'),
      translate,
    );
  }
}

export async function reorderPetPhotosAction(
  formData: FormData,
): Promise<PetPhotoActionState> {
  const context = await getContext(formData);
  if ('error' in context && context.error) return context.error;

  const { supabase, petId, photoId, user, translate } = context;
  const direction = getString(formData, 'direction');

  if (direction !== 'before' && direction !== 'after') {
    return {
      status: 'error',
      message: translate('pets.photos.invalidMove'),
    };
  }

  try {
    const repository = new PetPhotoRepository(supabase);
    const current = await repository.listPetPhotos(petId);
    const currentIndex = current.findIndex((photo) => photo.id === photoId);

    if (currentIndex < 0) {
      return {
        status: 'error',
        message: translate('pets.photos.photoMissing'),
      };
    }

    const targetIndex =
      direction === 'before'
        ? currentIndex - 1
        : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= current.length) {
      return {
        status: 'success',
        message: translate(
          direction === 'before'
            ? 'pets.photos.alreadyFirst'
            : 'pets.photos.alreadyLast',
        ),
        photoId,
      };
    }

    const nextOrder = current.map((photo) => photo.id);
    [nextOrder[currentIndex], nextOrder[targetIndex]] = [
      nextOrder[targetIndex],
      nextOrder[currentIndex],
    ];

    const parsed = reorderPetPhotosSchema.parse({
      petId,
      photoIds: nextOrder,
    });
    const ordered = await repository.reorderPhotos(parsed);
    const newIndex = ordered.findIndex((photo) => photo.id === photoId);

    revalidatePetPhotos(petId);

    return {
      status: 'success',
      message: translate('pets.photos.moved', {
        current: newIndex + 1,
        total: ordered.length,
      }),
      photoId,
    };
  } catch (error) {
    return mapError(
      'pet.photo.reorder_failed',
      error,
      { userId: user.id, petId, photoId, direction },
      translate('pets.photos.reorderError'),
      translate,
    );
  }
}

export async function updatePetPhotoAltTextAction(
  formData: FormData,
): Promise<PetPhotoActionState> {
  const context = await getContext(formData);
  if ('error' in context && context.error) return context.error;

  const { supabase, petId, photoId, user, translate } = context;
  const altText = getString(formData, 'altText');

  const parsed = updatePetPhotoSchema.safeParse({
    altText: altText || null,
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: translate('pets.photos.altTooLong'),
    };
  }

  try {
    const repository = new PetPhotoRepository(supabase);
    await repository.updatePhoto(photoId, parsed.data);
    revalidatePetPhotos(petId);

    return {
      status: 'success',
      message: translate('pets.photos.altUpdated'),
      photoId,
    };
  } catch (error) {
    return mapError(
      'pet.photo.update_alt_failed',
      error,
      { userId: user.id, petId, photoId },
      translate('pets.photos.altUpdateError'),
      translate,
    );
  }
}

export async function deletePetPhotoAction(
  formData: FormData,
): Promise<PetPhotoActionState> {
  const context = await getContext(formData);
  if ('error' in context && context.error) return context.error;

  const { supabase, petId, photoId, user, translate } = context;

  try {
    const repository = new PetPhotoRepository(supabase);
    await repository.deletePhoto(photoId);
    revalidatePetPhotos(petId);

    return {
      status: 'success',
      message: translate('pets.photos.deleted'),
      photoId,
    };
  } catch (error) {
    return mapError(
      'pet.photo.delete_failed',
      error,
      { userId: user.id, petId, photoId },
      translate('pets.photos.deleteError'),
      translate,
    );
  }
}
