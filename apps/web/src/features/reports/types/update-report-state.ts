export type UpdateReportState =
  | {
      status: 'idle';
      message?: undefined;
    }
  | {
      status: 'error';
      message: string;
    };

export const initialUpdateReportState:
  UpdateReportState = {
    status: 'idle',
  };
