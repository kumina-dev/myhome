import React from 'react';
import { I18nProvider } from '../i18n/I18nProvider';
import { AppStoreProvider, useAppStore } from '../store/store';
import { AppChrome } from './AppChrome';

export function AppShell() {
  return (
    <AppStoreProvider>
      <AppRuntimeProviders />
    </AppStoreProvider>
  );
}

function AppRuntimeProviders() {
  useAppStore();

  return (
    <I18nProvider localePreference="system" currencyCode="EUR">
      <AppChrome />
    </I18nProvider>
  );
}
