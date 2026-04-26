import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/theme';

export function Section({
  theme,
  title,
  subtitle,
  action,
  children,
}: {
  theme: Theme;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      marginBottom: theme.spacing.xxl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.md,
    },
    heading: {
      flex: 1,
    },
    title: {
      color: theme.text,
      fontSize: theme.typography.sectionTitle.fontSize,
      fontWeight: theme.typography.sectionTitle.fontWeight,
    },
    subtitle: {
      marginTop: theme.spacing.xs,
      color: theme.textMuted,
      fontSize: theme.typography.meta.fontSize,
      lineHeight: theme.typography.meta.lineHeight,
    },
  });
