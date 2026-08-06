'use client';

import {
  AlertTriangle,
  Eye,
  Plus,
  Search,
  Siren,
  TriangleAlert,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Sheet } from '@/components/ui/sheet';
import { useTranslations } from '@/features/i18n/i18n-provider';

export function QuickActionLauncher() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslations('common');

  return (
    <>
      <button
        type="button"
        className="-mt-7 flex min-h-20 flex-col items-center justify-start gap-1 rounded-xl text-xs font-semibold text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        aria-label={t(
          'quickActions.open',
        )}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="flex size-16 items-center justify-center rounded-full border-4 border-surface-elevated bg-primary text-primary-foreground shadow-[var(--shadow-md)]">
          <Plus
            className="size-7"
            aria-hidden="true"
          />
        </span>
        <span>{t('quickActions.add')}</span>
      </button>

      <Sheet
        open={open}
        side="bottom"
        title={t('quickActions.title')}
        description={t(
          'quickActions.description',
        )}
        closeLabel={t(
          'quickActions.close',
        )}
        onOpenChange={setOpen}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickActionLink
            href="/mis-reportes/nuevo/perdida"
            icon={<TriangleAlert />}
            title={t(
              'quickActions.lost.title',
            )}
            description={t(
              'quickActions.lost.description',
            )}
            onNavigate={() => setOpen(false)}
          />

          <UnavailableAction
            icon={<Search />}
            title={t(
              'quickActions.found.title',
            )}
            description={t(
              'quickActions.found.description',
            )}
            status={t(
              'quickActions.comingSoon',
            )}
          />

          <UnavailableAction
            icon={<Eye />}
            title={t(
              'quickActions.sighting.title',
            )}
            description={t(
              'quickActions.sighting.description',
            )}
            status={t(
              'quickActions.comingSoon',
            )}
          />

          <UnavailableAction
            icon={<AlertTriangle />}
            title={t(
              'quickActions.incident.title',
            )}
            description={t(
              'quickActions.incident.description',
            )}
            status={t(
              'quickActions.comingSoon',
            )}
          />

          <UnavailableAction
            icon={<Siren />}
            title={t(
              'quickActions.sos.title',
            )}
            description={t(
              'quickActions.sos.description',
            )}
            status={t(
              'quickActions.comingSoon',
            )}
          />
        </div>
      </Sheet>
    </>
  );
}

function QuickActionLink({
  href,
  icon,
  title,
  description,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex min-h-24 items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-[border-color,background-color] hover:border-primary/40 hover:bg-primary-soft/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger [&>svg]:size-6">
        {icon}
      </span>
      <span className="min-w-0">
        <strong className="block text-base">
          {title}
        </strong>
        <span className="mt-1 block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
    </Link>
  );
}

function UnavailableAction({
  icon,
  title,
  description,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div
      className="flex min-h-24 items-center gap-4 rounded-xl border border-border-soft bg-surface p-4 opacity-75"
      aria-disabled="true"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-muted-foreground [&>svg]:size-6">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <strong className="text-base">
            {title}
          </strong>
          <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {status}
          </span>
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
    </div>
  );
}
