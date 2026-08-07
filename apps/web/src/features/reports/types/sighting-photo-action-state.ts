export type SightingPhotoActionState =
  | { status: 'idle'; message?: undefined }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

export const initialSightingPhotoActionState: SightingPhotoActionState = {
  status: 'idle',
};
