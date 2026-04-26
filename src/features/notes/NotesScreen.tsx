import React from 'react';
import { Theme } from '../../shared/theme/theme';
import { Screen } from '../../shared/ui/Screen';
import { Section } from '../../shared/ui/Section';
import { useAppStore } from '../../store/store';
import { getActiveGroupProfiles, getPinnedNotes } from '../../store/selectors';
import { NoteForm } from './NoteForm';
import { NoteList } from './NoteList';

export function NotesScreen({ theme }: { theme: Theme }) {
  const { snapshot, addNote, toggleNotePinned } = useAppStore();

  if (!snapshot) return null;

  const notes = getPinnedNotes(snapshot);
  const memberProfiles = getActiveGroupProfiles(snapshot);

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title="Shared notes"
        subtitle="Pinned notes stay visible. The rest still remain easy to find without becoming a fake wiki."
      >
        <NoteForm theme={theme} onAddNote={addNote} />
      </Section>

      <Section theme={theme} title="Current notes">
        <NoteList
          theme={theme}
          notes={notes}
          memberProfiles={memberProfiles}
          onTogglePinned={noteId => {
            toggleNotePinned(noteId).catch(() => undefined);
          }}
        />
      </Section>
    </Screen>
  );
}
