'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { navigationItems } from './navigation-items';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-border-soft bg-surface-elevated lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:flex-col">
      <div className="flex min-h-20 items-center border-b border-border-soft px-6">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          aria-label="BuscoHuella, ir al inicio"
        >
          <span
            className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary"
            aria-hidden="true"
          >
            <PawPrint className="size-6" />
          </span>
          <span className="text-xl font-bold tracking-tight">BuscoHuella</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6" aria-label="Navegación principal">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex min-h-12 items-center gap-3 rounded-xl px-4 font-medium',
                    'transition-[background-color,color] duration-150',
                    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
                    isActive
                      ? 'bg-primary-soft text-primary'
                      : 'text-muted-foreground hover:bg-surface hover:text-foreground',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border-soft p-4">
        <Button fullWidth size="lg">
          <Plus className="size-5" aria-hidden="true" />
          Reportar
        </Button>
      </div>
    </aside>
  );
}
