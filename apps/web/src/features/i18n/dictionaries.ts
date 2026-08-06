import type { AppLocale } from './config';
import type { TranslationDictionary } from './types';

import caAuth from './locales/ca/auth.json';
import caCommon from './locales/ca/common.json';
import caProfile from './locales/ca/profile.json';
import esAuth from './locales/es/auth.json';
import esCommon from './locales/es/common.json';
import esProfile from './locales/es/profile.json';

const dictionaries = {
  es: {
    common: esCommon,
    auth: esAuth,
    profile: esProfile,
  },
  ca: {
    common: caCommon,
    auth: caAuth,
    profile: caProfile,
  },
} satisfies Record<AppLocale, TranslationDictionary>;

export type TranslationNamespace =
  keyof (typeof dictionaries)['es'];

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
