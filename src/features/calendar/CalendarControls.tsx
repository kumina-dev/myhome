import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { useDateTimeFormatter } from '../../shared/format/dateTime';
import { ModalSheet } from '../../shared/ui/ModalSheet';
import { CalendarViewMode, EventColorKey } from '../../store/models';
import { getCalendarMonthMatrix } from '../../store/selectors';
import { TranslationKey, useTranslation } from '../../i18n';
import { SegmentedControl } from '../../shared/ui/SegmentedControl';
import {
  combineDateAndTime,
  parseHour,
  parseMinute,
} from '../../shared/validation/forms';

function combineDateTime(dateIso: string, hour: number, minute: number) {
  return combineDateAndTime(dateIso, hour, minute) ?? new Date().toISOString();
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
  const { formatMonthYear, formatShortDate } = useDateTimeFormatter();
  const { t } = useTranslation();
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
        closeLabel={t('common.actions.close')}
        onClose={() => setVisible(false)}
      >
        <View style={styles.monthHeader}>
          <Button
            theme={theme}
            label={t('common.calendar.previous')}
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
            label={t('common.calendar.next')}
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
            ? ([
                'calendar.weekdays.narrow.monday',
                'calendar.weekdays.narrow.tuesday',
                'calendar.weekdays.narrow.wednesday',
                'calendar.weekdays.narrow.thursday',
                'calendar.weekdays.narrow.friday',
                'calendar.weekdays.narrow.saturday',
                'calendar.weekdays.narrow.sunday',
              ] satisfies TranslationKey[])
            : ([
                'calendar.weekdays.narrow.sunday',
                'calendar.weekdays.narrow.monday',
                'calendar.weekdays.narrow.tuesday',
                'calendar.weekdays.narrow.wednesday',
                'calendar.weekdays.narrow.thursday',
                'calendar.weekdays.narrow.friday',
                'calendar.weekdays.narrow.saturday',
              ] satisfies TranslationKey[])
          ).map(labelValue => (
            <Text key={labelValue} style={styles.weekLabel}>
              {t(labelValue)}
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

            return (
              <Pressable
                key={iso}
                onPress={() => {
                  const next = combineDateTime(iso, 12, 0);
                  onChange(next);
                  setVisible(false);
                }}
                style={[
                  styles.dayCell,
                  !sameMonth ? styles.dayCellMuted : null,
                  isSelected ? styles.dayCellSelected : null,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    !sameMonth ? styles.dayTextMuted : null,
                    isSelected ? styles.dayTextSelected : null,
                  ]}
                >
                  {cell.getDate()}
                </Text>
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
  const { formatTime } = useDateTimeFormatter();
  const { t } = useTranslation();
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
        closeLabel={t('common.actions.close')}
        onClose={() => setVisible(false)}
      >
        <Field
          theme={theme}
          label={t('calendar.fields.hour')}
          value={hour}
          onChangeText={setHour}
          keyboardType="numeric"
          helper={t('calendar.helpers.hour')}
        />
        <Field
          theme={theme}
          label={t('calendar.fields.minute')}
          value={minute}
          onChangeText={setMinute}
          keyboardType="numeric"
          helper={t('calendar.helpers.minute')}
        />
        <Button
          theme={theme}
          label={t('calendar.actions.applyTime')}
          onPress={() => {
            const parsedHour = parseHour(hour);
            const parsedMinute = parseMinute(minute);

            if (parsedHour === null || parsedMinute === null) {
              Alert.alert(
                t('validation.invalidTimeTitle'),
                t('validation.invalidTimeBody'),
              );
              return;
            }

            const next = combineDateAndTime(dateIso, parsedHour, parsedMinute);

            if (!next) {
              Alert.alert(
                t('validation.invalidTimeTitle'),
                t('validation.invalidTimeBody'),
              );
              return;
            }

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
  const { t } = useTranslation();

  return (
    <>
      <Button
        theme={theme}
        label={t('calendar.fields.eventColorValue', {
          value: t(`calendar.eventColors.${value}`),
        })}
        kind="secondary"
        onPress={() => setVisible(true)}
      />

      <ModalSheet
        theme={theme}
        visible={visible}
        title={t('calendar.fields.chooseEventColor')}
        closeLabel={t('common.actions.close')}
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
  value: CalendarViewMode;
  onChange: (next: CalendarViewMode) => void;
}) {
  const { t } = useTranslation();
  return (
    <SegmentedControl
      theme={theme}
      items={[
        { key: 'month', label: t('calendar.views.month') },
        { key: 'agenda', label: t('calendar.views.agenda') },
      ]}
      selected={value}
      onSelect={onChange}
    />
  );
}

function ColorSwatch({
  theme,
  colorKey,
  selected,
  onPress,
}: {
  theme: Theme;
  colorKey: EventColorKey;
  selected: boolean;
  onPress: () => void;
}) {
  const styles = createStyles(theme);
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.swatchBase, selected ? styles.swatchSelected : null]}
    >
      <View
        style={[
          styles.swatchDot,
          { backgroundColor: theme.eventColors[colorKey] },
        ]}
      />
      <Text style={styles.swatchText}>
        {t(`calendar.eventColors.${colorKey}`)}
      </Text>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    trigger: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: theme.borders.hairline,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    triggerLabel: {
      color: theme.textMuted,
      fontSize: theme.typography.kicker.fontSize,
      fontWeight: theme.typography.kicker.fontWeight,
      textTransform: theme.typography.kicker.textTransform,
      marginBottom: theme.spacing.sm,
    },
    triggerValue: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '700',
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
      fontWeight: '900',
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
      fontWeight: '800',
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
    },
    dayCellMuted: {
      backgroundColor: theme.backgroundElevated,
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
    swatchBase: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: theme.borders.hairline,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      marginBottom: theme.spacing.sm,
    },
    swatchSelected: {
      borderColor: theme.accent,
      backgroundColor: theme.accentSoft,
    },
    swatchDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    swatchText: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 21,
    },
  });
