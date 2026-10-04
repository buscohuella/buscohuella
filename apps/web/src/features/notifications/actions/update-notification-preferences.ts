'use server';

import type { Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createClient } from '@/services/supabase/server';

export async function updateNotificationPreferencesAction(
  inAppSightings: boolean,
  inAppReportUpdates: boolean,
) {
  const supabase = await createClient();
  const client = supabase as unknown as SupabaseClient<ReportDatabase>;
  const { data, error } = await client.rpc('update_my_notification_preferences', {
    target_in_app_sightings: inAppSightings,
    target_in_app_report_updates: inAppReportUpdates,
  });

  if (error || data !== true) {
    throw new Error(error?.message ?? 'notification-preferences-update-failed');
  }
}
