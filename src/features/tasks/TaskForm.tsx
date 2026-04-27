import React, { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import {
  AddTaskInput,
  AppSnapshot,
  GroupMember,
  TaskScope,
  UserProfile,
} from '../../store/models';
import { TaskDateField } from './TaskDateField';
import { useTranslation } from '../../i18n';
import { SegmentedControl } from '../../shared/ui/SegmentedControl';
import {
  normalizeRequiredText,
  parsePositiveInteger,
} from '../../shared/validation/forms';

interface ActiveGroupProfile {
  member: GroupMember;
  profile: UserProfile;
}

export function TaskForm({
  theme,
  snapshot,
  memberProfiles,
  currentUserId,
  onAddTask,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  memberProfiles: ActiveGroupProfile[];
  currentUserId: string;
  onAddTask: (input: AddTaskInput) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState<TaskScope>('shared');
  const [assigneeUserId, setAssigneeUserId] = useState(currentUserId);
  const [points, setPoints] = useState('3');
  const [dueAt, setDueAt] = useState(new Date().toISOString());

  const memberOptions = useMemo(
    () =>
      memberProfiles.map(item => ({
        key: item.member.userId,
        label: item.profile.displayName,
      })),
    [memberProfiles],
  );

  async function submit() {
    const cleanedTitle = normalizeRequiredText(title);
    const numericPoints = parsePositiveInteger(points);

    if (!cleanedTitle || numericPoints === null) {
      Alert.alert(
        t('tasks.validation.invalidTitle'),
        t('tasks.validation.invalidBody'),
      );
      return;
    }

    await onAddTask({
      title: cleanedTitle,
      scope,
      assigneeUserId: scope === 'personal' ? assigneeUserId : undefined,
      points: numericPoints,
      dueAt,
    });

    setTitle('');
    setPoints('3');
  }

  return (
    <Card theme={theme}>
      <Field
        theme={theme}
        label={t('tasks.fields.title')}
        value={title}
        onChangeText={setTitle}
        placeholder={t('tasks.placeholders.title')}
      />
      <SegmentedControl
        theme={theme}
        items={[
          { key: 'shared', label: t('tasks.scopes.shared') },
          { key: 'personal', label: t('tasks.scopes.personal') },
        ]}
        selected={scope}
        onSelect={setScope}
      />
      {scope === 'personal' ? (
        <SegmentedControl
          theme={theme}
          items={memberOptions}
          selected={assigneeUserId}
          onSelect={setAssigneeUserId}
        />
      ) : null}
      <Field
        theme={theme}
        label={t('tasks.fields.points')}
        value={points}
        onChangeText={setPoints}
        keyboardType="numeric"
      />
      <TaskDateField
        theme={theme}
        label={t('tasks.fields.dueDate')}
        value={dueAt}
        weekStartsOn={snapshot.settings.weekStartsOn}
        onChange={setDueAt}
      />
      <Button
        theme={theme}
        label={t('tasks.actions.addTask')}
        onPress={() => submit().catch(() => undefined)}
      />
    </Card>
  );
}
