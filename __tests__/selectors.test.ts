import { initialSnapshot } from '../src/store/seed';
import { AppSnapshot } from '../src/store/models';
import {
  getActiveGroupProfiles,
  getAgendaGroups,
  getCalendarMonthMatrix,
  getCurrentGroup,
  getCurrentMemberRole,
  getEventsForDate,
  getExpenseSummary,
  getLocaleSettings,
  getScoreboard,
  getVisibleTasks,
} from '../src/store/selectors';

function cloneSnapshot(): AppSnapshot {
  return JSON.parse(JSON.stringify(initialSnapshot)) as AppSnapshot;
}

function isoAt(daysFromToday: number, hour = 12): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

describe('store selectors', () => {
  it('resolves the current group from the active session', () => {
    const snapshot = cloneSnapshot();

    snapshot.groups = [
      {
        id: 'group-other',
        groupName: 'Wrong group',
        createdAt: isoAt(-30),
        createdByUserId: 'auth-other',
      },
      ...snapshot.groups,
    ];
    snapshot.sessionState.session = {
      userId: 'auth-owner',
      profileId: 'profile-owner',
      groupId: 'group-nordline',
      email: 'owner@northcircle.app',
    };

    expect(getCurrentGroup(snapshot).groupName).toBe('North Circle');
  });

  it('returns active group profiles and drops members with missing profiles', () => {
    const snapshot = cloneSnapshot();

    snapshot.members.push({
      id: 'member-missing-profile',
      groupId: 'group-nordline',
      userId: 'auth-missing',
      profileId: 'profile-missing',
      role: 'member',
      joinedAt: isoAt(-1),
    });

    expect(
      getActiveGroupProfiles(snapshot).map(item => item.profile.id),
    ).toEqual(['profile-owner', 'profile-elin', 'profile-mika']);
  });

  it('summarizes only current-month expenses by category and user', () => {
    const snapshot = cloneSnapshot();

    snapshot.expenses = [
      {
        id: 'expense-current-a',
        groupId: 'group-nordline',
        createdAt: isoAt(0),
        updatedAt: isoAt(0),
        createdByUserId: 'auth-owner',
        updatedByUserId: 'auth-owner',
        buyerUserId: 'auth-owner',
        title: 'Current groceries',
        amountCents: 1200,
        purchasedAt: isoAt(0),
        category: 'Groceries',
      },
      {
        id: 'expense-current-b',
        groupId: 'group-nordline',
        createdAt: isoAt(0),
        updatedAt: isoAt(0),
        createdByUserId: 'auth-elin',
        updatedByUserId: 'auth-elin',
        buyerUserId: 'auth-elin',
        title: 'Current transport',
        amountCents: 800,
        purchasedAt: isoAt(0),
        category: 'Transport',
      },
      {
        id: 'expense-old',
        groupId: 'group-nordline',
        createdAt: isoAt(-40),
        updatedAt: isoAt(-40),
        createdByUserId: 'auth-owner',
        updatedByUserId: 'auth-owner',
        buyerUserId: 'auth-owner',
        title: 'Old expense',
        amountCents: 9999,
        purchasedAt: isoAt(-40),
        category: 'Groceries',
      },
    ];

    const summary = getExpenseSummary(snapshot);

    expect(summary.total).toBe(2000);
    expect(summary.byCategory).toEqual([
      { label: 'Groceries', amountCents: 1200 },
      { label: 'Transport', amountCents: 800 },
    ]);
    expect(summary.byUser).toEqual([
      { userId: 'auth-owner', amountCents: 1200 },
      { userId: 'auth-elin', amountCents: 800 },
    ]);
  });

  it('filters visible tasks by completion state and active personal assignee', () => {
    const snapshot = cloneSnapshot();

    snapshot.sessionState.session = {
      userId: 'auth-owner',
      profileId: 'profile-owner',
      groupId: 'group-nordline',
      email: 'owner@northcircle.app',
    };
    snapshot.settings.showCompletedTasks = false;
    snapshot.tasks = [
      {
        id: 'shared-open',
        groupId: 'group-nordline',
        createdAt: isoAt(-1),
        updatedAt: isoAt(-1),
        createdByUserId: 'auth-owner',
        updatedByUserId: 'auth-owner',
        title: 'Shared open',
        scope: 'shared',
        points: 1,
        dueAt: isoAt(1),
      },
      {
        id: 'personal-owner',
        groupId: 'group-nordline',
        createdAt: isoAt(-1),
        updatedAt: isoAt(-1),
        createdByUserId: 'auth-owner',
        updatedByUserId: 'auth-owner',
        title: 'Owner personal',
        scope: 'personal',
        assigneeUserId: 'auth-owner',
        points: 1,
        dueAt: isoAt(2),
      },
      {
        id: 'personal-other',
        groupId: 'group-nordline',
        createdAt: isoAt(-1),
        updatedAt: isoAt(-1),
        createdByUserId: 'auth-owner',
        updatedByUserId: 'auth-owner',
        title: 'Other personal',
        scope: 'personal',
        assigneeUserId: 'auth-elin',
        points: 1,
        dueAt: isoAt(3),
      },
      {
        id: 'shared-complete',
        groupId: 'group-nordline',
        createdAt: isoAt(-1),
        updatedAt: isoAt(-1),
        createdByUserId: 'auth-owner',
        updatedByUserId: 'auth-owner',
        title: 'Completed shared',
        scope: 'shared',
        points: 1,
        dueAt: isoAt(4),
        completedAt: isoAt(0),
        completedByUserId: 'auth-owner',
      },
    ];

    expect(getVisibleTasks(snapshot).map(task => task.id)).toEqual([
      'shared-open',
      'personal-owner',
    ]);
  });

  it('builds current and previous scoreboards from score cycle windows', () => {
    const snapshot = cloneSnapshot();

    snapshot.settings.scoreCycleDays = 7;
    snapshot.settings.scoreCycleAnchor = '2026-04-21T00:00:00.000Z';
    snapshot.tasks = [
      {
        id: 'current-owner',
        groupId: 'group-nordline',
        createdAt: isoAt(-1),
        updatedAt: isoAt(-1),
        createdByUserId: 'auth-owner',
        updatedByUserId: 'auth-owner',
        title: 'Current owner',
        scope: 'shared',
        points: 5,
        completedAt: '2026-04-28T12:00:00.000Z',
        completedByUserId: 'auth-owner',
      },
      {
        id: 'previous-elin',
        groupId: 'group-nordline',
        createdAt: isoAt(-9),
        updatedAt: isoAt(-9),
        createdByUserId: 'auth-owner',
        updatedByUserId: 'auth-owner',
        title: 'Previous Elin',
        scope: 'shared',
        points: 3,
        completedAt: '2026-04-22T12:00:00.000Z',
        completedByUserId: 'auth-elin',
      },
    ];

    const scoreboard = getScoreboard(snapshot);

    expect(
      scoreboard.currentScores.find(item => item.userId === 'auth-owner'),
    ).toEqual({
      userId: 'auth-owner',
      points: 5,
    });
    expect(
      scoreboard.previousScores.find(item => item.userId === 'auth-elin'),
    ).toEqual({
      userId: 'auth-elin',
      points: 3,
    });
  });

  it('builds a 42-cell calendar matrix with configured week start', () => {
    const mondayMatrix = getCalendarMonthMatrix(
      new Date('2026-04-15T12:00:00'),
      'monday',
    );
    const sundayMatrix = getCalendarMonthMatrix(
      new Date('2026-04-15T12:00:00'),
      'sunday',
    );

    expect(mondayMatrix).toHaveLength(42);
    expect(sundayMatrix).toHaveLength(42);
    expect(mondayMatrix[0].getDay()).toBe(1);
    expect(sundayMatrix[0].getDay()).toBe(0);
  });

  it('groups upcoming agenda events by date and returns events for a selected date', () => {
    const snapshot = cloneSnapshot();
    const startsAt = isoAt(2, 10);
    const dateIso = startsAt.slice(0, 10);

    snapshot.events = [
      {
        id: 'event-target',
        groupId: 'group-nordline',
        createdAt: isoAt(-1),
        updatedAt: isoAt(-1),
        createdByUserId: 'auth-owner',
        updatedByUserId: 'auth-owner',
        title: 'Target event',
        startsAt,
        endsAt: isoAt(2, 11),
        colorKey: 'blue',
      },
    ];

    expect(getEventsForDate(snapshot, dateIso).map(event => event.id)).toEqual([
      'event-target',
    ]);
    expect(getAgendaGroups(snapshot)).toEqual([
      {
        dateIso,
        events: snapshot.events,
      },
    ]);
  });

  it('returns current member role and locale settings', () => {
    const snapshot = cloneSnapshot();

    snapshot.sessionState.session = {
      userId: 'auth-owner',
      profileId: 'profile-owner',
      groupId: 'group-nordline',
      email: 'owner@northcircle.app',
    };
    snapshot.settings.localePreference = 'fi';
    snapshot.settings.currencyCode = 'EUR';

    expect(getCurrentMemberRole(snapshot)).toBe('owner');
    expect(getLocaleSettings(snapshot)).toEqual({
      localePreference: 'fi',
      currencyCode: 'EUR',
    });
  });
});
