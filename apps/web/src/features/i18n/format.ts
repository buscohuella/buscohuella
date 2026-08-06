import type { AppLocale } from './config';

const localeTags: Record<AppLocale, string> = {
  es: 'es-ES',
  ca: 'ca-ES',
};

export function getLocaleTag(locale: AppLocale): string {
  return localeTags[locale];
}

export function formatDate(
  value: Date | string | number,
  locale: AppLocale,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(
    getLocaleTag(locale),
    options,
  ).format(new Date(value));
}

export function formatNumber(
  value: number,
  locale: AppLocale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(
    getLocaleTag(locale),
    options,
  ).format(value);
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: AppLocale,
  options?: Intl.RelativeTimeFormatOptions,
): string {
  return new Intl.RelativeTimeFormat(
    getLocaleTag(locale),
    options,
  ).format(value, unit);
}
