import React from 'react';
import { Theme } from '../../../shared/theme/theme';
import { Card } from '../../../shared/ui/Card';
import { Section } from '../../../shared/ui/Section';
import { AppSnapshot, UpdateSettingsInput } from '../../../store/models';
import { Kicker, SegmentedControl, ToggleRow } from '../SettingsRows';

export function TaskSettings({
  theme,
  snapshot,
  onUpdateSettings,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  onUpdateSettings: (input: UpdateSettingsInput) => Promise<void>;
}) {
  return (
    <Section theme={theme} title="Tasks and scoring">
      <Card theme={theme}>
        <Kicker theme={theme}>Score cycle</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 7, label: '7 days' },
            { key: 14, label: '14 days' },
            { key: 28, label: '28 days' },
          ]}
          selected={snapshot.settings.scoreCycleDays}
          onSelect={next =>
            onUpdateSettings({ scoreCycleDays: next }).catch(() => undefined)
          }
        />
        <ToggleRow
          theme={theme}
          label="Show completed tasks"
          value={snapshot.settings.showCompletedTasks}
          onValueChange={value =>
            onUpdateSettings({ showCompletedTasks: value }).catch(
              () => undefined,
            )
          }
        />
        <ToggleRow
          theme={theme}
          label="Show personal tasks on Home"
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
