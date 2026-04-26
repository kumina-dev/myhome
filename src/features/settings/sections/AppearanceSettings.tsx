import React from 'react';
import { Theme } from '../../../shared/theme/theme';
import { Card } from '../../../shared/ui/Card';
import { Field } from '../../../shared/ui/Field';
import { Section } from '../../../shared/ui/Section';
import {
  AppSnapshot,
  AppTab,
  LocalePreference,
  ThemeMode,
  UpdateSettingsInput,
} from '../../../store/models';
import { Kicker, SegmentedControl } from '../SettingsRows';

export function AppearanceSettings({
  theme,
  snapshot,
  onUpdateSettings,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  onUpdateSettings: (input: UpdateSettingsInput) => Promise<void>;
}) {
  return (
    <Section theme={theme} title="Appearance">
      <Card theme={theme}>
        <Kicker theme={theme}>Theme</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'system', label: 'System' },
            { key: 'light', label: 'Light' },
            { key: 'dark', label: 'Dark' },
          ]}
          selected={snapshot.settings.themeMode}
          onSelect={next =>
            onUpdateSettings({ themeMode: next as ThemeMode }).catch(
              () => undefined,
            )
          }
        />

        <Kicker theme={theme}>Language</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'system', label: 'System' },
            { key: 'en', label: 'English' },
            { key: 'fi', label: 'Finnish' },
          ]}
          selected={snapshot.settings.localePreference}
          onSelect={next =>
            onUpdateSettings({
              localePreference: next as LocalePreference,
            }).catch(() => undefined)
          }
        />

        <Field
          theme={theme}
          label="Currency code"
          value={snapshot.settings.currencyCode}
          onChangeText={value =>
            onUpdateSettings({
              currencyCode: value.trim().toUpperCase(),
            }).catch(() => undefined)
          }
          placeholder="EUR"
        />

        <Kicker theme={theme}>Default tab</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'home', label: 'Home' },
            { key: 'expenses', label: 'Expenses' },
            { key: 'notes', label: 'Notes' },
            { key: 'calendar', label: 'Calendar' },
            { key: 'tasks', label: 'Tasks' },
            { key: 'settings', label: 'Settings' },
          ]}
          selected={snapshot.settings.defaultTab}
          onSelect={next =>
            onUpdateSettings({ defaultTab: next as AppTab }).catch(
              () => undefined,
            )
          }
        />
      </Card>
    </Section>
  );
}
