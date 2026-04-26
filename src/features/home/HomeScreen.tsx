import React from 'react';
import {
  getActiveGroupProfiles,
  getCurrentGroup,
  getPinnedNotes,
  getScoreboard,
  getUnreadNotifications,
  getUpcomingEvents,
} from '../../store/selectors';
import { useAppStore } from '../../store/store';
import { useCurrencyFormatter } from '../../shared/format/currency';
import { Theme } from '../../shared/theme/theme';
import { Screen } from '../../shared/ui/Screen';
import { Section } from '../../shared/ui/Section';
import { GroupHeaderCard } from './GroupHeaderCard';
import { HomeNotifications } from './HomeNotifications';
import { HomeOverview } from './HomeOverview';
import { HomeUpcoming } from './HomeUpcoming';

export function HomeScreen({ theme }: { theme: Theme }) {
  const { snapshot, markAllNotificationsRead } = useAppStore();
  const { formatCurrency } = useCurrencyFormatter();

  if (!snapshot) return null;

  const group = getCurrentGroup(snapshot);
  const profiles = getActiveGroupProfiles(snapshot);
  const pinnedNotes = getPinnedNotes(snapshot).filter(note => note.isPinned);
  const unread = getUnreadNotifications(snapshot).slice(0, 4);
  const scoreboard = getScoreboard(snapshot);
  const upcoming = getUpcomingEvents(snapshot).slice(0, 3);
  const leader = scoreboard.currentScores[0];
  const leaderProfile = profiles.find(
    item => item.member.userId === leader?.userId,
  )?.profile;
  const monthlyTotal = formatCurrency(
    snapshot.expenses
      .filter(expense => expense.groupId === group.id)
      .filter(expense => {
        const date = new Date(expense.purchasedAt);
        const now = new Date();
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth()
        );
      })
      .reduce((total, expense) => total + expense.amountCents, 0),
  );

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title={group.groupName}
        subtitle="Private group planning, spending, and chores without needing a resident support engineer."
      >
        <GroupHeaderCard theme={theme} profiles={profiles} />
      </Section>

      <Section theme={theme} title="Overview">
        <HomeOverview
          theme={theme}
          monthlyTotal={monthlyTotal}
          pinnedNoteCount={pinnedNotes.length}
          leaderName={leaderProfile?.displayName}
          leaderPoints={leader?.points}
        />
      </Section>

      <HomeNotifications
        theme={theme}
        unread={unread}
        onMarkAllRead={() => {
          markAllNotificationsRead().catch(() => undefined);
        }}
      />

      <HomeUpcoming theme={theme} upcoming={upcoming} />
    </Screen>
  );
}
