export type CreateLostReportDraftState =
  | {
      status: 'idle';
      message?: undefined;
      reportId?: undefined;
    }
  | {
      status: 'error';
      message: string;
      reportId?: undefined;
    }
  | {
      status: 'success';
      message: string;
      reportId: string;
    };

export const initialCreateLostReportDraftState:
  CreateLostReportDraftState = {
    status: 'idle',
  };
