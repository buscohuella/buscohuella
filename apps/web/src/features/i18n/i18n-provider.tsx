'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from 'react';

import type { AppLocale } from './config';
import { createTranslator } from './translate';
import type {
  I18nContextValue,
  TranslationDictionary,
} from './types';

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  children: ReactNode;
  locale: AppLocale;
  dictionary: TranslationDictionary;
}

export function I18nProvider({
  children,
  locale,
  dictionary,
}: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      translate: createTranslator(dictionary),
    }),
    [dictionary, locale],
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error(
      'useI18n debe usarse dentro de I18nProvider.',
    );
  }

  return context;
}

export function useTranslations(namespace?: string) {
  const { locale, translate } = useI18n();

  return {
    locale,
    t: (
      key: string,
      values?: Parameters<typeof translate>[1],
    ) =>
      translate(
        namespace ? `${namespace}.${key}` : key,
        values,
      ),
  };
}
