export const ACCESSIBILITY_STORAGE_KEY = 'buscohuella-accessibility';

export const FONT_SIZE_OPTIONS = ['default', 'large', 'x-large'] as const;
export type FontSizePreference = (typeof FONT_SIZE_OPTIONS)[number];

export const CONTRAST_OPTIONS = ['default', 'high'] as const;
export type ContrastPreference = (typeof CONTRAST_OPTIONS)[number];

export interface AccessibilitySnapshot {
  fontSize: FontSizePreference;
  contrast: ContrastPreference;
  reducedMotion: boolean;
}

export const defaultAccessibilitySnapshot: AccessibilitySnapshot = {
  fontSize: 'default',
  contrast: 'default',
  reducedMotion: false,
};

export const isFontSizePreference = (value: unknown): value is FontSizePreference =>
  typeof value === 'string' && FONT_SIZE_OPTIONS.includes(value as FontSizePreference);

export const isContrastPreference = (value: unknown): value is ContrastPreference =>
  typeof value === 'string' && CONTRAST_OPTIONS.includes(value as ContrastPreference);
