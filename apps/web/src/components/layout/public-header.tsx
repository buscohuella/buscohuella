import {
  CircleUserRound,
  LogIn,
  Map,
  ScrollText,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import type { AuthUser } from '@/features/auth/types/auth-user';
import { LanguageSelector } from '@/features/i18n/language-selector';
import { getServerTranslator } from '@/features/i18n/server';

export async function PublicHeader({
  user,
}: {
  user: AuthUser | null;
}) {
  const { translate } =
    await getServerTranslator();

  const linkClass =
    'flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-muted-foreground hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft';

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-surface-elevated/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          aria-label={translate(
            'common.navigation.homeAria',
          )}
        >
          <Image
            src="/brand/mark.png"
            alt=""
            width={40}
            height={40}
            className="size-10 object-contain"
            priority
          />
          <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            BuscoHuella
          </span>
        </Link>

        <nav
          className="hidden items-center md:flex"
          aria-label={translate(
            'common.navigation.publicLabel',
          )}
        >
          <Link href="/mapa" className={linkClass}>
            <Map
              className="size-4"
              aria-hidden="true"
            />
            {translate(
              'common.navigation.map',
            )}
          </Link>
          <Link
 href="/explorar-avisos"
            className={linkClass}
          >
            <ScrollText
              className="size-4"
              aria-hidden="true"
            />
            {translate(
              'common.navigation.reports',
            )}
          </Link>
        </nav>

        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <LanguageSelector />
          <ThemeToggle />

          {user ? (
            <Link
              href="/perfil"
              className="flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 text-sm font-semibold hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft sm:px-4"
              aria-label={translate(
                'common.navigation.openProfile',
                { name: user.fullName },
              )}
              title={translate(
                'common.navigation.profile',
              )}
            >
              <CircleUserRound
                className="size-4"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                {user.fullName}
              </span>
              <span className="sm:hidden">
                {translate(
                  'common.navigation.profile',
                )}
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                data-mobile-auth-entry="true"
                className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-muted-foreground hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft sm:px-3"
                aria-label={translate('common.navigation.login')}
              >
                <LogIn className="size-4 sm:hidden" aria-hidden="true" />
                <span className="hidden sm:inline">{translate('common.navigation.login')}</span>
              </Link>
              <Link
                href="/registro"
                className="flex min-h-11 items-center gap-1 rounded-full bg-public-action px-3 text-xs font-semibold text-white transition-colors duration-150 hover:bg-public-action-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft sm:gap-2 sm:px-4 sm:text-sm [&>span:last-child]:hidden [&>span:last-child]:sm:inline"
              >
                <span className="sm:hidden">
                  {translate(
                    'common.navigation.registerShort',
                  )}
                </span>
                <span>
                  {translate(
                    'common.navigation.register',
                  )}
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="grid grid-cols-2 border-t border-border-soft px-3 md:hidden">
        <Link href="/mapa" className={linkClass}>
          <Map
            className="size-4"
            aria-hidden="true"
          />
          {translate('common.navigation.map')}
        </Link>
        <Link
 href="/explorar-avisos"
          className={linkClass}
        >
          <ScrollText
            className="size-4"
            aria-hidden="true"
          />
          {translate(
            'common.navigation.reports',
          )}
        </Link>
      </nav>
    </header>
  );
}
