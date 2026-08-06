'use client';

import { Bell, PawPrint } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import type { AuthUser } from '@/features/auth/types/auth-user';
import { useTranslations } from '@/features/i18n/i18n-provider';
import { LanguageSelector } from '@/features/i18n/language-selector';

import { UserMenu } from './user-menu';

export interface AppTopbarProps {
  user: AuthUser;
  title?: string;
}

export function AppTopbar({
  user,
  title = 'BuscoHuella',
}: AppTopbarProps) {
  const { t } = useTranslations('common');

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

          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground lg:hidden">
              BuscoHuella
            </p>
            <p className="truncate text-lg font-bold tracking-tight sm:text-xl">
              {title}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSelector />
          <ThemeToggle />

          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            aria-label={t(
              'navigation.private.notifications',
            )}
            title={t(
              'navigation.private.notifications',
            )}
          >
            <Bell
              className="size-5"
              aria-hidden="true"
            />
          </Button>

          <UserMenu
            user={user}
            compact
          />
        </div>
      </div>
    </header>
  );
}
