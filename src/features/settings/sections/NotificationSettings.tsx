import React from 'react';
import { Theme } from '../../../shared/theme/theme';
import { Card } from '../../../shared/ui/Card';
import { Section } from '../../../shared/ui/Section';
import { AppSnapshot, UpdateSettingsInput } from '../../../store/models';
import { ToggleRow } from '../SettingsRows';

export function NotificationSettings({
  theme,
  snapshot,
  onUpdateSettings,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  onUpdateSettings: (input: UpdateSettingsInput) => Promise<void>;
}) {
  return (
    <Section theme={theme} title="Notifications">
      <Card theme={theme}>
        <ToggleRow
          theme={theme}
          label="Event reminders"
          value={snapshot.settings.notifications.eventReminders}
          onValueChange={value =>
            onUpdateSettings({
              notifications: { eventReminders: value },
            }).catch(() => undefined)
          }
        />
        <ToggleRow
          theme={theme}
          label="Task reminders"
          value={snapshot.settings.notifications.taskReminders}
          onValueChange={value =>
            onUpdateSettings({
              notifications: { taskReminders: value },
            }).catch(() => undefined)
          }
        />
        <ToggleRow
          theme={theme}
          label="Shared note alerts"
          value={snapshot.settings.notifications.noteAlerts}
          onValueChange={value =>
            onUpdateSettings({
              notifications: { noteAlerts: value },
            }).catch(() => undefined)
          }
        />
        <ToggleRow
          theme={theme}
          label="Expense activity"
          value={snapshot.settings.notifications.expenseAlerts}
          onValueChange={value =>
            onUpdateSettings({
              notifications: { expenseAlerts: value },
            }).catch(() => undefined)
          }
        />
        <ToggleRow
          theme={theme}
          label="Shared task broadcasts"
          value={snapshot.settings.notifications.sharedTaskBroadcasts}
          onValueChange={value =>
            onUpdateSettings({
              notifications: { sharedTaskBroadcasts: value },
            }).catch(() => undefined)
          }
        />
      </Card>
    </Section>
  );
}
