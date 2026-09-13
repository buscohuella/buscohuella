import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function ProfileBackLink({ label }: { label: string }) {
  return (
    <Link
      href="/perfil"
      className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
