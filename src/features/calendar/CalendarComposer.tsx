import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { AddEventInput, AppSnapshot } from '../../store/models';
import { isoDate } from '../../store/selectors';
import { DateField, EventColorField, TimeField } from './CalendarControls';

export function CalendarComposer({
  theme,
  snapshot,
  onAddEvent,
  onDone,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  onAddEvent: (input: AddEventInput) => Promise<void>;
  onDone: () => void;
}) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [startsAt, setStartsAt] = useState(new Date().toISOString());
  const [endsAt, setEndsAt] = useState(
    new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  );
  const [colorKey, setColorKey] = useState(snapshot.settings.eventColorKey);

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

    await onAddEvent({
      title: title.trim(),
      startsAt,
      endsAt,
      colorKey,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    onDone();
  }

  return (
    <>
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
      <EventColorField theme={theme} value={colorKey} onChange={setColorKey} />
      <Field
        theme={theme}
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional reminder context"
        multiline
      />
      <Button
        theme={theme}
        label="Save event"
        onPress={() => submit().catch(() => undefined)}
      />
    </>
  );
}
