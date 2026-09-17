export type ArchivedReportDeletionResult =
  | {
      status: 'deleted';
      reportPhotoCount: number;
      sightingCount: number;
      sightingPhotoCount: number;
    }
  | { status: 'not_found' }
  | { status: 'not_archived' };

export type ArchivedReportDeletionFailureStage =
  | 'path_validation'
  | 'storage_cleanup'
  | 'database_cleanup_after_storage';

export class ArchivedReportDeletionError extends Error {
  readonly stage: ArchivedReportDeletionFailureStage;
  readonly cause?: unknown;

  constructor(stage: ArchivedReportDeletionFailureStage, cause?: unknown) {
    const messages: Record<ArchivedReportDeletionFailureStage, string> = {
      path_validation: 'Report photo storage path validation failed',
      storage_cleanup: 'Report photo storage cleanup failed',
      database_cleanup_after_storage:
        'Report database cleanup failed after storage cleanup',
    };

    super(messages[stage]);
    this.name = 'ArchivedReportDeletionError';
    this.stage = stage;
    this.cause = cause;
  }
}

export type ArchivedReportSighting = { id: string; createdBy: string };
export type ArchivedReportPhoto = { storagePath: string };
export type ArchivedReportSightingPhoto = {
  sightingId: string;
  storagePath: string;
};

export interface ArchivedReportDeletionOperations {
  findOwnedReport(
    reportId: string,
    ownerId: string,
  ): Promise<{ status: string } | null>;
  listSightings(reportId: string): Promise<ArchivedReportSighting[]>;
  listReportPhotos(reportId: string): Promise<ArchivedReportPhoto[]>;
  listSightingPhotos(
    sightingIds: string[],
  ): Promise<ArchivedReportSightingPhoto[]>;
  removeSightingPhotoObjects(paths: string[]): Promise<void>;
  removeReportPhotoObjects(paths: string[]): Promise<void>;
  finalizeArchivedReportDeletion(
    reportId: string,
    ownerId: string,
  ): Promise<boolean>;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_FILENAME_PATTERN =
  /^([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.(webp|jpg|png)$/i;
const STORAGE_REMOVE_BATCH_SIZE = 1000;
const SIGHTING_PHOTO_EXTENSIONS = new Set(['webp']);
const REPORT_PHOTO_EXTENSIONS = new Set(['webp', 'jpg', 'png']);

function isExactPhotoPath(
  path: string,
  expectedOwnerId: string,
  expectedParentId: string,
  allowedExtensions: ReadonlySet<string>,
): boolean {
  const segments = path.split('/');
  const filenameMatch = UUID_FILENAME_PATTERN.exec(segments[2] ?? '');

  return (
    segments.length === 3 &&
    segments[0] === expectedOwnerId &&
    segments[1] === expectedParentId &&
    UUID_PATTERN.test(segments[0]) &&
    UUID_PATTERN.test(segments[1]) &&
    filenameMatch !== null &&
    allowedExtensions.has(filenameMatch[2]?.toLowerCase() ?? '')
  );
}

function validatedUniquePaths(
  paths: Array<{
    storagePath: string;
    expectedOwnerId: string;
    expectedParentId: string;
    allowedExtensions: ReadonlySet<string>;
  }>,
): string[] {
  for (const path of paths) {
    if (
      !isExactPhotoPath(
        path.storagePath,
        path.expectedOwnerId,
        path.expectedParentId,
        path.allowedExtensions,
      )
    ) {
      throw new Error('PHOTO_STORAGE_PATH_INVALID');
    }
  }

  return [...new Set(paths.map((path) => path.storagePath))];
}

async function removeInBatches(
  paths: string[],
  remove: (batch: string[]) => Promise<void>,
): Promise<void> {
  for (
    let offset = 0;
    offset < paths.length;
    offset += STORAGE_REMOVE_BATCH_SIZE
  ) {
    await remove(paths.slice(offset, offset + STORAGE_REMOVE_BATCH_SIZE));
  }
}

export async function deleteArchivedReportSafely(
  operations: ArchivedReportDeletionOperations,
  input: { reportId: string; ownerId: string },
): Promise<ArchivedReportDeletionResult> {
  const report = await operations.findOwnedReport(input.reportId, input.ownerId);

  if (!report) return { status: 'not_found' };
  if (report.status !== 'ARCHIVED') return { status: 'not_archived' };

  const sightings = await operations.listSightings(input.reportId);
  const sightingIds = sightings.map((sighting) => sighting.id);
  const sightingPhotos =
    sightingIds.length > 0
      ? await operations.listSightingPhotos(sightingIds)
      : [];
  const reportPhotos = await operations.listReportPhotos(input.reportId);

  let sightingPhotoPaths: string[];
  let reportPhotoPaths: string[];

  try {
    const sightingAuthors = new Map(
      sightings.map((sighting) => [sighting.id, sighting.createdBy]),
    );

    sightingPhotoPaths = validatedUniquePaths(
      sightingPhotos.map((photo) => {
        const createdBy = sightingAuthors.get(photo.sightingId);

        if (!createdBy) throw new Error('SIGHTING_PHOTO_OUTSIDE_REPORT');

        return {
          storagePath: photo.storagePath,
          expectedOwnerId: createdBy,
          expectedParentId: photo.sightingId,
          allowedExtensions: SIGHTING_PHOTO_EXTENSIONS,
        };
      }),
    );
    reportPhotoPaths = validatedUniquePaths(
      reportPhotos.map((photo) => ({
        storagePath: photo.storagePath,
        expectedOwnerId: input.ownerId,
        expectedParentId: input.reportId,
        allowedExtensions: REPORT_PHOTO_EXTENSIONS,
      })),
    );
  } catch (error) {
    throw new ArchivedReportDeletionError('path_validation', error);
  }

  try {
    await removeInBatches(
      reportPhotoPaths,
      operations.removeReportPhotoObjects,
    );
    await removeInBatches(
      sightingPhotoPaths,
      operations.removeSightingPhotoObjects,
    );
  } catch (error) {
    throw new ArchivedReportDeletionError('storage_cleanup', error);
  }

  try {
    const deleted = await operations.finalizeArchivedReportDeletion(
      input.reportId,
      input.ownerId,
    );

    if (!deleted) throw new Error('Archived report was not deleted');
  } catch (error) {
    throw new ArchivedReportDeletionError(
      'database_cleanup_after_storage',
      error,
    );
  }

  return {
    status: 'deleted',
    reportPhotoCount: reportPhotoPaths.length,
    sightingCount: sightingIds.length,
    sightingPhotoCount: sightingPhotoPaths.length,
  };
}
