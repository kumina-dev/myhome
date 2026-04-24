export type AppTab = 'home' | 'expenses' | 'notes' | 'calendar' | 'tasks';
export type ThemeMode = 'system' | 'light' | 'dark';
export type NotificationKind = 'event' | 'task' | 'note' | 'expense';
export type WeekStart = 'monday' | 'sunday';
export type TaskScope = 'shared' | 'personal';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  buyerUserId: string;
  title: string;
  amountCents: number;
  purchasedAt: string;
  category: string;
  notes?: string;
}

export interface Note {
  id: string;
  authorUserId: string;
  title: string;
  body: string;
  isPinned: boolean;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  color: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  scope: TaskScope;
  assigneeUserId?: string;
  points: number;
  dueAt?: string;
  completedAt?: string;
  completedByUserId?: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}

export interface AppSettings {
  householdName: string;
  activeUserId: string;
  themeMode: ThemeMode;
  defaultTab: AppTab;
  expenseCategories: string[];
  scoreCycleDays: number;
  scoreCycleAnchor: string;
  weekStartsOn: WeekStart;
  showCompletedTasks: boolean;
  showPersonalTasksOnHome: boolean;
  notifications: {
    eventReminders: boolean;
    taskReminders: boolean;
    noteAlerts: boolean;
    expenseAlerts: boolean;
    sharedTaskBroadcasts: boolean;
  };
}

export interface AppState {
  users: User[];
  expenses: Expense[];
  notes: Note[];
  events: CalendarEvent[];
  tasks: Task[];
  notifications: NotificationItem[];
  settings: AppSettings;
}
