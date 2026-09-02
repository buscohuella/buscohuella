'use client';

import Image from 'next/image';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import type { AuthUser } from '@/features/auth/types/auth-user';
import { LanguageSelector } from '@/features/i18n/language-selector';
import { useTranslations } from '@/features/i18n/i18n-provider';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const { t } = useTranslations('common');
  const sectionTitle = pathname.startsWith('/mapa')
    ? t('navigation.private.map')
    : pathname.startsWith('/mis-mascotas')
      ? t('navigation.private.pets')
      : pathname.startsWith('/perfil')
        ? t('navigation.private.profile')
        : pathname === '/explorar-avisos'
          ? t('navigation.private.exploreReports')
          : pathname === '/avisos' || pathname.startsWith('/avisos/')
            ? t('navigation.private.publicReports')
          : pathname === '/mis-avisos'
            ? t('navigation.private.notices')
            : pathname.startsWith('/mis-avisos/propios')
              ? t('navigation.private.reports')
              : pathname.startsWith('/mis-reportes/nuevo')
                ? t('navigation.private.report')
                : pathname.startsWith('/mis-reportes')
                  ? t('navigation.private.reports')
                  : pathname.startsWith('/avistamientos')
                    ? t('navigation.private.sightings')
                    : pathname.startsWith('/mis-avistamientos')
                      ? t('navigation.private.mySightings')
                      : t('navigation.private.home');

  return (
    <header className="sticky top-0 z-30 border-b border-border-soft bg-surface-elevated/95 backdrop-blur">
      <div className="flex min-h-18 items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary lg:hidden"
            aria-hidden="true"
          >
            <Image
              src="/brand/mark.png"
              alt=""
              width={40}
              height={40}
              className="size-8 object-contain"
            />
          </span>

          <p className="truncate text-lg font-bold tracking-tight sm:text-xl lg:hidden">
            {sectionTitle || title}
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
