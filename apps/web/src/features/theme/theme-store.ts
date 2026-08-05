import {
  isThemePreference,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

export interface ThemeSnapshot {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
}

const serverSnapshot: ThemeSnapshot = {
  preference: 'light',
  resolvedTheme: 'light',
};

let clientSnapshot: ThemeSnapshot = serverSnapshot;
let initialized = false;

const listeners = new Set<() => void>();

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const detectInitialPreference = (): ThemePreference =>
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

const readPreference = (): ThemePreference => {
  const rootPreference =
    document.documentElement.dataset.themePreference;
  const storedPreference = window.localStorage.getItem(
    THEME_STORAGE_KEY,
  );

  if (isThemePreference(storedPreference)) {
    return storedPreference;
  }

  if (isThemePreference(rootPreference)) {
    return rootPreference;
  }

  return detectInitialPreference();
};

const applySnapshot = (
  preference: ThemePreference,
): ThemeSnapshot => {
  const root = document.documentElement;

  root.dataset.themePreference = preference;
  root.dataset.theme = preference;
  root.style.colorScheme = preference;

  return {
    preference,
    resolvedTheme: preference,
  };
};

const initializeClientStore = () => {
  if (initialized || typeof window === 'undefined') return;

  initialized = true;

  const preference = readPreference();
  window.localStorage.setItem(
    THEME_STORAGE_KEY,
    preference,
  );
  clientSnapshot = applySnapshot(preference);
};

export const getThemeSnapshot = (): ThemeSnapshot => {
  initializeClientStore();

  return clientSnapshot;
};

export const getServerThemeSnapshot = (): ThemeSnapshot =>
  serverSnapshot;

export const subscribeToTheme = (
  listener: () => void,
): (() => void) => {
  initializeClientStore();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const setThemePreference = (
  preference: ThemePreference,
) => {
  initializeClientStore();

  window.localStorage.setItem(
    THEME_STORAGE_KEY,
    preference,
  );

  const nextSnapshot = applySnapshot(preference);

  if (
    nextSnapshot.preference === clientSnapshot.preference &&
    nextSnapshot.resolvedTheme ===
      clientSnapshot.resolvedTheme
  ) {
    return;
  }

  clientSnapshot = nextSnapshot;
  emitChange();
};