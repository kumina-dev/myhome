import {
  AppSnapshot,
  CalendarEvent,
  GroupMember,
  UserProfile,
  WeekStart,
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

export function formatTime(value: string): string {
  return new Intl.DateTimeFormat('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function isoDate(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

export function getCurrentGroup(snapshot: AppSnapshot) {
  const groupId =
    snapshot.sessionState.session?.groupId ?? snapshot.groups[0]?.id;
  return (
    snapshot.groups.find(item => item.id === groupId) ?? snapshot.groups[0]
  );
}

export function getCurrentUser(snapshot: AppSnapshot) {
  const userId = snapshot.sessionState.session?.userId;
  return snapshot.authUsers.find(item => item.id === userId) ?? null;
}

export function getCurrentProfile(snapshot: AppSnapshot) {
  const profileId = snapshot.sessionState.activeProfileId;
  return snapshot.profiles.find(item => item.id === profileId) ?? null;
}

export function getProfileMap(
  profiles: UserProfile[],
): Record<string, UserProfile> {
  return profiles.reduce<Record<string, UserProfile>>((acc, profile) => {
    acc[profile.id] = profile;
    return acc;
  }, {});
}

export function getMemberMap(
  members: GroupMember[],
): Record<string, GroupMember> {
  return members.reduce<Record<string, GroupMember>>((acc, member) => {
    acc[member.id] = member;
    return acc;
  }, {});
}

export function getGroupMembers(snapshot: AppSnapshot) {
  const groupId = getCurrentGroup(snapshot)?.id;
  return snapshot.members.filter(item => item.groupId === groupId);
}

export function getActiveGroupProfiles(snapshot: AppSnapshot) {
  const profileMap = getProfileMap(snapshot.profiles);

  return getGroupMembers(snapshot)
    .map(member => ({
      member,
      profile: profileMap[member.profileId],
    }))
    .filter(item => Boolean(item.profile));
}

export function getExpenseSummary(snapshot: AppSnapshot) {
  const groupId = getCurrentGroup(snapshot)?.id;
  const now = new Date();
  const expenses = snapshot.expenses
    .filter(item => item.groupId === groupId)
    .filter(expense => {
      const date = new Date(expense.purchasedAt);
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    });
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

export function getPinnedNotes(snapshot: AppSnapshot) {
  const groupId = getCurrentGroup(snapshot)?.id;
  return snapshot.notes
    .filter(item => item.groupId === groupId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
}

export function getUpcomingEvents(snapshot: AppSnapshot): CalendarEvent[] {
  const groupId = getCurrentGroup(snapshot)?.id;
  return snapshot.events
    .filter(item => item.groupId === groupId)
    .filter(event => new Date(event.endsAt).getTime() >= Date.now())
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
}

export function getVisibleTasks(snapshot: AppSnapshot) {
  const groupId = getCurrentGroup(snapshot)?.id;
  const activeUserId = snapshot.sessionState.session?.userId;

  return snapshot.tasks
    .filter(item => item.groupId === groupId)
    .filter(task =>
      snapshot.settings.showCompletedTasks ? true : !task.completedAt,
    )
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

export function getUnreadNotifications(snapshot: AppSnapshot) {
  const groupId = getCurrentGroup(snapshot)?.id;
  return snapshot.notifications.filter(
    item => item.groupId === groupId && !item.isRead,
  );
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

function buildScoreboard(
  snapshot: AppSnapshot,
  range: { start: Date; end: Date },
) {
  const scores = new Map<string, number>();
  const profiles = getActiveGroupProfiles(snapshot);
  const groupId = getCurrentGroup(snapshot)?.id;

  profiles.forEach(item => scores.set(item.member.userId, 0));

  snapshot.tasks
    .filter(task => task.groupId === groupId)
    .forEach(task => {
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

export function getScoreboard(snapshot: AppSnapshot) {
  const current = startOfCycle(
    snapshot.settings.scoreCycleAnchor,
    snapshot.settings.scoreCycleDays,
    new Date(),
  );
  const previous = {
    start: new Date(
      current.start.getTime() -
        snapshot.settings.scoreCycleDays * 24 * 60 * 60 * 1000,
    ),
    end: current.start,
  };

  return {
    current,
    previous,
    currentScores: buildScoreboard(snapshot, current),
    previousScores: buildScoreboard(snapshot, previous),
  };
}

export function getCalendarMonthMatrix(
  visibleMonth: Date,
  weekStartsOn: WeekStart,
) {
  const firstDay = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1,
  );
  const firstWeekday = firstDay.getDay();
  const offset =
    weekStartsOn === 'monday' ? (firstWeekday + 6) % 7 : firstWeekday;
  const matrixStart = new Date(firstDay);
  matrixStart.setDate(firstDay.getDate() - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(matrixStart);
    date.setDate(matrixStart.getDate() + index);
    return date;
  });
}

export function getEventsForDate(snapshot: AppSnapshot, dateIso: string) {
  const groupId = getCurrentGroup(snapshot)?.id;

  return snapshot.events
    .filter(item => item.groupId === groupId)
    .filter(item => isoDate(item.startsAt) === dateIso)
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
}

export function getAgendaGroups(snapshot: AppSnapshot) {
  const groups = new Map<string, CalendarEvent[]>();

  getUpcomingEvents(snapshot).forEach(event => {
    const key = isoDate(event.startsAt);
    const current = groups.get(key) ?? [];
    groups.set(key, [...current, event]);
  });

  return Array.from(groups.entries()).map(([dateIso, events]) => ({
    dateIso,
    events,
  }));
}

export function getCurrentMemberRole(snapshot: AppSnapshot) {
  const userId = snapshot.sessionState.session?.userId;
  return getGroupMembers(snapshot).find(item => item.userId === userId)?.role;
}
