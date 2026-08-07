'use client';

import type {
  Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useEffect,
  useState,
} from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';
import { createClient } from '@/services/supabase/client';

type CountResult = {
  data: number | string | null;
  error: {
    message?: string;
  } | null;
};

export function NotificationBell() {
  const pathname =
    usePathname();
  const { t } =
    useTranslations('common');
  const [count, setCount] =
    useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase =
        createClient();

      const client =
        supabase as unknown as
          SupabaseClient<ReportDatabase>;
      const rpc =
        client.rpc.bind(
          client,
        ) as unknown as (
          name:
            'get_unread_notification_count',
        ) => Promise<CountResult>;

      const { data, error } =
        await rpc(
          'get_unread_notification_count',
        );

      if (
        !cancelled &&
        !error
      ) {
        setCount(
          Number(data ?? 0),
        );
      }
    }

    void load();

    const interval =
      window.setInterval(
        () => {
          void load();
        },
        30000,
      );

    const onFocus = () => {
      void load();
    };

    window.addEventListener(
      'focus',
      onFocus,
    );

    return () => {
      cancelled = true;
      window.clearInterval(
        interval,
      );
      window.removeEventListener(
        'focus',
        onFocus,
      );
    };
  }, [pathname]);

  return (
    <Link
      href="/notificaciones"
      className="relative inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
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

      {count > 0 ? (
        <span
          className="absolute right-0 top-0 flex min-w-5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-danger px-1 text-[0.65rem] font-bold leading-5 text-white"
          aria-hidden="true"
        >
          {count > 99
            ? '99+'
            : count}
        </span>
      ) : null}
    </Link>
  );
}
