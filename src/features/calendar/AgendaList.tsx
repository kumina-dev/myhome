import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { CalendarEvent } from '../../store/models';
import { formatShortDate, formatTime } from '../../store/selectors';

export function AgendaList({
  theme,
  events,
  onPressEvent,
}: {
  theme: Theme;
  events: { dateIso: string; events: CalendarEvent[] }[];
  onPressEvent: (event: CalendarEvent) => void;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.agenda}>
      {events.map(group => (
        <View key={group.dateIso} style={styles.agendaGroup}>
          <Text style={styles.agendaHeading}>
            {formatShortDate(group.dateIso)}
          </Text>
          {group.events.map(event => (
            <Pressable
              key={event.id}
              style={styles.agendaItem}
              onPress={() => onPressEvent(event)}
            >
              <View
                style={[
                  styles.eventAccent,
                  { backgroundColor: theme.eventColors[event.colorKey] },
                ]}
              />
              <View style={styles.agendaContent}>
                <Text style={styles.agendaTitle}>{event.title}</Text>
                <Text style={styles.agendaMeta}>
                  {formatTime(event.startsAt)} - {formatTime(event.endsAt)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    agenda: {
      gap: theme.spacing.lg,
    },
    agendaGroup: {
      gap: theme.spacing.sm,
    },
    agendaHeading: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '900',
    },
    agendaItem: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderWidth: theme.borders.hairline,
      borderColor: theme.border,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    eventAccent: {
      width: 10,
      borderRadius: theme.radius.full,
    },
    agendaContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    agendaTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '800',
    },
    agendaMeta: {
      color: theme.textMuted,
      fontSize: 13,
    },
  });
