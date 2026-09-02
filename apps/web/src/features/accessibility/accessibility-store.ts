import {
  ACCESSIBILITY_STORAGE_KEY,
  defaultAccessibilitySnapshot,
  isContrastPreference,
  isFontSizePreference,
  type AccessibilitySnapshot,
  type ContrastPreference,
  type FontSizePreference,
} from './accessibility';

const listeners = new Set<() => void>();
let clientSnapshot = defaultAccessibilitySnapshot;
let initialized = false;

const emitChange = () => listeners.forEach((listener) => listener());

const readSnapshot = (): AccessibilitySnapshot => {
  try {
    const stored = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    if (!stored) return defaultAccessibilitySnapshot;

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return defaultAccessibilitySnapshot;

    const value = parsed as Record<string, unknown>;
    return {
      fontSize: isFontSizePreference(value.fontSize) ? value.fontSize : 'default',
      contrast: isContrastPreference(value.contrast) ? value.contrast : 'default',
      reducedMotion: value.reducedMotion === true,
    };
  } catch {
    return defaultAccessibilitySnapshot;
  }
};

const applySnapshot = (snapshot: AccessibilitySnapshot) => {
  const root = document.documentElement;
  root.dataset.fontSize = snapshot.fontSize;
  root.dataset.contrast = snapshot.contrast;
  root.dataset.reducedMotion = String(snapshot.reducedMotion);
};

const initialize = () => {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  clientSnapshot = readSnapshot();
  applySnapshot(clientSnapshot);
};

export const getAccessibilitySnapshot = () => {
  initialize();
  return clientSnapshot;
};

export const getServerAccessibilitySnapshot = () => defaultAccessibilitySnapshot;

export const subscribeToAccessibility = (listener: () => void) => {
  initialize();
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setFontSizePreference = (fontSize: FontSizePreference) => {
  setAccessibilitySnapshot({ ...getAccessibilitySnapshot(), fontSize });
};

export const setContrastPreference = (contrast: ContrastPreference) => {
  setAccessibilitySnapshot({ ...getAccessibilitySnapshot(), contrast });
};

export const setReducedMotion = (reducedMotion: boolean) => {
  setAccessibilitySnapshot({ ...getAccessibilitySnapshot(), reducedMotion });
};

export const setAccessibilitySnapshot = (snapshot: AccessibilitySnapshot) => {
  initialize();
  window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(snapshot));
  applySnapshot(snapshot);
  if (JSON.stringify(snapshot) === JSON.stringify(clientSnapshot)) return;
  clientSnapshot = snapshot;
  emitChange();
};
