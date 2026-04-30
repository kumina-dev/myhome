import PocketBase from 'pocketbase';
import {
  createPocketBaseAuthClient,
  PocketBaseAuthClient,
  PocketBaseAuthSession,
} from '../backend/pocketBaseAuth';
import {
  BackendAuthUserRecord,
  BackendCalendarEventRecord,
  BackendExpenseCategoryRecord,
  BackendExpenseRecord,
  BackendGroupMemberRecord,
  BackendGroupRecord,
  BackendGroupSettingsRecord,
  BackendNoteRecord,
  BackendNotificationItemRecord,
  BackendProfileRecord,
  BackendTaskRecord,
  BackendUserSettingsRecord,
} from './backendRecords';
import {
  AcceptInviteInput,
  AddEventInput,
  AddExpenseInput,
  AddNoteInput,
  AddTaskInput,
  AppSnapshot,
  CreateGroupInput,
  MemberRole,
  SignInInput,
  UpdateSettingsInput,
} from './models';
import { createDefaultSettings, createPocketBaseSnapshot } from './pocketBaseMappers';
import {
  AppLockSettingsUpdateInput,
  AppRepositories,
  AuthRepository,
  CalendarRepository,
  ExpenseRepository,
  GroupRepository,
  NotesRepository,
  RepositoryResult,
  SettingsRepository,
  TaskRepository,
} from './repositories';

const STARTER_EXPENSE_CATEGORIES = [
  'Groceries',
  'Home supplies',
  'Transport',
  'Entertainment',
  'Other',
];

function emptyResult(): RepositoryResult {
  return {
    snapshot: createPocketBaseSnapshot({
      currentUser: null,
      currentProfile: null,
      activeGroup: null,
      members: [],
      profiles: [],
      expenseCategories: [],
      expenses: [],
      notes: [],
      calendarEvents: [],
      tasks: [],
      notifications: [],
    }),
  };
}

function unchanged(snapshot: AppSnapshot): RepositoryResult {
  return { snapshot };
}

function unsupported(message: string): never {
  throw new Error(message);
}

function isMissingRecordError(caught: unknown): boolean {
  return (
    typeof caught === 'object' &&
    caught !== null &&
    'status' in caught &&
    (caught as { status?: number }).status === 404
  );
}

async function getOptionalFirst<T>(
  client: PocketBase,
  collectionName: string,
  filter: string,
): Promise<T | null> {
  try {
    return await client.collection(collectionName).getFirstListItem<T>(filter);
  } catch (caught) {
    if (isMissingRecordError(caught)) return null;
    throw caught;
  }
}

async function getOptionalOne<T>(
  client: PocketBase,
  collectionName: string,
  id: string,
): Promise<T | null> {
  try {
    return await client.collection(collectionName).getOne<T>(id);
  } catch (caught) {
    if (isMissingRecordError(caught)) return null;
    throw caught;
  }
}

function buildIdOrFilter(client: PocketBase, ids: string[], prefix: string): string {
  return ids
    .map((id, index) =>
      client.filter(`id = {:${prefix}${index}}`, {
        [`${prefix}${index}`]: id,
      }),
    )
    .join(' || ');
}

function visibleUnreadNotificationFilter(
  client: PocketBase,
  groupId: string,
  userId: string,
): string {
  return client.filter(
    'group = {:groupId} && isRead = false && (targetUser = null || targetUser = {:userId})',
    { groupId, userId },
  );
}

function defaultUserSettingsPayload(userId: string) {
  const defaults = createDefaultSettings();

  return {
    user: userId,
    themeMode: defaults.themeMode,
    localePreference: defaults.localePreference,
    defaultTab: defaults.defaultTab,
    currencyCode: defaults.currencyCode,
    calendarDefaultView: defaults.calendarDefaultView,
  };
}

function defaultGroupSettingsPayload(groupId: string) {
  const defaults = createDefaultSettings();

  return {
    group: groupId,
    scoreCycleDays: String(defaults.scoreCycleDays),
    scoreCycleAnchor: defaults.scoreCycleAnchor,
    weekStartsOn: defaults.weekStartsOn,
    showCompletedTasks: defaults.showCompletedTasks,
    showPersonalTasksOnHome: defaults.showPersonalTasksOnHome,
    eventReminders: defaults.notifications.eventReminders,
    taskReminders: defaults.notifications.taskReminders,
    noteAlerts: defaults.notifications.noteAlerts,
    expenseAlerts: defaults.notifications.expenseAlerts,
    sharedTaskBroadcasts: defaults.notifications.sharedTaskBroadcasts,
  };
}

class PocketBaseWorkspaceReader {
  constructor(private readonly client: PocketBase) {}

  async read(session: PocketBaseAuthSession): Promise<RepositoryResult> {
    if (!session.isAuthenticated || !session.userId || !session.email) {
      return emptyResult();
    }

    const currentUser: BackendAuthUserRecord = {
      id: session.userId,
      email: session.email,
      created: '',
      updated: '',
    };

    const currentProfile = await getOptionalFirst<BackendProfileRecord>(
      this.client,
      'profiles',
      this.client.filter('user = {:userId}', {
        userId: session.userId,
      }),
    );

    const userSettings = await getOptionalFirst<BackendUserSettingsRecord>(
      this.client,
      'user_settings',
      this.client.filter('user = {:userId}', {
        userId: session.userId,
      }),
    );

    const activeMembership = await getOptionalFirst<BackendGroupMemberRecord>(
      this.client,
      'group_members',
      this.client.filter('user = {:userId} && removedAt = null', {
        userId: session.userId,
      }),
    );

    if (!currentProfile || !activeMembership) {
      return {
        snapshot: createPocketBaseSnapshot({
          currentUser,
          currentProfile,
          activeGroup: null,
          members: [],
          profiles: currentProfile ? [currentProfile] : [],
          userSettings,
          groupSettings: null,
          expenseCategories: [],
          expenses: [],
          notes: [],
          calendarEvents: [],
          tasks: [],
          notifications: [],
        }),
      };
    }

    const activeGroup = await getOptionalOne<BackendGroupRecord>(
      this.client,
      'groups',
      activeMembership.group,
    );

    if (!activeGroup) {
      return {
        snapshot: createPocketBaseSnapshot({
          currentUser,
          currentProfile,
          activeGroup: null,
          members: [activeMembership],
          profiles: [currentProfile],
          userSettings,
          groupSettings: null,
          expenseCategories: [],
          expenses: [],
          notes: [],
          calendarEvents: [],
          tasks: [],
          notifications: [],
        }),
      };
    }

    const members = await this.client
      .collection('group_members')
      .getFullList<BackendGroupMemberRecord>({
        filter: this.client.filter('group = {:groupId} && removedAt = null', {
          groupId: activeGroup.id,
        }),
        sort: 'joinedAt',
      });

    const profileIds = members.map((member) => member.profile);

    const profiles = profileIds.length
      ? await this.client.collection('profiles').getFullList<BackendProfileRecord>({
          filter: buildIdOrFilter(this.client, profileIds, 'profile'),
        })
      : [];

    const groupSettings = await getOptionalFirst<BackendGroupSettingsRecord>(
      this.client,
      'group_settings',
      this.client.filter('group = {:groupId}', {
        groupId: activeGroup.id,
      }),
    );

    const expenseCategories = await this.client
      .collection('expense_categories')
      .getFullList<BackendExpenseCategoryRecord>({
        filter: this.client.filter('group = {:groupId} && archivedAt = null', {
          groupId: activeGroup.id,
        }),
        sort: 'sortOrder,name',
      });

    const expenses = await this.client.collection('expenses').getFullList<BackendExpenseRecord>({
      filter: this.client.filter('group = {:groupId} && deletedAt = null', {
        groupId: activeGroup.id,
      }),
      sort: '-purchasedAt',
    });

    const notes = await this.client.collection('notes').getFullList<BackendNoteRecord>({
      filter: this.client.filter('group = {:groupId} && deletedAt = null', {
        groupId: activeGroup.id,
      }),
      sort: '-updated',
    });

    const calendarEvents = await this.client
      .collection('calendar_events')
      .getFullList<BackendCalendarEventRecord>({
        filter: this.client.filter('group = {:groupId} && deletedAt = null', {
          groupId: activeGroup.id,
        }),
        sort: 'startsAt',
      });

    const tasks = await this.client.collection('tasks').getFullList<BackendTaskRecord>({
      filter: this.client.filter('group = {:groupId} && deletedAt = null', {
        groupId: activeGroup.id,
      }),
      sort: 'dueAt',
    });

    const notifications = await this.client
      .collection('notification_items')
      .getFullList<BackendNotificationItemRecord>({
        filter: this.client.filter(
          'group = {:groupId} && (targetUser = "" || targetUser = null || targetUser = {:userId})',
          { groupId: activeGroup.id, userId: session.userId },
        ),
        sort: '-created',
      });

    return {
      snapshot: createPocketBaseSnapshot({
        currentUser,
        currentProfile,
        activeGroup,
        members,
        profiles,
        userSettings,
        groupSettings,
        expenseCategories,
        expenses,
        notes,
        calendarEvents,
        tasks,
        notifications,
      }),
    };
  }
}

class PocketBaseAuthRepository implements AuthRepository {
  private authClientPromise: Promise<PocketBaseAuthClient>;
  private snapshot: AppSnapshot | null = null;

  constructor(authClient?: PocketBaseAuthClient) {
    this.authClientPromise = authClient
      ? Promise.resolve(authClient)
      : createPocketBaseAuthClient();
  }

  async getClient(): Promise<PocketBase> {
    const authClient = await this.authClientPromise;
    return authClient.getClient();
  }

  private async readWorkspace(session: PocketBaseAuthSession): Promise<RepositoryResult> {
    const authClient = await this.authClientPromise;
    const reader = new PocketBaseWorkspaceReader(authClient.getClient());
    const result = await reader.read(session);
    this.snapshot = result.snapshot;

    return result;
  }

  async refresh(): Promise<RepositoryResult> {
    const authClient = await this.authClientPromise;
    const session = await authClient.bootstrap();

    return this.readWorkspace(session);
  }

  async bootstrap(): Promise<RepositoryResult> {
    const authClient = await this.authClientPromise;
    const session = await authClient.bootstrap();

    return this.readWorkspace(session);
  }

  async signIn(input: SignInInput): Promise<RepositoryResult> {
    const authClient = await this.authClientPromise;
    const session = await authClient.signIn(input);

    return this.readWorkspace(session);
  }

  private async ensureProfile(
    client: PocketBase,
    userId: string,
    input: CreateGroupInput,
  ): Promise<BackendProfileRecord> {
    const existing = await getOptionalFirst<BackendProfileRecord>(
      client,
      'profiles',
      client.filter('user = {:userId}', { userId }),
    );

    if (existing) return existing;

    return client.collection('profiles').create<BackendProfileRecord>({
      user: userId,
      displayName: input.displayName,
      colorKey: 'blue',
      createdBy: userId,
      updatedBy: userId,
    });
  }

  private async ensureGroup(
    client: PocketBase,
    userId: string,
    input: CreateGroupInput,
  ): Promise<BackendGroupRecord> {
    const existingMembership = await getOptionalFirst<BackendGroupMemberRecord>(
      client,
      'group_members',
      client.filter('user = {:userId} && removedAt = null', { userId }),
    );

    if (existingMembership) {
      const existingGroup = await getOptionalOne<BackendGroupRecord>(
        client,
        'groups',
        existingMembership.group,
      );

      if (existingGroup) return existingGroup;
    }

    const existingOwnedGroup = await getOptionalFirst<BackendGroupRecord>(
      client,
      'groups',
      client.filter('createdBy = {:userId}', { userId }),
    );

    if (existingOwnedGroup) return existingOwnedGroup;

    console.log('PB group create auth', {
      isValid: client.authStore.isValid,
      authUserId: client.authStore.record?.id,
      payload: {
        name: input.groupName,
        createdBy: userId,
      },
    });
    return client.collection('groups').create<BackendGroupRecord>({
      name: input.groupName,
    });
  }

  private async ensureMembership({
    client,
    groupId,
    userId,
    profileId,
  }: {
    client: PocketBase;
    groupId: string;
    userId: string;
    profileId: string;
  }): Promise<BackendGroupMemberRecord> {
    const existing = await getOptionalFirst<BackendGroupMemberRecord>(
      client,
      'group_members',
      client.filter('group = {:groupId} && user = {:userId}', { groupId, userId }),
    );

    if (existing) return existing;

    return client.collection('group_members').create<BackendGroupMemberRecord>({
      group: groupId,
      user: userId,
      profile: profileId,
      role: 'member',
      joinedAt: new Date().toISOString(),
    });
  }

  private async ensureUserSettings(client: PocketBase, userId: string) {
    const existing = await getOptionalFirst<BackendUserSettingsRecord>(
      client,
      'user_settings',
      client.filter('user = {:userId}', { userId }),
    );

    if (existing) return existing;

    return client
      .collection('user_settings')
      .create<BackendUserSettingsRecord>(defaultUserSettingsPayload(userId));
  }

  private async ensureGroupSettings(client: PocketBase, groupId: string) {
    const existing = await getOptionalFirst<BackendGroupSettingsRecord>(
      client,
      'group_settings',
      client.filter('group = {:groupId}', { groupId }),
    );

    if (existing) return existing;

    return client
      .collection('group_settings')
      .create<BackendGroupSettingsRecord>(defaultGroupSettingsPayload(groupId));
  }

  private async ensureStarterCategories(client: PocketBase, groupId: string, userId: string) {
    for (const [index, name] of STARTER_EXPENSE_CATEGORIES.entries()) {
      const existing = await getOptionalFirst<BackendExpenseCategoryRecord>(
        client,
        'expense_categories',
        client.filter('group = {:groupId} && name = {:name} && archivedAt = null', {
          groupId,
          name,
        }),
      );

      if (!existing) {
        await client.collection('expense_categories').create({
          group: groupId,
          name,
          sortOrder: index + 1,
          createdBy: userId,
          updatedBy: userId,
        });
      }
    }
  }

  async createGroupOwner(input: CreateGroupInput): Promise<RepositoryResult> {
    const authClient = await this.authClientPromise;
    let session = await authClient.bootstrap();

    if (!session.isAuthenticated) {
      session = await authClient.signIn({
        email: input.email,
        password: input.password,
      });
    }

    if (!session.userId || !session.email) {
      throw new Error('PocketBase did not return an authenticated user.');
    }

    if (session.email.trim().toLowerCase() !== input.email.trim().toLowerCase()) {
      throw new Error('Signed-in PocketBase user does not match the submitted email.');
    }

    const client = authClient.getClient();
    const profile = await this.ensureProfile(client, session.userId, input);
    const group = await this.ensureGroup(client, session.userId, input);

    await this.ensureMembership({
      client,
      groupId: group.id,
      userId: session.userId,
      profileId: profile.id,
    });
    await this.ensureUserSettings(client, session.userId);
    await this.ensureGroupSettings(client, group.id);
    await this.ensureStarterCategories(client, group.id, session.userId);

    return this.readWorkspace(session);
  }

  async acceptInvite(_input: AcceptInviteInput): Promise<RepositoryResult> {
    unsupported(
      'PocketBase invite acceptance needs server-side token validation before it can be wired safely.',
    );
  }

  async signOut(): Promise<RepositoryResult> {
    const authClient = await this.authClientPromise;
    await authClient.signOut();
    const result = emptyResult();
    this.snapshot = result.snapshot;

    return result;
  }

  async unlockApp(_pin: string): Promise<RepositoryResult> {
    return unchanged(this.requireSnapshot());
  }

  async lockApp(): Promise<RepositoryResult> {
    return unchanged(this.requireSnapshot());
  }

  async registerBackgroundedAt(_timestamp: string): Promise<RepositoryResult> {
    return unchanged(this.requireSnapshot());
  }

  async revalidateAppLock(_timestamp: string): Promise<RepositoryResult> {
    return unchanged(this.requireSnapshot());
  }

  getSnapshot(): AppSnapshot {
    return this.requireSnapshot();
  }

  private requireSnapshot(): AppSnapshot {
    if (!this.snapshot) {
      throw new Error('PocketBase repository has not bootstrapped yet.');
    }

    return this.snapshot;
  }
}

class PocketBaseGroupRepository implements GroupRepository {
  constructor(private readonly authRepository: PocketBaseAuthRepository) {}

  async updateGroupName(_value: string): Promise<RepositoryResult> {
    unsupported('PocketBase group updates are not wired yet.');
  }

  async inviteMember(_email: string, _profileNameHint: string): Promise<RepositoryResult> {
    unsupported('PocketBase invites are not wired yet.');
  }

  async revokeInvite(_inviteId: string): Promise<RepositoryResult> {
    unsupported('PocketBase invites are not wired yet.');
  }

  async updateMemberRole(_memberId: string, _role: MemberRole): Promise<RepositoryResult> {
    unsupported('PocketBase member role updates are not wired yet.');
  }

  async removeMember(_memberId: string): Promise<RepositoryResult> {
    unsupported('PocketBase member removal is not wired yet.');
  }
}

class PocketBaseFeatureRepository
  implements
    ExpenseRepository,
    NotesRepository,
    CalendarRepository,
    TaskRepository,
    SettingsRepository
{
  constructor(private readonly authRepository: PocketBaseAuthRepository) {}

  private getSession() {
    const session = this.authRepository.getSnapshot().sessionState.session;

    if (!session) {
      throw new Error('You need to sign in first.');
    }

    return session;
  }

  async addExpense(input: AddExpenseInput): Promise<RepositoryResult> {
    const client = await this.authRepository.getClient();
    const session = this.getSession();
    const category = await getOptionalFirst<BackendExpenseCategoryRecord>(
      client,
      'expense_categories',
      client.filter('group = {:groupId} && name = {:name} && archivedAt = null', {
        groupId: session.groupId,
        name: input.category,
      }),
    );

    await client.collection('expenses').create({
      group: session.groupId,
      buyer: input.buyerUserId,
      title: input.title,
      amountCents: input.amountCents,
      currencyCode: this.authRepository.getSnapshot().settings.currencyCode,
      purchasedAt: input.purchasedAt,
      category: category?.id,
      notes: input.notes,
      createdBy: session.userId,
      updatedBy: session.userId,
    });

    return this.authRepository.refresh();
  }

  async addNote(input: AddNoteInput): Promise<RepositoryResult> {
    const client = await this.authRepository.getClient();
    const session = this.getSession();

    await client.collection('notes').create({
      group: session.groupId,
      author: session.userId,
      title: input.title,
      body: input.body,
      isPinned: input.isPinned,
      createdBy: session.userId,
      updatedBy: session.userId,
    });

    return this.authRepository.refresh();
  }

  async toggleNotePinned(noteId: string): Promise<RepositoryResult> {
    const client = await this.authRepository.getClient();
    const session = this.getSession();
    const note = this.authRepository.getSnapshot().notes.find((item) => item.id === noteId);

    if (!note) throw new Error('Unknown note.');

    await client.collection('notes').update(noteId, {
      isPinned: !note.isPinned,
      updatedBy: session.userId,
    });

    return this.authRepository.refresh();
  }

  async addEvent(input: AddEventInput): Promise<RepositoryResult> {
    const client = await this.authRepository.getClient();
    const session = this.getSession();

    await client.collection('calendar_events').create({
      group: session.groupId,
      title: input.title,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      colorKey: input.colorKey,
      notes: input.notes,
      createdBy: session.userId,
      updatedBy: session.userId,
    });

    return this.authRepository.refresh();
  }

  async addTask(input: AddTaskInput): Promise<RepositoryResult> {
    const client = await this.authRepository.getClient();
    const session = this.getSession();

    await client.collection('tasks').create({
      group: session.groupId,
      title: input.title,
      scope: input.scope,
      assignee: input.assigneeUserId,
      points: input.points,
      dueAt: input.dueAt,
      createdBy: session.userId,
      updatedBy: session.userId,
    });

    return this.authRepository.refresh();
  }

  async toggleTaskComplete(taskId: string, completedByUserId: string): Promise<RepositoryResult> {
    const client = await this.authRepository.getClient();
    const session = this.getSession();
    const task = this.authRepository.getSnapshot().tasks.find((item) => item.id === taskId);

    if (!task) throw new Error('Unknown task.');

    const completedAt = task.completedAt ? undefined : new Date().toISOString();

    await client.collection('tasks').update(taskId, {
      completedAt,
      completedBy: completedAt ? completedByUserId : undefined,
      updatedBy: session.userId,
    });

    return this.authRepository.refresh();
  }

  async updateSettings(input: UpdateSettingsInput): Promise<RepositoryResult> {
    const client = await this.authRepository.getClient();
    const session = this.getSession();

    const userPatch = {
      themeMode: input.themeMode,
      localePreference: input.localePreference,
      defaultTab: input.defaultTab,
      currencyCode: input.currencyCode,
      calendarDefaultView: input.calendarDefaultView,
    };
    const groupPatch = {
      scoreCycleDays: input.scoreCycleDays === undefined ? undefined : String(input.scoreCycleDays),
      scoreCycleAnchor: input.scoreCycleAnchor,
      weekStartsOn: input.weekStartsOn,
      showCompletedTasks: input.showCompletedTasks,
      showPersonalTasksOnHome: input.showPersonalTasksOnHome,
      eventReminders: input.notifications?.eventReminders,
      taskReminders: input.notifications?.taskReminders,
      noteAlerts: input.notifications?.noteAlerts,
      expenseAlerts: input.notifications?.expenseAlerts,
      sharedTaskBroadcasts: input.notifications?.sharedTaskBroadcasts,
    };

    const cleanUserPatch = Object.fromEntries(
      Object.entries(userPatch).filter(([, value]) => value !== undefined),
    );
    const cleanGroupPatch = Object.fromEntries(
      Object.entries(groupPatch).filter(([, value]) => value !== undefined),
    );

    if (Object.keys(cleanUserPatch).length) {
      const userSettings = await getOptionalFirst<BackendUserSettingsRecord>(
        client,
        'user_settings',
        client.filter('user = {:userId}', { userId: session.userId }),
      );

      if (!userSettings) throw new Error('User settings are missing.');

      await client.collection('user_settings').update(userSettings.id, cleanUserPatch);
    }

    if (Object.keys(cleanGroupPatch).length) {
      const groupSettings = await getOptionalFirst<BackendGroupSettingsRecord>(
        client,
        'group_settings',
        client.filter('group = {:groupId}', { groupId: session.groupId }),
      );

      if (!groupSettings) throw new Error('Group settings are missing.');

      await client.collection('group_settings').update(groupSettings.id, cleanGroupPatch);
    }

    return this.authRepository.refresh();
  }

  async addExpenseCategory(value: string): Promise<RepositoryResult> {
    const cleaned = value.trim();

    if (!cleaned) return unchanged(this.authRepository.getSnapshot());

    const client = await this.authRepository.getClient();
    const session = this.getSession();

    const existing = await getOptionalFirst<BackendExpenseCategoryRecord>(
      client,
      'expense_categories',
      client.filter('group = {:groupId} && name = {:name} && archivedAt = null', {
        groupId: session.groupId,
        name: cleaned,
      }),
    );

    if (!existing) {
      await client.collection('expense_categories').create({
        group: session.groupId,
        name: cleaned,
        sortOrder: this.authRepository.getSnapshot().settings.expenseCategories.length + 1,
        createdBy: session.userId,
        updatedBy: session.userId,
      });
    }

    return this.authRepository.refresh();
  }

  async removeExpenseCategory(value: string): Promise<RepositoryResult> {
    const client = await this.authRepository.getClient();
    const session = this.getSession();
    const category = await getOptionalFirst<BackendExpenseCategoryRecord>(
      client,
      'expense_categories',
      client.filter('group = {:groupId} && name = {:name} && archivedAt = null', {
        groupId: session.groupId,
        name: value,
      }),
    );

    if (category) {
      await client.collection('expense_categories').update(category.id, {
        archivedAt: new Date().toISOString(),
        updatedBy: session.userId,
      });
    }

    return this.authRepository.refresh();
  }

  async markAllNotificationsRead(): Promise<RepositoryResult> {
    const client = await this.authRepository.getClient();
    const session = this.getSession();

    const notifications = await client
      .collection('notification_items')
      .getFullList<BackendNotificationItemRecord>({
        filter: visibleUnreadNotificationFilter(client, session.groupId, session.userId),
      });

    await Promise.all(
      notifications.map((notification) =>
        client.collection('notification_items').update(notification.id, {
          isRead: true,
          updatedBy: session.userId,
        }),
      ),
    );

    return this.authRepository.refresh();
  }

  async updateAppLockSettings(_input: AppLockSettingsUpdateInput): Promise<RepositoryResult> {
    return unchanged(this.authRepository.getSnapshot());
  }
}

export function createPocketBaseRepositoriesForAuthClient(
  authClient: PocketBaseAuthClient,
): AppRepositories {
  const authRepository = new PocketBaseAuthRepository(authClient);
  const groupRepository = new PocketBaseGroupRepository(authRepository);
  const featureRepository = new PocketBaseFeatureRepository(authRepository);

  return {
    authRepository,
    groupRepository,
    expenseRepository: featureRepository,
    notesRepository: featureRepository,
    calendarRepository: featureRepository,
    taskRepository: featureRepository,
    settingsRepository: featureRepository,
  };
}

export function createPocketBaseRepositories(): AppRepositories {
  const authRepository = new PocketBaseAuthRepository();
  const groupRepository = new PocketBaseGroupRepository(authRepository);
  const featureRepository = new PocketBaseFeatureRepository(authRepository);

  return {
    authRepository,
    groupRepository,
    expenseRepository: featureRepository,
    notesRepository: featureRepository,
    calendarRepository: featureRepository,
    taskRepository: featureRepository,
    settingsRepository: featureRepository,
  };
}
