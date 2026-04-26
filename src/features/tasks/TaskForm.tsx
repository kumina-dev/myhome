import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
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
    const numericPoints = Number(points);

    if (!title.trim() || Number.isNaN(numericPoints) || numericPoints <= 0) {
      Alert.alert('Invalid task', 'Title and positive points are required.');
      return;
    }

    await onAddTask({
      title: title.trim(),
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
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Take out trash"
      />
      <SegmentedControl
        theme={theme}
        items={[
          { key: 'shared', label: 'Shared' },
          { key: 'personal', label: 'Personal' },
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
        label="Points"
        value={points}
        onChangeText={setPoints}
        keyboardType="numeric"
      />
      <TaskDateField
        theme={theme}
        label="Due date"
        value={dueAt}
        weekStartsOn={snapshot.settings.weekStartsOn}
        onChange={setDueAt}
      />
      <Button
        theme={theme}
        label="Add task"
        onPress={() => submit().catch(() => undefined)}
      />
    </Card>
  );
}

function SegmentedControl<T extends string>({
  theme,
  items,
  selected,
  onSelect,
}: {
  theme: Theme;
  items: { key: T; label: string }[];
  selected: T;
  onSelect: (key: T) => void;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.segmented}>
      {items.map(item => {
        const isSelected = item.key === selected;

        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            style={[
              styles.segmentBase,
              isSelected ? styles.segmentSelected : styles.segment,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                isSelected ? styles.segmentTextSelected : null,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    segmented: {
      flexDirection: 'row',
      backgroundColor: theme.surfaceMuted,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xs,
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    segmentBase: {
      flex: 1,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderWidth: theme.borders.hairline,
      borderColor: 'transparent',
    },
    segment: {
      backgroundColor: 'transparent',
    },
    segmentSelected: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
    },
    segmentText: {
      color: theme.textMuted,
      fontWeight: '800',
      textAlign: 'center',
      fontSize: 13,
    },
    segmentTextSelected: {
      color: theme.text,
    },
  });
