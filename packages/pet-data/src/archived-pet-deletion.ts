export type ArchivedPetDeletionResult =
  | { status: 'deleted'; photoCount: number }
  | { status: 'not_found' }
  | { status: 'not_archived' }
  | { status: 'blocked_by_dependencies' };

export type ArchivedPetDeletionFailureStage =
  | 'storage_cleanup'
  | 'database_delete_after_storage';

export class ArchivedPetDeletionError extends Error {
  readonly stage: ArchivedPetDeletionFailureStage;
  readonly cause?: unknown;

  constructor(stage: ArchivedPetDeletionFailureStage, cause?: unknown) {
    super(
      stage === 'storage_cleanup'
        ? 'Pet photo storage cleanup failed'
        : 'Pet database deletion failed after storage cleanup',
    );
    this.name = 'ArchivedPetDeletionError';
    this.stage = stage;
    this.cause = cause;
  }
}

export interface ArchivedPetDeletionOperations {
  findOwnedPet(
    petId: string,
    ownerId: string,
  ): Promise<{ status: string } | null>;
  hasBlockingDependencies(petId: string): Promise<boolean>;
  listPhotoStoragePaths(petId: string): Promise<string[]>;
  removePhotoObjects(paths: string[]): Promise<void>;
  deleteArchivedPetRecord(petId: string, ownerId: string): Promise<boolean>;
}

export async function deleteArchivedPetSafely(
  operations: ArchivedPetDeletionOperations,
  input: { petId: string; ownerId: string },
): Promise<ArchivedPetDeletionResult> {
  const pet = await operations.findOwnedPet(input.petId, input.ownerId);

  if (!pet) return { status: 'not_found' };
  if (pet.status !== 'ARCHIVED') return { status: 'not_archived' };

  if (await operations.hasBlockingDependencies(input.petId)) {
    return { status: 'blocked_by_dependencies' };
  }

  const storagePaths = await operations.listPhotoStoragePaths(input.petId);

  if (storagePaths.length > 0) {
    try {
      await operations.removePhotoObjects(storagePaths);
    } catch (error) {
      throw new ArchivedPetDeletionError('storage_cleanup', error);
    }
  }

  try {
    const deleted = await operations.deleteArchivedPetRecord(
      input.petId,
      input.ownerId,
    );

    if (!deleted) {
      throw new Error('Archived pet was not deleted');
    }
  } catch (error) {
    throw new ArchivedPetDeletionError(
      'database_delete_after_storage',
      error,
    );
  }

  return { status: 'deleted', photoCount: storagePaths.length };
}
