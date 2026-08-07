'use server';

import type {
  Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

import type {
  ArchiveSightingState,
} from '@/features/reports/types/archive-sighting-state';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

type ArchiveRpcResult = {
  data: boolean | null;
  error: {
    code?: string;
    message?: string;
  } | null;
};

function text(
  formData: FormData,
  key: string,
) {
  const value = formData.get(key);

  return typeof value === 'string'
    ? value.trim()
    : '';
}

export async function archiveOwnedSightingAction(
  _previous: ArchiveSightingState,
  formData: FormData,
): Promise<ArchiveSightingState> {
  const sightingId = text(
    formData,
    'sightingId',
  );
  const reportId = text(
    formData,
    'reportId',
  );
  const archived =
    text(formData, 'archived') ===
    'true';

  const operation = archived
    ? 'archive'
    : 'restore';

  if (!sightingId || !reportId) {
    return {
      status: 'error',
      operation,
    };
  }

  const supabase =
    await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      operation,
    };
  }

  const client =
    supabase as unknown as
      SupabaseClient<ReportDatabase>;
  const rpc =
    client.rpc.bind(
      client,
    ) as unknown as (
      name:
        'set_owned_sighting_archived',
      args: {
        target_sighting_id: string;
        target_archived: boolean;
      },
    ) => Promise<ArchiveRpcResult>;

  const { error } = await rpc(
    'set_owned_sighting_archived',
    {
      target_sighting_id:
        sightingId,
      target_archived: archived,
    },
  );

  if (error) {
    logServerError(
      'sighting.owner_archive.failed',
      error,
      {
        userId: user.id,
        sightingId,
        reportId,
        archived,
        errorCode: error.code,
        errorMessage: error.message,
      },
    );

    return {
      status: 'error',
      operation,
    };
  }

  revalidatePath('/avistamientos');
  revalidatePath(
    `/avistamientos/${sightingId}`,
  );
  revalidatePath(
    `/mis-reportes/${reportId}`,
  );

  return {
    status: 'success',
    operation,
  };
}
