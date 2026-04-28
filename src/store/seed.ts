import { AppSnapshot, ProfileColorKey } from './models';

export const DEVELOPMENT_ONLY_SEEDED_PASSWORD = '1234';
export const DEVELOPMENT_ONLY_APP_LOCK_PIN = '2580';

const now = new Date();

function isoOffset(days: number, hours = 10): string {
  const value = new Date(now);
  value.setDate(value.getDate() + days);
  value.setHours(hours, 0, 0, 0);
  return value.toISOString();
}

function makeMeta(groupId: string, userId: string) {
  const createdAt = isoOffset(-14, 10);

  return {
    groupId,
    createdAt,
    updatedAt: createdAt,
    createdByUserId: userId,
    updatedByUserId: userId,
  };
}

function pickColor(index: number): ProfileColorKey {
  return ['blue', 'pink', 'green', 'amber'][index % 4] as ProfileColorKey;
}

export const initialSnapshot: AppSnapshot = (() => {
  const groupId = 'group-nordline';
  const ownerUserId = 'auth-owner';
  const ownerProfileId = 'profile-owner';
  const secondUserId = 'auth-elin';
  const secondProfileId = 'profile-elin';
  const thirdUserId = 'auth-mika';
  const thirdProfileId = 'profile-mika';
  const meta = makeMeta(groupId, ownerUserId);

  return {
    authUsers: [
      {
        id: ownerUserId,
        email: 'owner@northcircle.app',
        profileId: ownerProfileId,
      },
      {
        id: secondUserId,
        email: 'elin@northcircle.app',
        profileId: secondProfileId,
      },
      {
        id: thirdUserId,
        email: 'mika@northcircle.app',
        profileId: thirdProfileId,
      },
    ],
    profiles: [
      { id: ownerProfileId, displayName: 'You', colorKey: pickColor(0) },
      { id: secondProfileId, displayName: 'Elin', colorKey: pickColor(1) },
      { id: thirdProfileId, displayName: 'Mika', colorKey: pickColor(2) },
    ],
    sessionState: {
      session: null,
      activeProfileId: null,
    },
    appLockSettings: {
      isEnabled: true,
      lockAfterMinutes: 5,
    },
    appLockState: {
      isLocked: false,
    },
    groups: [
      {
        id: groupId,
        groupName: 'North Circle',
        createdAt: meta.createdAt,
        createdByUserId: ownerUserId,
      },
    ],
    members: [
      {
        id: 'member-owner',
        groupId,
        userId: ownerUserId,
        profileId: ownerProfileId,
        role: 'owner',
        joinedAt: isoOffset(-45, 9),
      },
      {
        id: 'member-elin',
        groupId,
        userId: secondUserId,
        profileId: secondProfileId,
        role: 'member',
        joinedAt: isoOffset(-32, 9),
      },
      {
        id: 'member-mika',
        groupId,
        userId: thirdUserId,
        profileId: thirdProfileId,
        role: 'member',
        joinedAt: isoOffset(-24, 9),
      },
    ],
    invites: [
      {
        id: 'invite-june',
        groupId,
        email: 'june@northcircle.app',
        code: 'NORTH-7832',
        profileNameHint: 'June',
        invitedByUserId: ownerUserId,
        createdAt: isoOffset(-1, 11),
      },
    ],
    expenses: [
      {
        id: 'expense-1',
        ...meta,
        buyerUserId: ownerUserId,
        title: 'Weekly groceries',
        amountCents: 8420,
        purchasedAt: isoOffset(-2, 18),
        category: 'Groceries',
        notes: 'Main supermarket run',
      },
      {
        id: 'expense-2',
        ...meta,
        buyerUserId: secondUserId,
        title: 'Cleaning supplies',
        amountCents: 2190,
        purchasedAt: isoOffset(-5, 16),
        category: 'Home supplies',
      },
      {
        id: 'expense-3',
        ...meta,
        buyerUserId: thirdUserId,
        title: 'Movie tickets',
        amountCents: 3600,
        purchasedAt: isoOffset(-9, 20),
        category: 'Entertainment',
      },
      {
        id: 'expense-4',
        ...meta,
        buyerUserId: ownerUserId,
        title: 'Train cards',
        amountCents: 5400,
        purchasedAt: isoOffset(-12, 8),
        category: 'Transport',
      },
    ],
    notes: [
      {
        id: 'note-1',
        ...meta,
        authorUserId: secondUserId,
        title: 'Weekend plan',
        body: 'Saturday market at 11, laundry after lunch, dinner booking by 19:30.',
        isPinned: true,
        updatedAt: isoOffset(-1, 9),
      },
      {
        id: 'note-2',
        ...meta,
        authorUserId: ownerUserId,
        title: 'Things we keep forgetting',
        body: 'Dishwasher tablets, oat milk, batteries, and bathroom cleaner.',
        isPinned: false,
        updatedAt: isoOffset(-3, 21),
      },
    ],
    events: [
      {
        id: 'event-1',
        ...meta,
        title: 'Dinner with parents',
        startsAt: isoOffset(1, 18),
        endsAt: isoOffset(1, 21),
        colorKey: 'amber',
        notes: 'Bring dessert.',
      },
      {
        id: 'event-2',
        ...meta,
        title: 'Rent payment',
        startsAt: isoOffset(5, 9),
        endsAt: isoOffset(5, 10),
        colorKey: 'red',
      },
      {
        id: 'event-3',
        ...meta,
        title: 'Deep clean day',
        startsAt: isoOffset(7, 11),
        endsAt: isoOffset(7, 14),
        colorKey: 'blue',
      },
    ],
    tasks: [
      {
        id: 'task-1',
        ...meta,
        title: 'Take out trash',
        scope: 'shared',
        points: 5,
        dueAt: isoOffset(0, 20),
      },
      {
        id: 'task-2',
        ...meta,
        title: 'Brush teeth',
        scope: 'personal',
        assigneeUserId: ownerUserId,
        points: 2,
        dueAt: isoOffset(0, 23),
        completedAt: isoOffset(0, 7),
        completedByUserId: ownerUserId,
      },
      {
        id: 'task-3',
        ...meta,
        title: 'Wipe kitchen counters',
        scope: 'shared',
        points: 4,
        dueAt: isoOffset(1, 19),
        completedAt: isoOffset(-2, 19),
        completedByUserId: secondUserId,
      },
      {
        id: 'task-4',
        ...meta,
        title: 'Gym session',
        scope: 'personal',
        assigneeUserId: thirdUserId,
        points: 3,
        dueAt: isoOffset(2, 18),
      },
    ],
    notifications: [
      {
        id: 'notification-1',
        ...meta,
        type: 'event',
        title: 'Upcoming event',
        body: 'Dinner with parents starts tomorrow at 18:00.',
        isRead: false,
        createdAt: isoOffset(0, 8),
        updatedAt: isoOffset(0, 8),
      },
      {
        id: 'notification-2',
        ...meta,
        type: 'task',
        title: 'Task completed',
        body: 'Elin completed "Wipe kitchen counters".',
        isRead: true,
        createdAt: isoOffset(-2, 20),
        updatedAt: isoOffset(-2, 20),
      },
    ],
    settings: {
      themeMode: 'system',
      defaultTab: 'home',
      localePreference: 'system',
      currencyCode: 'EUR',
      calendarDefaultView: 'month',
      eventColorKey: 'blue',
      expenseCategories: [
        'Groceries',
        'Home supplies',
        'Transport',
        'Entertainment',
        'Other',
      ],
      scoreCycleDays: 14,
      scoreCycleAnchor: isoOffset(-8, 0),
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
})();
