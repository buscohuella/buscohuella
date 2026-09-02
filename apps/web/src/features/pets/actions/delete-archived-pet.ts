'use server';

import { revalidatePath } from 'next/cache';
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
    const { data: pet, error: petError } = await supabase.from('pets').select('id, status').eq('id', petId).eq('owner_id', user.id).single();
    if (petError || !pet) return { status: 'error', message: translate('pets.result.notAvailable') };
    if (pet.status !== 'ARCHIVED') return { status: 'error', message: translate('pets.management.deleteOnlyArchived') };

    const { count, error: reportsError } = await client.from('reports').select('id', { count: 'exact', head: true }).eq('pet_id', petId);
    if (reportsError) throw reportsError;
    if ((count ?? 0) > 0) return { status: 'error', message: translate('pets.management.deleteHasReports') };

    const { data: photos, error: photosError } = await supabase.from('pet_photos').select('storage_path').eq('pet_id', petId);
    if (photosError) throw photosError;
    const paths = (photos ?? []).map((photo) => photo.storage_path);
    const { error: deleteError } = await supabase.from('pets').delete().eq('id', petId).eq('owner_id', user.id).eq('status', 'ARCHIVED');
    if (deleteError) throw deleteError;
    if (paths.length > 0) {
      const { error: storageError } = await supabase.storage.from('pet-photos').remove(paths);
      if (storageError) logServerError('pet.delete_archived.storage_cleanup_failed', storageError, { userId: user.id, petId });
    }
    revalidatePath('/mis-mascotas');
    return { status: 'success', message: translate('pets.management.deleteSuccess') };
  } catch (error) {
    logServerError('pet.delete_archived.failed', error, { userId: user.id, petId });
    return { status: 'error', message: translate('pets.management.deleteError') };
  }
}
