'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/features/theme/theme-provider';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  const isDark = preference === 'dark';
  const nextPreference = isDark ? 'light' : 'dark';
  const label = isDark
    ? 'Activar tema claro'
    : 'Activar tema oscuro';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full',
        'text-foreground transition-colors duration-150',
        'hover:bg-surface-hover active:bg-surface-sunken',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
      )}
      aria-label={label}
      title={label}
      onClick={() => setPreference(nextPreference)}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}