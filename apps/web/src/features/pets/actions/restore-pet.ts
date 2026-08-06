'use server';

import { PetRepository } from '@buscohuella/pet-data';
import { PetDomainError } from '@buscohuella/pet-domain';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import type { PetActionState } from '../types/pet-action-state';

export async function restorePetAction(
  _previousState: PetActionState,
  formData: FormData,
): Promise<PetActionState> {
  const { translate } =
    await getServerTranslator();
  const petId = formData.get('petId');

  if (typeof petId !== 'string' || !petId) {
    return {
      status: 'error',
      message: translate(
        'pets.result.petMissing',
      ),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      message: translate(
        'pets.result.sessionExpired',
      ),
    };
  }

  try {
    const repository =
      new PetRepository(supabase);
    await repository.restorePet(petId);
  } catch (error) {
    logServerError(
      'pet.restore.failed',
      error,
      {
        userId: user.id,
        petId,
      },
    );

    if (error instanceof PetDomainError) {
      if (error.code === 'PET_FORBIDDEN') {
        return {
          status: 'error',
          message: translate(
            'pets.management.restoreForbidden',
          ),
        };
      }

      if (error.code === 'PET_NOT_FOUND') {
        return {
          status: 'error',
          message: translate(
            'pets.result.notAvailable',
          ),
        };
      }
    }

    return {
      status: 'error',
      message: translate(
        'pets.management.restoreError',
      ),
    };
  }

  revalidatePath('/mis-mascotas');
  revalidatePath(`/mis-mascotas/${petId}`);
  redirect(
    '/mis-mascotas?estado=activas&restored=1',
  );
}
