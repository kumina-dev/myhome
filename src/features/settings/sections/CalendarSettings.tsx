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
import { useTranslation } from '../../../i18n';

export function CalendarSettings({
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
    <Section theme={theme} title={t('navigation.calendar')}>
      <Card theme={theme}>
        <Kicker theme={theme}>{t('settings.appearance.defaultTab')}</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'month', label: t('calendar.views.month') },
            { key: 'agenda', label: t('calendar.views.agenda') },
          ]}
          selected={snapshot.settings.calendarDefaultView}
          onSelect={next =>
            onUpdateSettings({
              calendarDefaultView: next as CalendarViewMode,
            }).catch(() => undefined)
          }
        />

        <Kicker theme={theme}>{t('calendar.fields.weekStartsOn')}</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'monday', label: t('calendar.weekdays.full.monday') },
            { key: 'sunday', label: t('calendar.weekdays.full.sunday') },
          ]}
          selected={snapshot.settings.weekStartsOn}
          onSelect={next =>
            onUpdateSettings({ weekStartsOn: next as WeekStart }).catch(
              () => undefined,
            )
          }
        />

        <Kicker theme={theme}>{t('calendar.fields.defaultEventColor')}</Kicker>
        <SegmentedControl
          theme={theme}
          items={[
            { key: 'blue', label: t('calendar.eventColors.blue') },
            { key: 'pink', label: t('calendar.eventColors.pink') },
            { key: 'green', label: t('calendar.eventColors.green') },
            { key: 'amber', label: t('calendar.eventColors.amber') },
            { key: 'red', label: t('calendar.eventColors.red') },
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
