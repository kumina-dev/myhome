import React, { createContext, useContext, useMemo } from 'react';
import {
  getSystemLocale,
  LocalePreference,
  resolveLocale,
  SupportedLocale,
} from './locale';

interface I18nContextValue {
  locale: SupportedLocale;
  localePreference: LocalePreference;
  systemLocale: string;
  currencyCode: string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({
  children,
  localePreference,
  currencyCode,
}: {
  children: React.ReactNode;
  localePreference: LocalePreference;
  currencyCode: string;
}) {
  const value = useMemo<I18nContextValue>(() => {
    const systemLocale = getSystemLocale();

    return {
      locale: resolveLocale(localePreference, systemLocale),
      localePreference,
      systemLocale,
      currencyCode,
    };
  }, [currencyCode, localePreference]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext() {
  const value = useContext(I18nContext);

  if (!value) {
    throw new Error('useI18nContext must be used inside I18nProvider');
  }

  return value;
}
