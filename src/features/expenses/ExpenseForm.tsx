import React, { useMemo, useState } from 'react';
import { Alert } from 'react-native';
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
import { useTranslation } from '../../i18n';
import { SegmentedControl } from '../../shared/ui/SegmentedControl';

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
  const { t } = useTranslation();

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
      Alert.alert(
        t('expenses.validation.invalidTitle'),
        t('expenses.validation.invalidBody'),
      );
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
        label={t('expenses.fields.title')}
        value={title}
        onChangeText={setTitle}
        placeholder={t('expenses.placeholders.title')}
      />
      <Field
        theme={theme}
        label={t('expenses.fields.amount')}
        value={amount}
        onChangeText={setAmount}
        placeholder={t('expenses.placeholders.amount')}
        keyboardType="numeric"
      />
      <ExpenseDateField
        theme={theme}
        label={t('expenses.fields.purchaseDate')}
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
        label={t('expenses.fields.notes')}
        value={notes}
        onChangeText={setNotes}
        placeholder={t('expenses.placeholders.notes')}
        multiline
      />
      <Button
        theme={theme}
        label={t('expenses.actions.addExpense')}
        onPress={() => submit().catch(() => undefined)}
      />
    </Card>
  );
}
