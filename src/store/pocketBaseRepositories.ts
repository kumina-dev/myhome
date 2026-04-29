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
  BackendNoteRecord,
  BackendProfileRecord,
  BackendTaskRecord,
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
import { createPocketBaseSnapshot } from './pocketBaseMappers';
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
    }),
  };
}

function unchanged(snapshot: AppSnapshot): RepositoryResult {
  return { snapshot };
}

function unsupported(message: string): never {
  throw new Error(message);
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

    const currentProfile = await this.client
      .collection('profiles')
      .getFirstListItem<BackendProfileRecord>(
        this.client.filter('user = {:userId}', {
          userId: session.userId,
        }),
      );

    const activeMembership = await this.client
      .collection('group_members')
      .getFirstListItem<BackendGroupMemberRecord>(
        this.client.filter('user = {:userId} && removedAt = null', {
          userId: session.userId,
        }),
      );

    const activeGroup = await this.client
      .collection('groups')
      .getOne<BackendGroupRecord>(activeMembership.group);

    const members = await this.client
      .collection('group_members')
      .getFullList<BackendGroupMemberRecord>({
        filter: this.client.filter('group = {:groupId} && removedAt = null', {
          groupId: activeGroup.id,
        }),
        sort: 'joinedAt',
      });

    const profileIds = members.map(member => member.profile);

    const profiles = profileIds.length
      ? await this.client
          .collection('profiles')
          .getFullList<BackendProfileRecord>({
            filter: profileIds
              .map((_, index) => `id = {:profile${index}}`)
              .join(' || '),
            requestKey: null,
            ...Object.fromEntries(
              profileIds.map((profileId, index) => [
                `profile${index}`,
                profileId,
              ]),
            ),
          } as never)
      : [];

    const expenseCategories = await this.client
      .collection('expense_categories')
      .getFullList<BackendExpenseCategoryRecord>({
        filter: this.client.filter('group = {:groupId} && archivedAt = null', {
          groupId: activeGroup.id,
        }),
        sort: 'sortOrder,name',
      });

    const expenses = await this.client
      .collection('expenses')
      .getFullList<BackendExpenseRecord>({
        filter: this.client.filter('group = {:groupId} && deletedAt = null', {
          groupId: activeGroup.id,
        }),
        sort: '-purchasedAt',
      });

    const notes = await this.client
      .collection('notes')
      .getFullList<BackendNoteRecord>({
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

    const tasks = await this.client
      .collection('tasks')
      .getFullList<BackendTaskRecord>({
        filter: this.client.filter('group = {:groupId} && deletedAt = null', {
          groupId: activeGroup.id,
        }),
        sort: 'dueAt',
      });

    return {
      snapshot: createPocketBaseSnapshot({
        currentUser,
        currentProfile,
        activeGroup,
        members,
        profiles,
        expenseCategories,
        expenses,
        notes,
        calendarEvents,
        tasks,
      }),
    };
  }
}

class PocketBaseAuthRepository implements AuthRepository {
  private authClientPromise: Promise<PocketBaseAuthClient>;
  private snapshot: AppSnapshot | null = null;

  constructor() {
    this.authClientPromise = createPocketBaseAuthClient();
  }

  async getClient(): Promise<PocketBase> {
    const authClient = await this.authClientPromise;
    return authClient.getClient();
  }

  private async readWorkspace(
    session: PocketBaseAuthSession,
  ): Promise<RepositoryResult> {
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

  async createGroupOwner(input: CreateGroupInput): Promise<RepositoryResult> {
    const authClient = await this.authClientPromise;
    const client = authClient.getClient();

    await client.collection('users').create({
      email: input.email,
      password: input.password,
      passwordConfirm: input.password,
    });

    const session = await authClient.signIn({
      email: input.email,
      password: input.password,
    });

    if (!session.userId) {
      throw new Error('PocketBase did not return an authenticated user.');
    }

    const profile = await client
      .collection('profiles')
      .create<BackendProfileRecord>({
        user: session.userId,
        displayName: input.displayName,
        colorKey: 'blue',
        createdBy: session.userId,
        updatedBy: session.userId,
      });

    const group = await client.collection('groups').create<BackendGroupRecord>({
      name: input.groupName,
      createdBy: session.userId,
    });

    await client.collection('group_members').create({
      group: group.id,
      user: session.userId,
      profile: profile.id,
      role: 'owner',
      joinedAt: new Date().toISOString(),
    });

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
    unsupported('PocketBase group updates are not wired in Batch 6.');
  }

  async inviteMember(
    _email: string,
    _profileNameHint: string,
  ): Promise<RepositoryResult> {
    unsupported('PocketBase invites are not wired in Batch 6.');
  }

  async revokeInvite(_inviteId: string): Promise<RepositoryResult> {
    unsupported('PocketBase invites are not wired in Batch 6.');
  }

  async updateMemberRole(
    _memberId: string,
    _role: MemberRole,
  ): Promise<RepositoryResult> {
    unsupported('PocketBase member role updates are not wired in Batch 6.');
  }

  async removeMember(_memberId: string): Promise<RepositoryResult> {
    unsupported('PocketBase member removal is not wired in Batch 6.');
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
    const category = await client
      .collection('expense_categories')
      .getFirstListItem<BackendExpenseCategoryRecord>(
        client.filter(
          'group = {:groupId} && name = {:name} && archivedAt = null',
          {
            groupId: session.groupId,
            name: input.category,
          },
        ),
      );

    await client.collection('expenses').create({
      group: session.groupId,
      buyer: input.buyerUserId,
      title: input.title,
      amountCents: input.amountCents,
      currencyCode: this.authRepository.getSnapshot().settings.currencyCode,
      purchasedAt: input.purchasedAt,
      category: category.id,
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
    const note = this.authRepository
      .getSnapshot()
      .notes.find(item => item.id === noteId);

    if (!note) {
      throw new Error('Unknown note.');
    }

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

  async toggleTaskComplete(
    taskId: string,
    completedByUserId: string,
  ): Promise<RepositoryResult> {
    const client = await this.authRepository.getClient();
    const session = this.getSession();
    const task = this.authRepository
      .getSnapshot()
      .tasks.find(item => item.id === taskId);

    if (!task) {
      throw new Error('Unknown task.');
    }

    const completedAt = task.completedAt ? undefined : new Date().toISOString();

    await client.collection('tasks').update(taskId, {
      completedAt,
      completedBy: completedAt ? completedByUserId : undefined,
      updatedBy: session.userId,
    });

    return this.authRepository.refresh();
  }

  async updateSettings(_input: UpdateSettingsInput): Promise<RepositoryResult> {
    return unchanged(this.authRepository.getSnapshot());
  }

  async addExpenseCategory(value: string): Promise<RepositoryResult> {
    const cleaned = value.trim();

    if (!cleaned) {
      return unchanged(this.authRepository.getSnapshot());
    }

    const client = await this.authRepository.getClient();
    const session = this.getSession();

    await client.collection('expense_categories').create({
      group: session.groupId,
      name: cleaned,
      sortOrder:
        this.authRepository.getSnapshot().settings.expenseCategories.length + 1,
      createdBy: session.userId,
      updatedBy: session.userId,
    });

    return this.authRepository.refresh();
  }

  async removeExpenseCategory(value: string): Promise<RepositoryResult> {
    const client = await this.authRepository.getClient();
    const session = this.getSession();
    const category = await client
      .collection('expense_categories')
      .getFirstListItem<BackendExpenseCategoryRecord>(
        client.filter(
          'group = {:groupId} && name = {:name} && archivedAt = null',
          {
            groupId: session.groupId,
            name: value,
          },
        ),
      );

    await client.collection('expense_categories').update(category.id, {
      archivedAt: new Date().toISOString(),
      updatedBy: session.userId,
    });

    return this.authRepository.refresh();
  }

  async markAllNotificationsRead(): Promise<RepositoryResult> {
    return unchanged(this.authRepository.getSnapshot());
  }

  async updateAppLockSettings(
    _input: AppLockSettingsUpdateInput,
  ): Promise<RepositoryResult> {
    return unchanged(this.authRepository.getSnapshot());
  }
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
