'use server';

import { PetDomainError } from '@buscohuella/pet-domain';
import { PetRepository } from '@buscohuella/pet-data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import type { PetActionState } from '../types/pet-action-state';

export async function restorePetAction(
  _previousState: PetActionState,
  formData: FormData,
): Promise<PetActionState> {
  const petId = formData.get('petId');

  if (typeof petId !== 'string' || !petId) {
    return {
      status: 'error',
      message: 'No se ha podido identificar la mascota.',
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

  try {
    const repository = new PetRepository(supabase);
    await repository.restorePet(petId);
  } catch (error) {
    logServerError('pet.restore.failed', error, {
      userId: user.id,
      petId,
    });

    if (error instanceof PetDomainError) {
      if (error.code === 'PET_FORBIDDEN') {
        return {
          status: 'error',
          message: 'No tienes permisos para restaurar esta mascota.',
        };
      }

      if (error.code === 'PET_NOT_FOUND') {
        return {
          status: 'error',
          message: 'La mascota ya no está disponible.',
        };
      }
    }

    return {
      status: 'error',
      message: 'No se ha podido restaurar la mascota.',
    };
  }

  revalidatePath('/mis-mascotas');
  revalidatePath(`/mis-mascotas/${petId}`);
  redirect('/mis-mascotas?estado=activas&restored=1');
}
