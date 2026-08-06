import {
  Pencil,
} from 'lucide-react';
import Link from 'next/link';

export function EditReportLink({
  reportId,
  label,
}: {
  reportId: string;
  label: string;
}) {
  return (
    <Link
      href={`/mis-reportes/${reportId}/editar`}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 font-semibold text-foreground hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
    >
      <Pencil
        className="size-4"
        aria-hidden="true"
      />
      {label}
    </Link>
  );
}
