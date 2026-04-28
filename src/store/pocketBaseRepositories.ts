import PocketBase from 'pocketbase';
import {
  createPocketBaseAuthClient,
  PocketBaseAuthClient,
  PocketBaseAuthSession,
} from '../backend/pocketBaseAuth';
import {
  BackendAuthUserRecord,
  BackendGroupMemberRecord,
  BackendGroupRecord,
  BackendProfileRecord,
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

    return {
      snapshot: createPocketBaseSnapshot({
        currentUser,
        currentProfile,
        activeGroup,
        members,
        profiles,
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

  private async readWorkspace(
    session: PocketBaseAuthSession,
  ): Promise<RepositoryResult> {
    const authClient = await this.authClientPromise;
    const reader = new PocketBaseWorkspaceReader(authClient.getClient());
    const result = await reader.read(session);
    this.snapshot = result.snapshot;

    return result;
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

  async addExpense(_input: AddExpenseInput): Promise<RepositoryResult> {
    unsupported('PocketBase expenses are not wired in Batch 6.');
  }

  async addNote(_input: AddNoteInput): Promise<RepositoryResult> {
    unsupported('PocketBase notes are not wired in Batch 6.');
  }

  async toggleNotePinned(_noteId: string): Promise<RepositoryResult> {
    unsupported('PocketBase notes are not wired in Batch 6.');
  }

  async addEvent(_input: AddEventInput): Promise<RepositoryResult> {
    unsupported('PocketBase calendar events are not wired in Batch 6.');
  }

  async addTask(_input: AddTaskInput): Promise<RepositoryResult> {
    unsupported('PocketBase tasks are not wired in Batch 6.');
  }

  async toggleTaskComplete(
    _taskId: string,
    _completedByUserId: string,
  ): Promise<RepositoryResult> {
    unsupported('PocketBase tasks are not wired in Batch 6.');
  }

  async updateSettings(_input: UpdateSettingsInput): Promise<RepositoryResult> {
    return unchanged(this.authRepository.getSnapshot());
  }

  async addExpenseCategory(_value: string): Promise<RepositoryResult> {
    unsupported('PocketBase categories are not wired in Batch 6.');
  }

  async removeExpenseCategory(_value: string): Promise<RepositoryResult> {
    unsupported('PocketBase categories are not wired in Batch 6.');
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
