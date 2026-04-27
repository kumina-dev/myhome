import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { AddNoteInput } from '../../store/models';
import { useTranslation } from '../../i18n';

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
      Alert.alert(t('notes.validation.invalidTitle'), t('notes.validation.invalidBody'));
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

function ToggleRow({
  theme,
  label,
  value,
  onValueChange,
}: {
  theme: Theme;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const styles = createStyles(theme);

  return (
    <Pressable onPress={() => onValueChange(!value)} style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={value ? styles.toggleTrackOn : styles.toggleTrack}>
        <View style={value ? styles.toggleThumbOn : styles.toggleThumb} />
      </View>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.md,
    },
    toggleLabel: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 21,
    },
    toggleTrack: {
      width: 52,
      height: 30,
      borderRadius: theme.radius.full,
      borderWidth: theme.borders.hairline,
      borderColor: theme.border,
      backgroundColor: theme.surfaceMuted,
      padding: 3,
      alignItems: 'flex-start',
    },
    toggleTrackOn: {
      width: 52,
      height: 30,
      borderRadius: theme.radius.full,
      borderWidth: theme.borders.hairline,
      borderColor: theme.accent,
      backgroundColor: theme.accent,
      padding: 3,
      alignItems: 'flex-end',
    },
    toggleThumb: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.textMuted,
    },
    toggleThumbOn: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.inverseText,
    },
  });
