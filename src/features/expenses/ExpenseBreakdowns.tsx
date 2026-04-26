import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Card } from '../../shared/ui/Card';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Section } from '../../shared/ui/Section';
import {
  formatCurrency,
  formatShortDate,
  getExpenseSummary,
} from '../../store/selectors';
import { GroupMember, ProfileColorKey, UserProfile } from '../../store/models';

interface ActiveGroupProfile {
  member: GroupMember;
  profile: UserProfile;
}

export function ExpenseBreakdowns({
  theme,
  summary,
  memberProfiles,
}: {
  theme: Theme;
  summary: ReturnType<typeof getExpenseSummary>;
  memberProfiles: ActiveGroupProfile[];
}) {
  const styles = createStyles(theme);

  return (
    <>
      <Section theme={theme} title="By category">
        {summary.byCategory.length ? (
          summary.byCategory.map(item => (
            <Card key={item.label} theme={theme}>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardValue}>
                {formatCurrency(item.amountCents)}
              </Text>
            </Card>
          ))
        ) : (
          <EmptyState
            theme={theme}
            title="No spending yet"
            body="Add the first purchase and the monthly view will start making sense."
          />
        )}
      </Section>

      <Section theme={theme} title="By member">
        {summary.byUser.map(item => {
          const profile = memberProfiles.find(
            profileItem => profileItem.member.userId === item.userId,
          )?.profile;

          return (
            <Card key={item.userId} theme={theme}>
              <View style={styles.row}>
                {profile ? (
                  <Avatar
                    theme={theme}
                    label={profile.displayName}
                    colorKey={profile.colorKey}
                  />
                ) : null}
                <View style={styles.memberColumn}>
                  <Text style={styles.cardTitle}>
                    {profile?.displayName ?? 'Unknown'}
                  </Text>
                  <Text style={styles.bodyMuted}>
                    {formatCurrency(item.amountCents)}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
      </Section>

      <Section theme={theme} title="Recent expenses">
        {summary.expenses.map(expense => {
          const profile = memberProfiles.find(
            profileItem => profileItem.member.userId === expense.buyerUserId,
          )?.profile;

          return (
            <Card key={expense.id} theme={theme}>
              <Text style={styles.cardTitle}>{expense.title}</Text>
              <Text style={styles.bodyMuted}>
                {profile?.displayName ?? 'Unknown'} · {expense.category} ·{' '}
                {formatShortDate(expense.purchasedAt)}
              </Text>
              <Text style={styles.cardValue}>
                {formatCurrency(expense.amountCents)}
              </Text>
            </Card>
          );
        })}
      </Section>
    </>
  );
}

function Avatar({
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

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cardTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '900',
    },
    cardValue: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '800',
    },
    bodyMuted: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    memberColumn: {
      gap: theme.spacing.xs,
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
  });
