export type PublicTitleTranslator = (
  key: string,
  values?: Record<
    string,
    string | number | boolean
  >,
) => string;

export function getLocalizedPublicReportTitle({
  rawTitle,
  reportType,
  petName,
  translate,
}: {
  rawTitle: string;
  reportType: string;
  petName?: string | null;
  translate: PublicTitleTranslator;
}) {
  if (reportType !== 'LOST_PET') {
    return rawTitle;
  }

  const generatedName =
    petName ??
    rawTitle.match(
      /^(.*?) se ha perdido$/,
    )?.[1] ??
    rawTitle.match(
      /^(.*?) s'ha perdut$/,
    )?.[1];

  if (!generatedName) {
    return rawTitle;
  }

  const expectedTitles = new Set([
    `${generatedName} se ha perdido`,
    `${generatedName} s'ha perdut`,
  ]);

  if (!expectedTitles.has(rawTitle)) {
    return rawTitle;
  }

  return translate(
    'publicReport.generatedTitle.LOST_PET',
    { name: generatedName },
  );
}
