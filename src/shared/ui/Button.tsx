import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Theme } from '../theme/theme';

export function Button({
  theme,
  label,
  onPress,
  kind = 'primary',
}: {
  theme: Theme;
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'ghost' | 'danger';
}) {
  const styles = createStyles(theme);
  const buttonStyle =
    kind === 'secondary'
      ? styles.secondary
      : kind === 'ghost'
      ? styles.ghost
      : kind === 'danger'
      ? styles.danger
      : styles.primary;
  const textStyle = kind === 'ghost' ? styles.ghostText : styles.solidText;

  return (
    <Pressable onPress={onPress} style={[styles.base, buttonStyle]}>
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderWidth: theme.borders.hairline,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    secondary: {
      backgroundColor: theme.surfaceMuted,
      borderColor: theme.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      paddingHorizontal: 0,
      alignItems: 'flex-start',
    },
    danger: {
      backgroundColor: theme.danger,
      borderColor: theme.danger,
    },
    solidText: {
      color: theme.inverseText,
      fontWeight: '800',
      fontSize: 15,
    },
    ghostText: {
      color: theme.accent,
      fontWeight: '800',
      fontSize: 15,
    },
  });
