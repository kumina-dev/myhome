import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import {
  AddExpenseInput,
  AppSnapshot,
  GroupMember,
  UserProfile,
} from '../../store/models';
import { ExpenseDateField } from './ExpenseDateField';

interface ActiveGroupProfile {
  member: GroupMember;
  profile: UserProfile;
}

export function ExpenseForm({
  theme,
  snapshot,
  memberProfiles,
  onAddExpense,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  memberProfiles: ActiveGroupProfile[];
  onAddExpense: (input: AddExpenseInput) => Promise<void>;
}) {
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

  async function submit() {
    const amountNumber = Number(amount.replace(',', '.'));

    if (!title.trim() || Number.isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Invalid expense', 'Title and amount are required.');
      return;
    }

    await onAddExpense({
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
      <ExpenseDateField
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
        onPress={() => submit().catch(() => undefined)}
      />
    </Card>
  );
}

function SegmentedControl<T extends string>({
  theme,
  items,
  selected,
  onSelect,
}: {
  theme: Theme;
  items: { key: T; label: string }[];
  selected: T;
  onSelect: (key: T) => void;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.segmented}>
      {items.map(item => {
        const isSelected = item.key === selected;

        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            style={[
              styles.segmentBase,
              isSelected ? styles.segmentSelected : styles.segment,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                isSelected ? styles.segmentTextSelected : null,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    segmented: {
      flexDirection: 'row',
      backgroundColor: theme.surfaceMuted,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xs,
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    segmentBase: {
      flex: 1,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderWidth: theme.borders.hairline,
      borderColor: 'transparent',
    },
    segment: {
      backgroundColor: 'transparent',
    },
    segmentSelected: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
    },
    segmentText: {
      color: theme.textMuted,
      fontWeight: '800',
      textAlign: 'center',
      fontSize: 13,
    },
    segmentTextSelected: {
      color: theme.text,
    },
  });
