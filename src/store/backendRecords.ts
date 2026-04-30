import {
  AppTab,
  CalendarViewMode,
  EventColorKey,
  LocalePreference,
  MemberRole,
  NotificationKind,
  ProfileColorKey,
  TaskScope,
  ThemeMode,
  WeekStart,
} from './models';

export interface BackendRecordBase {
  id: string;
  created: string;
  updated: string;
}

export interface BackendAuthUserRecord extends BackendRecordBase {
  email: string;
}

export interface BackendProfileRecord extends BackendRecordBase {
  user: string;
  displayName: string;
  colorKey: ProfileColorKey;
  createdBy?: string;
  updatedBy?: string;
}

export interface BackendGroupRecord extends BackendRecordBase {
  name: string;
  createdBy: string;
  archivedAt?: string;
}

export interface BackendGroupMemberRecord extends BackendRecordBase {
  group: string;
  user: string;
  profile: string;
  role: MemberRole;
  joinedAt: string;
  removedAt?: string;
}

export interface BackendInviteRecord extends BackendRecordBase {
  group: string;
  email: string;
  tokenHash: string;
  profileNameHint?: string;
  invitedBy: string;
  acceptedBy?: string;
  expiresAt?: string;
  acceptedAt?: string;
  revokedAt?: string;
}

export interface BackendExpenseCategoryRecord extends BackendRecordBase {
  group: string;
  name: string;
  sortOrder?: number;
  archivedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface BackendExpenseRecord extends BackendRecordBase {
  group: string;
  buyer: string;
  title: string;
  amountCents: number;
  currencyCode: string;
  purchasedAt: string;
  category?: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
}

export interface BackendNoteRecord extends BackendRecordBase {
  group: string;
  author: string;
  title: string;
  body: string;
  isPinned: boolean;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
}

export interface BackendCalendarEventRecord extends BackendRecordBase {
  group: string;
  title: string;
  startsAt: string;
  endsAt: string;
  colorKey: EventColorKey;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
}

export interface BackendTaskRecord extends BackendRecordBase {
  group: string;
  title: string;
  scope: TaskScope;
  assignee?: string;
  points: number;
  dueAt?: string;
  completedAt?: string;
  completedBy?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
}

export interface BackendNotificationItemRecord extends BackendRecordBase {
  group: string;
  type: NotificationKind;
  title: string;
  body: string;
  targetUser?: string;
  isRead: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface BackendUserSettingsRecord extends BackendRecordBase {
  user: string;
  themeMode?: ThemeMode;
  localePreference?: LocalePreference;
  defaultTab?: AppTab;
  currencyCode?: string;
  calendarDefaultView?: CalendarViewMode;
}

export interface BackendGroupSettingsRecord extends BackendRecordBase {
  group: string;
  scoreCycleDays?: number | string;
  scoreCycleAnchor?: string;
  weekStartsOn?: WeekStart;
  showCompletedTasks?: boolean;
  showPersonalTasksOnHome?: boolean;
  eventReminders?: boolean;
  taskReminders?: boolean;
  noteAlerts?: boolean;
  expenseAlerts?: boolean;
  sharedTaskBroadcasts?: boolean;
}

export interface BackendWorkspaceRecords {
  users: BackendAuthUserRecord[];
  profiles: BackendProfileRecord[];
  groups: BackendGroupRecord[];
  groupMembers: BackendGroupMemberRecord[];
  invites: BackendInviteRecord[];
  expenseCategories: BackendExpenseCategoryRecord[];
  expenses: BackendExpenseRecord[];
  notes: BackendNoteRecord[];
  calendarEvents: BackendCalendarEventRecord[];
  tasks: BackendTaskRecord[];
  notificationItems: BackendNotificationItemRecord[];
  userSettings: BackendUserSettingsRecord[];
  groupSettings: BackendGroupSettingsRecord[];
}
