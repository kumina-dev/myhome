import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { ModalSheet } from '../../shared/ui/ModalSheet';
import { useDateTimeFormatter } from '../../shared/format/dateTime';
import { getCalendarMonthMatrix } from '../../store/selectors';

function combineDateTime(dateIso: string, hour: number, minute: number) {
  const date = new Date(`${dateIso}T00:00:00`);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function ExpenseDateField({
  theme,
  label,
  value,
  weekStartsOn,
  onChange,
}: {
  theme: Theme;
  label: string;
  value: string;
  weekStartsOn: 'monday' | 'sunday';
  onChange: (next: string) => void;
}) {
  const styles = createStyles(theme);
  const [visible, setVisible] = useState(false);
  const { formatMonthYear, formatShortDate } = useDateTimeFormatter();
  const [visibleMonth, setVisibleMonth] = useState(new Date(value));

  const cells = useMemo(
    () => getCalendarMonthMatrix(visibleMonth, weekStartsOn),
    [visibleMonth, weekStartsOn],
  );

  const selectedIso = value.slice(0, 10);
  const selectedMonth = visibleMonth.getMonth();
  const selectedYear = visibleMonth.getFullYear();

  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={styles.trigger}>
        <Text style={styles.triggerLabel}>{label}</Text>
        <Text style={styles.triggerValue}>{formatShortDate(value)}</Text>
      </Pressable>

      <ModalSheet
        theme={theme}
        visible={visible}
        title={label}
        closeLabel="Close"
        onClose={() => setVisible(false)}
      >
        <View style={styles.monthHeader}>
          <Button
            theme={theme}
            label="Previous"
            kind="secondary"
            onPress={() =>
              setVisibleMonth(
                current =>
                  new Date(current.getFullYear(), current.getMonth() - 1, 1),
              )
            }
          />
          <Text style={styles.monthLabel}>{formatMonthYear(visibleMonth)}</Text>
          <Button
            theme={theme}
            label="Next"
            kind="secondary"
            onPress={() =>
              setVisibleMonth(
                current =>
                  new Date(current.getFullYear(), current.getMonth() + 1, 1),
              )
            }
          />
        </View>

        <View style={styles.weekHeader}>
          {(weekStartsOn === 'monday'
            ? ['M', 'T', 'W', 'T', 'F', 'S', 'S']
            : ['S', 'M', 'T', 'W', 'T', 'F', 'S']
          ).map((labelValue, index) => (
            <Text key={`${labelValue}-${index}`} style={styles.weekLabel}>
              {labelValue}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map(cell => {
            const iso = cell.toISOString().slice(0, 10);
            const sameMonth =
              cell.getMonth() === selectedMonth &&
              cell.getFullYear() === selectedYear;
            const isSelected = iso === selectedIso;
            const cellStyle = isSelected
              ? styles.dayCellSelected
              : sameMonth
              ? styles.dayCell
              : styles.dayCellMuted;
            const textStyle = isSelected
              ? styles.dayTextSelected
              : sameMonth
              ? styles.dayText
              : styles.dayTextMuted;

            return (
              <Pressable
                key={iso}
                onPress={() => {
                  onChange(combineDateTime(iso, 12, 0));
                  setVisible(false);
                }}
                style={cellStyle}
              >
                <Text style={textStyle}>{cell.getDate()}</Text>
              </Pressable>
            );
          })}
        </View>
      </ModalSheet>
    </>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    trigger: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: theme.borders.hairline,
      borderRadius: theme.radius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    triggerLabel: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: theme.spacing.xs,
    },
    triggerValue: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '600',
    },
    monthHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    monthLabel: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '800',
      flex: 1,
      textAlign: 'center',
    },
    weekHeader: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    weekLabel: {
      flex: 1,
      textAlign: 'center',
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    dayCell: {
      width: '13.2%',
      aspectRatio: 1,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayCellMuted: {
      width: '13.2%',
      aspectRatio: 1,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.backgroundElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayCellSelected: {
      width: '13.2%',
      aspectRatio: 1,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
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
  });
