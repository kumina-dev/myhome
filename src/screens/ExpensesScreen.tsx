import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/store';
import {
  formatCurrency,
  formatShortDate,
  getActiveGroupProfiles,
  getExpenseSummary,
} from '../store/selectors';
import { AppSnapshot } from '../store/models';
import { Theme } from '../shared/theme/theme';
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  Field,
  Screen,
  Section,
  SegmentedControl,
  StatCard,
} from '../ui/primitives';
import { DateField } from '../ui/pickers';

export function ExpensesScreen({ theme }: { theme: Theme }) {
  const { snapshot, addExpense } = useAppStore();

  if (!snapshot) return null;

  return (
    <ExpensesScreenContent
      theme={theme}
      snapshot={snapshot}
      addExpense={addExpense}
    />
  );
}

function ExpensesScreenContent({
  theme,
  snapshot,
  addExpense,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  addExpense: ReturnType<typeof useAppStore>['addExpense'];
}) {
  const styles = createStyles(theme);
  const summary = getExpenseSummary(snapshot);
  const memberProfiles = getActiveGroupProfiles(snapshot);
  const [buyerUserId, setBuyerUserId] = useState(
    snapshot.sessionState.session?.userId ?? memberProfiles[0]?.member.userId,
  );
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasedAt, setPurchasedAt] = useState(new Date().toISOString());
  const [category, setCategory] = useState(
    snapshot.settings.expenseCategories[0] ?? 'Other',
  );
  const [notes, setNotes] = useState('');

  const memberOptions = useMemo(
    () =>
      memberProfiles.map(item => ({
        key: item.member.userId,
        label: item.profile.displayName,
      })),
    [memberProfiles],
  );

  function handleSubmitPress() {
    submit().catch(() => undefined);
  }

  async function submit() {
    const amountNumber = Number(amount.replace(',', '.'));

    if (!title.trim() || Number.isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Invalid expense', 'Title and amount are required.');
      return;
    }

    await addExpense({
      buyerUserId: buyerUserId ?? snapshot.sessionState.session?.userId ?? '',
      title: title.trim(),
      amountCents: Math.round(amountNumber * 100),
      purchasedAt,
      category,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setAmount('');
    setNotes('');
  }

  return (
    <Screen theme={theme}>
      <Section theme={theme} title="This month">
        <StatCard
          theme={theme}
          label="Total"
          value={formatCurrency(summary.total)}
          hint="By category, by member, and easy to scan"
        />
      </Section>

      <Section
        theme={theme}
        title="Log purchase"
        subtitle="Structured inputs beat mysterious free-text blobs every time."
      >
        <Card theme={theme}>
          <SegmentedControl
            theme={theme}
            items={memberOptions}
            selected={buyerUserId ?? memberOptions[0]?.key ?? ''}
            onSelect={setBuyerUserId}
          />
          <Field
            theme={theme}
            label="What was bought"
            value={title}
            onChangeText={setTitle}
            placeholder="Weekly groceries"
          />
          <Field
            theme={theme}
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            placeholder="84.20"
            keyboardType="numeric"
          />
          <DateField
            theme={theme}
            label="Purchase date"
            value={purchasedAt}
            weekStartsOn={snapshot.settings.weekStartsOn}
            onChange={setPurchasedAt}
          />
          <SegmentedControl
            theme={theme}
            items={snapshot.settings.expenseCategories.map(item => ({
              key: item,
              label: item,
            }))}
            selected={category}
            onSelect={setCategory}
          />
          <Field
            theme={theme}
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional context"
            multiline
          />
          <Button
            theme={theme}
            label="Add expense"
            onPress={handleSubmitPress}
          />
        </Card>
      </Section>

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
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cardTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '800',
    },
    cardValue: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '700',
    },
    bodyMuted: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    memberColumn: {
      gap: 4,
    },
  });
