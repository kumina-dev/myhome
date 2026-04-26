import { AppTab } from '../store/models';

export const appTabs: { key: AppTab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'notes', label: 'Notes' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'settings', label: 'Settings' },
];
