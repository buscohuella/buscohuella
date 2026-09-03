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
    <div className="border-t border-border-soft md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-public-navigation"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-12 w-full items-center justify-end gap-2 px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
      >
        {label}
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      {open ? (
        <nav id="mobile-public-navigation" className="grid gap-1 border-t border-border-soft px-3 pb-3 pt-2" aria-label={label}>
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
