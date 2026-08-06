'use server';

import { PetRepository } from '@buscohuella/pet-data';
import { PetDomainError } from '@buscohuella/pet-domain';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import type { PetActionState } from '../types/pet-action-state';

export async function archivePetAction(
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
    await repository.archivePet(petId);
  } catch (error) {
    logServerError(
      'pet.archive.failed',
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
            'pets.management.archiveForbidden',
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
        'pets.management.archiveError',
      ),
    };
  }

  revalidatePath('/mis-mascotas');
  redirect('/mis-mascotas?archived=1');
}
