import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "../../i18n";
import {
  AcceptInviteInput,
  AuthFlowMode,
  CreateGroupInput,
  SignInInput,
} from "../../store/models";
import { Theme } from "../../shared/theme/theme";
import { Button } from "../../shared/ui/Button";
import { Field } from "../../shared/ui/Field";
import { authOptions } from "./authOptions";

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

  async function handleSubmit() {
    try {
      if (authMode === 'sign-in') {
        await onSignIn({ email, password });
        return;
      }

      if (authMode === 'create-group') {
        if (!groupName.trim() || !displayName.trim()) {
          throw new Error('Group name and display name are required.');
        }

        await onCreateGroup({
          groupName,
          displayName,
          email,
          password,
        });
        return;
      }

      if (!inviteCode.trim() || !displayName.trim()) {
        throw new Error('Invite code and display name are required.');
      }

      await onAcceptInvite({
        code: inviteCode,
        displayName,
        email,
        password,
      });
    } catch (caught) {
      Alert.alert(
        'Auth failed',
        caught instanceof Error ? caught.message : t('validation.unexpectedError'),
      );
    }
  }

  return (
    <>
      <View style={styles.modeTabs}>
        {authOptions.map(option => {
          const selected = authMode === option.key;

          return (
            <Pressable
              key={option.key}
              onPress={() => onAuthModeChange(option.key)}
              style={[styles.modeTab, selected ? styles.modeTabSelected : null]}
            >
              <Text
                style={[
                  styles.modeTabText,
                  selected ? styles.modeTabTextSelected : null,
                ]}
              >
                {t(option.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {authMode === 'create-group' ? (
        <Field
          theme={theme}
          label="Group name"
          value={groupName}
          onChangeText={setGroupName}
          placeholder="North Circle"
        />
      ) : null}

      {authMode !== 'sign-in' ? (
        <Field
          theme={theme}
          label="Display name"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="June"
        />
      ) : null}

      {authMode === 'accept-invite' ? (
        <Field
          theme={theme}
          label="Invite code"
          value={inviteCode}
          onChangeText={setInviteCode}
          placeholder="GROUP-1234"
        />
      ) : null}

      <Field
        theme={theme}
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
      />
      <Field
        theme={theme}
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
      />
      <Button
        theme={theme}
        label={t('common.actions.continue')}
        onPress={() => handleSubmit().catch(() => undefined)}
      />
      <Text style={styles.helper}>
        Demo credentials already seeded: `owner@northcircle.app` / `1234`.
      </Text>
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
    helper: {
      color: theme.textMuted,
      fontSize: 12,
      lineHeight: 18,
    },
  });