import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../i18n';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import {
  normalizeEmail,
  normalizeInviteCode,
  normalizeRequiredText,
} from '../../shared/validation/forms';
import { AcceptInviteInput, AuthFlowMode, CreateGroupInput, SignInInput } from '../../store/models';
import { authOptions } from './authOptions';

export function AuthForm({
  theme,
  authMode,
  onAuthModeChange,
  onSignIn,
  onCreateGroup,
  onAcceptInvite,
}: {
  theme: Theme;
  authMode: AuthFlowMode;
  onAuthModeChange: (mode: AuthFlowMode) => void;
  onSignIn: (input: SignInInput) => Promise<void>;
  onCreateGroup: (input: CreateGroupInput) => Promise<void>;
  onAcceptInvite: (input: AcceptInviteInput) => Promise<void>;
}) {
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (submitting) return;

    setSubmitting(true);

    try {
      const normalizedEmail = normalizeEmail(email);
      const cleanedPassword = normalizeRequiredText(password);

      if (!normalizedEmail) {
        throw new Error(t('validation.invalidEmail'));
      }

      if (!cleanedPassword) {
        throw new Error(t('validation.requiredText'));
      }

      if (authMode === 'sign-in') {
        await onSignIn({
          email: normalizedEmail,
          password: cleanedPassword,
        });
        return;
      }

      if (authMode === 'create-group') {
        const cleanedGroupName = normalizeRequiredText(groupName);
        const cleanedDisplayName = normalizeRequiredText(displayName);

        if (!cleanedGroupName || !cleanedDisplayName) {
          throw new Error(t('auth.validation.createGroupRequired'));
        }

        await onCreateGroup({
          groupName: cleanedGroupName,
          displayName: cleanedDisplayName,
          email: normalizedEmail,
          password: cleanedPassword,
        });
        return;
      }

      const cleanedInviteCode = normalizeInviteCode(inviteCode);
      const cleanedDisplayName = normalizeRequiredText(displayName);

      if (!cleanedInviteCode || !cleanedDisplayName) {
        throw new Error(t('auth.validation.inviteRequired'));
      }

      await onAcceptInvite({
        code: cleanedInviteCode,
        displayName: cleanedDisplayName,
        email: normalizedEmail,
        password: cleanedPassword,
      });
    } catch (caught) {
      const error = caught as {
        message?: string;
        data?: unknown;
        response?: unknown;
        status?: number;
      };

      Alert.alert(
        t('auth.errors.failed'),
        [
          error.message ?? t('validation.unexpectedError'),
          `status: ${error.status ?? 'unknown'}`,
          `data: ${JSON.stringify(error.data ?? null, null, 2)}`,
          `response: ${JSON.stringify(error.response ?? null, null, 2)}`,
        ].join('\n\n'),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <View style={styles.modeTabs}>
        {authOptions.map((option) => {
          const selected = authMode === option.key;

          return (
            <Pressable
              key={option.key}
              onPress={() => onAuthModeChange(option.key)}
              style={[styles.modeTab, selected ? styles.modeTabSelected : null]}
            >
              <Text style={[styles.modeTabText, selected ? styles.modeTabTextSelected : null]}>
                {t(option.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {authMode === 'create-group' ? (
        <Field
          theme={theme}
          label={t('auth.fields.groupName')}
          value={groupName}
          onChangeText={setGroupName}
          placeholder={t('auth.placeholders.groupName')}
        />
      ) : null}

      {authMode !== 'sign-in' ? (
        <Field
          theme={theme}
          label={t('auth.fields.displayName')}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder={t('auth.placeholders.displayName')}
        />
      ) : null}

      {authMode === 'accept-invite' ? (
        <Field
          theme={theme}
          label={t('auth.fields.inviteCode')}
          value={inviteCode}
          onChangeText={setInviteCode}
          placeholder={t('auth.placeholders.inviteCode')}
        />
      ) : null}

      <Field
        theme={theme}
        label={t('auth.fields.email')}
        value={email}
        onChangeText={setEmail}
        placeholder={t('auth.placeholders.email')}
      />
      <Field
        theme={theme}
        label={t('auth.fields.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder={t('auth.placeholders.password')}
      />
      <Button
        theme={theme}
        label={t('common.actions.continue')}
        onPress={() => handleSubmit().catch(() => undefined)}
      />
    </>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modeTabs: {
      flexDirection: 'row',
      backgroundColor: theme.surfaceMuted,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xs,
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    modeTab: {
      flex: 1,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderWidth: theme.borders.hairline,
      borderColor: 'transparent',
    },
    modeTabSelected: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
    },
    modeTabText: {
      color: theme.textMuted,
      fontWeight: '800',
      fontSize: 13,
      textAlign: 'center',
    },
    modeTabTextSelected: {
      color: theme.text,
    },
  });
