import { Alert, Text, View } from 'react-native';
import { Theme } from '../theme/theme';
import { useAppStore } from '../store/store';
import {
  formatCurrency,
  formatShortDate,
  getExpenseSummary,
  getUserMap,
} from '../store/selectors';
import { useState } from 'react';
import {
  Button,
  Card,
  Field,
  Pill,
  Screen,
  Section,
  StatCard,
} from '../ui/primitives';

export function ExpensesScreen({ theme }: { theme: Theme }) {
  const { state, dispatch } = useAppStore();
  const users = getUserMap(state.users);
  const summary = getExpenseSummary(state);

  const [buyerUserId, setBuyerUserId] = useState(state.settings.activeUserId);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(
    state.settings.expenseCategories[0] ?? 'Other',
  );
  const [notes, setNotes] = useState('');

  function submit() {
    const amountNumber = Number(amount.replace(',', '.'));

    if (!title.trim() || Number.isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Invalid expense', 'Title and amount are required.');
      return;
    }

    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        buyerUserId,
        title: title.trim(),
        amountCents: Math.round(amountNumber * 100),
        purchasedAt: new Date(`${date}T12:00:00`).toISOString(),
        category,
        notes: notes.trim() || undefined,
      },
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
          hint="Current calendar month"
        />
      </Section>

      <Section theme={theme} title="Log purchase">
        <Card theme={theme}>
          <Text style={{ color: theme.textMuted, marginBottom: 8 }}>Buyer</Text>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}
          >
            {state.users.map(user => (
              <Pill
                key={user.id}
                theme={theme}
                label={user.name}
                selected={buyerUserId === user.id}
                onPress={() => setBuyerUserId(user.id)}
              />
            ))}
          </View>

          <Field
            theme={theme}
            label="What"
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
          <Field
            theme={theme}
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="2026-04-23"
          />

          <Text style={{ color: theme.textMuted, marginBottom: 8 }}>
            Category
          </Text>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}
          >
            {state.settings.expenseCategories.map(item => (
              <Pill
                key={item}
                theme={theme}
                label={item}
                selected={category === item}
                onPress={() => setCategory(item)}
              />
            ))}
          </View>

          <Field
            theme={theme}
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional context"
            multiline
          />

          <Button theme={theme} label="Add expense" onPress={submit} />
        </Card>
      </Section>

      <Section theme={theme} title="By category">
        {summary.byCategory.map(item => (
          <Card key={item.label} theme={theme}>
            <Text
              style={{ color: theme.text, fontWeight: '700', fontSize: 16 }}
            >
              {item.label}
            </Text>
            <Text style={{ color: theme.textMuted, marginTop: 4 }}>
              {formatCurrency(item.amountCents)}
            </Text>
          </Card>
        ))}
      </Section>

      <Section theme={theme} title="By person">
        {summary.byUser.map(item => (
          <Card key={item.userId} theme={theme}>
            <Text
              style={{ color: theme.text, fontWeight: '700', fontSize: 16 }}
            >
              {users[item.userId]?.name ?? 'Unknown'}
            </Text>
            <Text style={{ color: theme.textMuted, marginTop: 4 }}>
              {formatCurrency(item.amountCents)}
            </Text>
          </Card>
        ))}
      </Section>

      <Section theme={theme} title="Recent expenses">
        {summary.expenses.map(expense => (
          <Card key={expense.id} theme={theme}>
            <Text
              style={{ color: theme.text, fontWeight: '700', fontSize: 16 }}
            >
              {expense.title}
            </Text>
            <Text style={{ color: theme.textMuted, marginTop: 4 }}>
              {users[expense.buyerUserId]?.name} · {expense.category} ·{' '}
              {formatShortDate(expense.purchasedAt)}
            </Text>
            <Text style={{ color: theme.text, marginTop: 8, fontSize: 18 }}>
              {formatCurrency(expense.amountCents)}
            </Text>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
