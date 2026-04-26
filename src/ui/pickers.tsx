import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EventColorKey } from '../store/models';
import {
  formatShortDate,
  formatTime,
  getCalendarMonthMatrix,
} from '../store/selectors';
import { Theme } from '../shared/theme/theme';
import {
  Button,
  ColorSwatch,
  Field,
  ModalSheet,
  SegmentedControl,
} from './primitives';

function monthLabel(value: Date) {
  return new Intl.DateTimeFormat('fi-FI', {
    month: 'long',
    year: 'numeric',
  }).format(value);
}

function combineDateTime(dateIso: string, hour: number, minute: number) {
  const date = new Date(`${dateIso}T00:00:00`);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function parseTimeValue(value: string) {
  const date = new Date(value);
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

export function DateField({
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
          <Text style={styles.monthLabel}>{monthLabel(visibleMonth)}</Text>
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
          ).map(labelValue => (
            <Text key={labelValue} style={styles.weekLabel}>
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
                  const next = combineDateTime(iso, 12, 0);
                  onChange(next);
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

export function TimeField({
  theme,
  label,
  value,
  dateIso,
  onChange,
}: {
  theme: Theme;
  label: string;
  value: string;
  dateIso: string;
  onChange: (next: string) => void;
}) {
  const styles = createStyles(theme);
  const [visible, setVisible] = useState(false);
  const parsed = parseTimeValue(value);
  const [hour, setHour] = useState(String(parsed.hour).padStart(2, '0'));
  const [minute, setMinute] = useState(String(parsed.minute).padStart(2, '0'));

  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={styles.trigger}>
        <Text style={styles.triggerLabel}>{label}</Text>
        <Text style={styles.triggerValue}>{formatTime(value)}</Text>
      </Pressable>

      <ModalSheet
        theme={theme}
        visible={visible}
        title={label}
        onClose={() => setVisible(false)}
      >
        <Field
          theme={theme}
          label="Hour"
          value={hour}
          onChangeText={setHour}
          keyboardType="numeric"
          helper="Use 00-23"
        />
        <Field
          theme={theme}
          label="Minute"
          value={minute}
          onChangeText={setMinute}
          keyboardType="numeric"
          helper="Use 00, 15, 30, or 45 for sane scheduling."
        />
        <Button
          theme={theme}
          label="Apply time"
          onPress={() => {
            const next = combineDateTime(dateIso, Number(hour), Number(minute));
            onChange(next);
            setVisible(false);
          }}
        />
      </ModalSheet>
    </>
  );
}

export function EventColorField({
  theme,
  value,
  onChange,
}: {
  theme: Theme;
  value: EventColorKey;
  onChange: (next: EventColorKey) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        theme={theme}
        label={`Event color: ${value}`}
        kind="secondary"
        onPress={() => setVisible(true)}
      />

      <ModalSheet
        theme={theme}
        visible={visible}
        title="Choose event color"
        onClose={() => setVisible(false)}
      >
        {(['blue', 'pink', 'green', 'amber', 'red'] as EventColorKey[]).map(
          colorKey => (
            <ColorSwatch
              key={colorKey}
              theme={theme}
              colorKey={colorKey}
              selected={colorKey === value}
              onPress={() => {
                onChange(colorKey);
                setVisible(false);
              }}
            />
          ),
        )}
      </ModalSheet>
    </>
  );
}

export function CalendarViewField({
  theme,
  value,
  onChange,
}: {
  theme: Theme;
  value: 'month' | 'agenda';
  onChange: (next: 'month' | 'agenda') => void;
}) {
  return (
    <SegmentedControl
      theme={theme}
      items={[
        { key: 'month', label: 'Month' },
        { key: 'agenda', label: 'Agenda' },
      ]}
      selected={value}
      onSelect={onChange}
    />
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    trigger: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 12,
    },
    triggerLabel: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 6,
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
      gap: 8,
      marginBottom: 12,
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
      marginBottom: 8,
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
      gap: 4,
    },
    dayCell: {
      width: '13.2%',
      aspectRatio: 1,
      borderRadius: 14,
      backgroundColor: theme.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayCellMuted: {
      width: '13.2%',
      aspectRatio: 1,
      borderRadius: 14,
      backgroundColor: theme.backgroundElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayCellSelected: {
      width: '13.2%',
      aspectRatio: 1,
      borderRadius: 14,
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
