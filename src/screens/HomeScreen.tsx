import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  formatCurrency,
  formatDateTime,
  getActiveGroupProfiles,
  getCurrentGroup,
  getPinnedNotes,
  getScoreboard,
  getUnreadNotifications,
  getUpcomingEvents,
} from '../store/selectors';
import { useAppStore } from '../store/store';
import { Theme } from '../shared/theme/theme';
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Screen,
  Section,
  StatCard,
} from '../ui/primitives';

export function HomeScreen({ theme }: { theme: Theme }) {
  const { snapshot, markAllNotificationsRead } = useAppStore();

  if (!snapshot) return null;

  const styles = createStyles(theme);
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
        <Card theme={theme}>
          <View style={styles.memberRow}>
            {profiles.map(item => (
              <View key={item.member.id} style={styles.memberChip}>
                <Avatar
                  theme={theme}
                  label={item.profile.displayName}
                  colorKey={item.profile.colorKey}
                />
                <View style={styles.memberText}>
                  <Text style={styles.memberName}>
                    {item.profile.displayName}
                  </Text>
                  <Text style={styles.memberRole}>{item.member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </Section>

      <Section theme={theme} title="Overview">
        <StatCard
          theme={theme}
          label="This month"
          value={monthlyTotal}
          hint="Shared spending for the current month"
        />
        <StatCard
          theme={theme}
          label="Pinned notes"
          value={String(pinnedNotes.length)}
          hint="Visible priorities for everyone"
        />
        <StatCard
          theme={theme}
          label="Cycle leader"
          value={leaderProfile?.displayName ?? 'No score yet'}
          hint={
            leader
              ? `${leader.points} points this cycle`
              : 'Complete tasks to start'
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
              onPress={() => {
                markAllNotificationsRead().catch(() => undefined);
              }}
            />
          ) : undefined
        }
      >
        {unread.length ? (
          unread.map(item => (
            <Card key={item.id} theme={theme}>
              <Badge theme={theme} label={item.type} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.bodyMuted}>{item.body}</Text>
              <Text style={styles.meta}>{formatDateTime(item.createdAt)}</Text>
            </Card>
          ))
        ) : (
          <EmptyState
            theme={theme}
            title="Quiet for now"
            body="No unread updates. A rare but welcome condition."
          />
        )}
      </Section>

      <Section theme={theme} title="Upcoming">
        {upcoming.length ? (
          upcoming.map(event => (
            <Card key={event.id} theme={theme}>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.bodyMuted}>
                {formatDateTime(event.startsAt)}
              </Text>
              {event.notes ? (
                <Text style={styles.meta}>{event.notes}</Text>
              ) : null}
            </Card>
          ))
        ) : (
          <EmptyState
            theme={theme}
            title="No upcoming events"
            body="Add plans, reminders, or important dates to keep the group coordinated."
          />
        )}
      </Section>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    memberRow: {
      gap: 12,
    },
    memberChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 4,
    },
    memberText: {
      gap: 2,
    },
    memberName: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '700',
    },
    memberRole: {
      color: theme.textMuted,
      fontSize: 13,
      textTransform: 'capitalize',
    },
    cardTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '800',
    },
    bodyMuted: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    meta: {
      color: theme.textMuted,
      fontSize: 12,
      lineHeight: 18,
    },
  });
