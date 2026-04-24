import {
  AppState,
  CalendarEvent,
  NotificationItem,
  Task,
  User,
} from './models';

export function formatCurrency(amountCents: number): string {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function getUserMap(users: User[]): Record<string, User> {
  return users.reduce<Record<string, User>>((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});
}

export function getCurrentMonthExpenses(state: AppState) {
  const now = new Date();

  return state.expenses.filter(expense => {
    const date = new Date(expense.purchasedAt);
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  });
}

export function getExpenseSummary(state: AppState) {
  const expenses = getCurrentMonthExpenses(state);
  const byCategory = new Map<string, number>();
  const byUser = new Map<string, number>();

  let total = 0;

  expenses.forEach(expense => {
    total += expense.amountCents;
    byCategory.set(
      expense.category,
      (byCategory.get(expense.category) ?? 0) + expense.amountCents,
    );
    byUser.set(
      expense.buyerUserId,
      (byUser.get(expense.buyerUserId) ?? 0) + expense.amountCents,
    );
  });

  return {
    total,
    byCategory: Array.from(byCategory.entries())
      .map(([label, amountCents]) => ({ label, amountCents }))
      .sort((a, b) => b.amountCents - a.amountCents),
    byUser: Array.from(byUser.entries())
      .map(([userId, amountCents]) => ({ userId, amountCents }))
      .sort((a, b) => b.amountCents - a.amountCents),
    expenses: [...expenses].sort(
      (a, b) =>
        new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime(),
    ),
  };
}

export function getPinnedNotes(state: AppState) {
  return [...state.notes]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
}

export function getUpcomingEvents(state: AppState): CalendarEvent[] {
  return [...state.events]
    .filter(event => new Date(event.endsAt).getTime() >= Date.now())
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
}

export function getVisibleTasks(state: AppState): Task[] {
  const activeUserId = state.settings.activeUserId;

  return [...state.tasks]
    .filter(task => {
      if (state.settings.showCompletedTasks) {
        return true;
      }

      return !task.completedAt;
    })
    .filter(task => {
      if (task.scope === 'shared') {
        return true;
      }

      return task.assigneeUserId === activeUserId;
    })
    .sort((a, b) => {
      const aDue = a.dueAt
        ? new Date(a.dueAt).getTime()
        : Number.MAX_SAFE_INTEGER;
      const bDue = b.dueAt
        ? new Date(b.dueAt).getTime()
        : Number.MAX_SAFE_INTEGER;
      return aDue - bDue;
    });
}

export function getUnreadNotifications(state: AppState): NotificationItem[] {
  return state.notifications.filter(item => !item.isRead);
}

function startOfCycle(anchorIso: string, cycleDays: number, pointInTime: Date) {
  const anchor = new Date(anchorIso);
  anchor.setHours(0, 0, 0, 0);

  const diff = pointInTime.getTime() - anchor.getTime();
  const cycleMs = cycleDays * 24 * 60 * 60 * 1000;
  const cycleIndex = Math.floor(diff / cycleMs);
  const start = new Date(anchor.getTime() + cycleIndex * cycleMs);
  const end = new Date(start.getTime() + cycleMs);

  return { start, end };
}

function buildScoreboard(state: AppState, range: { start: Date; end: Date }) {
  const scores = new Map<string, number>();

  state.users.forEach(user => scores.set(user.id, 0));

  state.tasks.forEach(task => {
    if (!task.completedAt || !task.completedByUserId) {
      return;
    }

    const completedAt = new Date(task.completedAt).getTime();

    if (
      completedAt >= range.start.getTime() &&
      completedAt < range.end.getTime()
    ) {
      scores.set(
        task.completedByUserId,
        (scores.get(task.completedByUserId) ?? 0) + task.points,
      );
    }
  });

  return Array.from(scores.entries())
    .map(([userId, points]) => ({ userId, points }))
    .sort((a, b) => b.points - a.points);
}

export function getScoreboard(state: AppState) {
  const current = startOfCycle(
    state.settings.scoreCycleAnchor,
    state.settings.scoreCycleDays,
    new Date(),
  );
  const previous = {
    start: new Date(
      current.start.getTime() -
        state.settings.scoreCycleDays * 24 * 60 * 60 * 1000,
    ),
    end: current.start,
  };

  return {
    current,
    previous,
    currentScores: buildScoreboard(state, current),
    previousScores: buildScoreboard(state, previous),
  };
}
