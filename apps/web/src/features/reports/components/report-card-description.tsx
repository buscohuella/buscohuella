export function ReportCardDescription({
  description,
}: {
  description: string;
}) {
  const marker = [
    'Detalles importantes:',
    'Detalls importants:',
  ].find((candidate) =>
    description.includes(candidate),
  );

  if (!marker) {
    return (
      <p className="line-clamp-4 whitespace-pre-wrap text-sm text-muted-foreground">
        {description}
      </p>
    );
  }

  const [summary, details] =
    description.split(marker, 2);

  return (
    <div className="space-y-3 text-sm text-muted-foreground">
      <p className="whitespace-pre-wrap">
        {summary.trim()}
      </p>
      <div className="border-t border-border-soft pt-3">
        <p className="font-semibold text-foreground">
          {marker.replace(':', '')}
        </p>
        <p className="mt-1 whitespace-pre-wrap">
          {details.trim()}
        </p>
      </div>
    </div>
  );
}
