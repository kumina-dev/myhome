import { createDefaultSettings, createPocketBaseSnapshot } from '../src/store/pocketBaseMappers';

const now = '2026-04-30T12:00:00.000Z';

describe('PocketBase mappers', () => {
  it('handles an unauthenticated empty snapshot', () => {
    const snapshot = createPocketBaseSnapshot({
      currentUser: null,
      currentProfile: null,
      activeGroup: null,
      members: [],
      profiles: [],
    });

    expect(snapshot.sessionState.session).toBeNull();
    expect(snapshot.authUsers).toEqual([]);
    expect(snapshot.groups).toEqual([]);
    expect(snapshot.settings.currencyCode).toBe('EUR');
  });

  it('maps a full workspace with settings, categories, and notifications', () => {
    const snapshot = createPocketBaseSnapshot({
      currentUser: {
        id: 'user-1',
        email: 'owner@example.com',
        created: now,
        updated: now,
      },
      currentProfile: {
        id: 'profile-1',
        user: 'user-1',
        displayName: 'Owner',
        colorKey: 'blue',
        created: now,
        updated: now,
      },
      activeGroup: {
        id: 'group-1',
        name: 'Home',
        createdBy: 'user-1',
        created: now,
        updated: now,
      },
      members: [
        {
          id: 'member-1',
          group: 'group-1',
          user: 'user-1',
          profile: 'profile-1',
          role: 'owner',
          joinedAt: now,
          created: now,
          updated: now,
        },
      ],
      profiles: [
        {
          id: 'profile-1',
          user: 'user-1',
          displayName: 'Owner',
          colorKey: 'blue',
          created: now,
          updated: now,
        },
      ],
      userSettings: {
        id: 'user-settings-1',
        user: 'user-1',
        themeMode: 'dark',
        localePreference: 'fi',
        defaultTab: 'tasks',
        currencyCode: 'USD',
        calendarDefaultView: 'agenda',
        created: now,
        updated: now,
      },
      groupSettings: {
        id: 'group-settings-1',
        group: 'group-1',
        scoreCycleDays: '28',
        scoreCycleAnchor: now,
        weekStartsOn: 'sunday',
        showCompletedTasks: false,
        showPersonalTasksOnHome: false,
        eventReminders: false,
        taskReminders: false,
        noteAlerts: false,
        expenseAlerts: false,
        sharedTaskBroadcasts: false,
        created: now,
        updated: now,
      },
      expenseCategories: [
        {
          id: 'category-1',
          group: 'group-1',
          name: 'Groceries',
          sortOrder: 1,
          created: now,
          updated: now,
        },
      ],
      notifications: [
        {
          id: 'notification-1',
          group: 'group-1',
          type: 'group',
          title: 'Hello',
          body: 'World',
          isRead: false,
          created: now,
          updated: now,
        },
      ],
    });

    expect(snapshot.sessionState.session).toEqual({
      userId: 'user-1',
      profileId: 'profile-1',
      groupId: 'group-1',
      email: 'owner@example.com',
    });
    expect(snapshot.settings.themeMode).toBe('dark');
    expect(snapshot.settings.localePreference).toBe('fi');
    expect(snapshot.settings.defaultTab).toBe('tasks');
    expect(snapshot.settings.currencyCode).toBe('USD');
    expect(snapshot.settings.calendarDefaultView).toBe('agenda');
    expect(snapshot.settings.scoreCycleDays).toBe(28);
    expect(snapshot.settings.weekStartsOn).toBe('sunday');
    expect(snapshot.settings.expenseCategories).toEqual(['Groceries']);
    expect(snapshot.notifications).toHaveLength(1);
  });

  it('fills missing optional backend settings from frontend defaults', () => {
    const defaults = createDefaultSettings();

    const snapshot = createPocketBaseSnapshot({
      currentUser: null,
      currentProfile: null,
      activeGroup: null,
      members: [],
      profiles: [],
      userSettings: {
        id: 'user-settings-1',
        user: 'user-1',
        currencyCode: 'GBP',
        created: now,
        updated: now,
      },
      groupSettings: {
        id: 'group-settings-1',
        group: 'group-1',
        scoreCycleDays: undefined,
        created: now,
        updated: now,
      },
    });

    expect(snapshot.settings.currencyCode).toBe('GBP');
    expect(snapshot.settings.themeMode).toBe(defaults.themeMode);
    expect(snapshot.settings.defaultTab).toBe(defaults.defaultTab);
    expect(snapshot.settings.scoreCycleDays).toBe(defaults.scoreCycleDays);
    expect(snapshot.settings.eventColorKey).toBe(defaults.eventColorKey);
  });
});
