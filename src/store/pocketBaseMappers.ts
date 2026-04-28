import {
  BackendAuthUserRecord,
  BackendExpenseCategoryRecord,
  BackendExpenseRecord,
  BackendGroupMemberRecord,
  BackendGroupRecord,
  BackendProfileRecord,
} from './backendRecords';
import {
  AppSettings,
  AppSnapshot,
  Expense,
  Group,
  GroupMember,
  Session,
  UserProfile,
} from './models';

export function createDefaultSettings(): AppSettings {
  const now = new Date().toISOString();

  return {
    themeMode: 'system',
    defaultTab: 'home',
    localePreference: 'system',
    currencyCode: 'EUR',
    calendarDefaultView: 'month',
    eventColorKey: 'blue',
    expenseCategories: [],
    scoreCycleDays: 14,
    scoreCycleAnchor: now,
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
  };
}

export function mapBackendUser(record: BackendAuthUserRecord) {
  return {
    id: record.id,
    email: record.email,
    profileId: '',
  };
}

export function mapBackendProfile(record: BackendProfileRecord): UserProfile {
  return {
    id: record.id,
    displayName: record.displayName,
    colorKey: record.colorKey,
  };
}

export function mapBackendGroup(record: BackendGroupRecord): Group {
  return {
    id: record.id,
    groupName: record.name,
    createdAt: record.created,
    createdByUserId: record.createdBy,
  };
}

export function mapBackendGroupMember(
  record: BackendGroupMemberRecord,
): GroupMember {
  return {
    id: record.id,
    groupId: record.group,
    userId: record.user,
    profileId: record.profile,
    role: record.role,
    joinedAt: record.joinedAt,
  };
}

export function mapBackendExpense(
  record: BackendExpenseRecord,
  categoriesById: Record<string, BackendExpenseCategoryRecord>,
): Expense {
  const categoryName = record.category
    ? categoriesById[record.category]?.name
    : undefined;

  return {
    id: record.id,
    groupId: record.group,
    createdAt: record.created,
    updatedAt: record.updated,
    createdByUserId: record.createdBy ?? '',
    updatedByUserId: record.updatedBy ?? '',
    deletedAt: record.deletedAt,
    buyerUserId: record.buyer,
    title: record.title,
    amountCents: record.amountCents,
    purchasedAt: record.purchasedAt,
    category: categoryName ?? 'Other',
    notes: record.notes,
  };
}

export function createPocketBaseSnapshot({
  currentUser,
  currentProfile,
  activeGroup,
  members,
  profiles,
  expenseCategories = [],
  expenses = [],
}: {
  currentUser: BackendAuthUserRecord | null;
  currentProfile: BackendProfileRecord | null;
  activeGroup: BackendGroupRecord | null;
  members: BackendGroupMemberRecord[];
  profiles: BackendProfileRecord[];
  expenseCategories?: BackendExpenseCategoryRecord[];
  expenses?: BackendExpenseRecord[];
}): AppSnapshot {
  const categoriesById = expenseCategories.reduce<
    Record<string, BackendExpenseCategoryRecord>
  >((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {});

  const authUsers = currentUser
    ? [
        {
          ...mapBackendUser(currentUser),
          profileId: currentProfile?.id ?? '',
        },
      ]
    : [];

  const session: Session | null =
    currentUser && currentProfile && activeGroup
      ? {
          userId: currentUser.id,
          profileId: currentProfile.id,
          groupId: activeGroup.id,
          email: currentUser.email,
        }
      : null;

  return {
    authUsers,
    profiles: profiles.map(mapBackendProfile),
    sessionState: {
      session,
      activeProfileId: session?.profileId ?? null,
    },
    appLockSettings: {
      isEnabled: false,
      lockAfterMinutes: 5,
    },
    appLockState: {
      isLocked: false,
    },
    groups: activeGroup ? [mapBackendGroup(activeGroup)] : [],
    members: members.map(mapBackendGroupMember),
    invites: [],
    expenses: expenses.map(expense =>
      mapBackendExpense(expense, categoriesById),
    ),
    notes: [],
    events: [],
    tasks: [],
    notifications: [],
    settings: {
      ...createDefaultSettings(),
      expenseCategories: expenseCategories.map(category => category.name),
    },
  };
}
