import type { PetPhotoActionState } from '../types/pet-photo-action-state';

export interface PetPhotoBatchStatus {
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

interface UploadPetPhotoBatchOptions<Item> {
  items: readonly Item[];
  upload: (
    item: Item,
  ) => Promise<PetPhotoActionState>;
  onStatus: (
    item: Item,
    status: PetPhotoBatchStatus,
  ) => void;
  setUploading: (uploading: boolean) => void;
  unexpectedErrorMessage: string;
}

export async function uploadPetPhotoBatch<Item>({
  items,
  upload,
  onStatus,
  setUploading,
  unexpectedErrorMessage,
}: UploadPetPhotoBatchOptions<Item>): Promise<number> {
  let uploadedCount = 0;

  setUploading(true);

  try {
    for (const item of items) {
      onStatus(item, {
        status: 'uploading',
        message: undefined,
      });

      try {
        const result = await upload(item);
        const status =
          result.status === 'success'
            ? 'success'
            : 'error';

        if (status === 'success') {
          uploadedCount += 1;
        }

        onStatus(item, {
          status,
          message:
            result.message ??
            unexpectedErrorMessage,
        });
      } catch {
        onStatus(item, {
          status: 'error',
          message: unexpectedErrorMessage,
        });
      }
    }

    return uploadedCount;
  } finally {
    setUploading(false);
  }
}
