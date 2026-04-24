import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Theme } from '../theme/theme';

export function Screen({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.screenContent}
    >
      {children}
    </ScrollView>
  );
}

export function Section({
  theme,
  title,
  action,
  children,
}: {
  theme: Theme;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {title}
        </Text>
        {action}
      </View>
      {children}
    </View>
  );
}

export function Card({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      {children}
    </View>
  );
}

export function StatCard({
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
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>
        {label}
      </Text>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      {hint ? (
        <Text style={[styles.statHint, { color: theme.textMuted }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export function Pill({
  theme,
  label,
  selected,
  onPress,
}: {
  theme: Theme;
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          borderColor: selected ? theme.accent : theme.border,
          backgroundColor: selected ? theme.accentSoft : theme.surfaceMuted,
        },
      ]}
    >
      <Text
        style={[
          styles.pillText,
          { color: selected ? theme.accent : theme.textMuted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Field({
  theme,
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
}: {
  theme: Theme;
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        multiline={multiline}
        keyboardType={keyboardType}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />
    </View>
  );
}

export function Button({
  theme,
  label,
  onPress,
  kind = 'primary',
}: {
  theme: Theme;
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary';
}) {
  const isPrimary = kind === 'primary';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: isPrimary ? theme.accent : theme.surfaceMuted,
          borderColor: isPrimary ? theme.accent : theme.border,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          { color: isPrimary ? '#FFFFFF' : theme.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  statCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  statHint: {
    fontSize: 13,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  inputMultiline: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
  button: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
