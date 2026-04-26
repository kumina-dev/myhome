import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/theme';

export function EmptyState({
  theme,
  title,
  body,
}: {
  theme: Theme;
  title: string;
  body: string;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.surfaceMuted,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      borderWidth: theme.borders.hairline,
      borderColor: theme.border,
      gap: theme.spacing.sm,
    },
    title: {
      color: theme.text,
      fontSize: 17,
      fontWeight: '800',
    },
    body: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
  });
