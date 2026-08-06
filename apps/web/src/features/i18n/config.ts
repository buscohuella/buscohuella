export const supportedLocales = ['es', 'ca'] as const;

export type AppLocale = (typeof supportedLocales)[number];

export const defaultLocale: AppLocale = 'es';
export const localeCookieName = 'buscohuella-locale';
export const localeCookieMaxAge = 60 * 60 * 24 * 365;

export const localeLabels: Record<AppLocale, string> = {
  es: 'Español',
  ca: 'Català',
};

export function isSupportedLocale(
  value: string | null | undefined,
): value is AppLocale {
  return supportedLocales.includes(value as AppLocale);
}

export function normalizeLocale(
  value: string | null | undefined,
): AppLocale | null {
  if (!value) return null;

  const normalized = value.trim().toLowerCase().split('-')[0];

  return isSupportedLocale(normalized) ? normalized : null;
}
