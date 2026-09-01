'use server';

import type { Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import type { ReportLifecycleState } from '../types/report-lifecycle-state';

export async function deleteArchivedReportAction(
  _previousState: ReportLifecycleState,
  formData: FormData,
): Promise<ReportLifecycleState> {
  const { translate } = await getServerTranslator();
  const reportId = formData.get('reportId');

  if (typeof reportId !== 'string' || !reportId) {
    return { status: 'error', message: translate('reports.detail.errors.notFound') };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { status: 'error', message: translate('reports.detail.errors.session') };
  }

  const client = supabase as unknown as SupabaseClient<ReportDatabase>;
  try {
    const { data: report, error: reportError } = await client
      .from('reports')
      .select('id, status, created_by')
      .eq('id', reportId)
      .eq('created_by', user.id)
      .single();
    if (reportError || !report) {
      return { status: 'error', message: translate('reports.detail.errors.notFound') };
    }
    if (report.status !== 'ARCHIVED') {
      return { status: 'error', message: translate('reports.detail.errors.deleteOnlyArchived') };
    }

    const { count: sightingsCount, error: sightingsError } = await client
      .from('sightings')
      .select('id', { count: 'exact', head: true })
      .eq('report_id', reportId);
    if (sightingsError) throw sightingsError;
    if ((sightingsCount ?? 0) > 0) {
      return { status: 'error', message: translate('reports.detail.errors.deleteHasSightings') };
    }

    const { data: photos, error: photosError } = await client
      .from('report_photos')
      .select('storage_path')
      .eq('report_id', reportId);
    if (photosError) throw photosError;
    const paths = (photos ?? []).map((photo) => photo.storage_path);
    if (paths.length > 0) {
      const { error: storageError } = await supabase.storage.from('report-photos').remove(paths);
      if (storageError) throw storageError;
    }

    const { error: eventsError } = await client.from('report_events').delete().eq('report_id', reportId);
    if (eventsError) throw eventsError;
    const { error: deleteError } = await client.from('reports').delete().eq('id', reportId).eq('status', 'ARCHIVED');
    if (deleteError) throw deleteError;

    revalidatePath('/mis-reportes');
    return { status: 'success', message: translate('reports.detail.success.DELETE') };
  } catch (error) {
    logServerError('report.delete_archived.failed', error, { userId: user.id, reportId });
    return { status: 'error', message: translate('reports.detail.errors.deleteGeneric') };
  }
}
