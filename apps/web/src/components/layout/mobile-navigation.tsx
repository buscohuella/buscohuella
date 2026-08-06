'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useTranslations } from '@/features/i18n/i18n-provider';
import { cn } from '@/lib/utils';

import {
  navigationItems,
  reportAction,
  type NavigationItem,
} from './navigation-items';

export function MobileNavigation() {
  const pathname = usePathname();
  const { t } = useTranslations('common');
  const ReportIcon = reportAction.icon;

  const leftItems =
    navigationItems.slice(0, 2);
  const rightItems =
    navigationItems.slice(3);

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

        <button
          type="button"
          className="-mt-7 flex min-h-20 flex-col items-center justify-start gap-1 rounded-xl text-xs font-semibold text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          aria-label={t(
            reportAction.labelKey,
          )}
        >
          <span className="flex size-16 items-center justify-center rounded-full border-4 border-surface-elevated bg-primary text-primary-foreground shadow-[var(--shadow-md)]">
            <ReportIcon
              className="size-7"
              aria-hidden="true"
            />
          </span>
          <span>
            {t(reportAction.labelKey)}
          </span>
        </button>

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
  const isActive =
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
