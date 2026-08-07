export type ArchiveSightingState =
  | {
      status: 'idle';
      operation?: undefined;
    }
  | {
      status: 'success';
      operation: 'archive' | 'restore';
    }
  | {
      status: 'error';
      operation: 'archive' | 'restore';
    };

export const initialArchiveSightingState: ArchiveSightingState = {
  status: 'idle',
};
