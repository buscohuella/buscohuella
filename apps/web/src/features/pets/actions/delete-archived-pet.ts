'use server';

import { revalidatePath } from 'next/cache';
import {
  ArchivedPetDeletionError,
  deleteArchivedPetSafely,
} from '@buscohuella/pet-data';
import type { Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import type { PetActionState } from '../types/pet-action-state';

export async function deleteArchivedPetAction(
  _previousState: PetActionState,
  formData: FormData,
): Promise<PetActionState> {
  const { translate } = await getServerTranslator();
  const petId = formData.get('petId');
  if (typeof petId !== 'string' || !petId) return { status: 'error', message: translate('pets.result.petMissing') };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: 'error', message: translate('pets.result.sessionExpired') };

  try {
    const client = supabase as unknown as SupabaseClient<ReportDatabase>;
    const result = await deleteArchivedPetSafely(
      {
        async findOwnedPet(targetPetId, ownerId) {
          const { data, error } = await supabase
            .from('pets')
            .select('status')
            .eq('id', targetPetId)
            .eq('owner_id', ownerId)
            .maybeSingle();
          if (error) throw error;
          return data;
        },
        async hasBlockingDependencies(targetPetId) {
          const { count, error } = await client
            .from('reports')
            .select('id', { count: 'exact', head: true })
            .eq('pet_id', targetPetId);
          if (error) throw error;
          return (count ?? 0) > 0;
        },
        async listPhotoStoragePaths(targetPetId) {
          const { data, error } = await supabase
            .from('pet_photos')
            .select('storage_path')
            .eq('pet_id', targetPetId);
          if (error) throw error;
          return (data ?? []).map((photo) => photo.storage_path);
        },
        async removePhotoObjects(paths) {
          const { error } = await supabase.storage
            .from('pet-photos')
            .remove(paths);
          if (error) throw error;
        },
        async deleteArchivedPetRecord(targetPetId, ownerId) {
          const { data, error } = await supabase
            .from('pets')
            .delete()
            .eq('id', targetPetId)
            .eq('owner_id', ownerId)
            .eq('status', 'ARCHIVED')
            .select('id')
            .maybeSingle();
          if (error) throw error;
          return data !== null;
        },
      },
      { petId, ownerId: user.id },
    );

    if (result.status === 'not_found') {
      return { status: 'error', message: translate('pets.result.notAvailable') };
    }
    if (result.status === 'not_archived') {
      return { status: 'error', message: translate('pets.management.deleteOnlyArchived') };
    }
    if (result.status === 'blocked_by_dependencies') {
      return { status: 'error', message: translate('pets.management.deleteHasReports') };
    }

    revalidatePath('/mis-mascotas');
    return { status: 'success', message: translate('pets.management.deleteSuccess') };
  } catch (error) {
    if (error instanceof ArchivedPetDeletionError) {
      const event = error.stage === 'storage_cleanup'
        ? 'pet.delete_archived.storage_cleanup_failed'
        : 'pet.delete_archived.database_failed_after_storage_cleanup';
      logServerError(event, error, { userId: user.id, petId });

      return {
        status: 'error',
        message: translate(
          error.stage === 'storage_cleanup'
            ? 'pets.management.deleteStorageError'
            : 'pets.management.deleteDatabaseAfterStorageError',
        ),
      };
    }

    logServerError('pet.delete_archived.failed', error, { userId: user.id, petId });
    return { status: 'error', message: translate('pets.management.deleteError') };
  }
}
