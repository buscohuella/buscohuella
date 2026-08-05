import {
  createPetPhotoMetadataSchema,
  reorderPetPhotosSchema,
  updatePetPhotoSchema,
  type CreatePetPhotoMetadataInput,
  type PetPhoto,
  type PetPhotoMimeType,
  type PetPhotoWithSignedUrl,
  type ReorderPetPhotosInput,
  type UpdatePetPhotoInput,
} from '@buscohuella/pet-domain';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types.js';
import { normalizePetDataError } from './errors.js';
import { mapPetPhotoRow } from './mappers.js';
import {
  PET_PHOTOS_BUCKET,
  buildPetPhotoStoragePath,
} from './photo-storage.js';

const DEFAULT_SIGNED_URL_TTL_SECONDS = 60 * 10;

type PetPhotoRow = Database['public']['Tables']['pet_photos']['Row'];

type SetPrimaryRpcResult = {
  data: PetPhotoRow | null;
  error: {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  } | null;
};

type ReorderRpcResult = {
  data: PetPhotoRow[] | null;
  error: {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  } | null;
};

export class PetPhotoRepository {
  constructor(
    private readonly client: SupabaseClient<Database>,
  ) {}

  async listPetPhotos(petId: string): Promise<PetPhoto[]> {
    const { data, error } = await this.client
      .from('pet_photos')
      .select('*')
      .eq('pet_id', petId)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw normalizePetDataError(error);

    return (data ?? []).map(mapPetPhotoRow);
  }

  async listPetPhotosWithSignedUrls(
    petId: string,
    expiresIn = DEFAULT_SIGNED_URL_TTL_SECONDS,
  ): Promise<PetPhotoWithSignedUrl[]> {
    const photos = await this.listPetPhotos(petId);

    if (!photos.length) return [];

    const { data, error } = await this.client.storage
      .from(PET_PHOTOS_BUCKET)
      .createSignedUrls(
        photos.map((photo) => photo.storagePath),
        expiresIn,
      );

    if (error) throw normalizePetDataError(error);

    return photos.map((photo, index) => {
      const signed = data[index];

      if (!signed?.signedUrl) {
        throw normalizePetDataError(
          { message: 'Missing signed URL for pet photo' },
          'PET_UNKNOWN',
        );
      }

      return {
        ...photo,
        signedUrl: signed.signedUrl,
      };
    });
  }

  async createMetadata(
    input: CreatePetPhotoMetadataInput,
  ): Promise<PetPhoto> {
    const parsed = createPetPhotoMetadataSchema.parse(input);

    const { data, error } = await this.client
      .from('pet_photos')
      .insert({
        id: parsed.id,
        pet_id: parsed.petId,
        storage_path: parsed.storagePath,
        position: parsed.position,
        is_primary: parsed.isPrimary,
        visibility: parsed.visibility,
        alt_text: parsed.altText ?? null,
        mime_type: parsed.mimeType,
        file_size_bytes: parsed.fileSizeBytes,
        width: parsed.width,
        height: parsed.height,
      })
      .select('*')
      .single();

    if (error) throw normalizePetDataError(error);

    return mapPetPhotoRow(data);
  }

  async uploadPhoto(input: {
    ownerId: string;
    petId: string;
    photoId: string;
    mimeType: PetPhotoMimeType;
    bytes: ArrayBuffer;
    fileSizeBytes: number;
    width: number;
    height: number;
    altText?: string | null;
    position?: number;
  }): Promise<PetPhoto> {
    const storagePath = buildPetPhotoStoragePath(input);

    const { error: uploadError } = await this.client.storage
      .from(PET_PHOTOS_BUCKET)
      .upload(storagePath, input.bytes, {
        contentType: input.mimeType,
        upsert: false,
        cacheControl: '3600',
      });

    if (uploadError) {
      throw normalizePetDataError(uploadError);
    }

    try {
      return await this.createMetadata({
        id: input.photoId,
        petId: input.petId,
        storagePath,
        position: input.position ?? 0,
        isPrimary: false,
        visibility: 'PRIVATE',
        altText: input.altText ?? null,
        mimeType: input.mimeType,
        fileSizeBytes: input.fileSizeBytes,
        width: input.width,
        height: input.height,
      });
    } catch (error) {
      await this.client.storage
        .from(PET_PHOTOS_BUCKET)
        .remove([storagePath]);

      throw error;
    }
  }

  async updatePhoto(
    photoId: string,
    input: UpdatePetPhotoInput,
  ): Promise<PetPhoto> {
    const parsed = updatePetPhotoSchema.parse(input);

    const update: Database['public']['Tables']['pet_photos']['Update'] = {};

    if (parsed.altText !== undefined) {
      update.alt_text = parsed.altText;
    }

    if (parsed.visibility !== undefined) {
      update.visibility = parsed.visibility;
    }

    const { data, error } = await this.client
      .from('pet_photos')
      .update(update)
      .eq('id', photoId)
      .select('*')
      .single();

    if (error) {
      throw normalizePetDataError(error, 'PET_NOT_FOUND');
    }

    return mapPetPhotoRow(data);
  }

  async setPrimaryPhoto(photoId: string): Promise<PetPhoto> {
    const rpc = this.client.rpc.bind(this.client) as unknown as (
      functionName: string,
      args: { target_photo_id: string },
    ) => Promise<SetPrimaryRpcResult>;

    const { data, error } = await rpc('set_pet_primary_photo', {
      target_photo_id: photoId,
    });

    if (error || !data) {
      throw normalizePetDataError(
        error ?? { message: 'Pet photo not found' },
        'PET_NOT_FOUND',
      );
    }

    return mapPetPhotoRow(data);
  }

  async reorderPhotos(
    input: ReorderPetPhotosInput,
  ): Promise<PetPhoto[]> {
    const parsed = reorderPetPhotosSchema.parse(input);

    const rpc = this.client.rpc.bind(this.client) as unknown as (
      functionName: string,
      args: {
        target_pet_id: string;
        ordered_photo_ids: string[];
      },
    ) => Promise<ReorderRpcResult>;

    const { data, error } = await rpc('reorder_pet_photos', {
      target_pet_id: parsed.petId,
      ordered_photo_ids: parsed.photoIds,
    });

    if (error || !data) {
      throw normalizePetDataError(
        error ?? { message: 'PET_PHOTO_ORDER_MISMATCH' },
        'PET_FORBIDDEN',
      );
    }

    return data.map(mapPetPhotoRow);
  }

  async deletePhoto(photoId: string): Promise<void> {
    const { data: photo, error: selectError } = await this.client
      .from('pet_photos')
      .select('*')
      .eq('id', photoId)
      .single();

    if (selectError || !photo) {
      throw normalizePetDataError(
        selectError ?? { message: 'Pet photo not found' },
        'PET_NOT_FOUND',
      );
    }

    const { error: storageError } = await this.client.storage
      .from(PET_PHOTOS_BUCKET)
      .remove([photo.storage_path]);

    if (storageError) {
      throw normalizePetDataError(storageError);
    }

    const { error: deleteError } = await this.client
      .from('pet_photos')
      .delete()
      .eq('id', photoId);

    if (deleteError) {
      throw normalizePetDataError(deleteError);
    }
  }
}
