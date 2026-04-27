import React from 'react';
import { Theme } from '../../../shared/theme/theme';
import { Card } from '../../../shared/ui/Card';
import { Section } from '../../../shared/ui/Section';
import { AppSnapshot, UpdateSettingsInput } from '../../../store/models';
import { Kicker, SegmentedControl, ToggleRow } from '../SettingsRows';
import { useTranslation } from '../../../i18n';

export function TaskSettings({
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
    <Section theme={theme} title={t('settings.tasks.title')}>
      <Card theme={theme}>
        <Kicker theme={theme}>{t('settings.tasks.scoreCycle')}</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 7, label: t('common.durations.days', { count: 7 }) },
            { key: 14, label: t('common.durations.days', { count: 14 }) },
            { key: 28, label: t('common.durations.days', { count: 28 }) },
          ]}
          selected={snapshot.settings.scoreCycleDays}
          onSelect={next =>
            onUpdateSettings({ scoreCycleDays: next }).catch(() => undefined)
          }
        />
        <ToggleRow
          theme={theme}
          label={t('settings.tasks.showCompletedTasks')}
          value={snapshot.settings.showCompletedTasks}
          onValueChange={value =>
            onUpdateSettings({ showCompletedTasks: value }).catch(
              () => undefined,
            )
          }
        />
        <ToggleRow
          theme={theme}
          label={t('settings.tasks.showPersonalTasksOnHome')}
          value={snapshot.settings.showPersonalTasksOnHome}
          onValueChange={value =>
            onUpdateSettings({ showPersonalTasksOnHome: value }).catch(
              () => undefined,
            )
          }
        />
      </Card>
    </Section>
  );
}
