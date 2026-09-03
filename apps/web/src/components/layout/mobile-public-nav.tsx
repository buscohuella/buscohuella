'use client';

import { Menu, Map, ScrollText, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function MobilePublicNav({
  label,
  mapLabel,
  reportsLabel,
}: {
  label: string;
  mapLabel: string;
  reportsLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mr-1 md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-public-navigation"
        onClick={() => setOpen((current) => !current)}
        title={label}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border-soft bg-surface-elevated text-muted-foreground shadow-[var(--shadow-sm)] transition-[background-color,color,box-shadow] hover:bg-surface-hover hover:text-foreground hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
      >
        <span className="sr-only">{label}</span>
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      {open ? (
        <nav id="mobile-public-navigation" className="absolute right-0 top-full z-50 grid w-56 gap-1 rounded-xl border border-border bg-surface-elevated p-2 shadow-[var(--shadow-lg)]" aria-label={label}>
          <Link href="/mapa" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
            <Map className="size-4" aria-hidden="true" />
            {mapLabel}
          </Link>
          <Link href="/explorar-avisos" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
            <ScrollText className="size-4" aria-hidden="true" />
            {reportsLabel}
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
