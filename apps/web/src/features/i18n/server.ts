import 'server-only';

import { cookies, headers } from 'next/headers';

import {
  defaultLocale,
  localeCookieName,
  normalizeLocale,
  type AppLocale,
} from './config';
import { getDictionary } from './dictionaries';
import { createTranslator } from './translate';

function resolveAcceptLanguage(
  value: string | null,
): AppLocale | null {
  if (!value) return null;

  const candidates = value
    .split(',')
    .map((entry) => {
      const [language, ...parameters] = entry.trim().split(';');
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().startsWith('q='),
      );
      const quality = qualityParameter
        ? Number(qualityParameter.trim().slice(2))
        : 1;

      return {
        locale: normalizeLocale(language),
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter(
      (
        candidate,
      ): candidate is { locale: AppLocale; quality: number } =>
        candidate.locale !== null,
    )
    .sort((left, right) => right.quality - left.quality);

  return candidates[0]?.locale ?? null;
}

export async function getRequestLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const storedLocale = normalizeLocale(
    cookieStore.get(localeCookieName)?.value,
  );

  if (storedLocale) return storedLocale;

  const headerStore = await headers();
  const browserLocale = resolveAcceptLanguage(
    headerStore.get('accept-language'),
  );

  return browserLocale ?? defaultLocale;
}

export async function getServerTranslator() {
  const locale = await getRequestLocale();

  return {
    locale,
    translate: createTranslator(getDictionary(locale)),
  };
}
