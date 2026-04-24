import { Alert, Pressable, Text, View } from 'react-native';
import { Theme } from '../theme/theme';
import { useAppStore } from '../store/store';
import { formatDateTime, getPinnedNotes, getUserMap } from '../store/selectors';
import { useState } from 'react';
import { Button, Card, Field, Pill, Screen, Section } from '../ui/primitives';

export function NotesScreen({ theme }: { theme: Theme }) {
  const { state, dispatch } = useAppStore();
  const users = getUserMap(state.users);
  const notes = getPinnedNotes(state);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  function submit() {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Invalid note', 'Title and body are required.');
      return;
    }

    dispatch({
      type: 'ADD_NOTE',
      payload: {
        authorUserId: state.settings.activeUserId,
        title: title.trim(),
        body: body.trim(),
        isPinned,
      },
    });

    setTitle('');
    setBody('');
    setIsPinned(false);
  }

  return (
    <Screen theme={theme}>
      <Section theme={theme} title="New shared note">
        <Card theme={theme}>
          <Field
            theme={theme}
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Weekend plan"
          />
          <Field
            theme={theme}
            label="Body"
            value={body}
            onChangeText={setBody}
            placeholder="What everyone needs to know"
            multiline
          />
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}
          >
            <Pill
              theme={theme}
              label="Pinned"
              selected={isPinned}
              onPress={() => setIsPinned(value => !value)}
            />
          </View>
          <Button theme={theme} label="Save note" onPress={submit} />
        </Card>
      </Section>

      <Section theme={theme} title="Shared notes">
        {notes.map(note => (
          <Card key={note.id} theme={theme}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{ color: theme.text, fontWeight: '700', fontSize: 16 }}
              >
                {note.title}
              </Text>
              <Pressable
                onPress={() =>
                  dispatch({
                    type: 'TOGGLE_NOTE_PINNED',
                    payload: { noteId: note.id },
                  })
                }
              >
                <Text style={{ color: theme.accent, fontWeight: '700' }}>
                  {note.isPinned ? 'Unpin' : 'Pin'}
                </Text>
              </Pressable>
            </View>
            <Text style={{ color: theme.textMuted, marginTop: 8 }}>
              {note.body}
            </Text>
            <Text
              style={{ color: theme.textMuted, marginTop: 10, fontSize: 12 }}
            >
              {users[note.authorUserId]?.name} ·{' '}
              {formatDateTime(note.updatedAt)}
            </Text>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
