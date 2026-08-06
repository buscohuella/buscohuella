'use server';

import {
  REPORT_LIMITS,
} from '@buscohuella/report-domain';
import type {
  Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

import { getServerTranslator } from '@/features/i18n/server';
import { detectPetPhotoMimeType } from '@/features/pets/lib/detect-photo-mime';
import {
  PetPhotoProcessingError,
  processPetPhoto,
} from '@/features/pets/lib/process-pet-photo';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import type {
  ReportPhotoActionState,
} from '../types/report-photo-action-state';

const REPORT_PHOTOS_BUCKET =
  'report-photos';

type RpcError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
} | null;

type SetPrimaryPhotoRpcResult = {
  data:
    | ReportDatabase['public']['Tables']['report_photos']['Row']
    | null;
  error: RpcError;
};

type ReorderPhotosRpcResult = {
  data:
    | ReportDatabase['public']['Tables']['report_photos']['Row'][]
    | null;
  error: RpcError;
};


type RecordPhotoUpdateRpcResult = {
  data: null;
  error: RpcError;
};

function getString(
  formData: FormData,
  name: string,
) {
  const value = formData.get(name);
  return typeof value === 'string'
    ? value.trim()
    : '';
}

function getReportClient(
  client: Awaited<
    ReturnType<typeof createClient>
  >,
) {
  return client as unknown as
    SupabaseClient<ReportDatabase>;
}

function getSetPrimaryRpc(
  client: SupabaseClient<ReportDatabase>,
) {
  return client.rpc.bind(
    client,
  ) as unknown as (
    functionName:
      'set_report_primary_photo',
    args: {
      target_photo_id: string;
    },
  ) => Promise<SetPrimaryPhotoRpcResult>;
}

function getReorderPhotosRpc(
  client: SupabaseClient<ReportDatabase>,
) {
  return client.rpc.bind(
    client,
  ) as unknown as (
    functionName:
      'reorder_report_photos',
    args: {
      target_report_id: string;
      ordered_photo_ids: string[];
    },
  ) => Promise<ReorderPhotosRpcResult>;
}


function getRecordPhotoUpdateRpc(
  client: SupabaseClient<ReportDatabase>,
) {
  return client.rpc.bind(
    client,
  ) as unknown as (
    functionName:
      'record_report_photo_update',
    args: {
      target_report_id: string;
      target_change: string;
    },
  ) => Promise<RecordPhotoUpdateRpcResult>;
}

async function recordPhotoUpdate(
  client: SupabaseClient<ReportDatabase>,
  reportId: string,
  change: string,
) {
  const rpc = getRecordPhotoUpdateRpc(client);
  const { error } = await rpc(
    'record_report_photo_update',
    {
      target_report_id: reportId,
      target_change: change,
    },
  );

  if (error) {
    logServerError(
      'report.photo.event_failed',
      error,
      { reportId, change },
    );
  }
}

async function verifyEditableOwnership(
  reportId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false as const,
      supabase,
      user: null,
    };
  }

  const reportClient =
    getReportClient(supabase);

  const { data: report, error } =
    await reportClient
      .from('reports')
      .select('id, status, created_by')
      .eq('id', reportId)
      .single();

  if (
    error ||
    !report ||
    report.created_by !== user.id ||
    !['DRAFT', 'ACTIVE', 'PAUSED'].includes(report.status)
  ) {
    return {
      ok: false as const,
      supabase,
      user,
    };
  }

  return {
    ok: true as const,
    supabase,
    reportClient,
    user,
  };
}

function processingMessage(
  error: PetPhotoProcessingError,
  translate: (key: string) => string,
) {
  if (
    error.code === 'IMAGE_TOO_SMALL' ||
    error.code === 'IMAGE_TOO_LARGE' ||
    error.code === 'OUTPUT_TOO_LARGE'
  ) {
    return error.message;
  }

  if (
    error.code === 'UNSUPPORTED_IMAGE'
  ) {
    return translate(
      'reports.photos.errors.unsupported',
    );
  }

  return translate(
    'reports.photos.errors.damaged',
  );
}

export async function uploadReportPhotoAction(
  _previousState: ReportPhotoActionState,
  formData: FormData,
): Promise<ReportPhotoActionState> {
  const { translate } =
    await getServerTranslator();
  const reportId = getString(
    formData,
    'reportId',
  );
  const altText =
    getString(formData, 'altText') ||
    null;
  const file = formData.get('photo');

  if (!reportId) {
    return {
      status: 'error',
      message: translate(
        'reports.photos.errors.reportMissing',
      ),
    };
  }

  if (
    !(file instanceof File) ||
    file.size === 0
  ) {
    return {
      status: 'error',
      message: translate(
        'reports.photos.errors.select',
      ),
    };
  }

  if (
    file.size >
    REPORT_LIMITS.photoMaxSizeBytes
  ) {
    return {
      status: 'error',
      message: translate(
        'reports.photos.errors.inputTooLarge',
      ),
    };
  }

  const ownership =
    await verifyEditableOwnership(reportId);

  if (!ownership.ok) {
    return {
      status: 'error',
      message: translate(
        'reports.photos.errors.forbidden',
      ),
    };
  }

  const { reportClient, user } =
    ownership;

  const { count } = await reportClient
    .from('report_photos')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('report_id', reportId);

  if (
    (count ?? 0) >=
    REPORT_LIMITS.reportPhotosMaxCount
  ) {
    return {
      status: 'error',
      message: translate(
        'reports.photos.errors.maxReached',
      ),
    };
  }

  const bytes = await file.arrayBuffer();
  const detected =
    detectPetPhotoMimeType(bytes);

  if (!detected) {
    return {
      status: 'error',
      message: translate(
        'reports.photos.errors.invalid',
      ),
    };
  }

  let processed;

  try {
    processed =
      await processPetPhoto(bytes);
  } catch (error) {
    if (
      error instanceof
      PetPhotoProcessingError
    ) {
      return {
        status: 'error',
        message: processingMessage(
          error,
          translate,
        ),
      };
    }

    logServerError(
      'report.photo.processing_failed',
      error,
      {
        reportId,
        originalSize: file.size,
      },
    );

    return {
      status: 'error',
      message: translate(
        'reports.photos.errors.processing',
      ),
    };
  }

  const photoId = crypto.randomUUID();
  const storagePath =
    `${user.id}/${reportId}/${photoId}.webp`;

  const { error: uploadError } =
    await ownership.supabase.storage
      .from(REPORT_PHOTOS_BUCKET)
      .upload(
        storagePath,
        processed.bytes,
        {
          contentType:
            processed.mimeType,
          cacheControl: '3600',
          upsert: false,
        },
      );

  if (uploadError) {
    logServerError(
      'report.photo.storage_upload_failed',
      uploadError,
      {
        userId: user.id,
        reportId,
      },
    );

    return {
      status: 'error',
      message: translate(
        'reports.photos.errors.upload',
      ),
    };
  }

  const { error: metadataError } =
    await reportClient
      .from('report_photos')
      .insert({
        id: photoId,
        report_id: reportId,
        storage_path: storagePath,
        position: count ?? 0,
        is_primary: (count ?? 0) === 0,
        alt_text: altText,
        mime_type: processed.mimeType,
        file_size_bytes:
          processed.fileSizeBytes,
        width: processed.width,
        height: processed.height,
      });

  if (metadataError) {
    await ownership.supabase.storage
      .from(REPORT_PHOTOS_BUCKET)
      .remove([storagePath]);

    logServerError(
      'report.photo.metadata_create_failed',
      metadataError,
      {
        userId: user.id,
        reportId,
      },
    );

    return {
      status: 'error',
      message: translate(
        'reports.photos.errors.upload',
      ),
    };
  }

  await recordPhotoUpdate(
    reportClient,
    reportId,
    'UPLOADED',
  );

  revalidatePath(
    `/mis-reportes/${reportId}/fotos`,
  );
  revalidatePath(
    `/mis-reportes/${reportId}`,
  );
  revalidatePath('/mis-reportes');
  revalidatePath('/reportes');

  return {
    status: 'success',
    message: translate(
      'reports.photos.uploadSuccess',
      { file: file.name },
    ),
  };
}

export async function deleteReportPhotoAction(
  formData: FormData,
) {
  const reportId = getString(
    formData,
    'reportId',
  );
  const photoId = getString(
    formData,
    'photoId',
  );

  const ownership =
    await verifyEditableOwnership(reportId);

  if (
    !ownership.ok ||
    !photoId
  ) {
    return;
  }

  const { data: photo } =
    await ownership.reportClient
      .from('report_photos')
      .select('*')
      .eq('id', photoId)
      .eq('report_id', reportId)
      .single();

  if (!photo) {
    return;
  }

  await ownership.supabase.storage
    .from(REPORT_PHOTOS_BUCKET)
    .remove([photo.storage_path]);

  await ownership.reportClient
    .from('report_photos')
    .delete()
    .eq('id', photoId)
    .eq('report_id', reportId);

  await recordPhotoUpdate(
    ownership.reportClient,
    reportId,
    'DELETED',
  );

  revalidatePath(
    `/mis-reportes/${reportId}/fotos`,
  );
  revalidatePath(
    `/mis-reportes/${reportId}`,
  );
  revalidatePath('/mis-reportes');
  revalidatePath('/reportes');
}

export async function setReportPrimaryPhotoAction(
  formData: FormData,
) {
  const reportId = getString(
    formData,
    'reportId',
  );
  const photoId = getString(
    formData,
    'photoId',
  );

  const ownership =
    await verifyEditableOwnership(reportId);

  if (
    !ownership.ok ||
    !photoId
  ) {
    return;
  }

  const rpc = getSetPrimaryRpc(
    ownership.reportClient,
  );

  const { error } = await rpc(
    'set_report_primary_photo',
    {
      target_photo_id: photoId,
    },
  );

  if (error) {
    logServerError(
      'report.photo.set_primary_failed',
      error,
      {
        userId: ownership.user.id,
        reportId,
        photoId,
      },
    );
    return;
  }

  await recordPhotoUpdate(
    ownership.reportClient,
    reportId,
    'PRIMARY_CHANGED',
  );

  revalidatePath(
    `/mis-reportes/${reportId}/fotos`,
  );
  revalidatePath(
    `/mis-reportes/${reportId}`,
  );
  revalidatePath('/mis-reportes');
  revalidatePath('/reportes');
}

export async function moveReportPhotoAction(
  formData: FormData,
) {
  const reportId = getString(
    formData,
    'reportId',
  );
  const photoId = getString(
    formData,
    'photoId',
  );
  const direction = getString(
    formData,
    'direction',
  );

  const ownership =
    await verifyEditableOwnership(reportId);

  if (
    !ownership.ok ||
    !photoId
  ) {
    return;
  }

  const { data: photos } =
    await ownership.reportClient
      .from('report_photos')
      .select('id')
      .eq('report_id', reportId)
      .order('position', {
        ascending: true,
      })
      .order('created_at', {
        ascending: true,
      });

  const ids = (photos ?? []).map(
    (photo) => photo.id,
  );
  const index = ids.indexOf(photoId);

  if (index < 0) {
    return;
  }

  const target =
    direction === 'LEFT'
      ? index - 1
      : index + 1;

  if (
    target < 0 ||
    target >= ids.length
  ) {
    return;
  }

  [ids[index], ids[target]] = [
    ids[target],
    ids[index],
  ];

  const rpc = getReorderPhotosRpc(
    ownership.reportClient,
  );

  const { error } = await rpc(
    'reorder_report_photos',
    {
      target_report_id: reportId,
      ordered_photo_ids: ids,
    },
  );

  if (error) {
    logServerError(
      'report.photo.reorder_failed',
      error,
      {
        userId: ownership.user.id,
        reportId,
        photoId,
        direction,
      },
    );
    return;
  }

  await recordPhotoUpdate(
    ownership.reportClient,
    reportId,
    'REORDERED',
  );

  revalidatePath(
    `/mis-reportes/${reportId}/fotos`,
  );
  revalidatePath(
    `/mis-reportes/${reportId}`,
  );
  revalidatePath('/mis-reportes');
  revalidatePath('/reportes');
}
