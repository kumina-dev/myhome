import React from 'react';
import { Theme } from '../../../shared/theme/theme';
import { Card } from '../../../shared/ui/Card';
import { Field } from '../../../shared/ui/Field';
import { Section } from '../../../shared/ui/Section';
import { AppLockSettings, AppSnapshot } from '../../../store/models';
import { Kicker, SegmentedControl, ToggleRow } from '../SettingsRows';

export function SecuritySettings({
  theme,
  snapshot,
  onUpdateAppLockSettings,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  onUpdateAppLockSettings: (input: Partial<AppLockSettings>) => Promise<void>;
}) {
  return (
    <Section theme={theme} title="Security">
      <Card theme={theme}>
        <ToggleRow
          theme={theme}
          label="Enable app lock"
          value={snapshot.appLockSettings.isEnabled}
          onValueChange={value =>
            onUpdateAppLockSettings({ isEnabled: value }).catch(() => undefined)
          }
        />
        <ToggleRow
          theme={theme}
          label="Enable biometric unlock"
          value={snapshot.appLockSettings.biometricEnabled}
          onValueChange={value =>
            onUpdateAppLockSettings({ biometricEnabled: value }).catch(
              () => undefined,
            )
          }
        />
        <Field
          theme={theme}
          label="App PIN"
          value={snapshot.appLockSettings.pin}
          onChangeText={value => {
            if (value.length <= 6) {
              onUpdateAppLockSettings({ pin: value }).catch(() => undefined);
            }
          }}
          keyboardType="numeric"
        />
        <Kicker theme={theme}>Lock after</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 1, label: '1 min' },
            { key: 5, label: '5 min' },
            { key: 15, label: '15 min' },
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
