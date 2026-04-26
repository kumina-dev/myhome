import React from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Theme } from '../theme/theme';

export function Field({
  theme,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  helper,
  secureTextEntry,
}: {
  theme: Theme;
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  helper?: string;
  secureTextEntry?: boolean;
}) {
  const styles = createStyles(theme);
  const inputStyle = multiline ? styles.inputMultiline : styles.input;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        style={[styles.inputBase, inputStyle]}
      />
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    field: {
      marginBottom: theme.spacing.md,
    },
    label: {
      color: theme.textMuted,
      textTransform: theme.typography.kicker.textTransform,
      fontSize: theme.typography.kicker.fontSize,
      fontWeight: theme.typography.kicker.fontWeight,
      letterSpacing: 0.6,
      marginBottom: theme.spacing.sm,
    },
    inputBase: {
      borderWidth: theme.borders.hairline,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      color: theme.text,
      borderRadius: theme.radius.md,
      fontSize: 15,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    input: {
      minHeight: 48,
    },
    inputMultiline: {
      minHeight: 104,
      textAlignVertical: 'top',
    },
    helper: {
      marginTop: theme.spacing.sm,
      color: theme.textMuted,
      fontSize: 12,
      lineHeight: 16,
    },
  });
