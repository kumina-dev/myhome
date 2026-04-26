import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { CalendarEvent } from '../../store/models';
import { formatShortDate, formatTime, isoDate } from '../../store/selectors';

export function EventDetailCard({
  theme,
  event,
}: {
  theme: Theme;
  event: CalendarEvent;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.detailCard}>
      <View
        style={[
          styles.detailMarker,
          { backgroundColor: theme.eventColors[event.colorKey] },
        ]}
      />
      <Text style={styles.detailTitle}>{event.title}</Text>
      <Text style={styles.detailMeta}>
        {formatShortDate(isoDate(event.startsAt))} ·{' '}
        {formatTime(event.startsAt)} - {formatTime(event.endsAt)}
      </Text>
      {event.notes ? (
        <Text style={styles.detailBody}>{event.notes}</Text>
      ) : null}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    detailCard: {
      backgroundColor: theme.surfaceMuted,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    detailMarker: {
      width: 42,
      height: 6,
      borderRadius: theme.radius.full,
    },
    detailTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '900',
    },
    detailMeta: {
      color: theme.textMuted,
      fontSize: 14,
    },
    detailBody: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 21,
    },
  });
