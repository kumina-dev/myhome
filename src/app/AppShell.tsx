import React from 'react';
import { AppStoreProvider } from '../store/store';
import { AppChrome } from './AppChrome';

export function AppShell() {
  return (
    <AppStoreProvider>
      <AppChrome />
    </AppStoreProvider>
  );
}
