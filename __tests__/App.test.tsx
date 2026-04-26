import { resolveLocale } from "../src/i18n/locale";
import { formatCurrencyAmount } from "../src/shared/format/currency";
import { formatMonthYearValue, formatShortDateValue } from "../src/shared/format/dateTime";
import { AppSnapshot } from "../src/store/models";
import { initialSnapshot } from "../src/store/seed";
import { resolvePhase } from "../src/store/store";

function withSession(snapshot: AppSnapshot): AppSnapshot {
  const user = snapshot.authUsers[0];
  const group = snapshot.groups[0];

  return {
    ...snapshot,
    sessionState: {
      session: {
        userId: user.id,
        profileId: user.profileId,
        groupId: group.id,
        email: user.email,
      },
      activeProfileId: user.profileId,
    },
  };
}

describe('resolvePhase', () => {
  test('shows splash while loading or before a snapshot exists', () => {
    expect(resolvePhase(null, true)).toBe('splash');
    expect(resolvePhase(null, false)).toBe('splash');
  });

  test('shows auth when no session exists', () => {
    expect(resolvePhase(initialSnapshot, false)).toBe('auth');
  });

  test('shows app lock when a signed-in locked snapshot requires it', () => {
    const snapshot = withSession({
      ...initialSnapshot,
      appLockSettings: {
        ...initialSnapshot.appLockSettings,
        isEnabled: true,
      },
      appLockState: {
        ...initialSnapshot.appLockState,
        isLocked: true,
      },
    });

    expect(resolvePhase(snapshot, false)).toBe('app-locked');
  });

  test('shows main app when signed in and not locked', () => {
    const snapshot = withSession({
      ...initialSnapshot,
      appLockState: {
        ...initialSnapshot.appLockState,
        isLocked: false,
      },
    });

    expect(resolvePhase(snapshot, false)).toBe('main-app');
  });
});

describe('locale resolution', () => {
  test('uses explicit supported locale preferences before system locale', () => {
    expect(resolveLocale('fi', 'en-US')).toBe('fi');
    expect(resolveLocale('en', 'fi-FI')).toBe('en');
  });

  test('normalizes system locale and falls back to English', () => {
    expect(resolveLocale('system', 'fi_FI')).toBe('fi');
    expect(resolveLocale('system', 'sv-SE')).toBe('en');
    expect(resolveLocale('system', '')).toBe('en');
  });
});

describe('formatting', () => {
  test('formats currency with the provided locale and currency code', () => {
    expect(
      formatCurrencyAmount({
        amountCents: 1234,
        locale: 'en',
        currencyCode: 'USD',
      }),
    ).toBe('$12.34');
  });

  test('formats dates with the provided locale', () => {
    expect(formatShortDateValue(new Date(2026, 3, 27), 'en')).toBe('Apr 27');
    expect(formatMonthYearValue(new Date(2026, 3, 1), 'en')).toBe(
      'April 2026',
    );
  });
});
