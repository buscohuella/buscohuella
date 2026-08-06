export type PublishReportState =
  | {
      status: 'idle';
      message?: undefined;
    }
  | {
      status: 'error';
      message: string;
    }
  | {
      status: 'success';
      message: string;
    };

export const initialPublishReportState:
  PublishReportState = {
    status: 'idle',
  };
