import { Bell, PawPrint } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { AuthUser } from '@/features/auth/types/auth-user';

import { UserMenu } from './user-menu';

export interface AppTopbarProps {
  user: AuthUser;
  title?: string;
}

export function AppTopbar({
  user,
  title = 'BuscoHuella',
}: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border-soft bg-surface-elevated/95 backdrop-blur">
      <div className="flex min-h-18 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
            <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" aria-label="Ver notificaciones">
            <Bell className="size-5" aria-hidden="true" />
          </Button>

          <UserMenu user={user} compact />
        </div>
      </div>
    </header>
  );
}
