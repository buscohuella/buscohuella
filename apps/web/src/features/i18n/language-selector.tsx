'use client';

import {
  Check,
  ChevronDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  startTransition,
  useEffect,
  useRef,
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

const localeFlags: Record<AppLocale, string> = {
  es: '',
  ca: '',
};

function LocaleFlag({ locale }: { locale: AppLocale }) {
  return (
    <span
      className={[
        'inline-block h-4 w-6 shrink-0 rounded-[3px] shadow-[inset_0_0_0_1px_rgb(15_23_42/0.12)]',
        locale === 'es'
          ? 'bg-[linear-gradient(to_bottom,#dc2626_0_25%,#facc15_25%_75%,#dc2626_75%_100%)]'
          : 'bg-[repeating-linear-gradient(to_bottom,#facc15_0_16%,#dc2626_16%_32%)]',
      ].join(' ')}
      aria-hidden="true"
    >
      {localeFlags[locale]}
    </span>
  );
}

export function LanguageSelector() {
  const router = useRouter();
  const { locale, t } =
    useTranslations('common');

  const [isOpen, setIsOpen] =
    useState(false);

  const [isChanging, setIsChanging] =
    useState(false);

  const [
    requestedLocale,
    setRequestedLocale,
  ] = useState<AppLocale | null>(null);

  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(
      event: PointerEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    );

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      );

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [isOpen]);

  useEffect(() => {
    if (!requestedLocale) {
      return;
    }

    document.cookie = [
      `${localeCookieName}=${requestedLocale}`,
      'Path=/',
      `Max-Age=${localeCookieMaxAge}`,
      'SameSite=Lax',
    ].join('; ');

    startTransition(() => {
      router.refresh();
      setRequestedLocale(null);
      setIsChanging(false);
    });
  }, [requestedLocale, router]);

  function changeLocale(
    nextLocale: AppLocale,
  ) {
    if (
      nextLocale === locale ||
      isChanging
    ) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);
    setIsOpen(false);
    setRequestedLocale(nextLocale);
  }

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t('language.label')}
        disabled={isChanging}
        onClick={() =>
          setIsOpen(
            (current) => !current,
          )
        }
        className={[
          'flex min-h-10 items-center gap-1.5 rounded-full',
          'border border-border bg-surface px-2.5',
          'text-sm font-semibold text-foreground shadow-[var(--shadow-sm)]',
          'hover:bg-surface-hover',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
          'disabled:cursor-wait disabled:opacity-65',
        ].join(' ')}
      >
        <LocaleFlag locale={locale} />

        <span className="hidden sm:inline">
          {t(`language.options.${locale}`)}
        </span>
        <span className="sm:hidden">
          {shortLabels[locale]}
        </span>

        <ChevronDown
          className={[
            'size-4 text-muted-foreground transition-transform',
            isOpen
              ? 'rotate-180'
              : '',
          ].join(' ')}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label={t(
            'language.label',
          )}
          className="absolute right-0 top-full z-50 mt-2 min-w-44 overflow-hidden rounded-xl border border-border bg-surface-elevated p-1 shadow-[var(--shadow-lg)]"
        >
          {supportedLocales.map(
            (supportedLocale) => {
              const isSelected =
                supportedLocale ===
                locale;

              return (
                <button
                  key={supportedLocale}
                  type="button"
                  role="menuitemradio"
                  aria-checked={
                    isSelected
                  }
                  onClick={() =>
                    changeLocale(
                      supportedLocale,
                    )
                  }
                  className={[
                    'flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-sm',
                    'hover:bg-surface',
                    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
                    isSelected
                      ? 'bg-primary-soft font-semibold text-primary'
                      : 'text-foreground',
                  ].join(' ')}
                >
                  <span className="flex items-center gap-3">
                    <LocaleFlag locale={supportedLocale} />
                    <span>
                      <span className="block font-semibold">
                        {t(`language.options.${supportedLocale}`)}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {shortLabels[supportedLocale]}
                      </span>
                    </span>
                  </span>

                  {isSelected ? (
                    <Check
                      className="size-4"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            },
          )}
        </div>
      ) : null}
    </div>
  );
}
