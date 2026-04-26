import { TranslationKey } from '../i18n';
import { AppTab } from '../store/models';

export const appTabs: { key: AppTab; labelKey: TranslationKey }[] = [
  { key: 'home', labelKey: 'navigation.home' },
  { key: 'expenses', labelKey: 'navigation.expenses' },
  { key: 'notes', labelKey: 'navigation.notes' },
  { key: 'calendar', labelKey: 'navigation.calendar' },
  { key: 'tasks', labelKey: 'navigation.tasks' },
  { key: 'settings', labelKey: 'navigation.settings' },
];
