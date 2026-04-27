import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { ProfileColorKey } from '../../store/models';

export function Kicker({
  theme,
  children,
}: {
  theme: Theme;
  children: string;
}) {
  const styles = createStyles(theme);

  return <Text style={styles.kicker}>{children}</Text>;
}

export function ListRow({
  theme,
  title,
  subtitle,
  trailing,
}: {
  theme: Theme;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.listRow}>
      <View style={styles.listContent}>
        <Text style={styles.listTitle}>{title}</Text>
        {subtitle ? <Text style={styles.meta}>{subtitle}</Text> : null}
      </View>
      {trailing}
    </View>
  );
}

export function Avatar({
  theme,
  label,
  colorKey,
}: {
  theme: Theme;
  label: string;
  colorKey: ProfileColorKey;
}) {
  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.avatar,
        { backgroundColor: theme.profileColors[colorKey] },
      ]}
    >
      <Text style={styles.avatarText}>{label.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

export function Badge({ theme, label }: { theme: Theme; label: string }) {
  const styles = createStyles(theme);

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    kicker: {
      color: theme.textMuted,
      fontSize: theme.typography.kicker.fontSize,
      fontWeight: theme.typography.kicker.fontWeight,
      textTransform: theme.typography.kicker.textTransform,
      marginBottom: theme.spacing.sm,
    },
    body: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 21,
    },
    meta: {
      color: theme.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    listRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    listContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    listTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '800',
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: theme.inverseText,
      fontWeight: '900',
      fontSize: 14,
    },
    badge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.full,
      backgroundColor: theme.accentSoft,
      alignSelf: 'flex-start',
    },
    badgeText: {
      color: theme.accent,
      fontWeight: '800',
      fontSize: 12,
    },
  });
