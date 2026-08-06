import type { AppLocale } from './config';

export type TranslationPrimitive = string | number | boolean;
export type TranslationValues = Record<string, TranslationPrimitive>;
export type TranslationDictionary = Record<string, unknown>;

export interface I18nContextValue {
  locale: AppLocale;
  translate: (key: string, values?: TranslationValues) => string;
}
