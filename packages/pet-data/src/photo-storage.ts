import type {
  PetPhotoMimeType,
  PetPhotoUploadDescriptor,
} from '@buscohuella/pet-domain';

const MIME_EXTENSION: Record<PetPhotoMimeType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const PET_PHOTOS_BUCKET = 'pet-photos';

export function buildPetPhotoStoragePath(
  descriptor: PetPhotoUploadDescriptor,
): string {
  const { ownerId, petId, photoId, mimeType } = descriptor;

  for (const [field, value] of Object.entries({
    ownerId,
    petId,
    photoId,
  })) {
    if (!UUID_PATTERN.test(value)) {
      throw new Error(`Invalid UUID for ${field}`);
    }
  }

  return `${ownerId}/${petId}/${photoId}.${MIME_EXTENSION[mimeType]}`;
}
