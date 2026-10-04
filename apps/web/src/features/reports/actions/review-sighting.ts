'use server';

import type { Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

type ReviewStatus = 'ACCEPTED' | 'REJECTED' | 'FLAGGED';

function text(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

export async function reviewOwnedSightingAction(formData: FormData) {
  const sightingId = text(formData, 'sightingId');
  const reportId = text(formData, 'reportId');
  const status = text(formData, 'status') as ReviewStatus;

  if (!sightingId || !reportId || !['ACCEPTED', 'REJECTED', 'FLAGGED'].includes(status)) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const client = supabase as unknown as SupabaseClient<ReportDatabase>;

  const { error } = await client.rpc('review_owned_report_sighting', {
    target_sighting_id: sightingId,
    target_status: status,
  });

  if (error) {
    logServerError('sighting.owner_review.failed', error, {
      userId: user.id,
      sightingId,
      reportId,
      status,
      errorCode: error.code,
      errorMessage: error.message,
    });
    return;
  }

  revalidatePath('/avistamientos');
  revalidatePath(`/avistamientos/${sightingId}`);
  revalidatePath(`/mis-reportes/${reportId}`);
}
