import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Card } from '../../shared/ui/Card';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Section } from '../../shared/ui/Section';
import { CalendarEvent } from '../../store/models';
import { useDateTimeFormatter } from '../../shared/format/dateTime';

export function HomeUpcoming({
  theme,
  upcoming,
}: {
  theme: Theme;
  upcoming: CalendarEvent[];
}) {
  const styles = createStyles(theme);
  const { formatDateTime } = useDateTimeFormatter();

  return (
    <Section theme={theme} title="Upcoming">
      {upcoming.length ? (
        upcoming.map(event => (
          <Card key={event.id} theme={theme}>
            <Text style={styles.cardTitle}>{event.title}</Text>
            <Text style={styles.bodyMuted}>{formatDateTime(event.startsAt)}</Text>
            {event.notes ? <Text style={styles.meta}>{event.notes}</Text> : null}
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
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cardTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '900',
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
