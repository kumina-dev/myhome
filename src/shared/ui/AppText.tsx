import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Theme } from '../theme/theme';

export function AppText({
  theme,
  children,
  variant = 'body',
}: {
  theme: Theme;
  children: React.ReactNode;
  variant?: 'title' | 'subtitle' | 'body' | 'muted' | 'kicker';
}) {
  const styles = createStyles(theme);
  const style =
    variant === 'title'
      ? styles.title
      : variant === 'subtitle'
      ? styles.subtitle
      : variant === 'muted'
      ? styles.muted
      : variant === 'kicker'
      ? styles.kicker
      : styles.body;

  return <Text style={style}>{children}</Text>;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      color: theme.text,
      fontSize: theme.typography.title.fontSize,
      fontWeight: theme.typography.title.fontWeight,
    },
    subtitle: {
      color: theme.textMuted,
      fontSize: theme.typography.meta.fontSize,
      lineHeight: theme.typography.meta.lineHeight,
    },
    body: {
      color: theme.text,
      fontSize: theme.typography.body.fontSize,
      lineHeight: theme.typography.body.lineHeight,
    },
    muted: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    kicker: {
      color: theme.textMuted,
      textTransform: theme.typography.kicker.textTransform,
      fontSize: theme.typography.kicker.fontSize,
      fontWeight: theme.typography.kicker.fontWeight,
      letterSpacing: 0.6,
    },
  });
