import { Alert, Text, View } from 'react-native';
import { Theme } from '../theme/theme';
import { useState } from 'react';
import { formatDateTime, getUpcomingEvents } from '../store/selectors';
import { useAppStore } from '../store/store';
import { Button, Card, Field, Pill, Screen, Section } from '../ui/primitives';

const colors = ['#2563EB', '#DB2777', '#059669', '#F59E0B', '#DC2626'];

export function CalendarScreen({ theme }: { theme: Theme }) {
  const { state, dispatch } = useAppStore();
  const events = getUpcomingEvents(state);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:00');
  const [color, setColor] = useState(colors[0]);
  const [notes, setNotes] = useState('');

  function submit() {
    if (!title.trim()) {
      Alert.alert('Invalid event', 'Title is required.');
      return;
    }

    dispatch({
      type: 'ADD_EVENT',
      payload: {
        title: title.trim(),
        startsAt: new Date(`${date}T${startTime}:00`).toISOString(),
        endsAt: new Date(`${date}T${endTime}:00`).toISOString(),
        color,
        notes: notes.trim() || undefined,
      },
    });

    setTitle('');
    setNotes('');
  }

  return (
    <Screen theme={theme}>
      <Section theme={theme} title="Add event">
        <Card theme={theme}>
          <Field
            theme={theme}
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Dinner with parents"
          />
          <Field
            theme={theme}
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="2026-04-23"
          />
          <Field
            theme={theme}
            label="Start"
            value={startTime}
            onChangeText={setStartTime}
            placeholder="18:00"
          />
          <Field
            theme={theme}
            label="End"
            value={endTime}
            onChangeText={setEndTime}
            placeholder="19:00"
          />
          <Text style={{ color: theme.textMuted, marginBottom: 8 }}>Color</Text>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}
          >
            {colors.map(item => (
              <Pill
                key={item}
                theme={theme}
                label={item}
                selected={color === item}
                onPress={() => setColor(item)}
              />
            ))}
          </View>
          <Field
            theme={theme}
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional reminder context"
            multiline
          />
          <Button theme={theme} label="Save event" onPress={submit} />
        </Card>
      </Section>

      <Section theme={theme} title="Upcoming">
        {events.map(event => (
          <Card key={event.id} theme={theme}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: event.color,
                marginBottom: 10,
              }}
            />
            <Text
              style={{ color: theme.text, fontWeight: '700', fontSize: 16 }}
            >
              {event.title}
            </Text>
            <Text style={{ color: theme.textMuted, marginTop: 4 }}>
              {formatDateTime(event.startsAt)} - {formatDateTime(event.endsAt)}
            </Text>
            {event.notes ? (
              <Text style={{ color: theme.textMuted, marginTop: 8 }}>
                {event.notes}
              </Text>
            ) : null}
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
