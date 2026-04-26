import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../shared/theme/theme';
import { AddTaskInput, AppSnapshot, TaskScope } from '../store/models';
import { useAppStore } from '../store/store';
import {
  formatDateTime,
  formatShortDate,
  getActiveGroupProfiles,
  getScoreboard,
  getVisibleTasks,
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
  SegmentedControl,
  StatCard,
} from '../ui/primitives';
import { DateField } from '../ui/pickers';

export function TasksScreen({ theme }: { theme: Theme }) {
  const { snapshot, addTask, toggleTaskComplete } = useAppStore();

  if (!snapshot) return null;

  return (
    <TasksScreenContent
      theme={theme}
      snapshot={snapshot}
      addTask={addTask}
      toggleTaskComplete={toggleTaskComplete}
    />
  );
}

function TasksScreenContent({
  theme,
  snapshot,
  addTask,
  toggleTaskComplete,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  addTask: ReturnType<typeof useAppStore>['addTask'];
  toggleTaskComplete: ReturnType<typeof useAppStore>['toggleTaskComplete'];
}) {
  const styles = createStyles(theme);
  const memberProfiles = getActiveGroupProfiles(snapshot);
  const scoreboard = getScoreboard(snapshot);
  const tasks = getVisibleTasks(snapshot);
  const currentUserId =
    snapshot.sessionState.session?.userId ??
    memberProfiles[0]?.member.userId ??
    '';
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

  function handleSubmitPress() {
    submit().catch(() => undefined);
  }

  async function submit() {
    const numericPoints = Number(points);

    if (!title.trim() || Number.isNaN(numericPoints) || numericPoints <= 0) {
      Alert.alert('Invalid task', 'Title and positive points are required.');
      return;
    }

    const payload: AddTaskInput = {
      title: title.trim(),
      scope,
      assigneeUserId: scope === 'personal' ? assigneeUserId : undefined,
      points: numericPoints,
      dueAt,
    };

    await addTask(payload);
    setTitle('');
    setPoints('3');
  }

  return (
    <Screen theme={theme}>
      <Section theme={theme} title="Current cycle">
        {scoreboard.currentScores.map(item => {
          const profile = memberProfiles.find(
            member => member.member.userId === item.userId,
          )?.profile;

          return (
            <StatCard
              key={item.userId}
              theme={theme}
              label={profile?.displayName ?? 'Unknown'}
              value={`${item.points}`}
              hint={`Cycle started ${formatShortDate(
                scoreboard.current.start.toISOString(),
              )}`}
            />
          );
        })}
      </Section>

      <Section
        theme={theme}
        title="New task"
        subtitle="Shared and personal tasks live in the same system, without making everyday use feel like a spreadsheet prison."
      >
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
            onSelect={next => setScope(next as TaskScope)}
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
          <DateField
            theme={theme}
            label="Due date"
            value={dueAt}
            weekStartsOn={snapshot.settings.weekStartsOn}
            onChange={setDueAt}
          />
          <Button theme={theme} label="Add task" onPress={handleSubmitPress} />
        </Card>
      </Section>

      <Section theme={theme} title="Task board">
        {tasks.length ? (
          tasks.map(task => {
            const profile = memberProfiles.find(
              item => item.member.userId === task.assigneeUserId,
            )?.profile;

            return (
              <Card key={task.id} theme={theme}>
                <View style={styles.taskHeader}>
                  <View style={styles.taskText}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskMeta}>
                      {task.scope === 'shared'
                        ? 'Shared task'
                        : `Personal · ${profile?.displayName ?? 'Unknown'}`}
                    </Text>
                    <Text style={styles.taskMeta}>
                      {task.points} points
                      {task.dueAt
                        ? ` · due ${formatShortDate(task.dueAt)}`
                        : ''}
                    </Text>
                    {task.completedAt ? (
                      <Text style={styles.taskDone}>
                        Completed {formatDateTime(task.completedAt)}
                      </Text>
                    ) : null}
                  </View>
                  <ActionTextButton
                    theme={theme}
                    label={task.completedAt ? 'Undo' : 'Complete'}
                    onPress={() =>
                      toggleTaskComplete(
                        task.id,
                        task.assigneeUserId ?? currentUserId,
                      ).catch(() => undefined)
                    }
                  />
                </View>
                {profile ? (
                  <View style={styles.assigneeRow}>
                    <Avatar
                      theme={theme}
                      label={profile.displayName}
                      colorKey={profile.colorKey}
                    />
                    <Text style={styles.taskMeta}>{profile.displayName}</Text>
                  </View>
                ) : null}
              </Card>
            );
          })
        ) : (
          <EmptyState
            theme={theme}
            title="No tasks yet"
            body="Add the first shared or personal task to make the score cycle do something useful."
          />
        )}
      </Section>

      <Section theme={theme} title="Previous cycle">
        {scoreboard.previousScores.map(item => {
          const profile = memberProfiles.find(
            member => member.member.userId === item.userId,
          )?.profile;

          return (
            <Card key={item.userId} theme={theme}>
              <Text style={styles.taskTitle}>
                {profile?.displayName || 'Unknown'}
              </Text>
              <Text style={styles.taskMeta}>{item.points} points</Text>
            </Card>
          );
        })}
      </Section>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    taskHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    taskText: {
      gap: 4,
      flex: 1,
    },
    taskTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '800',
    },
    taskMeta: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    taskDone: {
      color: theme.success,
      fontSize: 13,
      fontWeight: '700',
    },
    assigneeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
  });
