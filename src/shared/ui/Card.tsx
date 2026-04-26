import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../theme/theme';

export function Card({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  const styles = createStyles(theme);

  return <View style={styles.card}>{children}</View>;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: theme.borders.hairline,
      borderLeftWidth: theme.borders.accent,
      borderLeftColor: theme.accent,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      gap: theme.spacing.md,
      elevation: theme.elevation.low,
    },
  });
