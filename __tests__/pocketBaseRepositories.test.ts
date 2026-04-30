jest.mock('../src/backend/pocketBaseAuth', () => ({
  createPocketBaseAuthClient: jest.fn(),
}));

import { PocketBaseAuthClient } from '../src/backend/pocketBaseAuth';
import { createPocketBaseRepositoriesForAuthClient } from '../src/store/pocketBaseRepositories';

type RecordData = Record<string, any>;

function missing() {
  const error = new Error('Missing') as Error & { status: number };
  error.status = 404;
  return error;
}

class FakeCollection {
  constructor(private readonly name: string, private readonly db: Record<string, RecordData[]>) {}

  private records() {
    this.db[this.name] ??= [];
    return this.db[this.name];
  }

  async getFirstListItem(filter: string) {
    const record = this.records().find((item) => matches(this.name, item, filter));
    if (!record) throw missing();
    return record;
  }

  async getOne(id: string) {
    const record = this.records().find((item) => item.id === id);
    if (!record) throw missing();
    return record;
  }

  async getFullList(options: { filter?: string; sort?: string } = {}) {
    const rows = options.filter
      ? this.records().filter((item) => matches(this.name, item, options.filter as string))
      : [...this.records()];

    if (options.sort === 'sortOrder,name') {
      return rows.sort(
        (a, b) =>
          Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0) ||
          String(a.name).localeCompare(String(b.name)),
      );
    }

    return rows;
  }

  async create(input: RecordData) {
    const now = '2026-04-30T12:00:00.000Z';
    const record = {
      id: `${this.name}-${this.records().length + 1}`,
      created: now,
      updated: now,
      ...input,
    };

    this.records().push(record);
    return record;
  }

  async update(id: string, input: RecordData) {
    const index = this.records().findIndex((item) => item.id === id);
    if (index < 0) throw missing();

    this.records()[index] = {
      ...this.records()[index],
      ...input,
      updated: '2026-04-30T12:05:00.000Z',
    };

    return this.records()[index];
  }
}

class FakePocketBase {
  constructor(private readonly db: Record<string, RecordData[]>) {}

  collection(name: string) {
    return new FakeCollection(name, this.db);
  }

  filter(template: string, params: Record<string, unknown>) {
    return JSON.stringify({ template, params });
  }
}

function decode(filter: string): {
  template: string;
  params: Record<string, any>;
} {
  try {
    return JSON.parse(filter);
  } catch {
    return { template: filter, params: {} };
  }
}

function matches(collection: string, record: RecordData, filter: string) {
  if (!filter) return true;

  const decoded = decode(filter);

  if (decoded.template === filter && filter.includes(' || ')) {
    return filter.split(' || ').some((part) => matches(collection, record, part));
  }

  const { template, params } = decoded;

  if (template.includes('id = {:profile')) {
    return record.id === Object.values(params)[0];
  }

  if (
    collection !== 'notification_items' &&
    template.includes('user = {:userId}') &&
    record.user !== params.userId
  ) {
    return false;
  }

  if (template.includes('createdBy = {:userId}') && record.createdBy !== params.userId) {
    return false;
  }

  if (template.includes('group = {:groupId}') && record.group !== params.groupId) {
    return false;
  }

  if (template.includes('name = {:name}') && record.name !== params.name) {
    return false;
  }

  if (template.includes('isRead = false') && record.isRead !== false) {
    return false;
  }

  if (template.includes('removedAt = null') && record.removedAt) {
    return false;
  }

  if (template.includes('archivedAt = null') && record.archivedAt) {
    return false;
  }

  if (template.includes('deletedAt = null') && record.deletedAt) {
    return false;
  }

  if (collection === 'notification_items' && template.includes('targetUser')) {
    return !record.targetUser || record.targetUser === params.userId;
  }

  return true;
}

function makeAuthClient(
  db: Record<string, RecordData[]>,
  session = {
    isAuthenticated: true,
    userId: 'user-1',
    email: 'owner@example.com',
  },
): PocketBaseAuthClient {
  let currentSession = session;

  return {
    async bootstrap() {
      return currentSession;
    },
    async signIn() {
      currentSession = session;
      return currentSession;
    },
    async signOut() {
      currentSession = {
        isAuthenticated: false,
        userId: null,
        email: null,
      };
      return currentSession;
    },
    getClient() {
      return new FakePocketBase(db) as never;
    },
  };
}

describe('PocketBase repositories', () => {
  it('returns setup-incomplete snapshot for an authenticated user without app records', async () => {
    const db: Record<string, RecordData[]> = {};
    const repos = createPocketBaseRepositoriesForAuthClient(makeAuthClient(db));

    const result = await repos.authRepository.bootstrap();

    expect(result.snapshot.authUsers).toEqual([
      {
        id: 'user-1',
        email: 'owner@example.com',
        profileId: '',
      },
    ]);
    expect(result.snapshot.sessionState.session).toBeNull();
    expect(result.snapshot.groups).toEqual([]);
  });

  it('createGroupOwner creates missing post-auth records', async () => {
    const db: Record<string, RecordData[]> = {};
    const repos = createPocketBaseRepositoriesForAuthClient(makeAuthClient(db));

    await repos.authRepository.createGroupOwner({
      groupName: 'Home',
      displayName: 'Owner',
      email: 'owner@example.com',
      password: 'secret',
    });

    expect(db.profiles).toHaveLength(1);
    expect(db.groups).toHaveLength(1);
    expect(db.group_members).toHaveLength(1);
    expect(db.user_settings).toHaveLength(1);
    expect(db.group_settings).toHaveLength(1);
    expect(db.expense_categories.map((item) => item.name)).toEqual([
      'Groceries',
      'Home supplies',
      'Transport',
      'Entertainment',
      'Other',
    ]);
  });

  it('createGroupOwner reuses existing partial setup records', async () => {
    const db: Record<string, RecordData[]> = {
      profiles: [
        {
          id: 'profile-existing',
          user: 'user-1',
          displayName: 'Owner',
          colorKey: 'blue',
          created: '',
          updated: '',
        },
      ],
      groups: [
        {
          id: 'group-existing',
          name: 'Home',
          createdBy: 'user-1',
          created: '',
          updated: '',
        },
      ],
      expense_categories: [
        {
          id: 'category-existing',
          group: 'group-existing',
          name: 'Groceries',
          sortOrder: 1,
          created: '',
          updated: '',
        },
      ],
    };
    const repos = createPocketBaseRepositoriesForAuthClient(makeAuthClient(db));

    await repos.authRepository.createGroupOwner({
      groupName: 'Home',
      displayName: 'Owner',
      email: 'owner@example.com',
      password: 'secret',
    });

    expect(db.profiles).toHaveLength(1);
    expect(db.groups).toHaveLength(1);
    expect(db.group_members).toHaveLength(1);
    expect(db.user_settings).toHaveLength(1);
    expect(db.group_settings).toHaveLength(1);
    expect(db.expense_categories.filter((item) => item.name === 'Groceries')).toHaveLength(1);
  });

  it('updateSettings writes user and group settings to the correct collections', async () => {
    const db = seededWorkspace();
    const repos = createPocketBaseRepositoriesForAuthClient(makeAuthClient(db));

    await repos.authRepository.bootstrap();
    await repos.settingsRepository.updateSettings({
      currencyCode: 'USD',
      themeMode: 'dark',
      scoreCycleDays: 28,
      notifications: {
        taskReminders: false,
      },
    });

    expect(db.user_settings[0]).toMatchObject({
      currencyCode: 'USD',
      themeMode: 'dark',
    });
    expect(db.user_settings[0].scoreCycleDays).toBeUndefined();

    expect(db.group_settings[0]).toMatchObject({
      scoreCycleDays: 28,
      taskReminders: false,
    });
    expect(db.group_settings[0].currencyCode).toBeUndefined();
  });

  it('markAllNotificationsRead updates only visible unread notifications', async () => {
    const db = seededWorkspace();

    db.notification_items = [
      {
        id: 'visible-group',
        group: 'group-1',
        type: 'group',
        title: 'A',
        body: 'A',
        isRead: false,
        created: '',
        updated: '',
      },
      {
        id: 'visible-targeted',
        group: 'group-1',
        targetUser: 'user-1',
        type: 'task',
        title: 'B',
        body: 'B',
        isRead: false,
        created: '',
        updated: '',
      },
      {
        id: 'other-target',
        group: 'group-1',
        targetUser: 'user-2',
        type: 'task',
        title: 'C',
        body: 'C',
        isRead: false,
        created: '',
        updated: '',
      },
      {
        id: 'other-group',
        group: 'group-2',
        type: 'group',
        title: 'D',
        body: 'D',
        isRead: false,
        created: '',
        updated: '',
      },
      {
        id: 'already-read',
        group: 'group-1',
        type: 'group',
        title: 'E',
        body: 'E',
        isRead: true,
        created: '',
        updated: '',
      },
    ];

    const repos = createPocketBaseRepositoriesForAuthClient(makeAuthClient(db));

    await repos.authRepository.bootstrap();
    await repos.settingsRepository.markAllNotificationsRead();

    expect(db.notification_items.find((item) => item.id === 'visible-group')?.isRead).toBe(true);
    expect(db.notification_items.find((item) => item.id === 'visible-targeted')?.isRead).toBe(true);
    expect(db.notification_items.find((item) => item.id === 'other-target')?.isRead).toBe(false);
    expect(db.notification_items.find((item) => item.id === 'other-group')?.isRead).toBe(false);
    expect(db.notification_items.find((item) => item.id === 'already-read')?.isRead).toBe(true);
  });
});

function seededWorkspace(): Record<string, RecordData[]> {
  return {
    profiles: [
      {
        id: 'profile-1',
        user: 'user-1',
        displayName: 'Owner',
        colorKey: 'blue',
        created: '',
        updated: '',
      },
    ],
    groups: [
      {
        id: 'group-1',
        name: 'Home',
        createdBy: 'user-1',
        created: '',
        updated: '',
      },
    ],
    group_members: [
      {
        id: 'member-1',
        group: 'group-1',
        user: 'user-1',
        profile: 'profile-1',
        role: 'owner',
        joinedAt: '',
        created: '',
        updated: '',
      },
    ],
    user_settings: [
      {
        id: 'user-settings-1',
        user: 'user-1',
        themeMode: 'system',
        localePreference: 'system',
        defaultTab: 'home',
        currencyCode: 'EUR',
        calendarDefaultView: 'month',
        created: '',
        updated: '',
      },
    ],
    group_settings: [
      {
        id: 'group-settings-1',
        group: 'group-1',
        scoreCycleDays: 14,
        scoreCycleAnchor: '',
        weekStartsOn: 'monday',
        showCompletedTasks: true,
        showPersonalTasksOnHome: true,
        eventReminders: true,
        taskReminders: true,
        noteAlerts: true,
        expenseAlerts: true,
        sharedTaskBroadcasts: true,
        created: '',
        updated: '',
      },
    ],
    expense_categories: [],
    expenses: [],
    notes: [],
    calendar_events: [],
    tasks: [],
    notification_items: [],
  };
}
