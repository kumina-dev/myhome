import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { EmptyState } from '../../shared/ui/EmptyState';
import { ModalSheet } from '../../shared/ui/ModalSheet';
import { Screen } from '../../shared/ui/Screen';
import { Section } from '../../shared/ui/Section';
import { useAppStore } from '../../store/store';
import { useDateTimeFormatter } from '../../shared/format/dateTime';
import {
  getAgendaGroups,
  getCurrentGroup,
  getEventsForDate,
} from '../../store/selectors';
import { AppSnapshot, CalendarEvent } from '../../store/models';
import { AgendaList } from './AgendaList';
import { CalendarComposer } from './CalendarComposer';
import { CalendarMonthView } from './CalendarMonthView';
import { CalendarViewField } from './CalendarControls';
import { EventDetailCard } from './EventDetailCard';

export function CalendarScreen({ theme }: { theme: Theme }) {
  const { snapshot, addEvent, updateSettings } = useAppStore();

  if (!snapshot) return null;

  return (
    <CalendarScreenContent
      theme={theme}
      snapshot={snapshot}
      addEvent={addEvent}
      updateSettings={updateSettings}
    />
  );
}

function CalendarScreenContent({
  theme,
  snapshot,
  addEvent,
  updateSettings,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  addEvent: ReturnType<typeof useAppStore>['addEvent'];
  updateSettings: ReturnType<typeof useAppStore>['updateSettings'];
}) {
  const styles = createStyles(theme);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const [composerVisible, setComposerVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const { formatDateTime } = useDateTimeFormatter();
  const agendaGroups = useMemo(() => getAgendaGroups(snapshot), [snapshot]);
  const dayEvents = getEventsForDate(snapshot, selectedDate);
  const viewMode = snapshot.settings.calendarDefaultView;

  function handleCalendarViewChange(next: 'month' | 'agenda') {
    updateSettings({ calendarDefaultView: next }).catch(() => undefined);
  }

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title="Shared calendar"
        subtitle="Month view for context, agenda for clarity, and no one has to reverse-engineer date strings."
        action={
          <Button
            theme={theme}
            label="Add event"
            onPress={() => setComposerVisible(true)}
          />
        }
      >
        <Card theme={theme}>
          <CalendarViewField
            theme={theme}
            value={viewMode}
            onChange={handleCalendarViewChange}
          />
          <Text style={styles.helperText}>
            Current group: {getCurrentGroup(snapshot).groupName}
          </Text>
        </Card>
      </Section>

      <Section theme={theme} title="Calendar">
        {viewMode === 'month' ? (
          <>
            <Card theme={theme}>
              <View style={styles.monthNav}>
                <Button
                  theme={theme}
                  label="Previous"
                  kind="secondary"
                  onPress={() =>
                    setVisibleMonth(
                      current =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() - 1,
                          1,
                        ),
                    )
                  }
                />
                <Button
                  theme={theme}
                  label="Today"
                  kind="secondary"
                  onPress={() => {
                    setVisibleMonth(new Date());
                    setSelectedDate(new Date().toISOString().slice(0, 10));
                  }}
                />
                <Button
                  theme={theme}
                  label="Next"
                  kind="secondary"
                  onPress={() =>
                    setVisibleMonth(
                      current =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() + 1,
                          1,
                        ),
                    )
                  }
                />
              </View>
            </Card>
            <CalendarMonthView
              theme={theme}
              snapshot={snapshot}
              visibleMonth={visibleMonth}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <Section theme={theme} title={`Events on ${selectedDate}`}>
              {dayEvents.length ? (
                dayEvents.map(event => (
                  <Card key={event.id} theme={theme}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventMeta}>
                      {formatDateTime(event.startsAt)}
                    </Text>
                    <Button
                      theme={theme}
                      label="View details"
                      kind="secondary"
                      onPress={() => setSelectedEvent(event)}
                    />
                  </Card>
                ))
              ) : (
                <EmptyState
                  theme={theme}
                  title="Nothing scheduled"
                  body="Select a day or add an event to start building a usable shared calendar."
                />
              )}
            </Section>
          </>
        ) : agendaGroups.length ? (
          <AgendaList
            theme={theme}
            events={agendaGroups}
            onPressEvent={setSelectedEvent}
          />
        ) : (
          <EmptyState
            theme={theme}
            title="Agenda is empty"
            body="Add the first event and the agenda view will start doing actual work."
          />
        )}
      </Section>

      <ModalSheet
        theme={theme}
        visible={composerVisible}
        title="Add event"
        closeLabel="Close"
        onClose={() => setComposerVisible(false)}
      >
        <CalendarComposer
          theme={theme}
          snapshot={snapshot}
          onAddEvent={addEvent}
          onDone={() => setComposerVisible(false)}
        />
      </ModalSheet>

      <ModalSheet
        theme={theme}
        visible={Boolean(selectedEvent)}
        title="Event details"
        closeLabel="Close"
        onClose={() => setSelectedEvent(null)}
      >
        {selectedEvent ? (
          <EventDetailCard theme={theme} event={selectedEvent} />
        ) : null}
      </ModalSheet>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    helperText: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    monthNav: {
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'space-between',
    },
    eventTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '800',
    },
    eventMeta: {
      color: theme.textMuted,
      fontSize: 14,
    },
  });
