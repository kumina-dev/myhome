import { useMemo } from 'react';
import { useI18nContext } from '../../i18n/I18nProvider';
import { SupportedLocale } from '../../i18n/locale';

export function formatShortDateValue(
  value: string | Date,
  locale: SupportedLocale,
) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).format(new Date(value));
}

export function formatDateTimeValue(
  value: string | Date,
  locale: SupportedLocale,
) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatTimeValue(value: string | Date, locale: SupportedLocale) {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatMonthYearValue(
  value: string | Date,
  locale: SupportedLocale,
) {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function useDateTimeFormatter() {
  const { locale } = useI18nContext();

  return useMemo(
    () => ({
      formatShortDate: (value: string | Date) =>
        formatShortDateValue(value, locale),
      formatDateTime: (value: string | Date) =>
        formatDateTimeValue(value, locale),
      formatTime: (value: string | Date) => formatTimeValue(value, locale),
      formatMonthYear: (value: string | Date) =>
        formatMonthYearValue(value, locale),
    }),
    [locale],
  );
}
