export const THEME_STORAGE_KEY = 'buscohuella-theme';

export const THEME_PREFERENCES = [
  'light',
  'dark',
] as const;

export type ThemePreference =
  (typeof THEME_PREFERENCES)[number];

export type ResolvedTheme = ThemePreference;

export const isThemePreference = (
  value: unknown,
): value is ThemePreference =>
  typeof value === 'string' &&
  THEME_PREFERENCES.includes(value as ThemePreference);