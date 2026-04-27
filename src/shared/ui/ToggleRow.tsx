import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/theme';

export function ToggleRow({
  theme,
  label,
  value,
  onValueChange,
}: {
  theme: Theme;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const styles = createStyles(theme);

  return (
    <Pressable onPress={() => onValueChange(!value)} style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={value ? styles.toggleTrackOn : styles.toggleTrack}>
        <View style={value ? styles.toggleThumbOn : styles.toggleThumb} />
      </View>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.md,
    },
    toggleLabel: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 21,
    },
    toggleTrack: {
      width: 52,
      height: 30,
      borderRadius: theme.radius.full,
      borderWidth: theme.borders.hairline,
      borderColor: theme.border,
      backgroundColor: theme.surfaceMuted,
      padding: 3,
      alignItems: 'flex-start',
    },
    toggleTrackOn: {
      width: 52,
      height: 30,
      borderRadius: theme.radius.full,
      borderWidth: theme.borders.hairline,
      borderColor: theme.accent,
      backgroundColor: theme.accent,
      padding: 3,
      alignItems: 'flex-end',
    },
    toggleThumb: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.textMuted,
    },
    toggleThumbOn: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.inverseText,
    },
  });
