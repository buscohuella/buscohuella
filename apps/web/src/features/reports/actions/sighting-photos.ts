'use server';

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
import type {
  ReportDatabaseWithSightingPhotos,
} from '@/features/reports/lib/sighting-photo-database';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import type {
  SightingPhotoActionState,
} from '../types/sighting-photo-action-state';

const BUCKET = 'sighting-photos';
const MAX_PHOTOS = 5;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;

const text = (
  formData: FormData,
  name: string,
) => {
  const value = formData.get(name);

  return typeof value === 'string'
    ? value.trim()
    : '';
};

async function getOwnedSighting(
  sightingId: string,
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

  const client =
    supabase as unknown as
      SupabaseClient<ReportDatabaseWithSightingPhotos>;

  const { data: sighting, error } =
    await client
      .from('sightings')
      .select(
        'id, report_id, created_by',
      )
      .eq('id', sightingId)
      .eq('report_id', reportId)
      .eq('created_by', user.id)
      .single();

  if (error || !sighting) {
    return {
      ok: false as const,
      supabase,
      user,
    };
  }

  return {
    ok: true as const,
    supabase,
    client,
    user,
    sighting,
  };
}

function processingMessage(
  error: PetPhotoProcessingError,
  translate: (key: string) => string,
) {
  if (
    [
      'IMAGE_TOO_SMALL',
      'IMAGE_TOO_LARGE',
      'OUTPUT_TOO_LARGE',
    ].includes(error.code)
  ) {
    return error.message;
  }

  return translate(
    error.code === 'UNSUPPORTED_IMAGE'
      ? 'sightingPhotos.errors.unsupported'
      : 'sightingPhotos.errors.damaged',
  );
}

export async function uploadSightingPhotoAction(
  _previous: SightingPhotoActionState,
  formData: FormData,
): Promise<SightingPhotoActionState> {
  const { translate } =
    await getServerTranslator();

  const reportId = text(
    formData,
    'reportId',
  );
  const sightingId = text(
    formData,
    'sightingId',
  );
  const altText =
    text(formData, 'altText') ||
    null;
  const file = formData.get('photo');

  if (!reportId || !sightingId) {
    return {
      status: 'error',
      message: translate(
        'sightingPhotos.errors.missing',
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
        'sightingPhotos.errors.select',
      ),
    };
  }

  if (file.size > MAX_INPUT_BYTES) {
    return {
      status: 'error',
      message: translate(
        'sightingPhotos.errors.tooLarge',
      ),
    };
  }

  const ownership =
    await getOwnedSighting(
      sightingId,
      reportId,
    );

  if (!ownership.ok) {
    return {
      status: 'error',
      message: translate(
        'sightingPhotos.errors.forbidden',
      ),
    };
  }

  const { count } =
    await ownership.client
      .from('sighting_photos')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq(
        'sighting_id',
        sightingId,
      );

  if ((count ?? 0) >= MAX_PHOTOS) {
    return {
      status: 'error',
      message: translate(
        'sightingPhotos.errors.maxReached',
      ),
    };
  }

  const bytes =
    await file.arrayBuffer();

  if (!detectPetPhotoMimeType(bytes)) {
    return {
      status: 'error',
      message: translate(
        'sightingPhotos.errors.unsupported',
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
      'sighting.photo.processing_failed',
      error,
      {
        userId: ownership.user.id,
        reportId,
        sightingId,
      },
    );

    return {
      status: 'error',
      message: translate(
        'sightingPhotos.errors.processing',
      ),
    };
  }

  const photoId = crypto.randomUUID();
  const storagePath =
    `${ownership.user.id}/` +
    `${sightingId}/` +
    `${photoId}.webp`;

  const { error: uploadError } =
    await ownership.supabase.storage
      .from(BUCKET)
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
      'sighting.photo.storage_upload_failed',
      uploadError,
      {
        userId: ownership.user.id,
        reportId,
        sightingId,
      },
    );

    return {
      status: 'error',
      message: translate(
        'sightingPhotos.errors.upload',
      ),
    };
  }

  const { error: metadataError } =
    await ownership.client
      .from('sighting_photos')
      .insert({
        id: photoId,
        sighting_id: sightingId,
        storage_path: storagePath,
        position: count ?? 0,
        alt_text: altText,
        mime_type:
          processed.mimeType,
        file_size_bytes:
          processed.fileSizeBytes,
        width: processed.width,
        height: processed.height,
      });

  if (metadataError) {
    await ownership.supabase.storage
      .from(BUCKET)
      .remove([storagePath]);

    logServerError(
      'sighting.photo.metadata_create_failed',
      metadataError,
      {
        userId: ownership.user.id,
        reportId,
        sightingId,
      },
    );

    return {
      status: 'error',
      message: translate(
        'sightingPhotos.errors.upload',
      ),
    };
  }

  revalidatePath(
    `/reportes/${reportId}/` +
      `avistamiento/${sightingId}/fotos`,
  );

  return {
    status: 'success',
    message: translate(
      'sightingPhotos.uploadSuccess',
    ),
  };
}

export async function deleteSightingPhotoAction(
  formData: FormData,
) {
  const reportId = text(
    formData,
    'reportId',
  );
  const sightingId = text(
    formData,
    'sightingId',
  );
  const photoId = text(
    formData,
    'photoId',
  );

  if (
    !reportId ||
    !sightingId ||
    !photoId
  ) {
    return;
  }

  const ownership =
    await getOwnedSighting(
      sightingId,
      reportId,
    );

  if (!ownership.ok) {
    return;
  }

  const { data: photo } =
    await ownership.client
      .from('sighting_photos')
      .select(
        'id, storage_path',
      )
      .eq('id', photoId)
      .eq(
        'sighting_id',
        sightingId,
      )
      .single();

  if (!photo) {
    return;
  }

  await ownership.supabase.storage
    .from(BUCKET)
    .remove([photo.storage_path]);

  await ownership.client
    .from('sighting_photos')
    .delete()
    .eq('id', photoId)
    .eq(
      'sighting_id',
      sightingId,
    );

  revalidatePath(
    `/reportes/${reportId}/` +
      `avistamiento/${sightingId}/fotos`,
  );
}
