'use client';

import { PawPrint } from 'lucide-react';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import type { AuthUser } from '@/features/auth/types/auth-user';
import { LanguageSelector } from '@/features/i18n/language-selector';
import { NotificationBell } from '@/features/notifications/components/notification-bell';

import { UserMenu } from './user-menu';

export interface AppTopbarProps {
  user: AuthUser;
  avatarUrl: string | null;
  title?: string;
}

export function AppTopbar({
  user,
  avatarUrl,
  title = 'BuscoHuella',
}: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border-soft bg-surface-elevated/95 backdrop-blur">
      <div className="flex min-h-18 items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary lg:hidden"
            aria-hidden="true"
          >
            <PawPrint className="size-5" />
          </span>

          <p className="truncate text-lg font-bold tracking-tight sm:text-xl lg:hidden">
            {title}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSelector />
          <ThemeToggle />

          <NotificationBell />

          <UserMenu
            user={user}
            avatarUrl={avatarUrl}
            compact
          />
        </div>
      </div>
    </header>
  );
}
