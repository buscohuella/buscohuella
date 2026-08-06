'use client';

import { PawPrint, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { AuthUser } from '@/features/auth/types/auth-user';
import { useTranslations } from '@/features/i18n/i18n-provider';
import { cn } from '@/lib/utils';

import { navigationItems } from './navigation-items';
import { UserMenu } from './user-menu';

export interface AppSidebarProps {
  user: AuthUser;
}

export function AppSidebar({
  user,
}: AppSidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslations('common');

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-border-soft bg-surface-elevated lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:flex-col">
      <div className="flex min-h-20 items-center border-b border-border-soft px-6">
        <Link
          href="/inicio"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          aria-label={t(
            'navigation.private.brandHome',
          )}
        >
          <span
            className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary"
            aria-hidden="true"
          >
            <PawPrint className="size-6" />
          </span>
          <span className="text-xl font-bold tracking-tight">
            BuscoHuella
          </span>
        </Link>
      </div>

      <nav
        className="flex-1 px-4 py-6"
        aria-label={t(
          'navigation.private.mainLabel',
        )}
      >
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`,
              );

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={
                    isActive ? 'page' : undefined
                  }
                  className={cn(
                    'flex min-h-12 items-center gap-3 rounded-xl px-4 font-medium',
                    'transition-[background-color,color] duration-150',
                    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
                    isActive
                      ? 'bg-primary-soft text-primary'
                      : 'text-muted-foreground hover:bg-surface hover:text-foreground',
                  )}
                >
                  <Icon
                    className="size-5"
                    aria-hidden="true"
                  />
                  <span>{t(item.labelKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-3 border-t border-border-soft p-4">
        <Link
          href="/mis-reportes/nuevo"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          aria-label={t(
            'navigation.private.createNotice',
          )}
        >
          <Plus
            className="size-5"
            aria-hidden="true"
          />
          {t('navigation.private.createNotice')}
        </Link>

        <UserMenu user={user} />
      </div>
    </aside>
  );
}
