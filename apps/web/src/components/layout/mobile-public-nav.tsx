'use client';

import { CircleHelp, LogIn, Menu, Map, ScrollText, UserPlus, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ThemeToggle } from '@/components/ui/theme-toggle';

export function MobilePublicNav({
  label,
  mapLabel,
  reportsLabel,
  themeLabel,
  loginLabel,
  registerLabel,
  helpLabel,
  showAuth,
}: {
  label: string;
  mapLabel: string;
  reportsLabel: string;
  themeLabel: string;
  loginLabel: string;
  registerLabel: string;
  helpLabel: string;
  showAuth: boolean;
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
          <Link href="/ayuda" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
            <CircleHelp className="size-4" aria-hidden="true" />
            {helpLabel}
          </Link>
          <Link href="/explorar-avisos" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
            <ScrollText className="size-4" aria-hidden="true" />
            {reportsLabel}
          </Link>
          <div className="flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-semibold text-muted-foreground">
            {themeLabel}
            <ThemeToggle />
          </div>
          {showAuth ? (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
                <LogIn className="size-4" aria-hidden="true" />
                {loginLabel}
              </Link>
              <Link href="/registro" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg bg-public-action px-3 text-sm font-semibold !text-white transition-colors hover:bg-public-action-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
                <UserPlus className="size-4" aria-hidden="true" />
                {registerLabel}
              </Link>
            </>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
