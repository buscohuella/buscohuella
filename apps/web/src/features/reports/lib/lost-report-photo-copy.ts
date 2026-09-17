export type PetPhotoCopySource = {
  storagePath: string;
  position: number;
  isPrimary: boolean;
  altText: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  width: number | null;
  height: number | null;
};

export type ReportPhotoCopyMetadata = {
  id: string;
  reportId: string;
  storagePath: string;
  position: number;
  isPrimary: boolean;
  altText: string | null;
  mimeType: string;
  fileSizeBytes: number;
  width: number | null;
  height: number | null;
};

type PhotoCopyCleanupStage =
  | 'storage'
  | 'metadata';

type DraftRollbackStage =
  | 'close'
  | 'archive'
  | 'database';

export class PetPhotoCopyError extends Error {
  readonly cleanupCompleted: boolean;

  constructor(
    cause: unknown,
    cleanupCompleted: boolean,
  ) {
    super('Pet photo copy failed', {
      cause,
    });
    this.name = 'PetPhotoCopyError';
    this.cleanupCompleted =
      cleanupCompleted;
  }
}

function photoExtension(
  mimeType: string,
) {
  if (mimeType === 'image/jpeg') {
    return 'jpg';
  }

  if (mimeType === 'image/png') {
    return 'png';
  }

  return 'webp';
}

async function cleanupCopiedPhotos({
  uploadedPaths,
  insertedPhotoIds,
  removeReportPhotos,
  deleteReportPhotoMetadata,
  onCleanupFailure,
}: {
  uploadedPaths: string[];
  insertedPhotoIds: string[];
  removeReportPhotos: (
    paths: string[],
  ) => Promise<void>;
  deleteReportPhotoMetadata: (
    ids: string[],
  ) => Promise<void>;
  onCleanupFailure: (
    stage: PhotoCopyCleanupStage,
    error: unknown,
  ) => void;
}) {
  if (uploadedPaths.length > 0) {
    try {
      await removeReportPhotos(
        uploadedPaths,
      );
    } catch (error) {
      onCleanupFailure(
        'storage',
        error,
      );
      return false;
    }
  }

  if (insertedPhotoIds.length > 0) {
    try {
      await deleteReportPhotoMetadata(
        insertedPhotoIds,
      );
    } catch (error) {
      onCleanupFailure(
        'metadata',
        error,
      );
      return false;
    }
  }

  return true;
}

export async function copyPetPhotosToReport({
  userId,
  petId,
  reportId,
  listPetPhotos,
  downloadPetPhoto,
  uploadReportPhoto,
  insertReportPhotoMetadata,
  removeReportPhotos,
  deleteReportPhotoMetadata,
  generatePhotoId,
  onCleanupFailure,
}: {
  userId: string;
  petId: string;
  reportId: string;
  listPetPhotos: (
    petId: string,
  ) => Promise<PetPhotoCopySource[]>;
  downloadPetPhoto: (
    storagePath: string,
  ) => Promise<Blob>;
  uploadReportPhoto: (input: {
    storagePath: string;
    file: Blob;
    mimeType: string;
  }) => Promise<void>;
  insertReportPhotoMetadata: (
    metadata: ReportPhotoCopyMetadata,
  ) => Promise<void>;
  removeReportPhotos: (
    paths: string[],
  ) => Promise<void>;
  deleteReportPhotoMetadata: (
    ids: string[],
  ) => Promise<void>;
  generatePhotoId: () => string;
  onCleanupFailure: (
    stage: PhotoCopyCleanupStage,
    error: unknown,
  ) => void;
}) {
  const uploadedPaths: string[] = [];
  const insertedPhotoIds: string[] = [];

  try {
    const petPhotos =
      await listPetPhotos(petId);
    const explicitPrimaryIndex =
      petPhotos.findIndex(
        (photo) => photo.isPrimary,
      );
    const primaryIndex =
      explicitPrimaryIndex >= 0
        ? explicitPrimaryIndex
        : 0;

    for (const [index, petPhoto] of
      petPhotos.entries()) {
      const file = await downloadPetPhoto(
        petPhoto.storagePath,
      );
      const photoId = generatePhotoId();
      const mimeType =
        petPhoto.mimeType ??
        'image/webp';
      const storagePath =
        `${userId}/${reportId}/${photoId}.${photoExtension(mimeType)}`;

      await uploadReportPhoto({
        storagePath,
        file,
        mimeType,
      });
      uploadedPaths.push(storagePath);
      insertedPhotoIds.push(photoId);

      await insertReportPhotoMetadata({
        id: photoId,
        reportId,
        storagePath,
        position: petPhoto.position,
        isPrimary: index === primaryIndex,
        altText: petPhoto.altText,
        mimeType,
        fileSizeBytes:
          petPhoto.fileSizeBytes ??
          file.size,
        width: petPhoto.width,
        height: petPhoto.height,
      });
    }
  } catch (error) {
    const cleanupCompleted =
      await cleanupCopiedPhotos({
        uploadedPaths,
        insertedPhotoIds,
        removeReportPhotos,
        deleteReportPhotoMetadata,
        onCleanupFailure,
      });

    throw new PetPhotoCopyError(
      error,
      cleanupCompleted,
    );
  }
}

export async function rollbackFailedDraft({
  closeDraft,
  archiveDraft,
  finalizeArchivedReportDeletion,
  onRollbackFailure,
}: {
  closeDraft: () => Promise<void>;
  archiveDraft: () => Promise<void>;
  finalizeArchivedReportDeletion: () => Promise<void>;
  onRollbackFailure: (
    stage: DraftRollbackStage,
    error: unknown,
  ) => void;
}) {
  const steps: ReadonlyArray<{
    stage: DraftRollbackStage;
    run: () => Promise<void>;
  }> = [
    { stage: 'close', run: closeDraft },
    { stage: 'archive', run: archiveDraft },
    {
      stage: 'database',
      run: finalizeArchivedReportDeletion,
    },
  ];

  for (const step of steps) {
    try {
      await step.run();
    } catch (error) {
      onRollbackFailure(
        step.stage,
        error,
      );
      return false;
    }
  }

  return true;
}

export async function createDraftWithOptionalPetPhotos({
  usePetPhotos,
  createDraft,
  copyPetPhotos,
  rollbackDraft,
}: {
  usePetPhotos: boolean;
  createDraft: () => Promise<string>;
  copyPetPhotos: (
    reportId: string,
  ) => Promise<void>;
  rollbackDraft: (
    reportId: string,
  ) => Promise<boolean>;
}) {
  const reportId = await createDraft();

  if (!usePetPhotos) {
    return reportId;
  }

  try {
    await copyPetPhotos(reportId);
  } catch (error) {
    if (
      error instanceof PetPhotoCopyError &&
      error.cleanupCompleted
    ) {
      await rollbackDraft(reportId);
    }

    throw error;
  }

  return reportId;
}
