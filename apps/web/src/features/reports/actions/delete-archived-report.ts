'use server';

import {
  ArchivedReportDeletionError,
  deleteArchivedReportSafely,
  type Database as ReportDatabase,
} from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { finalizeArchivedReportDeletion as finalizeArchivedReportDeletionInDatabase } from '@/services/database/report-cleanup';
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
    const result = await deleteArchivedReportSafely(
      {
        async findOwnedReport(targetReportId, ownerId) {
          const { data, error } = await client
            .from('reports')
            .select('status')
            .eq('id', targetReportId)
            .eq('created_by', ownerId)
            .maybeSingle();
          if (error) throw error;
          return data;
        },
        async listSightings(targetReportId) {
          const { data, error } = await client
            .from('sightings')
            .select('id, created_by')
            .eq('report_id', targetReportId);
          if (error) throw error;
          return (data ?? []).map((sighting) => ({
            id: sighting.id,
            createdBy: sighting.created_by,
          }));
        },
        async listReportPhotos(targetReportId) {
          const { data, error } = await client
            .from('report_photos')
            .select('storage_path')
            .eq('report_id', targetReportId);
          if (error) throw error;
          return (data ?? []).map((photo) => ({
            storagePath: photo.storage_path,
          }));
        },
        async listSightingPhotos(sightingIds) {
          const { data, error } = await client
            .from('sighting_photos')
            .select('sighting_id, storage_path')
            .in('sighting_id', sightingIds);
          if (error) throw error;
          return (data ?? []).map((photo) => ({
            sightingId: photo.sighting_id,
            storagePath: photo.storage_path,
          }));
        },
        async removeSightingPhotoObjects(paths) {
          const { error } = await supabase.storage
            .from('sighting-photos')
            .remove(paths);
          if (error) throw error;
        },
        async removeReportPhotoObjects(paths) {
          const { error } = await supabase.storage
            .from('report-photos')
            .remove(paths);
          if (error) throw error;
        },
        async finalizeArchivedReportDeletion(targetReportId, ownerId) {
          return finalizeArchivedReportDeletionInDatabase(
            targetReportId,
            ownerId,
          );
        },
      },
      { reportId, ownerId: user.id },
    );

    if (result.status === 'not_found') {
      return { status: 'error', message: translate('reports.detail.errors.notFound') };
    }
    if (result.status === 'not_archived') {
      return { status: 'error', message: translate('reports.detail.errors.deleteOnlyArchived') };
    }

    revalidatePath('/mis-reportes');
    return { status: 'success', message: translate('reports.detail.success.DELETE') };
  } catch (error) {
    if (error instanceof ArchivedReportDeletionError) {
      const event = error.stage === 'path_validation'
        ? 'report.delete_archived.path_validation_failed'
        : error.stage === 'storage_cleanup'
          ? 'report.delete_archived.storage_cleanup_failed'
          : 'report.delete_archived.database_failed_after_storage_cleanup';
      logServerError(event, error, { userId: user.id, reportId });
      return { status: 'error', message: translate('reports.detail.errors.deleteGeneric') };
    }

    logServerError('report.delete_archived.failed', error, { userId: user.id, reportId });
    return { status: 'error', message: translate('reports.detail.errors.deleteGeneric') };
  }
}
