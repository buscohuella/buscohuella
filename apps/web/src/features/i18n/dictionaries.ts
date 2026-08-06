import type { AppLocale } from './config';
import type { TranslationDictionary } from './types';

import caAuth from './locales/ca/auth.json';
import caCommon from './locales/ca/common.json';
import esAuth from './locales/es/auth.json';
import esCommon from './locales/es/common.json';

const dictionaries = {
  es: { common: esCommon, auth: esAuth },
  ca: { common: caCommon, auth: caAuth },
} satisfies Record<AppLocale, TranslationDictionary>;

export type TranslationNamespace = keyof (typeof dictionaries)['es'];

export function getDictionary(
  locale: AppLocale,
): TranslationDictionary {
  return dictionaries[locale];
}

export function getNamespaceDictionary(
  locale: AppLocale,
  namespace: TranslationNamespace,
): TranslationDictionary {
  return dictionaries[locale][namespace];
}
