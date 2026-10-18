export type ReportPublishReadinessInput = {
  reportType: 'LOST_PET' | 'FOUND_ANIMAL';
  petId: string | null;
  speciesId: number;
  title: string | null;
  description: string | null;
  hasLocation: boolean;
};

export type ReportPublishReadiness = {
  hasAnimalIdentity: boolean;
  hasDescription: boolean;
  hasLocation: boolean;
  hasTitle: boolean;
  canPublish: boolean;
};

export function getReportPublishReadiness(
  report: ReportPublishReadinessInput,
): ReportPublishReadiness {
  const hasAnimalIdentity =
    report.reportType === 'LOST_PET'
      ? Boolean(report.petId)
      : report.petId === null && Number.isInteger(report.speciesId) && report.speciesId > 0;
  const hasTitle = Boolean(report.title?.trim());
  const hasDescription = Boolean(report.description && report.description.trim().length >= 10);

  return {
    hasAnimalIdentity,
    hasDescription,
    hasLocation: report.hasLocation,
    hasTitle,
    canPublish: hasAnimalIdentity && hasTitle && hasDescription && report.hasLocation,
  };
}
