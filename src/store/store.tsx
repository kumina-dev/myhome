import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState as NativeAppState, AppStateStatus } from 'react-native';
import {
  AcceptInviteInput,
  AddEventInput,
  AddExpenseInput,
  AddNoteInput,
  AddTaskInput,
  AppPhase,
  AppRepositories,
  AppSnapshot,
  AuthFlowMode,
  CreateGroupInput,
  MemberRole,
  SettingsTab,
  SignInInput,
  UpdateSettingsInput,
} from './models';
import { createDevelopmentRepositories } from './developmentApi';

interface AppStoreValue {
  phase: AppPhase;
  snapshot: AppSnapshot | null;
  loading: boolean;
  error: string | null;
  authMode: AuthFlowMode;
  settingsTab: SettingsTab;
  setAuthMode: (mode: AuthFlowMode) => void;
  setSettingsTab: (tab: SettingsTab) => void;
  signIn: (input: SignInInput) => Promise<void>;
  createGroupOwner: (input: CreateGroupInput) => Promise<void>;
  acceptInvite: (input: AcceptInviteInput) => Promise<void>;
  signOut: () => Promise<void>;
  unlockApp: (pin: string) => Promise<void>;
  lockApp: () => Promise<void>;
  addExpense: (input: AddExpenseInput) => Promise<void>;
  addNote: (input: AddNoteInput) => Promise<void>;
  toggleNotePinned: (noteId: string) => Promise<void>;
  addEvent: (input: AddEventInput) => Promise<void>;
  addTask: (input: AddTaskInput) => Promise<void>;
  toggleTaskComplete: (
    taskId: string,
    completedByUserId: string,
  ) => Promise<void>;
  updateSettings: (input: UpdateSettingsInput) => Promise<void>;
  addExpenseCategory: (value: string) => Promise<void>;
  removeExpenseCategory: (value: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  updateGroupName: (value: string) => Promise<void>;
  inviteMember: (email: string, profileNameHint: string) => Promise<void>;
  revokeInvite: (inviteId: string) => Promise<void>;
  updateMemberRole: (memberId: string, role: MemberRole) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  updateAppLockSettings: (input: {
    isEnabled?: boolean;
    lockAfterMinutes?: number;
  }) => Promise<void>;
}

const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);

export function resolvePhase(
  snapshot: AppSnapshot | null,
  loading: boolean,
): AppPhase {
  if (loading || !snapshot) return 'splash';
  if (!snapshot.sessionState.session) return 'auth';
  if (snapshot.appLockSettings.isEnabled && snapshot.appLockState.isLocked)
    return 'app-locked';
  return 'main-app';
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const repositoriesRef = useRef<AppRepositories>(
    createDevelopmentRepositories(),
  );
  const [snapshot, setSnapshot] = useState<AppSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthFlowMode>('sign-in');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('account');

  const run = useCallback(async (work: () => Promise<AppSnapshot>) => {
    setError(null);

    try {
      const nextSnapshot = await work();
      setSnapshot(nextSnapshot);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unexpected error.');
      throw caught;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      setLoading(true);

      try {
        const data = await repositoriesRef.current.authRepository.bootstrap();

        if (mounted) setSnapshot(data);
      } catch (caught) {
        if (mounted) {
          setError(
            caught instanceof Error ? caught.message : 'Failed to start app.',
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = NativeAppState.addEventListener(
      'change',
      async (state: AppStateStatus) => {
        if (!snapshot?.sessionState.session) return;

        if (state === 'background') {
          const timestamp = new Date().toISOString();
          const next =
            await repositoriesRef.current.authRepository.registerBackgroundedAt(
              timestamp,
            );
          setSnapshot(next);
        }

        if (state === 'active') {
          const timestamp = new Date().toISOString();
          const next =
            await repositoriesRef.current.authRepository.revalidateAppLock(
              timestamp,
            );
          setSnapshot(next);
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [snapshot]);

  const value = useMemo<AppStoreValue>(
    () => ({
      phase: resolvePhase(snapshot, loading),
      snapshot,
      loading,
      error,
      authMode,
      settingsTab,
      setAuthMode,
      setSettingsTab,
      signIn: async input => {
        await run(() => repositoriesRef.current.authRepository.signIn(input));
      },
      createGroupOwner: async input => {
        await run(() =>
          repositoriesRef.current.authRepository.createGroupOwner(input),
        );
      },
      acceptInvite: async input => {
        await run(() =>
          repositoriesRef.current.authRepository.acceptInvite(input),
        );
      },
      signOut: async () => {
        await run(() => repositoriesRef.current.authRepository.signOut());
      },
      unlockApp: async pin => {
        await run(() => repositoriesRef.current.authRepository.unlockApp(pin));
      },
      lockApp: async () => {
        await run(() => repositoriesRef.current.authRepository.lockApp());
      },
      addExpense: async input => {
        await run(() =>
          repositoriesRef.current.expenseRepository.addExpense(input),
        );
      },
      addNote: async input => {
        await run(() => repositoriesRef.current.notesRepository.addNote(input));
      },
      toggleNotePinned: async noteId => {
        await run(() =>
          repositoriesRef.current.notesRepository.toggleNotePinned(noteId),
        );
      },
      addEvent: async input => {
        await run(() =>
          repositoriesRef.current.calendarRepository.addEvent(input),
        );
      },
      addTask: async input => {
        await run(() => repositoriesRef.current.taskRepository.addTask(input));
      },
      toggleTaskComplete: async (taskId, completedByUserId) => {
        await run(() =>
          repositoriesRef.current.taskRepository.toggleTaskComplete(
            taskId,
            completedByUserId,
          ),
        );
      },
      updateSettings: async input => {
        await run(() =>
          repositoriesRef.current.settingsRepository.updateSettings(input),
        );
      },
      addExpenseCategory: async categoryName => {
        await run(() =>
          repositoriesRef.current.settingsRepository.addExpenseCategory(
            categoryName,
          ),
        );
      },
      removeExpenseCategory: async categoryName => {
        await run(() =>
          repositoriesRef.current.settingsRepository.removeExpenseCategory(
            categoryName,
          ),
        );
      },
      markAllNotificationsRead: async () => {
        await run(() =>
          repositoriesRef.current.settingsRepository.markAllNotificationsRead(),
        );
      },
      updateGroupName: async groupName => {
        await run(() =>
          repositoriesRef.current.groupRepository.updateGroupName(groupName),
        );
      },
      inviteMember: async (email, profileNameHint) => {
        await run(() =>
          repositoriesRef.current.groupRepository.inviteMember(
            email,
            profileNameHint,
          ),
        );
      },
      revokeInvite: async inviteId => {
        await run(() =>
          repositoriesRef.current.groupRepository.revokeInvite(inviteId),
        );
      },
      updateMemberRole: async (memberId, role) => {
        await run(() =>
          repositoriesRef.current.groupRepository.updateMemberRole(
            memberId,
            role,
          ),
        );
      },
      removeMember: async memberId => {
        await run(() =>
          repositoriesRef.current.groupRepository.removeMember(memberId),
        );
      },
      updateAppLockSettings: async input => {
        await run(() =>
          repositoriesRef.current.settingsRepository.updateAppLockSettings(
            input,
          ),
        );
      },
    }),
    [authMode, error, loading, run, settingsTab, snapshot],
  );

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const value = useContext(AppStoreContext);

  if (!value) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }

  return value;
}
