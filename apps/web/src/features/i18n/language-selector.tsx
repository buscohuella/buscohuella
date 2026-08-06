'use client';

import { Languages } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  startTransition,
  useState,
} from 'react';

import {
  localeCookieMaxAge,
  localeCookieName,
  supportedLocales,
  type AppLocale,
} from './config';
import { useTranslations } from './i18n-provider';

const shortLabels: Record<AppLocale, string> = {
  es: 'ES',
  ca: 'CA',
};

export function LanguageSelector() {
  const router = useRouter();
  const { locale, t } = useTranslations('common');
  const [isChanging, setIsChanging] =
    useState(false);

  function changeLocale(
    nextLocale: AppLocale,
  ) {
    if (nextLocale === locale) {
      return;
    }

    setIsChanging(true);

    document.cookie = [
      `${localeCookieName}=${nextLocale}`,
      'Path=/',
      `Max-Age=${localeCookieMaxAge}`,
      'SameSite=Lax',
    ].join('; ');

    startTransition(() => {
      router.refresh();
      setIsChanging(false);
    });
  }

  return (
    <div className="relative shrink-0">
      <label
        htmlFor="app-language"
        className="sr-only"
      >
        {t('language.label')}
      </label>

      <select
        id="app-language"
        value={locale}
        disabled={isChanging}
        aria-label={t('language.label')}
        title={t('language.label')}
        className={[
          'peer absolute inset-0 z-10 size-full cursor-pointer appearance-none rounded-full opacity-0',
          'focus:outline-none',
          'disabled:cursor-wait',
        ].join(' ')}
        onChange={(event) =>
          changeLocale(
            event.currentTarget.value as AppLocale,
          )
        }
      >
        {supportedLocales.map(
          (supportedLocale) => (
            <option
              key={supportedLocale}
              value={supportedLocale}
            >
              {shortLabels[supportedLocale]}
              {' — '}
              {t(
                `language.options.${supportedLocale}`,
              )}
            </option>
          ),
        )}
      </select>

      <div
        className={[
          'pointer-events-none flex min-h-10 items-center gap-1.5 rounded-full',
          'border border-border bg-surface-elevated px-2.5',
          'text-sm font-semibold text-foreground',
          'transition-[border-color,box-shadow,background-color,opacity]',
          'peer-hover:bg-surface-hover',
          'peer-focus-visible:border-primary',
          'peer-focus-visible:ring-4 peer-focus-visible:ring-focus-soft',
          isChanging ? 'opacity-65' : '',
        ].join(' ')}
        aria-hidden="true"
      >
        <Languages className="size-4" />
        <span>{shortLabels[locale]}</span>
      </div>
    </div>
  );
}
