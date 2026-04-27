import { TranslationKey } from '../../i18n';
import { SettingsTab } from '../../store/models';

export const settingsTabs: { key: SettingsTab; labelKey: TranslationKey }[] = [
  { key: 'account', labelKey: 'settings.tabs.account' },
  { key: 'group', labelKey: 'settings.tabs.group' },
  { key: 'notifications', labelKey: 'settings.tabs.notifications' },
  { key: 'appearance', labelKey: 'settings.tabs.appearance' },
  { key: 'calendar', labelKey: 'settings.tabs.calendar' },
  { key: 'tasks', labelKey: 'settings.tabs.tasks' },
  { key: 'categories', labelKey: 'settings.tabs.categories' },
  { key: 'security', labelKey: 'settings.tabs.security' },
];
