'use client';

import { LogOut } from 'lucide-react';

import { logoutAction } from '@/features/auth/actions/logout';
import type { AuthUser } from '@/features/auth/types/auth-user';

export interface UserMenuProps {
  user: AuthUser;
  compact?: boolean;
}

export function UserMenu({ user, compact = false }: UserMenuProps) {
  const initial = user.fullName.charAt(0).toUpperCase();

  if (compact) {
    return (
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary"
          aria-hidden="true"
        >
          {initial}
        </span>

        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-semibold">{user.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-danger focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="size-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-soft bg-surface p-3">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary"
          aria-hidden="true"
        >
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{user.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <form action={logoutAction} className="mt-3">
        <button
          type="submit"
          className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-danger focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
