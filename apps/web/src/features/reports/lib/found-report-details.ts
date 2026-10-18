export type FoundAnimalCareStatus = 'IN_CARE' | 'LOCATED';

export function composeFoundAnimalDescription({
  description,
  careStatus,
  careHeading,
  momentHeading,
  momentLabel,
  inCareLabel,
  locatedLabel,
}: {
  description: string;
  careStatus: FoundAnimalCareStatus;
  careHeading: string;
  momentHeading: string;
  momentLabel: string;
  inCareLabel: string;
  locatedLabel: string;
}) {
  const careLabel = careStatus === 'IN_CARE' ? inCareLabel : locatedLabel;

  return [
    description.trim() || null,
    `${momentHeading}\n\u2022 ${momentLabel}`,
    `${careHeading}\n\u2022 ${careLabel}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}
