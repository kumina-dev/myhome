import React, { createContext, useContext, useReducer } from 'react';
import {
  AppSettings,
  AppState,
  CalendarEvent,
  Expense,
  Note,
  NotificationItem,
  Task,
  TaskScope,
} from './models';
import { initialState } from './seed';

type Action =
  | {
      type: 'ADD_EXPENSE';
      payload: {
        buyerUserId: string;
        title: string;
        amountCents: number;
        purchasedAt: string;
        category: string;
        notes?: string;
      };
    }
  | {
      type: 'ADD_NOTE';
      payload: {
        authorUserId: string;
        title: string;
        body: string;
        isPinned: boolean;
      };
    }
  | {
      type: 'TOGGLE_NOTE_PINNED';
      payload: {
        noteId: string;
      };
    }
  | {
      type: 'ADD_EVENT';
      payload: {
        title: string;
        startsAt: string;
        endsAt: string;
        color: string;
        notes?: string;
      };
    }
  | {
      type: 'ADD_TASK';
      payload: {
        title: string;
        scope: TaskScope;
        assigneeUserId?: string;
        points: number;
        dueAt?: string;
      };
    }
  | {
      type: 'TOGGLE_TASK_COMPLETE';
      payload: {
        taskId: string;
        completedByUserId: string;
      };
    }
  | {
      type: 'MARK_ALL_NOTIFICATIONS_READ';
    }
  | {
      type: 'UPDATE_SETTINGS';
      payload: Partial<AppSettings>;
    }
  | {
      type: 'ADD_EXPENSE_CATEGORY';
      payload: {
        value: string;
      };
    }
  | {
      type: 'REMOVE_EXPENSE_CATEGORY';
      payload: {
        value: string;
      };
    };

interface StoreValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreValue | undefined>(undefined);

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function makeNotification(
  type: NotificationItem['type'],
  title: string,
  body: string,
): NotificationItem {
  return {
    id: makeId('notification'),
    type,
    title,
    body,
    createdAt: new Date().toISOString(),
    isRead: false,
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const expense: Expense = {
        id: makeId('expense'),
        ...action.payload,
      };

      return {
        ...state,
        expenses: [expense, ...state.expenses],
        notifications: [
          makeNotification(
            'expense',
            'Expense added',
            `${expense.title} was logged under ${expense.category}.`,
          ),
          ...state.notifications,
        ],
      };
    }

    case 'ADD_NOTE': {
      const note: Note = {
        id: makeId('note'),
        updatedAt: new Date().toISOString(),
        ...action.payload,
      };

      return {
        ...state,
        notes: [note, ...state.notes],
        notifications: [
          makeNotification('note', 'New shared note', note.title),
          ...state.notifications,
        ],
      };
    }

    case 'TOGGLE_NOTE_PINNED': {
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.noteId
            ? {
                ...note,
                isPinned: !note.isPinned,
                updatedAt: new Date().toISOString(),
              }
            : note,
        ),
      };
    }

    case 'ADD_EVENT': {
      const event: CalendarEvent = {
        id: makeId('event'),
        ...action.payload,
      };

      return {
        ...state,
        events: [event, ...state.events],
        notifications: [
          makeNotification(
            'event',
            'Calendar updated',
            `${event.title} was added to the shared calendar.`,
          ),
          ...state.notifications,
        ],
      };
    }

    case 'ADD_TASK': {
      const task: Task = {
        id: makeId('task'),
        ...action.payload,
      };

      return {
        ...state,
        tasks: [task, ...state.tasks],
        notifications: [
          makeNotification(
            'task',
            'Task created',
            `${task.title} is now on the board.`,
          ),
          ...state.notifications,
        ],
      };
    }

    case 'TOGGLE_TASK_COMPLETE': {
      const task = state.tasks.find(item => item.id === action.payload.taskId);

      if (!task) {
        return state;
      }

      const completedAt = task.completedAt
        ? undefined
        : new Date().toISOString();
      const completedByUserId = completedAt
        ? action.payload.completedByUserId
        : undefined;

      return {
        ...state,
        tasks: state.tasks.map(item =>
          item.id === action.payload.taskId
            ? {
                ...item,
                completedAt,
                completedByUserId,
              }
            : item,
        ),
        notifications: completedAt
          ? [
              makeNotification(
                'task',
                'Task completed',
                `${task.title} was completed.`,
              ),
              ...state.notifications,
            ]
          : state.notifications,
      };
    }

    case 'MARK_ALL_NOTIFICATIONS_READ': {
      return {
        ...state,
        notifications: state.notifications.map(item => ({
          ...item,
          isRead: true,
        })),
      };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
          notifications: {
            ...state.settings.notifications,
            ...action.payload.notifications,
          },
        },
      };
    }

    case 'ADD_EXPENSE_CATEGORY': {
      const value = action.payload.value.trim();

      if (!value) {
        return state;
      }

      const exists = state.settings.expenseCategories.some(
        item => item.toLowerCase() === value.toLowerCase(),
      );

      if (exists) {
        return state;
      }

      return {
        ...state,
        settings: {
          ...state.settings,
          expenseCategories: [...state.settings.expenseCategories, value],
        },
      };
    }

    case 'REMOVE_EXPENSE_CATEGORY': {
      const nextCategories = state.settings.expenseCategories.filter(
        item => item !== action.payload.value,
      );

      return {
        ...state,
        settings: {
          ...state.settings,
          expenseCategories: nextCategories.length
            ? nextCategories
            : state.settings.expenseCategories,
        },
      };
    }

    default:
      return state;
  }
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useAppStore(): StoreValue {
  const value = useContext(StoreContext);

  if (!value) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }

  return value;
}
