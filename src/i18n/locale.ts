export type SupportedLocale = 'en' | 'fi';
export type LocalePreference = 'system' | SupportedLocale;

const supportedLocales: SupportedLocale[] = ['en', 'fi'];

function normalizeLocale(value: string | undefined): string {
  return (value ?? '').replace('_', '-').toLowerCase();
}

export function getSystemLocale(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    return 'en';
  }
}

export function resolveLocale(
  preference: LocalePreference,
  systemLocale = getSystemLocale(),
): SupportedLocale {
  if (preference !== 'system') {
    return preference;
  }

  const normalized = normalizeLocale(systemLocale);
  const language = normalized.split('-')[0];

  if (supportedLocales.includes(language as SupportedLocale)) {
    return language as SupportedLocale;
  }

  return 'en';
}
