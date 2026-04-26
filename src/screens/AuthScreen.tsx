import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { AuthFlowMode } from '../store/models';
import { useAppStore } from '../store/store';
import { Theme } from '../shared/theme/theme';
import {
  Button,
  Card,
  Field,
  Screen,
  Section,
  SegmentedControl,
} from '../ui/primitives';

export function AuthScreen({ theme }: { theme: Theme }) {
  const { authMode, setAuthMode, signIn, createGroupOwner, acceptInvite } =
    useAppStore();

  const styles = createStyles(theme);
  const [groupName, setGroupName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  async function handleSubmit() {
    try {
      if (authMode === 'sign-in') {
        await signIn({ email, password });
        return;
      }

      if (authMode === 'create-group') {
        if (!groupName.trim() || !displayName.trim()) {
          throw new Error('Group name and display name are required.');
        }

        await createGroupOwner({
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

      await acceptInvite({
        code: inviteCode,
        displayName,
        email,
        password,
      });
    } catch (caught) {
      Alert.alert(
        'Auth failed',
        caught instanceof Error ? caught.message : 'Unexpected auth failure.',
      );
    }
  }

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title="Access"
        subtitle="Private app, invited members, and an actual path through the flow instead of guesswork."
      >
        <Card theme={theme}>
          <SegmentedControl
            theme={theme}
            items={[
              { key: 'sign-in', label: 'Sign in' },
              { key: 'create-group', label: 'Create group' },
              { key: 'accept-invite', label: 'Accept invite' },
            ]}
            selected={authMode}
            onSelect={next => setAuthMode(next as AuthFlowMode)}
          />

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
            label="Continue"
            onPress={() => handleSubmit().catch(() => undefined)}
          />
          <Text style={styles.helper}>
            Demo credentials already seeded: `owner@northcircle.app` / `1234`.
          </Text>
        </Card>
      </Section>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    helper: {
      color: theme.textMuted,
      fontSize: 12,
      lineHeight: 18,
    },
  });
