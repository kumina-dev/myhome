import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store/store';
import { useCurrencyFormatter } from '../../shared/format/currency';
import {
  getActiveGroupProfiles,
  getExpenseSummary,
} from '../../store/selectors';
import { Theme } from '../../shared/theme/theme';
import { Screen } from '../../shared/ui/Screen';
import { Section } from '../../shared/ui/Section';
import { ExpenseBreakdowns } from './ExpenseBreakdowns';
import { ExpenseForm } from './ExpenseForm';

export function ExpensesScreen({ theme }: { theme: Theme }) {
  const { snapshot, addExpense } = useAppStore();
  const { formatCurrency } = useCurrencyFormatter();
  
  if (!snapshot) return null;
  
  const styles = createStyles(theme);
  const summary = getExpenseSummary(snapshot);
  const memberProfiles = getActiveGroupProfiles(snapshot);

  return (
    <Screen theme={theme}>
      <Section theme={theme} title="This month">
        <View style={styles.statCard}>
          <Text style={styles.kicker}>Total</Text>
          <Text style={styles.statValue}>{formatCurrency(summary.total)}</Text>
          <Text style={styles.bodyMuted}>
            By category, by member, and easy to scan
          </Text>
        </View>
      </Section>

      <Section
        theme={theme}
        title="Log purchase"
        subtitle="Structured inputs beat mysterious free-text blobs every time."
      >
        <ExpenseForm
          theme={theme}
          snapshot={snapshot}
          memberProfiles={memberProfiles}
          onAddExpense={addExpense}
        />
      </Section>

      <ExpenseBreakdowns
        theme={theme}
        summary={summary}
        memberProfiles={memberProfiles}
      />
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    statCard: {
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
    statValue: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '900',
      marginBottom: theme.spacing.xs,
    },
    bodyMuted: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
  });
