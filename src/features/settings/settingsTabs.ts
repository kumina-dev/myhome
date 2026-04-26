import { SettingsTab } from '../../store/models';

export const settingsTabs: { key: SettingsTab; label: string }[] = [
  { key: 'account', label: 'Account' },
  { key: 'group', label: 'Group' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'tasks', label: 'Tasks & Scores' },
  { key: 'categories', label: 'Categories' },
  { key: 'security', label: 'Security' },
];
