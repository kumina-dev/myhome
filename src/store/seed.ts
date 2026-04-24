import { AppState } from './models';

const now = new Date();

function isoOffset(days: number, hours = 10): string {
  const value = new Date(now);
  value.setDate(value.getDate() + days);
  value.setHours(hours, 0, 0, 0);
  return value.toISOString();
}

function cycleAnchor(): string {
  const anchor = new Date(now);
  anchor.setDate(anchor.getDate() - 8);
  anchor.setHours(0, 0, 0, 0);
  return anchor.toISOString();
}

export const initialState: AppState = {
  users: [
    { id: 'user-me', name: 'You', color: '#2563EB' },
    { id: 'user-gf', name: 'Girlfriend', color: '#DB2777' },
    { id: 'user-friend', name: 'Friend', color: '#059669' },
  ],
  expenses: [
    {
      id: 'expense-1',
      buyerUserId: 'user-me',
      title: 'Weekly groceries',
      amountCents: 8420,
      purchasedAt: isoOffset(-2, 18),
      category: 'Groceries',
      notes: 'Main supermarket run',
    },
    {
      id: 'expense-2',
      buyerUserId: 'user-gf',
      title: 'Cleaning supplies',
      amountCents: 2190,
      purchasedAt: isoOffset(-5, 16),
      category: 'Household',
    },
    {
      id: 'expense-3',
      buyerUserId: 'user-friend',
      title: 'Movie tickets',
      amountCents: 3600,
      purchasedAt: isoOffset(-9, 20),
      category: 'Entertainment',
    },
    {
      id: 'expense-4',
      buyerUserId: 'user-me',
      title: 'Train cards',
      amountCents: 5400,
      purchasedAt: isoOffset(-12, 8),
      category: 'Transport',
    },
  ],
  notes: [
    {
      id: 'note-1',
      authorUserId: 'user-gf',
      title: 'Weekend plan',
      body: 'Saturday: market, laundry, and dinner reservation by 19:30.',
      isPinned: true,
      updatedAt: isoOffset(-1, 9),
    },
    {
      id: 'note-2',
      authorUserId: 'user-me',
      title: 'Things we keep forgetting',
      body: 'Dishwasher tablets, oat milk, batteries, and bathroom cleaner.',
      isPinned: false,
      updatedAt: isoOffset(-3, 21),
    },
  ],
  events: [
    {
      id: 'event-1',
      title: 'Dinner with parents',
      startsAt: isoOffset(1, 18),
      endsAt: isoOffset(1, 21),
      color: '#F59E0B',
      notes: 'Bring dessert.',
    },
    {
      id: 'event-2',
      title: 'Rent payment',
      startsAt: isoOffset(5, 9),
      endsAt: isoOffset(5, 9),
      color: '#DC2626',
    },
    {
      id: 'event-3',
      title: 'Deep clean day',
      startsAt: isoOffset(7, 11),
      endsAt: isoOffset(7, 14),
      color: '#2563EB',
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Take out trash',
      scope: 'shared',
      points: 5,
      dueAt: isoOffset(0, 20),
    },
    {
      id: 'task-2',
      title: 'Brush teeth',
      scope: 'personal',
      assigneeUserId: 'user-me',
      points: 2,
      dueAt: isoOffset(0, 23),
      completedAt: isoOffset(0, 7),
      completedByUserId: 'user-me',
    },
    {
      id: 'task-3',
      title: 'Wipe kitchen counters',
      scope: 'shared',
      points: 4,
      dueAt: isoOffset(1, 19),
      completedAt: isoOffset(-2, 19),
      completedByUserId: 'user-gf',
    },
    {
      id: 'task-4',
      title: 'Gym session',
      scope: 'personal',
      assigneeUserId: 'user-friend',
      points: 3,
      dueAt: isoOffset(2, 18),
    },
  ],
  notifications: [
    {
      id: 'notification-1',
      type: 'event',
      title: 'Upcoming event',
      body: 'Dinner with parents starts tomorrow at 18:00.',
      createdAt: isoOffset(0, 8),
      isRead: false,
    },
    {
      id: 'notification-2',
      type: 'task',
      title: 'Task completed',
      body: 'Girlfriend completed "Wipe kitchen counters".',
      createdAt: isoOffset(-2, 20),
      isRead: true,
    },
  ],
  settings: {
    householdName: 'My Home',
    activeUserId: 'user-me',
    themeMode: 'system',
    defaultTab: 'home',
    expenseCategories: [
      'Groceries',
      'Household',
      'Transport',
      'Entertainment',
      'Other',
    ],
    scoreCycleDays: 14,
    scoreCycleAnchor: cycleAnchor(),
    weekStartsOn: 'monday',
    showCompletedTasks: true,
    showPersonalTasksOnHome: true,
    notifications: {
      eventReminders: true,
      taskReminders: true,
      noteAlerts: true,
      expenseAlerts: true,
      sharedTaskBroadcasts: true,
    },
  },
};
