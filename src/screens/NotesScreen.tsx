import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/theme';
import { useAppStore } from '../store/store';
import { AppSnapshot } from '../store/models';
import {
  formatDateTime,
  getActiveGroupProfiles,
  getPinnedNotes,
} from '../store/selectors';
import {
  ActionTextButton,
  Avatar,
  Button,
  Card,
  EmptyState,
  Field,
  Screen,
  Section,
  ToggleRow,
} from '../ui/primitives';

export function NotesScreen({ theme }: { theme: Theme }) {
  const { snapshot, addNote, toggleNotePinned } = useAppStore();

  if (!snapshot) return null;

  return (
    <NotesScreenContent
      theme={theme}
      snapshot={snapshot}
      addNote={addNote}
      toggleNotePinned={toggleNotePinned}
    />
  );
}

function NotesScreenContent({
  theme,
  snapshot,
  addNote,
  toggleNotePinned,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  addNote: ReturnType<typeof useAppStore>['addNote'];
  toggleNotePinned: ReturnType<typeof useAppStore>['toggleNotePinned'];
}) {
  const styles = createStyles(theme);
  const notes = getPinnedNotes(snapshot);
  const memberProfiles = getActiveGroupProfiles(snapshot);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  function handleSubmitPress() {
    submit().catch(() => undefined);
  }

  async function submit() {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Invalid note', 'Title and body are required.');
      return;
    }

    await addNote({
      title: title.trim(),
      body: body.trim(),
      isPinned,
    });

    setTitle('');
    setBody('');
    setIsPinned(false);
  }

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title="Shared notes"
        subtitle="Pinned notes stay visible. The rest still remain easy to find without becoming a fake wiki."
      >
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
          <ToggleRow
            theme={theme}
            label="Pin this note"
            value={isPinned}
            onValueChange={setIsPinned}
          />
          <Button
            theme={theme}
            label="Save note"
            onPress={handleSubmitPress}
          />
        </Card>
      </Section>

      <Section theme={theme} title="Current notes">
        {notes.length ? (
          notes.map(note => {
            const profile = memberProfiles.find(
              item => item.member.userId === note.authorUserId,
            )?.profile;

            return (
              <Card key={note.id} theme={theme}>
                <View style={styles.headerRow}>
                  <View style={styles.authorRow}>
                    {profile ? (
                      <Avatar
                        theme={theme}
                        label={profile.displayName}
                        colorKey={profile.colorKey}
                      />
                    ) : null}
                    <View style={styles.authorText}>
                      <Text style={styles.cardTitle}>{note.title}</Text>
                      <Text style={styles.meta}>
                        {profile?.displayName ?? 'Unknown'} ·{' '}
                        {formatDateTime(note.updatedAt)}
                      </Text>
                    </View>
                  </View>
                  <ActionTextButton
                    theme={theme}
                    label={note.isPinned ? 'Unpin' : 'Pin'}
                    onPress={() =>
                      toggleNotePinned(note.id).catch(() => undefined)
                    }
                  />
                </View>
                <Text style={styles.body}>{note.body}</Text>
              </Card>
            );
          })
        ) : (
          <EmptyState
            theme={theme}
            title="No notes yet"
            body="Create the first shared note for plans, shopping reminders, or things no one should need to ask you twice."
          />
        )}
      </Section>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
    },
    authorRow: {
      flexDirection: 'row',
      gap: 12,
      flex: 1,
    },
    authorText: {
      gap: 4,
      flex: 1,
    },
    cardTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '800',
    },
    meta: {
      color: theme.textMuted,
      fontSize: 12,
    },
    body: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 21,
    },
  });
