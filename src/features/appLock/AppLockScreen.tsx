import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Screen } from '../../shared/ui/Screen';
import { Section } from '../../shared/ui/Section';
import { useAppStore } from '../../store/store';
import { useTranslation } from '../../i18n';

export function AppLockScreen({ theme }: { theme: Theme }) {
  const { snapshot, unlockApp, signOut, updateAppLockSettings } = useAppStore();
  const { t } = useTranslation();
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
        t('appLock.errors.unlockFailed'),
        caught instanceof Error ? caught.message : t('validation.unexpectedError'),
      );
    }
  }

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title={t('appLock.title')}
        subtitle={t('appLock.subtitle')}
      >
        <Card theme={theme}>
          <Field
            theme={theme}
            label={t('appLock.fields.pin')}
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry
            helper={t('appLock.helpers.seededPin')}
          />
          <ToggleRow
            theme={theme}
            label={t('appLock.settings.biometricUnlock')}
            value={snapshot.appLockSettings.biometricEnabled}
            onValueChange={handleBiometricChange}
          />
          <Button
            theme={theme}
            label={t('appLock.actions.unlock')}
            onPress={() => handleUnlock().catch(() => undefined)}
          />
          <Button
            theme={theme}
            label={t('appLock.actions.signOut')}
            kind="secondary"
            onPress={handleSignOut}
          />
          <Text style={styles.helper}>
            {t('appLock.helpers.nativeBiometric')}
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
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.md,
    },
    toggleLabel: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 21,
    },
    toggleTrack: {
      width: 52,
      height: 30,
      borderRadius: theme.radius.full,
      borderWidth: theme.borders.hairline,
      borderColor: theme.border,
      backgroundColor: theme.surfaceMuted,
      padding: 3,
      alignItems: 'flex-start',
    },
    toggleTrackOn: {
      width: 52,
      height: 30,
      borderRadius: theme.radius.full,
      borderWidth: theme.borders.hairline,
      borderColor: theme.accent,
      backgroundColor: theme.accent,
      padding: 3,
      alignItems: 'flex-end',
    },
    toggleThumb: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.textMuted,
    },
    toggleThumbOn: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.inverseText,
    },
  });

function ToggleRow({
  theme,
  label,
  value,
  onValueChange,
}: {
  theme: Theme;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const styles = createStyles(theme);

  return (
    <Pressable onPress={() => onValueChange(!value)} style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={value ? styles.toggleTrackOn : styles.toggleTrack}>
        <View style={value ? styles.toggleThumbOn : styles.toggleThumb} />
      </View>
    </Pressable>
  );
}
