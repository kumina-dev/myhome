import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { AppSnapshot } from '../../store/models';
import {
  getCalendarMonthMatrix,
  getEventsForDate,
} from '../../store/selectors';

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

          return (
            <Pressable
              key={dateIso}
              style={[
                styles.dayCell,
                !sameMonth ? styles.dayCellMuted : null,
                today ? styles.dayCellToday : null,
                selected ? styles.dayCellSelected : null,
              ]}
              onPress={() => onSelectDate(dateIso)}
            >
              <Text
                style={[
                  styles.dayText,
                  !sameMonth ? styles.dayTextMuted : null,
                  selected ? styles.dayTextSelected : null,
                ]}
              >
                {date.getDate()}
              </Text>
              <View style={styles.dotRow}>
                {events.map(event => (
                  <View
                    key={event.id}
                    style={[
                      styles.eventDot,
                      { backgroundColor: theme.eventColors[event.colorKey] },
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

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    monthCard: {
      backgroundColor: theme.surface,
      borderWidth: theme.borders.hairline,
      borderColor: theme.border,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    monthTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '900',
      marginBottom: theme.spacing.md,
    },
    weekHeader: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    weekLabel: {
      flex: 1,
      textAlign: 'center',
      color: theme.textMuted,
      fontWeight: '800',
      fontSize: 12,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    dayCell: {
      width: '13.2%',
      aspectRatio: 1,
      borderRadius: theme.radius.md,
      backgroundColor: theme.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
    },
    dayCellMuted: {
      backgroundColor: theme.backgroundElevated,
    },
    dayCellToday: {
      backgroundColor: theme.calendarToday,
    },
    dayCellSelected: {
      backgroundColor: theme.accent,
    },
    dayText: {
      color: theme.text,
      fontWeight: '800',
    },
    dayTextMuted: {
      color: theme.textMuted,
    },
    dayTextSelected: {
      color: theme.inverseText,
    },
    dotRow: {
      flexDirection: 'row',
      gap: 3,
      marginTop: theme.spacing.xs,
    },
    eventDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
  });
