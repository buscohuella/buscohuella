import type { ReportStatus } from './types.js';

export const REPORT_STATUS_TRANSITIONS: Readonly<
  Record<ReportStatus, readonly ReportStatus[]>
> = {
  DRAFT: ['ACTIVE', 'CLOSED'],
  ACTIVE: ['PAUSED', 'RESOLVED', 'CLOSED'],
  PAUSED: ['ACTIVE', 'RESOLVED', 'CLOSED'],
  RESOLVED: ['ARCHIVED'],
  CLOSED: ['ARCHIVED'],
  ARCHIVED: [],
};

export const canTransitionReportStatus = (
  from: ReportStatus,
  to: ReportStatus,
): boolean => REPORT_STATUS_TRANSITIONS[from].includes(to);

export const assertReportStatusTransition = (
  from: ReportStatus,
  to: ReportStatus,
): void => {
  if (!canTransitionReportStatus(from, to)) {
    throw new ReportDomainError(
      'REPORT_STATUS_TRANSITION_INVALID',
      `Invalid report status transition: ${from} -> ${to}`,
    );
  }
};

export class ReportDomainError extends Error {
  constructor(
    public readonly code: string,
    message = code,
  ) {
    super(message);
    this.name = 'ReportDomainError';
  }
}
