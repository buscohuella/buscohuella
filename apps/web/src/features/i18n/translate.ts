import type {
  TranslationDictionary,
  TranslationValues,
} from './types';

function getTranslationValue(
  dictionary: TranslationDictionary,
  key: string,
): unknown {
  return key.split('.').reduce<unknown>((current, segment) => {
    if (
      typeof current !== 'object' ||
      current === null ||
      Array.isArray(current)
    ) {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, dictionary);
}

function interpolate(
  message: string,
  values?: TranslationValues,
): string {
  if (!values) return message;

  return message.replace(
    /\{([a-zA-Z0-9_]+)\}/g,
    (match, name: string) => {
      const value = values[name];
      return value === undefined ? match : String(value);
    },
  );
}

export function createTranslator(
  dictionary: TranslationDictionary,
) {
  return (key: string, values?: TranslationValues): string => {
    const value = getTranslationValue(dictionary, key);
    return typeof value === 'string'
      ? interpolate(value, values)
      : key;
  };
}
