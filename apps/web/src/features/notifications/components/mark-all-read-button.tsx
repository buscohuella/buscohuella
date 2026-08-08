'use client';

import { CheckCheck, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { markAllNotificationsReadAction } from '@/features/notifications/actions/notification-actions';

export function MarkAllReadButton({ label }: { label: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function markAllRead() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={markAllRead}
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <CheckCheck className="size-4" aria-hidden="true" />
      )}
      {label}
    </button>
  );
}
