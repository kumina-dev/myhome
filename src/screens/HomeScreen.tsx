import React from 'react';
import { Theme } from '../theme/theme';
import {
  getExpenseSummary,
  getPinnedNotes,
  getUpcomingEvents,
  getUnreadNotifications,
  getScoreboard,
  getUserMap,
  formatCurrency,
  formatDateTime,
} from '../store/selectors';
import { useAppStore } from '../store/store';
import { Button, Card, Screen, Section, StatCard } from '../ui/primitives';
import { Text, View } from 'react-native';

export function HomeScreen({ theme }: { theme: Theme }) {
  const { state, dispatch } = useAppStore();
  const expenseSummary = getExpenseSummary(state);
  const pinnedNotes = getPinnedNotes(state).filter(note => note.isPinned);
  const upcomingEvents = getUpcomingEvents(state).slice(0, 3);
  const unread = getUnreadNotifications(state).slice(0, 4);
  const scoreboard = getScoreboard(state);
  const users = getUserMap(state.users);
  const leader = scoreboard.currentScores[0];

  return (
    <Screen theme={theme}>
      <Section theme={theme} title="Overview">
        <StatCard
          theme={theme}
          label="This month"
          value={formatCurrency(expenseSummary.total)}
          hint={`${expenseSummary.expenses.length} logged expenses`}
        />
        <StatCard
          theme={theme}
          label="Pinned notes"
          value={String(pinnedNotes.length)}
          hint="Shared priorities kept visible"
        />
        <StatCard
          theme={theme}
          label="Upcoming events"
          value={String(upcomingEvents.length)}
          hint="Next 3 items on the calendar"
        />
        <StatCard
          theme={theme}
          label="Cycle leader"
          value={leader ? users[leader.userId].name : 'No points yet'}
          hint={
            leader
              ? `${leader.points} points this cycle`
              : 'Complete tasks to score'
          }
        />
      </Section>

      <Section
        theme={theme}
        title="Notifications"
        action={
          unread.length ? (
            <Button
              theme={theme}
              label="Mark all read"
              kind="secondary"
              onPress={() => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })}
            />
          ) : undefined
        }
      >
        {unread.length ? (
          unread.map(item => (
            <Card key={item.id} theme={theme}>
              <Text
                style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}
              >
                {item.title}
              </Text>
              <Text style={{ color: theme.textMuted, marginTop: 4 }}>
                {item.body}
              </Text>
              <Text
                style={{ color: theme.textMuted, marginTop: 8, fontSize: 12 }}
              >
                {formatDateTime(item.createdAt)}
              </Text>
            </Card>
          ))
        ) : (
          <Card theme={theme}>
            <Text style={{ color: theme.textMuted }}>
              Nothing urgent. Miracles happen.
            </Text>
          </Card>
        )}
      </Section>

      <Section theme={theme} title="Next up">
        {upcomingEvents.map(event => (
          <Card key={event.id} theme={theme}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: event.color,
                marginBottom: 10,
              }}
            />
            <Text
              style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}
            >
              {event.title}
            </Text>
            <Text style={{ color: theme.textMuted, marginTop: 4 }}>
              {formatDateTime(event.startsAt)}
            </Text>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
