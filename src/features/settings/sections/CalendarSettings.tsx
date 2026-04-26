import React from 'react';
import { Theme } from '../../../shared/theme/theme';
import { Card } from '../../../shared/ui/Card';
import { Section } from '../../../shared/ui/Section';
import {
  AppSnapshot,
  CalendarViewMode,
  EventColorKey,
  UpdateSettingsInput,
  WeekStart,
} from '../../../store/models';
import { Kicker, SegmentedControl } from '../SettingsRows';

export function CalendarSettings({
  theme,
  snapshot,
  onUpdateSettings,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  onUpdateSettings: (input: UpdateSettingsInput) => Promise<void>;
}) {
  return (
    <Section theme={theme} title="Calendar">
      <Card theme={theme}>
        <Kicker theme={theme}>Default view</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'month', label: 'Month' },
            { key: 'agenda', label: 'Agenda' },
          ]}
          selected={snapshot.settings.calendarDefaultView}
          onSelect={next =>
            onUpdateSettings({
              calendarDefaultView: next as CalendarViewMode,
            }).catch(() => undefined)
          }
        />

        <Kicker theme={theme}>Week starts on</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'monday', label: 'Monday' },
            { key: 'sunday', label: 'Sunday' },
          ]}
          selected={snapshot.settings.weekStartsOn}
          onSelect={next =>
            onUpdateSettings({ weekStartsOn: next as WeekStart }).catch(
              () => undefined,
            )
          }
        />

        <Kicker theme={theme}>Default event color</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'blue', label: 'Blue' },
            { key: 'pink', label: 'Pink' },
            { key: 'green', label: 'Green' },
            { key: 'amber', label: 'Amber' },
            { key: 'red', label: 'Red' },
          ]}
          selected={snapshot.settings.eventColorKey}
          onSelect={next =>
            onUpdateSettings({ eventColorKey: next as EventColorKey }).catch(
              () => undefined,
            )
          }
        />
      </Card>
    </Section>
  );
}
