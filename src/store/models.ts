export type AppPhase =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'app-locked'
  | 'main-app';

export type AppTab =
  | 'home'
  | 'expenses'
  | 'notes'
  | 'calendar'
  | 'tasks'
  | 'settings';

export type SettingsTab =
  | 'account'
  | 'group'
  | 'notifications'
  | 'appearance'
  | 'calendar'
  | 'tasks'
  | 'categories'
  | 'security';

export type AuthFlowMode = 'sign-in' | 'create-group' | 'accept-invite';
export type ThemeMode = 'system' | 'light' | 'dark';
export type NotificationKind = 'event' | 'task' | 'note' | 'expense' | 'group';
export type WeekStart = 'monday' | 'sunday';
export type TaskScope = 'shared' | 'personal';
export type MemberRole = 'owner' | 'member';
export type CalendarViewMode = 'month' | 'agenda';
export type ProfileColorKey = 'blue' | 'pink' | 'green' | 'amber';
export type EventColorKey = 'blue' | 'pink' | 'green' | 'amber' | 'red';

export interface BaseRecord {
  id: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  updatedByUserId: string;
  deletedAt?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  profileId: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  colorKey: ProfileColorKey;
}

export interface Session {
  userId: string;
  profileId: string;
  groupId: string;
  email: string;
}

export interface SessionState {
  session: Session | null;
  activeProfileId: string | null;
}

export interface AppLockSettings {
  isEnabled: boolean;
  pin: string;
  biometricEnabled: boolean;
  lockAfterMinutes: number;
}

export interface AppLockState {
  isLocked: boolean;
  lastBackgroundedAt?: string;
}

export interface Group {
  id: string;
  groupName: string;
  createdAt: string;
  createdByUserId: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  profileId: string;
  role: MemberRole;
  joinedAt: string;
}

export interface Invite {
  id: string;
  groupId: string;
  email: string;
  code: string;
  profileNameHint?: string;
  invitedByUserId: string;
  createdAt: string;
  acceptedAt?: string;
  revokedAt?: string;
}

export interface Expense extends BaseRecord {
  buyerUserId: string;
  title: string;
  amountCents: number;
  purchasedAt: string;
  category: string;
  notes?: string;
}

export interface Note extends BaseRecord {
  authorUserId: string;
  title: string;
  body: string;
  isPinned: boolean;
}

export interface CalendarEvent extends BaseRecord {
  title: string;
  startsAt: string;
  endsAt: string;
  colorKey: EventColorKey;
  notes?: string;
}

export interface Task extends BaseRecord {
  title: string;
  scope: TaskScope;
  assigneeUserId?: string;
  points: number;
  dueAt?: string;
  completedAt?: string;
  completedByUserId?: string;
}

export interface NotificationItem extends BaseRecord {
  type: NotificationKind;
  title: string;
  body: string;
  isRead: boolean;
}

export interface NotificationPreferences {
  eventReminders: boolean;
  taskReminders: boolean;
  noteAlerts: boolean;
  expenseAlerts: boolean;
  sharedTaskBroadcasts: boolean;
}

export interface AppSettings {
  groupName: string;
  themeMode: ThemeMode;
  defaultTab: AppTab;
  calendarDefaultView: CalendarViewMode;
  eventColorKey: EventColorKey;
  expenseCategories: string[];
  scoreCycleDays: number;
  scoreCycleAnchor: string;
  weekStartsOn: WeekStart;
  showCompletedTasks: boolean;
  showPersonalTasksOnHome: boolean;
  notifications: NotificationPreferences;
}

export interface AppSnapshot {
  onboardingComplete: boolean;
  authUsers: AuthUser[];
  profiles: UserProfile[];
  sessionState: SessionState;
  appLockSettings: AppLockSettings;
  appLockState: AppLockState;
  groups: Group[];
  members: GroupMember[];
  invites: Invite[];
  expenses: Expense[];
  notes: Note[];
  events: CalendarEvent[];
  tasks: Task[];
  notifications: NotificationItem[];
  settings: AppSettings;
}

export interface CreateGroupInput {
  groupName: string;
  displayName: string;
  email: string;
  password: string;
}

export interface AcceptInviteInput {
  code: string;
  displayName: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AddExpenseInput {
  buyerUserId: string;
  title: string;
  amountCents: number;
  purchasedAt: string;
  category: string;
  notes?: string;
}

export interface AddNoteInput {
  title: string;
  body: string;
  isPinned: boolean;
}

export interface AddEventInput {
  title: string;
  startsAt: string;
  endsAt: string;
  colorKey: EventColorKey;
  notes?: string;
}

export interface AddTaskInput {
  title: string;
  scope: TaskScope;
  assigneeUserId?: string;
  points: number;
  dueAt?: string;
}

export type UpdateSettingsInput = Omit<
  Partial<AppSettings>,
  'notifications'
> & {
  notifications?: Partial<NotificationPreferences>;
};

export interface AuthRepository {
  bootstrap(): Promise<AppSnapshot>;
  completeOnboarding(): Promise<AppSnapshot>;
  signIn(input: SignInInput): Promise<AppSnapshot>;
  createGroupOwner(input: CreateGroupInput): Promise<AppSnapshot>;
  acceptInvite(input: AcceptInviteInput): Promise<AppSnapshot>;
  signOut(): Promise<AppSnapshot>;
  unlockApp(pin: string): Promise<AppSnapshot>;
  lockApp(): Promise<AppSnapshot>;
  registerBackgroundedAt(timestamp: string): Promise<AppSnapshot>;
  revalidateAppLock(timestamp: string): Promise<AppSnapshot>;
}

export interface GroupRepository {
  inviteMember(email: string, profileNameHint: string): Promise<AppSnapshot>;
  revokeInvite(inviteId: string): Promise<AppSnapshot>;
  updateMemberRole(memberId: string, role: MemberRole): Promise<AppSnapshot>;
  removeMember(memberId: string): Promise<AppSnapshot>;
}

export interface ExpenseRepository {
  addExpense(input: AddExpenseInput): Promise<AppSnapshot>;
}

export interface NotesRepository {
  addNote(input: AddNoteInput): Promise<AppSnapshot>;
  toggleNotePinned(noteId: string): Promise<AppSnapshot>;
}

export interface CalendarRepository {
  addEvent(input: AddEventInput): Promise<AppSnapshot>;
}

export interface TaskRepository {
  addTask(input: AddTaskInput): Promise<AppSnapshot>;
  toggleTaskComplete(
    taskId: string,
    completedByUserId: string,
  ): Promise<AppSnapshot>;
}

export interface SettingsRepository {
  updateSettings(input: UpdateSettingsInput): Promise<AppSnapshot>;
  addExpenseCategory(value: string): Promise<AppSnapshot>;
  removeExpenseCategory(value: string): Promise<AppSnapshot>;
  markAllNotificationsRead(): Promise<AppSnapshot>;
  updateAppLockSettings(input: Partial<AppLockSettings>): Promise<AppSnapshot>;
}

export interface AppRepositories {
  authRepository: AuthRepository;
  groupRepository: GroupRepository;
  expenseRepository: ExpenseRepository;
  notesRepository: NotesRepository;
  calendarRepository: CalendarRepository;
  taskRepository: TaskRepository;
  settingsRepository: SettingsRepository;
}
