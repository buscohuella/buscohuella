'use server';

import {
  PetDomainError,
  updatePetPhotoSchema,
} from '@buscohuella/pet-domain';
import {
  PetPhotoRepository,
  PetRepository,
} from '@buscohuella/pet-data';
import { revalidatePath } from 'next/cache';

import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import type { PetPhotoActionState } from '../types/pet-photo-action-state';

function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

async function getContext(formData: FormData) {
  const petId = getString(formData, 'petId');
  const photoId = getString(formData, 'photoId');

  if (!petId || !photoId) {
    return {
      error: {
        status: 'error',
        message: 'No se ha podido identificar la fotografía.',
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
        message: 'Tu sesión ha caducado. Inicia sesión de nuevo.',
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
          message:
            'Restaura la mascota antes de gestionar sus fotografías.',
        } satisfies PetPhotoActionState,
      };
    }

    return {
      supabase,
      user,
      pet,
      petId,
      photoId,
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
        message: 'No se ha podido validar la fotografía.',
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
): PetPhotoActionState {
  logServerError(event, error, context);

  if (error instanceof PetDomainError) {
    if (error.code === 'PET_NOT_FOUND') {
      return {
        status: 'error',
        message: 'La fotografía ya no existe.',
      };
    }

    if (error.code === 'PET_FORBIDDEN') {
      return {
        status: 'error',
        message: 'No tienes permiso para gestionar esta fotografía.',
      };
    }
  }

  return {
    status: 'error',
    message: fallback,
  };
}

export async function setPrimaryPetPhotoAction(
  formData: FormData,
): Promise<PetPhotoActionState> {
  const context = await getContext(formData);

  if ('error' in context && context.error) {
    return context.error;
  }

  const { supabase, petId, photoId, user } = context;

  try {
    const repository = new PetPhotoRepository(supabase);
    await repository.setPrimaryPhoto(photoId);

    revalidatePetPhotos(petId);

    return {
      status: 'success',
      message: 'La portada se ha actualizado correctamente.',
      photoId,
    };
  } catch (error) {
    return mapError(
      'pet.photo.set_primary_failed',
      error,
      { userId: user.id, petId, photoId },
      'No se ha podido cambiar la portada.',
    );
  }
}

export async function updatePetPhotoAltTextAction(
  formData: FormData,
): Promise<PetPhotoActionState> {
  const context = await getContext(formData);

  if ('error' in context && context.error) {
    return context.error;
  }

  const { supabase, petId, photoId, user } = context;
  const altText = getString(formData, 'altText');

  const parsed = updatePetPhotoSchema.safeParse({
    altText: altText || null,
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'El texto alternativo no puede superar 300 caracteres.',
    };
  }

  try {
    const repository = new PetPhotoRepository(supabase);
    await repository.updatePhoto(photoId, parsed.data);

    revalidatePetPhotos(petId);

    return {
      status: 'success',
      message: 'La descripción de la fotografía se ha actualizado.',
      photoId,
    };
  } catch (error) {
    return mapError(
      'pet.photo.update_alt_failed',
      error,
      { userId: user.id, petId, photoId },
      'No se ha podido actualizar la descripción.',
    );
  }
}

export async function deletePetPhotoAction(
  formData: FormData,
): Promise<PetPhotoActionState> {
  const context = await getContext(formData);

  if ('error' in context && context.error) {
    return context.error;
  }

  const { supabase, petId, photoId, user } = context;

  try {
    const repository = new PetPhotoRepository(supabase);
    await repository.deletePhoto(photoId);

    revalidatePetPhotos(petId);

    return {
      status: 'success',
      message: 'La fotografía se ha eliminado correctamente.',
      photoId,
    };
  } catch (error) {
    return mapError(
      'pet.photo.delete_failed',
      error,
      { userId: user.id, petId, photoId },
      'No se ha podido eliminar la fotografía.',
    );
  }
}
