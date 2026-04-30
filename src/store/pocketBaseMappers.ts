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
  AppSettings,
  AppSnapshot,
  CalendarEvent,
  Expense,
  Group,
  GroupMember,
  Note,
  NotificationItem,
  Session,
  Task,
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

export function mapBackendGroupMember(record: BackendGroupMemberRecord): GroupMember {
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
  const categoryName = record.category ? categoriesById[record.category]?.name : undefined;

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

export function mapBackendNote(record: BackendNoteRecord): Note {
  return {
    id: record.id,
    groupId: record.group,
    createdAt: record.created,
    updatedAt: record.updated,
    createdByUserId: record.createdBy ?? record.author,
    updatedByUserId: record.updatedBy ?? record.author,
    deletedAt: record.deletedAt,
    authorUserId: record.author,
    title: record.title,
    body: record.body,
    isPinned: record.isPinned,
  };
}

export function mapBackendCalendarEvent(record: BackendCalendarEventRecord): CalendarEvent {
  return {
    id: record.id,
    groupId: record.group,
    createdAt: record.created,
    updatedAt: record.updated,
    createdByUserId: record.createdBy ?? '',
    updatedByUserId: record.updatedBy ?? '',
    deletedAt: record.deletedAt,
    title: record.title,
    startsAt: record.startsAt,
    endsAt: record.endsAt,
    colorKey: record.colorKey,
    notes: record.notes,
  };
}

export function mapBackendTask(record: BackendTaskRecord): Task {
  return {
    id: record.id,
    groupId: record.group,
    createdAt: record.created,
    updatedAt: record.updated,
    createdByUserId: record.createdBy ?? '',
    updatedByUserId: record.updatedBy ?? '',
    deletedAt: record.deletedAt,
    title: record.title,
    scope: record.scope,
    assigneeUserId: record.assignee,
    points: record.points,
    dueAt: record.dueAt,
    completedAt: record.completedAt,
    completedByUserId: record.completedBy,
  };
}

export function mapBackendNotification(record: BackendNotificationItemRecord): NotificationItem {
  return {
    id: record.id,
    groupId: record.group,
    createdAt: record.created,
    updatedAt: record.updated,
    createdByUserId: record.createdBy ?? '',
    updatedByUserId: record.updatedBy ?? '',
    type: record.type,
    title: record.title,
    body: record.body,
    isRead: record.isRead,
  };
}

function parseScoreCycleDays(value: number | string | undefined) {
  if (typeof value === 'number') return value;

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function mapBackendSettings({
  userSettings,
  groupSettings,
  expenseCategories,
}: {
  userSettings: BackendUserSettingsRecord | null;
  groupSettings: BackendGroupSettingsRecord | null;
  expenseCategories: BackendExpenseCategoryRecord[];
}): AppSettings {
  const defaults = createDefaultSettings();

  return {
    ...defaults,
    themeMode: userSettings?.themeMode ?? defaults.themeMode,
    defaultTab: userSettings?.defaultTab ?? defaults.defaultTab,
    localePreference: userSettings?.localePreference ?? defaults.localePreference,
    currencyCode: userSettings?.currencyCode ?? defaults.currencyCode,
    calendarDefaultView: userSettings?.calendarDefaultView ?? defaults.calendarDefaultView,
    expenseCategories: expenseCategories.map((category) => category.name),
    scoreCycleDays: parseScoreCycleDays(groupSettings?.scoreCycleDays) ?? defaults.scoreCycleDays,
    scoreCycleAnchor: groupSettings?.scoreCycleAnchor ?? defaults.scoreCycleAnchor,
    weekStartsOn: groupSettings?.weekStartsOn ?? defaults.weekStartsOn,
    showCompletedTasks: groupSettings?.showCompletedTasks ?? defaults.showCompletedTasks,
    showPersonalTasksOnHome:
      groupSettings?.showPersonalTasksOnHome ?? defaults.showPersonalTasksOnHome,
    notifications: {
      ...defaults.notifications,
      eventReminders: groupSettings?.eventReminders ?? defaults.notifications.eventReminders,
      taskReminders: groupSettings?.taskReminders ?? defaults.notifications.taskReminders,
      noteAlerts: groupSettings?.noteAlerts ?? defaults.notifications.noteAlerts,
      expenseAlerts: groupSettings?.expenseAlerts ?? defaults.notifications.expenseAlerts,
      sharedTaskBroadcasts:
        groupSettings?.sharedTaskBroadcasts ?? defaults.notifications.sharedTaskBroadcasts,
    },
  };
}

export function createPocketBaseSnapshot({
  currentUser,
  currentProfile,
  activeGroup,
  members,
  profiles,
  userSettings = null,
  groupSettings = null,
  expenseCategories = [],
  expenses = [],
  notes = [],
  calendarEvents = [],
  tasks = [],
  notifications = [],
}: {
  currentUser: BackendAuthUserRecord | null;
  currentProfile: BackendProfileRecord | null;
  activeGroup: BackendGroupRecord | null;
  members: BackendGroupMemberRecord[];
  profiles: BackendProfileRecord[];
  userSettings?: BackendUserSettingsRecord | null;
  groupSettings?: BackendGroupSettingsRecord | null;
  expenseCategories?: BackendExpenseCategoryRecord[];
  expenses?: BackendExpenseRecord[];
  notes?: BackendNoteRecord[];
  calendarEvents?: BackendCalendarEventRecord[];
  tasks?: BackendTaskRecord[];
  notifications?: BackendNotificationItemRecord[];
}): AppSnapshot {
  const categoriesById = expenseCategories.reduce<Record<string, BackendExpenseCategoryRecord>>(
    (acc, category) => {
      acc[category.id] = category;
      return acc;
    },
    {},
  );

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
    expenses: expenses.map((expense) => mapBackendExpense(expense, categoriesById)),
    notes: notes.map(mapBackendNote),
    events: calendarEvents.map(mapBackendCalendarEvent),
    tasks: tasks.map(mapBackendTask),
    notifications: notifications.map(mapBackendNotification),
    settings: mapBackendSettings({
      userSettings,
      groupSettings,
      expenseCategories,
    }),
  };
}
