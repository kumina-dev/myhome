import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/theme';
import { useAppStore } from '../store/store';
import {
  formatDateTime,
  getAgendaGroups,
  getCurrentGroup,
  getEventsForDate,
  isoDate,
} from '../store/selectors';
import { CalendarMonthView, AgendaList, EventDetailCard } from '../ui/calendar';
import {
  Button,
  Card,
  EmptyState,
  Field,
  ModalSheet,
  Screen,
  Section,
} from '../ui/primitives';
import {
  CalendarViewField,
  DateField,
  EventColorField,
  TimeField,
} from '../ui/pickers';
import { AppSnapshot, CalendarEvent } from '../store/models';

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
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [startsAt, setStartsAt] = useState(new Date().toISOString());
  const [endsAt, setEndsAt] = useState(
    new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  );
  const [colorKey, setColorKey] = useState(snapshot.settings.eventColorKey);

  const agendaGroups = useMemo(() => getAgendaGroups(snapshot), [snapshot]);
  const dayEvents = getEventsForDate(snapshot, selectedDate);
  const viewMode = snapshot.settings.calendarDefaultView;

  function handleCalendarViewChange(next: 'month' | 'agenda') {
    updateSettings({ calendarDefaultView: next }).catch(() => undefined);
  }

  function handleSubmitPress() {
    submit().catch(() => undefined);
  }

  async function submit() {
    if (!title.trim()) {
      Alert.alert('Invalid event', 'Title is required.');
      return;
    }

    if (new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
      Alert.alert(
        'Invalid time range',
        'End time must be after the start time.',
      );
      return;
    }

    await addEvent({
      title: title.trim(),
      startsAt,
      endsAt,
      colorKey,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    setComposerVisible(false);
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
        onClose={() => setComposerVisible(false)}
      >
        <Field
          theme={theme}
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Dinner with parents"
        />
        <DateField
          theme={theme}
          label="Start date"
          value={startsAt}
          weekStartsOn={snapshot.settings.weekStartsOn}
          onChange={next => {
            setStartsAt(next);
            setEndsAt(
              new Date(new Date(next).getTime() + 60 * 60 * 1000).toISOString(),
            );
          }}
        />
        <TimeField
          theme={theme}
          label="Start time"
          value={startsAt}
          dateIso={isoDate(startsAt)}
          onChange={setStartsAt}
        />
        <DateField
          theme={theme}
          label="End date"
          value={endsAt}
          weekStartsOn={snapshot.settings.weekStartsOn}
          onChange={setEndsAt}
        />
        <TimeField
          theme={theme}
          label="End time"
          value={endsAt}
          dateIso={isoDate(endsAt)}
          onChange={setEndsAt}
        />
        <EventColorField
          theme={theme}
          value={colorKey}
          onChange={setColorKey}
        />
        <Field
          theme={theme}
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional reminder context"
          multiline
        />
        <Button theme={theme} label="Save event" onPress={handleSubmitPress} />
      </ModalSheet>

      <ModalSheet
        theme={theme}
        visible={Boolean(selectedEvent)}
        title="Event details"
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
