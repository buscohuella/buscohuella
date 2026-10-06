import type { Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createClient } from '@/services/supabase/server';

export type NotificationPreferences = {
  inAppSightings: boolean;
  inAppReportUpdates: boolean;
};

const defaults: NotificationPreferences = {
  inAppSightings: true,
  inAppReportUpdates: true,
};

export async function getMyNotificationPreferences(): Promise<NotificationPreferences> {
  const supabase = await createClient();
  const client = supabase as unknown as SupabaseClient<ReportDatabase>;
  const { data, error } = await client.rpc('get_my_notification_preferences');

  if (error) {
    // A deployment can briefly have the UI ahead of the database migration.
    // Keep the account area usable with privacy-safe defaults until the RPCs
    // are available; saving will report the configuration error.
    return defaults;
  }
  const row = data?.[0];
  return row
    ? { inAppSightings: row.in_app_sightings, inAppReportUpdates: row.in_app_report_updates }
    : defaults;
}
