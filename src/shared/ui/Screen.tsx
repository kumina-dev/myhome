import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Theme } from '../theme/theme';

export function Screen({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  const styles = createStyles(theme);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
    },
  });
