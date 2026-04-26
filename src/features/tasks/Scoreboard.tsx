import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Section } from '../../shared/ui/Section';
import { GroupMember, UserProfile } from '../../store/models';
import { useDateTimeFormatter } from '../../shared/format/dateTime';
import { getScoreboard } from '../../store/selectors';

interface ActiveGroupProfile {
  member: GroupMember;
  profile: UserProfile;
}

export function Scoreboard({
  theme,
  scoreboard,
  memberProfiles,
  mode = 'current',
}: {
  theme: Theme;
  scoreboard: ReturnType<typeof getScoreboard>;
  memberProfiles: ActiveGroupProfile[];
  mode?: 'current' | 'previous';
}) {
  const scores =
    mode === 'current' ? scoreboard.currentScores : scoreboard.previousScores;

  if (mode === 'previous') {
    return (
      <Section theme={theme} title="Previous cycle">
        <ScoreCards
          theme={theme}
          scores={scores}
          memberProfiles={memberProfiles}
          cycleStart={scoreboard.previous.start.toISOString()}
          showCycleHint={false}
        />
      </Section>
    );
  }

  return (
    <ScoreCards
      theme={theme}
      scores={scores}
      memberProfiles={memberProfiles}
      cycleStart={scoreboard.current.start.toISOString()}
      showCycleHint
    />
  );
}

function ScoreCards({
  theme,
  scores,
  memberProfiles,
  cycleStart,
  showCycleHint,
}: {
  theme: Theme;
  scores: { userId: string; points: number }[];
  memberProfiles: ActiveGroupProfile[];
  cycleStart: string;
  showCycleHint: boolean;
}) {
  const { formatShortDate } = useDateTimeFormatter();
  
  return (
    <>
      {scores.map(item => {
        const profile = memberProfiles.find(
          member => member.member.userId === item.userId,
        )?.profile;

        return (
          <StatCard
            key={item.userId}
            theme={theme}
            label={profile?.displayName ?? 'Unknown'}
            value={`${item.points}`}
            hint={
              showCycleHint
                ? `Cycle started ${formatShortDate(cycleStart)}`
                : 'Previous scoring window'
            }
          />
        );
      })}
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
