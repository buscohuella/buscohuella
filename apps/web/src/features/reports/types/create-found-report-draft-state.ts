export type CreateFoundReportDraftState =
  | {
      status: 'idle';
      message: null;
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

export const initialCreateFoundReportDraftState: CreateFoundReportDraftState = {
  status: 'idle',
  message: null,
};
