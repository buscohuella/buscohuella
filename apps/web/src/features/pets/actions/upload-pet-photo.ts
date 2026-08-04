'use server';

import {
  PET_LIMITS,
  PetDomainError,
} from '@buscohuella/pet-domain';
import {
  PetPhotoRepository,
  PetRepository,
} from '@buscohuella/pet-data';
import { revalidatePath } from 'next/cache';

import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import { detectPetPhotoMimeType } from '../lib/detect-photo-mime';
import type { PetPhotoActionState } from '../types/pet-photo-action-state';

function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function getPositiveInteger(formData: FormData, name: string) {
  const value = Number(getString(formData, name));
  return Number.isInteger(value) && value > 0 ? value : null;
}

export async function uploadPetPhotoAction(
  formData: FormData,
): Promise<PetPhotoActionState> {
  const petId = getString(formData, 'petId');
  const width = getPositiveInteger(formData, 'width');
  const height = getPositiveInteger(formData, 'height');
  const altText = getString(formData, 'altText') || null;
  const file = formData.get('photo');

  if (!petId) {
    return {
      status: 'error',
      message: 'No se ha podido identificar la mascota.',
    };
  }

  if (!(file instanceof File) || file.size === 0) {
    return {
      status: 'error',
      message: 'Selecciona una fotografía válida.',
    };
  }

  if (file.size > PET_LIMITS.photoMaxSizeBytes) {
    return {
      status: 'error',
      message: 'La fotografía supera el límite de 8 MB.',
    };
  }

  if (!width || !height) {
    return {
      status: 'error',
      message: 'No se han podido leer las dimensiones de la imagen.',
    };
  }

  const bytes = await file.arrayBuffer();
  const detectedMimeType = detectPetPhotoMimeType(bytes);

  if (!detectedMimeType) {
    return {
      status: 'error',
      message: 'El archivo no es una imagen JPEG, PNG o WebP válida.',
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      message: 'Tu sesión ha caducado. Inicia sesión de nuevo.',
    };
  }

  const petRepository = new PetRepository(supabase);
  const photoRepository = new PetPhotoRepository(supabase);

  try {
    const pet = await petRepository.getOwnPetById(petId);

    if (pet.status !== 'ACTIVE') {
      return {
        status: 'error',
        message:
          'Restaura la mascota antes de añadir fotografías.',
      };
    }

    const currentPhotos =
      await photoRepository.listPetPhotos(petId);

    if (currentPhotos.length >= PET_LIMITS.photosMaxCount) {
      return {
        status: 'error',
        message: 'Esta mascota ya tiene el máximo de 10 fotografías.',
      };
    }

    const photoId = crypto.randomUUID();

    await photoRepository.uploadPhoto({
      ownerId: user.id,
      petId,
      photoId,
      mimeType: detectedMimeType,
      bytes,
      fileSizeBytes: file.size,
      width,
      height,
      altText,
      position: currentPhotos.length,
    });

    revalidatePath(`/mis-mascotas/${petId}`);
    revalidatePath('/mis-mascotas');

    return {
      status: 'success',
      message: `${file.name} se ha subido correctamente.`,
      photoId,
    };
  } catch (error) {
    logServerError('pet.photo.upload_failed', error, {
      userId: user.id,
      petId,
      fileSizeBytes: file.size,
      detectedMimeType,
    });

    if (error instanceof PetDomainError) {
      if (error.code === 'PET_PHOTO_LIMIT_REACHED') {
        return {
          status: 'error',
          message:
            'Esta mascota ya tiene el máximo de 10 fotografías.',
        };
      }

      if (error.code === 'PET_PHOTO_TOO_LARGE') {
        return {
          status: 'error',
          message: 'La fotografía supera el límite de 8 MB.',
        };
      }

      if (error.code === 'PET_PHOTO_UNSUPPORTED_TYPE') {
        return {
          status: 'error',
          message: 'El formato de la fotografía no está permitido.',
        };
      }

      if (error.code === 'PET_FORBIDDEN') {
        return {
          status: 'error',
          message: 'No tienes permiso para modificar esta mascota.',
        };
      }
    }

    return {
      status: 'error',
      message:
        'No se ha podido subir la fotografía. Inténtalo de nuevo.',
    };
  }
}
