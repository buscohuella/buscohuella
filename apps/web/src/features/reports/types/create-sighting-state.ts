export type CreateSightingState =
  | { status: 'idle'; message?: undefined }
  | { status: 'error'; message: string };

export const initialCreateSightingState: CreateSightingState = { status: 'idle' };
