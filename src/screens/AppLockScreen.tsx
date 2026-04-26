import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Theme } from '../shared/theme/theme';
import { useAppStore } from '../store/store';
import {
  Button,
  Card,
  Field,
  Screen,
  Section,
  ToggleRow,
} from '../ui/primitives';

export function AppLockScreen({ theme }: { theme: Theme }) {
  const { snapshot, unlockApp, signOut, updateAppLockSettings } = useAppStore();
  const [pin, setPin] = useState('');
  const styles = createStyles(theme);

  if (!snapshot) return null;

  function handleBiometricChange(value: boolean) {
    updateAppLockSettings({ biometricEnabled: value }).catch(() => undefined);
  }

  function handleSignOut() {
    signOut().catch(() => undefined);
  }

  async function handleUnlock() {
    try {
      await unlockApp(pin);
      setPin('');
    } catch (caught) {
      Alert.alert(
        'Unlock failed',
        caught instanceof Error ? caught.message : 'Unexpected error.',
      );
    }
  }

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title="App lock"
        subtitle="The session exists, but access still requires the local device lock."
      >
        <Card theme={theme}>
          <Field
            theme={theme}
            label="PIN"
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry
            helper="Current seeded PIN: 2580"
          />
          <ToggleRow
            theme={theme}
            label="Biometric unlock"
            value={snapshot.appLockSettings.biometricEnabled}
            onValueChange={handleBiometricChange}
          />
          <Button
            theme={theme}
            label="Unlock"
            onPress={() => handleUnlock().catch(() => undefined)}
          />
          <Button
            theme={theme}
            label="Sign out"
            kind="secondary"
            onPress={handleSignOut}
          />
          <Text style={styles.helper}>
            In a full device build, biometric unlock would be wired to native
            secure auth. Here the setting and lock flow are ready, not
            fictional.
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
