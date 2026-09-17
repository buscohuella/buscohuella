import type { SupabaseClient } from '@supabase/supabase-js';

import type { ReportDatabaseWithSightingPhotos } from './sighting-photo-database';

export async function canUploadSightingPhoto(
  client: SupabaseClient<ReportDatabaseWithSightingPhotos>,
  sightingId: string,
): Promise<boolean> {
  const { data, error } = await client.rpc(
    'can_manage_sighting_photo_storage',
    { target_sighting_id: sightingId },
  );

  return !error && data === true;
}
