export type ReportLifecycleState =
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

export const initialReportLifecycleState:
  ReportLifecycleState = {
    status: 'idle',
  };
