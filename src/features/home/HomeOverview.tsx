import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';

export function HomeOverview({
  theme,
  monthlyTotal,
  pinnedNoteCount,
  leaderName,
  leaderPoints,
}: {
  theme: Theme;
  monthlyTotal: string;
  pinnedNoteCount: number;
  leaderName?: string;
  leaderPoints?: number;
}) {
  return (
    <>
      <StatCard
        theme={theme}
        label="This month"
        value={monthlyTotal}
        hint="Shared spending for the current month"
      />
      <StatCard
        theme={theme}
        label="Pinned notes"
        value={String(pinnedNoteCount)}
        hint="Visible priorities for everyone"
      />
      <StatCard
        theme={theme}
        label="Cycle leader"
        value={leaderName ?? 'No score yet'}
        hint={
          leaderPoints !== undefined
            ? `${leaderPoints} points this cycle`
            : 'Complete tasks to start'
        }
      />
    </>
  );
}

function StatCard({
  theme,
  label,
  value,
  hint,
}: {
  theme: Theme;
  label: string;
  value: string;
  hint?: string;
}) {
  const styles = createStyles(theme);
  
  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: theme.borders.hairline,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    kicker: {
      color: theme.textMuted,
      textTransform: theme.typography.kicker.textTransform,
      fontSize: theme.typography.kicker.fontSize,
      fontWeight: theme.typography.kicker.fontWeight,
      letterSpacing: 0.6,
      marginBottom: theme.spacing.sm,
    },
    value: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '900',
      marginBottom: theme.spacing.xs,
    },
    hint: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
  });
