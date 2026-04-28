import React from 'react';
import { Theme } from '../../../shared/theme/theme';
import { Card } from '../../../shared/ui/Card';
import { Field } from '../../../shared/ui/Field';
import { Section } from '../../../shared/ui/Section';
import { AppLockSettings, AppSnapshot } from '../../../store/models';
import { Kicker } from '../SettingsRows';
import { SegmentedControl } from '../../../shared/ui/SegmentedControl';
import { ToggleRow } from '../../../shared/ui/ToggleRow';
import { useTranslation } from '../../../i18n';
import {
  isValidPin,
  normalizePinInput,
} from '../../../shared/validation/forms';

export function SecuritySettings({
  theme,
  snapshot,
  onUpdateAppLockSettings,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  onUpdateAppLockSettings: (input: Partial<AppLockSettings>) => Promise<void>;
}) {
  const { t } = useTranslation();

  return (
    <Section theme={theme} title={t('settings.tabs.security')}>
      <Card theme={theme}>
        <ToggleRow
          theme={theme}
          label={t('settings.security.enableAppLock')}
          value={snapshot.appLockSettings.isEnabled}
          onValueChange={value =>
            onUpdateAppLockSettings({ isEnabled: value }).catch(() => undefined)
          }
        />
        <ToggleRow
          theme={theme}
          label={t('settings.security.enableBiometricUnlock')}
          value={snapshot.appLockSettings.biometricEnabled}
          onValueChange={value =>
            onUpdateAppLockSettings({ biometricEnabled: value }).catch(
              () => undefined,
            )
          }
        />
        <Field
          theme={theme}
          label={t('settings.security.appPin')}
          value={snapshot.appLockSettings.developmentPin}
          onChangeText={value => {
            const pin = normalizePinInput(value);

            if (isValidPin(pin)) {
              onUpdateAppLockSettings({ developmentPin: pin }).catch(
                () => undefined,
              );
            }
          }}
          keyboardType="numeric"
        />
        <Kicker theme={theme}>{t('settings.security.lockAfter')}</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 1, label: t('common.durations.minutes', { count: 1 }) },
            { key: 5, label: t('common.durations.minutes', { count: 5 }) },
            { key: 15, label: t('common.durations.minutes', { count: 15 }) },
          ]}
          selected={snapshot.appLockSettings.lockAfterMinutes}
          onSelect={next =>
            onUpdateAppLockSettings({ lockAfterMinutes: next }).catch(
              () => undefined,
            )
          }
        />
      </Card>
    </Section>
  );
}
