import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Screen } from '../../shared/ui/Screen';
import { Section } from '../../shared/ui/Section';
import { useAppStore } from '../../store/store';
import { useTranslation } from '../../i18n';
import { isValidPin, normalizePinInput } from '../../shared/validation/forms';

export function AppLockScreen({ theme }: { theme: Theme }) {
  const { snapshot, unlockApp, signOut } = useAppStore();
  const { t } = useTranslation();
  const [pin, setPin] = useState('');

  if (!snapshot) return null;

  function handleSignOut() {
    signOut().catch(() => undefined);
  }

  async function handleUnlock() {
    try {
      if (!isValidPin(pin)) {
        throw new Error(t('validation.invalidPin'));
      }

      await unlockApp(pin);
      setPin('');
    } catch (caught) {
      Alert.alert(
        t('appLock.errors.unlockFailed'),
        caught instanceof Error
          ? caught.message
          : t('validation.unexpectedError'),
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
            onChangeText={value => setPin(normalizePinInput(value))}
            keyboardType="numeric"
            secureTextEntry
            helper={t('appLock.helpers.seededPin')}
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
        </Card>
      </Section>
    </Screen>
  );
}
