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
import {
  PetPhotoProcessingError,
  processPetPhoto,
} from '../lib/process-pet-photo';
import type { PetPhotoActionState } from '../types/pet-photo-action-state';

function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function processingErrorMessage(
  error: PetPhotoProcessingError,
): string {
  switch (error.code) {
    case 'IMAGE_TOO_SMALL':
    case 'IMAGE_TOO_LARGE':
    case 'ANIMATED_IMAGE':
    case 'OUTPUT_TOO_LARGE':
      return error.message;
    case 'UNSUPPORTED_IMAGE':
      return 'El formato de la fotografía no está permitido.';
    default:
      return 'La fotografía está dañada o no se puede procesar.';
  }
}

export async function uploadPetPhotoAction(
  formData: FormData,
): Promise<PetPhotoActionState> {
  const petId = getString(formData, 'petId');
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
      message: 'La fotografía supera el límite de entrada de 8 MB.',
    };
  }

  const originalBytes = await file.arrayBuffer();
  const detectedMimeType = detectPetPhotoMimeType(originalBytes);

  if (!detectedMimeType) {
    return {
      status: 'error',
      message: 'El archivo no es una imagen JPEG, PNG o WebP válida.',
    };
  }

  let processed;

  try {
    processed = await processPetPhoto(originalBytes);
  } catch (error) {
    if (error instanceof PetPhotoProcessingError) {
      return {
        status: 'error',
        message: processingErrorMessage(error),
      };
    }

    logServerError('pet.photo.processing_failed', error, {
      petId,
      fileSizeBytes: file.size,
      detectedMimeType,
    });

    return {
      status: 'error',
      message: 'No se ha podido procesar la fotografía.',
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
      mimeType: processed.mimeType,
      bytes: processed.bytes,
      fileSizeBytes: processed.fileSizeBytes,
      width: processed.width,
      height: processed.height,
      altText,
      position: currentPhotos.length,
    });

    revalidatePath(`/mis-mascotas/${petId}`);
    revalidatePath('/mis-mascotas');

    return {
      status: 'success',
      message: `${file.name} se ha orientado, optimizado y subido correctamente.`,
      photoId,
    };
  } catch (error) {
    logServerError('pet.photo.upload_failed', error, {
      userId: user.id,
      petId,
      originalFileSizeBytes: file.size,
      processedFileSizeBytes: processed.fileSizeBytes,
      detectedMimeType,
      storedMimeType: processed.mimeType,
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
          message: 'La fotografía procesada supera el límite permitido.',
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
