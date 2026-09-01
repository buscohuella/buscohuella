'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useTranslations } from '@/features/i18n/i18n-provider';
import { cn } from '@/lib/utils';

import {
  navigationItems,
  type NavigationItem,
} from './navigation-items';
import { QuickActionLauncher } from './quick-action-launcher';

export function MobileNavigation() {
  const pathname = usePathname();
  const { t } = useTranslations('common');

  const visibleItems = navigationItems.filter(
    (item) =>
      item.href !== '/perfil',
  );

  const leftItems =
    visibleItems.slice(0, 2);
  const rightItems =
    visibleItems.slice(2, 4);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-soft bg-surface-elevated/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-lg)] backdrop-blur lg:hidden"
      aria-label={t(
        'navigation.private.mobileLabel',
      )}
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end">
        {leftItems.map((item) => (
          <MobileNavigationLink
            key={item.href}
            item={item}
            pathname={pathname}
          />
        ))}

        <QuickActionLauncher />

        {rightItems.map((item) => (
          <MobileNavigationLink
            key={item.href}
            item={item}
            pathname={pathname}
          />
        ))}
      </div>
    </nav>
  );
}

function MobileNavigationLink({
  item,
  pathname,
}: {
  item: NavigationItem;
  pathname: string;
}) {
  const { t } = useTranslations('common');
  const Icon = item.icon;

  const noticesActive =
    item.href === '/mis-avisos' &&
    (
      pathname === '/mis-avisos' ||
      pathname.startsWith('/mis-avisos/') ||
      pathname.startsWith('/reportes') ||
      pathname.startsWith('/mis-reportes') ||
      pathname.startsWith('/avistamientos') ||
      pathname.startsWith('/mis-avistamientos')
    );

  const isActive =
    noticesActive ||
    pathname === item.href ||
    pathname.startsWith(
      `${item.href}/`,
    );

  return (
    <Link
      href={item.href}
      aria-current={
        isActive ? 'page' : undefined
      }
      className={cn(
        'flex min-h-18 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-medium',
        'transition-[background-color,color] duration-150',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:bg-surface hover:text-foreground',
      )}
    >
      <Icon
        className="size-5"
        aria-hidden="true"
      />
      <span>{t(item.labelKey)}</span>
    </Link>
  );
}
