import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { AddNoteInput } from '../../store/models';
import { useTranslation } from '../../i18n';
import { ToggleRow } from '../../shared/ui/ToggleRow';

export function NoteForm({
  theme,
  onAddNote,
}: {
  theme: Theme;
  onAddNote: (input: AddNoteInput) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  async function submit() {
    if (!title.trim() || !body.trim()) {
      Alert.alert(
        t('notes.validation.invalidTitle'),
        t('notes.validation.invalidBody'),
      );
      return;
    }

    await onAddNote({
      title: title.trim(),
      body: body.trim(),
      isPinned,
    });

    setTitle('');
    setBody('');
    setIsPinned(false);
  }

  return (
    <Card theme={theme}>
      <Field
        theme={theme}
        label={t('notes.fields.title')}
        value={title}
        onChangeText={setTitle}
        placeholder={t('notes.placeholders.title')}
      />
      <Field
        theme={theme}
        label={t('notes.fields.body')}
        value={body}
        onChangeText={setBody}
        placeholder={t('notes.placeholders.body')}
        multiline
      />
      <ToggleRow
        theme={theme}
        label={t('notes.fields.pin')}
        value={isPinned}
        onValueChange={setIsPinned}
      />
      <Button
        theme={theme}
        label={t('notes.actions.saveNote')}
        onPress={() => submit().catch(() => undefined)}
      />
    </Card>
  );
}
