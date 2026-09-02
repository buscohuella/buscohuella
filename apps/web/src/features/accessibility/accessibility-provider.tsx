'use client';

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';

import type { AccessibilitySnapshot, ContrastPreference, FontSizePreference } from './accessibility';
import {
  getAccessibilitySnapshot,
  getServerAccessibilitySnapshot,
  setContrastPreference,
  setFontSizePreference,
  setReducedMotion,
  subscribeToAccessibility,
} from './accessibility-store';

interface AccessibilityContextValue extends AccessibilitySnapshot {
  setFontSize: (value: FontSizePreference) => void;
  setContrast: (value: ContrastPreference) => void;
  setReducedMotion: (value: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeToAccessibility,
    getAccessibilitySnapshot,
    getServerAccessibilitySnapshot,
  );

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      ...snapshot,
      setFontSize: setFontSizePreference,
      setContrast: setContrastPreference,
      setReducedMotion,
    }),
    [snapshot],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used inside AccessibilityProvider.');
  return context;
};
