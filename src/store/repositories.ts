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

export interface RepositoryResult {
  snapshot: AppSnapshot;
}

export interface AppLockSettingsUpdateInput {
  isEnabled?: boolean;
  lockAfterMinutes?: number;
}

export interface AuthRepository {
  bootstrap(): Promise<RepositoryResult>;
  signIn(input: SignInInput): Promise<RepositoryResult>;
  createGroupOwner(input: CreateGroupInput): Promise<RepositoryResult>;
  acceptInvite(input: AcceptInviteInput): Promise<RepositoryResult>;
  signOut(): Promise<RepositoryResult>;
  unlockApp(pin: string): Promise<RepositoryResult>;
  lockApp(): Promise<RepositoryResult>;
  registerBackgroundedAt(timestamp: string): Promise<RepositoryResult>;
  revalidateAppLock(timestamp: string): Promise<RepositoryResult>;
}

export interface GroupRepository {
  updateGroupName(value: string): Promise<RepositoryResult>;
  inviteMember(
    email: string,
    profileNameHint: string,
  ): Promise<RepositoryResult>;
  revokeInvite(inviteId: string): Promise<RepositoryResult>;
  updateMemberRole(
    memberId: string,
    role: MemberRole,
  ): Promise<RepositoryResult>;
  removeMember(memberId: string): Promise<RepositoryResult>;
}

export interface ExpenseRepository {
  addExpense(input: AddExpenseInput): Promise<RepositoryResult>;
}

export interface NotesRepository {
  addNote(input: AddNoteInput): Promise<RepositoryResult>;
  toggleNotePinned(noteId: string): Promise<RepositoryResult>;
}

export interface CalendarRepository {
  addEvent(input: AddEventInput): Promise<RepositoryResult>;
}

export interface TaskRepository {
  addTask(input: AddTaskInput): Promise<RepositoryResult>;
  toggleTaskComplete(
    taskId: string,
    completedByUserId: string,
  ): Promise<RepositoryResult>;
}

export interface SettingsRepository {
  updateSettings(input: UpdateSettingsInput): Promise<RepositoryResult>;
  addExpenseCategory(value: string): Promise<RepositoryResult>;
  removeExpenseCategory(value: string): Promise<RepositoryResult>;
  markAllNotificationsRead(): Promise<RepositoryResult>;
  updateAppLockSettings(
    input: AppLockSettingsUpdateInput,
  ): Promise<RepositoryResult>;
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
