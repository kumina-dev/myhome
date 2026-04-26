import { useCallback } from 'react';
import { useI18nContext } from './I18nProvider';
import { SupportedLocale } from './locale';
import { en, TranslationShape } from './translations/en';
import { fi } from './translations/fi';

type TranslationTree = TranslationShape;

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never;

type DotPath<T> = T extends string
  ? never
  : {
      [K in keyof T]: T[K] extends string ? K & string : Join<K, DotPath<T[K]>>;
    }[keyof T];

export type TranslationKey = DotPath<TranslationTree>;
export type TranslationParams = Record<string, string | number>;

const dictionaries: Record<SupportedLocale, TranslationShape> = {
  en,
  fi,
};

function readPath(
  dictionary: TranslationTree,
  key: TranslationKey,
): string | undefined {
  const value = key
    .split('.')
    .reduce<unknown>(
      (current, segment) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[segment]
          : undefined,
      dictionary,
    );

  return typeof value === 'string' ? value : undefined;
}

function interpolate(value: string, params?: TranslationParams): string {
  if (!params) return value;

  return Object.entries(params).reduce(
    (next, [key, replacement]) =>
      next.replace(new RegExp(`{${key}}`, 'g'), String(replacement)),
    value,
  );
}

export function t(
  locale: SupportedLocale,
  key: TranslationKey,
  params?: TranslationParams,
): string {
  const translated = readPath(dictionaries[locale], key) ?? readPath(en, key);

  return interpolate(translated ?? key, params);
}

export function useTranslation() {
  const context = useI18nContext();

  const translate = useCallback(
    (key: TranslationKey, params?: TranslationParams) =>
      t(context.locale, key, params),
    [context.locale],
  );

  return {
    ...context,
    t: translate,
  };
}

export type { LocalePreference, SupportedLocale } from './locale';
