export type ReportPhotoActionState =
  | {
      status: 'idle';
      message?: undefined;
    }
  | {
      status: 'success';
      message: string;
    }
  | {
      status: 'error';
      message: string;
    };

export const initialReportPhotoActionState:
  ReportPhotoActionState = {
    status: 'idle',
  };
