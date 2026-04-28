import {
  AcceptInviteInput,
  AddEventInput,
  AddExpenseInput,
  AddNoteInput,
  AddTaskInput,
  AppSnapshot,
  AuthUser,
  CreateGroupInput,
  Invite,
  MemberRole,
  SignInInput,
  UpdateSettingsInput,
} from './models';
import {
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
import {
  DEVELOPMENT_ONLY_APP_LOCK_PIN,
  DEVELOPMENT_ONLY_SEEDED_PASSWORD,
  initialSnapshot,
} from './seed';

const DEVELOPMENT_ONLY_INVITE_CODE_PREFIX = 'GROUP';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function makeDevelopmentOnlyInviteCode(): string {
  return `${DEVELOPMENT_ONLY_INVITE_CODE_PREFIX}-${Math.round(
    Math.random() * 8999 + 1000,
  )}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function result(snapshot: AppSnapshot): RepositoryResult {
  return { snapshot: clone(snapshot) };
}

class InMemoryDevelopmentApi
  implements
    AuthRepository,
    GroupRepository,
    ExpenseRepository,
    NotesRepository,
    CalendarRepository,
    TaskRepository,
    SettingsRepository
{
  private snapshot = clone(initialSnapshot);
  private readonly developmentOnlyPasswords = new Map(
    initialSnapshot.authUsers.map(user => [
      user.id,
      DEVELOPMENT_ONLY_SEEDED_PASSWORD,
    ]),
  );

  async bootstrap(): Promise<RepositoryResult> {
    return result(this.snapshot);
  }

  private getSessionOrThrow() {
    const session = this.snapshot.sessionState.session;

    if (!session) {
      throw new Error('You need to sign in first.');
    }

    return session;
  }

  private getProfileIdForUser(userId: string) {
    const member = this.snapshot.members.find(item => item.userId === userId);

    if (!member) {
      throw new Error('Unknown group member.');
    }

    return member.profileId;
  }

  private pushNotification(
    title: string,
    body: string,
    type: AppSnapshot['notifications'][number]['type'],
  ) {
    const session = this.snapshot.sessionState.session;
    const groupId = session?.groupId ?? this.snapshot.groups[0].id;
    const actorId = session?.userId ?? this.snapshot.groups[0].createdByUserId;
    const timestamp = nowIso();

    this.snapshot.notifications = [
      {
        id: makeId('notification'),
        groupId,
        type,
        title,
        body,
        isRead: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdByUserId: actorId,
        updatedByUserId: actorId,
      },
      ...this.snapshot.notifications,
    ];
  }

  private finishAuth(user: AuthUser, groupId: string) {
    this.snapshot.sessionState = {
      session: {
        userId: user.id,
        profileId: user.profileId,
        groupId,
        email: user.email,
      },
      activeProfileId: user.profileId,
    };

    this.snapshot.appLockState = {
      isLocked: false,
    };
  }

  async signIn(input: SignInInput): Promise<RepositoryResult> {
    const user = this.snapshot.authUsers.find(
      item =>
        item.email.trim().toLowerCase() === input.email.trim().toLowerCase() &&
        this.developmentOnlyPasswords.get(item.id) === input.password,
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const member = this.snapshot.members.find(item => item.userId === user.id);

    if (!member) {
      throw new Error('This account does not belong to any group.');
    }

    this.finishAuth(user, member.groupId);
    return result(this.snapshot);
  }

  async createGroupOwner(input: CreateGroupInput): Promise<RepositoryResult> {
    const userId = makeId('auth');
    const profileId = makeId('profile');
    const groupId = makeId('group');
    const timestamp = nowIso();

    const user: AuthUser = {
      id: userId,
      email: input.email.trim().toLowerCase(),
      profileId,
    };

    this.developmentOnlyPasswords.set(userId, input.password);
    this.snapshot.authUsers = [...this.snapshot.authUsers, user];
    this.snapshot.profiles = [
      ...this.snapshot.profiles,
      {
        id: profileId,
        displayName: input.displayName.trim(),
        colorKey: 'blue',
      },
    ];
    this.snapshot.groups = [
      ...this.snapshot.groups,
      {
        id: groupId,
        groupName: input.groupName.trim(),
        createdAt: timestamp,
        createdByUserId: userId,
      },
    ];
    this.snapshot.members = [
      ...this.snapshot.members,
      {
        id: makeId('member'),
        groupId,
        userId,
        profileId,
        role: 'owner',
        joinedAt: timestamp,
      },
    ];

    this.finishAuth(user, groupId);
    this.pushNotification(
      'Group created',
      `${input.groupName.trim()} is ready.`,
      'group',
    );
    return result(this.snapshot);
  }

  async acceptInvite(input: AcceptInviteInput): Promise<RepositoryResult> {
    const invite = this.snapshot.invites.find(
      item =>
        item.code.trim().toUpperCase() === input.code.trim().toUpperCase() &&
        !item.acceptedAt &&
        !item.revokedAt,
    );

    if (!invite) {
      throw new Error('Invite code is invalid or already used.');
    }

    const existingUser = this.snapshot.authUsers.find(
      item => item.email === input.email.trim().toLowerCase(),
    );

    if (existingUser) {
      throw new Error('That email is already in use.');
    }

    const userId = makeId('auth');
    const profileId = makeId('profile');
    const timestamp = nowIso();
    const user: AuthUser = {
      id: userId,
      email: input.email.trim().toLowerCase(),
      profileId,
    };

    this.developmentOnlyPasswords.set(userId, input.password);
    this.snapshot.authUsers = [...this.snapshot.authUsers, user];
    this.snapshot.profiles = [
      ...this.snapshot.profiles,
      {
        id: profileId,
        displayName: input.displayName.trim(),
        colorKey: 'amber',
      },
    ];
    this.snapshot.members = [
      ...this.snapshot.members,
      {
        id: makeId('member'),
        groupId: invite.groupId,
        userId,
        profileId,
        role: 'member',
        joinedAt: timestamp,
      },
    ];
    this.snapshot.invites = this.snapshot.invites.map(item =>
      item.id === invite.id ? { ...item, acceptedAt: timestamp } : item,
    );

    this.finishAuth(user, invite.groupId);
    this.pushNotification(
      'New member joined',
      `${input.displayName.trim()} joined the group.`,
      'group',
    );
    return result(this.snapshot);
  }

  async updateGroupName(value: string): Promise<RepositoryResult> {
    const session = this.getSessionOrThrow();
    const cleaned = value.trim();

    if (!cleaned) {
      return result(this.snapshot);
    }

    this.snapshot.groups = this.snapshot.groups.map(item =>
      item.id === session.groupId ? { ...item, groupName: cleaned } : item,
    );

    return result(this.snapshot);
  }

  async signOut(): Promise<RepositoryResult> {
    this.snapshot.sessionState = {
      session: null,
      activeProfileId: null,
    };
    this.snapshot.appLockState = { isLocked: false };
    return result(this.snapshot);
  }

  async unlockApp(pin: string): Promise<RepositoryResult> {
    if (pin !== DEVELOPMENT_ONLY_APP_LOCK_PIN) {
      throw new Error('Incorrect PIN.');
    }

    this.snapshot.appLockState = {
      isLocked: false,
    };
    return result(this.snapshot);
  }

  async lockApp(): Promise<RepositoryResult> {
    this.snapshot.appLockState = {
      isLocked: true,
    };
    return result(this.snapshot);
  }

  async registerBackgroundedAt(timestamp: string): Promise<RepositoryResult> {
    this.snapshot.appLockState = {
      ...this.snapshot.appLockState,
      lastBackgroundedAt: timestamp,
    };
    return result(this.snapshot);
  }

  async revalidateAppLock(timestamp: string): Promise<RepositoryResult> {
    const lastBackgroundedAt = this.snapshot.appLockState.lastBackgroundedAt;

    if (!lastBackgroundedAt || !this.snapshot.appLockSettings.isEnabled) {
      return result(this.snapshot);
    }

    const elapsedMinutes =
      (new Date(timestamp).getTime() - new Date(lastBackgroundedAt).getTime()) /
      (60 * 1000);

    if (elapsedMinutes >= this.snapshot.appLockSettings.lockAfterMinutes) {
      this.snapshot.appLockState = {
        isLocked: true,
        lastBackgroundedAt,
      };
    }

    return result(this.snapshot);
  }

  async inviteMember(
    email: string,
    profileNameHint: string,
  ): Promise<RepositoryResult> {
    const session = this.getSessionOrThrow();
    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = this.snapshot.invites.find(
      item =>
        item.groupId === session.groupId &&
        item.email === normalizedEmail &&
        !item.revokedAt &&
        !item.acceptedAt,
    );

    if (duplicate) {
      throw new Error('That invite is already pending.');
    }

    const invite: Invite = {
      id: makeId('invite'),
      groupId: session.groupId,
      email: normalizedEmail,
      code: makeDevelopmentOnlyInviteCode(),
      profileNameHint: profileNameHint.trim() || undefined,
      invitedByUserId: session.userId,
      createdAt: nowIso(),
    };

    this.snapshot.invites = [invite, ...this.snapshot.invites];
    this.pushNotification(
      'Invite created',
      `${normalizedEmail} can now join.`,
      'group',
    );
    return result(this.snapshot);
  }

  async revokeInvite(inviteId: string): Promise<RepositoryResult> {
    this.snapshot.invites = this.snapshot.invites.map(item =>
      item.id === inviteId ? { ...item, revokedAt: nowIso() } : item,
    );
    this.pushNotification(
      'Invite revoked',
      'A pending invite was revoked.',
      'group',
    );
    return result(this.snapshot);
  }

  async updateMemberRole(
    memberId: string,
    role: MemberRole,
  ): Promise<RepositoryResult> {
    this.snapshot.members = this.snapshot.members.map(item =>
      item.id === memberId ? { ...item, role } : item,
    );
    this.pushNotification(
      'Member updated',
      `A member role changed to ${role}.`,
      'group',
    );
    return result(this.snapshot);
  }

  async removeMember(memberId: string): Promise<RepositoryResult> {
    this.snapshot.members = this.snapshot.members.filter(
      item => item.id !== memberId,
    );
    this.pushNotification(
      'Member removed',
      'A member was removed from the group.',
      'group',
    );
    return result(this.snapshot);
  }

  async addExpense(input: AddExpenseInput): Promise<RepositoryResult> {
    const session = this.getSessionOrThrow();
    const timestamp = nowIso();

    this.snapshot.expenses = [
      {
        id: makeId('expense'),
        groupId: session.groupId,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdByUserId: session.userId,
        updatedByUserId: session.userId,
        ...input,
      },
      ...this.snapshot.expenses,
    ];
    this.pushNotification(
      'Expense added',
      `${input.title} was logged.`,
      'expense',
    );
    return result(this.snapshot);
  }

  async addNote(input: AddNoteInput): Promise<RepositoryResult> {
    const session = this.getSessionOrThrow();
    const timestamp = nowIso();

    this.snapshot.notes = [
      {
        id: makeId('note'),
        groupId: session.groupId,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdByUserId: session.userId,
        updatedByUserId: session.userId,
        authorUserId: session.userId,
        ...input,
      },
      ...this.snapshot.notes,
    ];
    this.pushNotification('New note', input.title, 'note');
    return result(this.snapshot);
  }

  async toggleNotePinned(noteId: string): Promise<RepositoryResult> {
    this.snapshot.notes = this.snapshot.notes.map(item =>
      item.id === noteId
        ? {
            ...item,
            isPinned: !item.isPinned,
            updatedAt: nowIso(),
          }
        : item,
    );
    return result(this.snapshot);
  }

  async addEvent(input: AddEventInput): Promise<RepositoryResult> {
    const session = this.getSessionOrThrow();
    const timestamp = nowIso();

    this.snapshot.events = [
      {
        id: makeId('event'),
        groupId: session.groupId,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdByUserId: session.userId,
        updatedByUserId: session.userId,
        ...input,
      },
      ...this.snapshot.events,
    ];
    this.pushNotification(
      'Event added',
      `${input.title} was added to the calendar.`,
      'event',
    );
    return result(this.snapshot);
  }

  async addTask(input: AddTaskInput): Promise<RepositoryResult> {
    const session = this.getSessionOrThrow();
    const timestamp = nowIso();

    this.snapshot.tasks = [
      {
        id: makeId('task'),
        groupId: session.groupId,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdByUserId: session.userId,
        updatedByUserId: session.userId,
        ...input,
      },
      ...this.snapshot.tasks,
    ];
    this.pushNotification(
      'Task created',
      `${input.title} is now on the board.`,
      'task',
    );
    return result(this.snapshot);
  }

  async toggleTaskComplete(
    taskId: string,
    completedByUserId: string,
  ): Promise<RepositoryResult> {
    const timestamp = nowIso();

    this.snapshot.tasks = this.snapshot.tasks.map(item =>
      item.id === taskId
        ? {
            ...item,
            completedAt: item.completedAt ? undefined : timestamp,
            completedByUserId: item.completedAt ? undefined : completedByUserId,
            updatedAt: timestamp,
          }
        : item,
    );

    const task = this.snapshot.tasks.find(item => item.id === taskId);

    if (task?.completedAt) {
      const profileId = this.getProfileIdForUser(completedByUserId);
      const profile = this.snapshot.profiles.find(
        item => item.id === profileId,
      );

      this.pushNotification(
        'Task completed',
        `${profile?.displayName ?? 'Someone'} completed ${task.title}.`,
        'task',
      );
    }

    return result(this.snapshot);
  }

  async updateSettings(input: UpdateSettingsInput): Promise<RepositoryResult> {
    this.snapshot.settings = {
      ...this.snapshot.settings,
      ...input,
      notifications: {
        ...this.snapshot.settings.notifications,
        ...input.notifications,
      },
    };
    return result(this.snapshot);
  }

  async addExpenseCategory(value: string): Promise<RepositoryResult> {
    const cleaned = value.trim();

    if (!cleaned) {
      return result(this.snapshot);
    }

    const exists = this.snapshot.settings.expenseCategories.some(
      item => item.toLowerCase() === cleaned.toLowerCase(),
    );

    if (!exists) {
      this.snapshot.settings = {
        ...this.snapshot.settings,
        expenseCategories: [
          ...this.snapshot.settings.expenseCategories,
          cleaned,
        ],
      };
    }

    return result(this.snapshot);
  }

  async removeExpenseCategory(value: string): Promise<RepositoryResult> {
    const nextCategories = this.snapshot.settings.expenseCategories.filter(
      item => item !== value,
    );

    if (nextCategories.length) {
      this.snapshot.settings = {
        ...this.snapshot.settings,
        expenseCategories: nextCategories,
      };
    }

    return result(this.snapshot);
  }

  async markAllNotificationsRead(): Promise<RepositoryResult> {
    this.snapshot.notifications = this.snapshot.notifications.map(item => ({
      ...item,
      isRead: true,
    }));
    return result(this.snapshot);
  }

  async updateAppLockSettings(input: {
    isEnabled?: boolean;
    lockAfterMinutes?: number;
  }): Promise<RepositoryResult> {
    this.snapshot.appLockSettings = {
      ...this.snapshot.appLockSettings,
      ...input,
    };
    return result(this.snapshot);
  }
}

export function createDevelopmentRepositories(): AppRepositories {
  const api = new InMemoryDevelopmentApi();

  return {
    authRepository: api,
    groupRepository: api,
    expenseRepository: api,
    notesRepository: api,
    calendarRepository: api,
    taskRepository: api,
    settingsRepository: api,
  };
}
