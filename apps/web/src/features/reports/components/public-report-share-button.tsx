'use client';

import {
  Check,
  Share2,
} from 'lucide-react';
import { useState } from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';

export function PublicReportShareButton({
  title,
}: {
  title: string;
}) {
  const { t } =
    useTranslations('publicReport');
  const [copied, setCopied] =
    useState(false);

  async function share() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: t('share.text', {
            title,
          }),
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(
        url,
      );
      setCopied(true);
      window.setTimeout(
        () => setCopied(false),
        2000,
      );
    } catch {
      // Cancelar el diálogo nativo no
      // requiere mostrar un error.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 font-semibold text-foreground hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
    >
      {copied ? (
        <Check
          className="size-5 text-primary"
          aria-hidden="true"
        />
      ) : (
        <Share2
          className="size-5"
          aria-hidden="true"
        />
      )}
      {t(
        copied
          ? 'share.copied'
          : 'share.button',
      )}
    </button>
  );
}
