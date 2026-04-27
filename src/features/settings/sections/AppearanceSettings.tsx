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
import { useTranslation } from '../../../i18n';

export function AppearanceSettings({
  theme,
  snapshot,
  onUpdateSettings,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  onUpdateSettings: (input: UpdateSettingsInput) => Promise<void>;
}) {
  const { t } = useTranslation();
  
  return (
    <Section theme={theme} title={t('settings.tabs.appearance')}>
      <Card theme={theme}>
        <Kicker theme={theme}>{t('settings.appearance.theme')}</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'system', label: t('settings.locale.system') },
            { key: 'light', label: t('settings.appearance.light') },
            { key: 'dark', label: t('settings.appearance.dark') },
          ]}
          selected={snapshot.settings.themeMode}
          onSelect={next =>
            onUpdateSettings({ themeMode: next as ThemeMode }).catch(
              () => undefined,
            )
          }
        />

        <Kicker theme={theme}>{t('settings.appearance.language')}</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'system', label: t('settings.locale.system') },
            { key: 'en', label: t('settings.locale.english') },
            { key: 'fi', label: t('settings.locale.finnish') },
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
          label={t('settings.currencyCode')}
          value={snapshot.settings.currencyCode}
          onChangeText={value =>
            onUpdateSettings({
              currencyCode: value.trim().toUpperCase(),
            }).catch(() => undefined)
          }
          placeholder="EUR"
        />

        <Kicker theme={theme}>{t('settings.appearance.defaultTab')}</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'home', label: t('navigation.home') },
            { key: 'expenses', label: t('navigation.expenses') },
            { key: 'notes', label: t('navigation.notes') },
            { key: 'calendar', label: t('navigation.calendar') },
            { key: 'tasks', label: t('navigation.tasks') },
            { key: 'settings', label: t('navigation.settings') },
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
