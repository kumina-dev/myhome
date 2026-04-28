import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { useTranslation } from '../../i18n';

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
  const { t } = useTranslation();

  return (
    <>
      <StatCard
        theme={theme}
        label={t('home.overview.thisMonth')}
        value={monthlyTotal}
        hint={t('home.overview.thisMonthHint')}
      />
      <StatCard
        theme={theme}
        label={t('home.overview.pinnedNotes')}
        value={String(pinnedNoteCount)}
        hint={t('home.overview.pinnedNotesHint')}
      />
      <StatCard
        theme={theme}
        label={t('home.overview.cycleLeader')}
        value={leaderName ?? t('home.overview.noScoreYet')}
        hint={
          leaderPoints !== undefined
            ? t('home.overview.pointsThisCycle', { count: leaderPoints })
            : t('home.overview.completeTasksToStart')
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
