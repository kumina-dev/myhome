import React from 'react';
import { Theme } from '../../shared/theme/theme';
import { Screen } from '../../shared/ui/Screen';
import { Section } from '../../shared/ui/Section';
import { useAppStore } from '../../store/store';
import { getActiveGroupProfiles, getPinnedNotes } from '../../store/selectors';
import { NoteForm } from './NoteForm';
import { NoteList } from './NoteList';
import { useTranslation } from '../../i18n';

export function NotesScreen({ theme }: { theme: Theme }) {
  const { snapshot, addNote, toggleNotePinned } = useAppStore();
  const { t } = useTranslation();

  if (!snapshot) return null;

  const notes = getPinnedNotes(snapshot);
  const memberProfiles = getActiveGroupProfiles(snapshot);

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title={t('notes.screen.title')}
        subtitle={t('notes.screen.subtitle')}
      >
        <NoteForm theme={theme} onAddNote={addNote} />
      </Section>

      <Section theme={theme} title={t('notes.screen.currentNotes')}>
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
