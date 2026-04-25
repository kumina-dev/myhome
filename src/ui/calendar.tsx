import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarEvent, EventColorKey } from '../store/models';
import {
  formatShortDate,
  formatTime,
  getCalendarMonthMatrix,
  getEventsForDate,
  isoDate,
} from '../store/selectors';
import { Theme } from '../theme/theme';
import { AppSnapshot } from '../store/models';

function monthHeading(value: Date) {
  return new Intl.DateTimeFormat('fi-FI', {
    month: 'long',
    year: 'numeric',
  }).format(value);
}

export function CalendarMonthView({
  theme,
  snapshot,
  visibleMonth,
  selectedDate,
  onSelectDate,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  visibleMonth: Date;
  selectedDate: string;
  onSelectDate: (next: string) => void;
}) {
  const styles = createStyles(theme);
  const cells = getCalendarMonthMatrix(
    visibleMonth,
    snapshot.settings.weekStartsOn,
  );
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <View style={styles.monthCard}>
      <Text style={styles.monthTitle}>{monthHeading(visibleMonth)}</Text>
      <View style={styles.weekHeader}>
        {(snapshot.settings.weekStartsOn === 'monday'
          ? ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
          : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        ).map(value => (
          <Text key={value} style={styles.weekLabel}>
            {value}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map(date => {
          const dateIso = date.toISOString().slice(0, 10);
          const selected = dateIso === selectedDate;
          const sameMonth = date.getMonth() === visibleMonth.getMonth();
          const today = dateIso === todayIso;
          const events = getEventsForDate(snapshot, dateIso).slice(0, 3);
          const cellStyle = selected
            ? styles.dayCellSelected
            : today
            ? styles.dayCellToday
            : sameMonth
            ? styles.dayCell
            : styles.dayCellMuted;
          const textStyle = selected
            ? styles.dayTextSelected
            : sameMonth
            ? styles.dayText
            : styles.dayTextMuted;

          return (
            <Pressable
              key={dateIso}
              style={cellStyle}
              onPress={() => onSelectDate(dateIso)}
            >
              <Text style={textStyle}>{date.getDate()}</Text>
              <View style={styles.dotRow}>
                {events.map(event => (
                  <View
                    key={event.id}
                    style={[
                      styles.eventDot,
                      swatchStyleMap[event.colorKey](theme),
                    ]}
                  />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

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
                  swatchStyleMap[event.colorKey](theme),
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
        style={[styles.detailMarker, swatchStyleMap[event.colorKey](theme)]}
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

const swatchStyleMap: Record<EventColorKey, (theme: Theme) => object> = {
  blue: theme => ({ backgroundColor: theme.eventColors.blue }),
  pink: theme => ({ backgroundColor: theme.eventColors.pink }),
  green: theme => ({ backgroundColor: theme.eventColors.green }),
  amber: theme => ({ backgroundColor: theme.eventColors.amber }),
  red: theme => ({ backgroundColor: theme.eventColors.red }),
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    monthCard: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
    },
    monthTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 12,
    },
    weekHeader: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    weekLabel: {
      flex: 1,
      textAlign: 'center',
      color: theme.textMuted,
      fontWeight: '700',
      fontSize: 12,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    dayCell: {
      width: '13.2%',
      aspectRatio: 1,
      borderRadius: 14,
      backgroundColor: theme.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    dayCellMuted: {
      width: '13.2%',
      aspectRatio: 1,
      borderRadius: 14,
      backgroundColor: theme.backgroundElevated,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    dayCellToday: {
      width: '13.2%',
      aspectRatio: 1,
      borderRadius: 14,
      backgroundColor: theme.calendarToday,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    dayCellSelected: {
      width: '13.2%',
      aspectRatio: 1,
      borderRadius: 14,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    dayText: {
      color: theme.text,
      fontWeight: '700',
    },
    dayTextMuted: {
      color: theme.textMuted,
      fontWeight: '700',
    },
    dayTextSelected: {
      color: theme.inverseText,
      fontWeight: '800',
    },
    dotRow: {
      flexDirection: 'row',
      gap: 3,
      marginTop: 4,
    },
    eventDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    agenda: {
      gap: 16,
    },
    agendaGroup: {
      gap: 8,
    },
    agendaHeading: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '800',
    },
    agendaItem: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 18,
      padding: 14,
      gap: 12,
    },
    eventAccent: {
      width: 10,
      borderRadius: 999,
    },
    agendaContent: {
      flex: 1,
      gap: 4,
    },
    agendaTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '700',
    },
    agendaMeta: {
      color: theme.textMuted,
      fontSize: 13,
    },
    detailCard: {
      backgroundColor: theme.surfaceMuted,
      borderRadius: 18,
      padding: 16,
      gap: 8,
    },
    detailMarker: {
      width: 42,
      height: 6,
      borderRadius: 999,
    },
    detailTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '800',
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
