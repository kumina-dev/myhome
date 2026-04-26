import { useMemo } from 'react';
import { useI18nContext } from '../../i18n/I18nProvider';
import { SupportedLocale } from '../../i18n/locale';

export function formatCurrencyAmount({
  amountCents,
  locale,
  currencyCode,
}: {
  amountCents: number;
  locale: SupportedLocale;
  currencyCode: string;
}) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

export function useCurrencyFormatter() {
  const { locale, currencyCode } = useI18nContext();

  return useMemo(
    () => ({
      formatCurrency: (amountCents: number) =>
        formatCurrencyAmount({ amountCents, locale, currencyCode }),
    }),
    [currencyCode, locale],
  );
}
