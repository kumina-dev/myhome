import { Alert, Pressable, Text, View } from "react-native";
import { Theme } from "../theme/theme";
import { useAppStore } from "../store/store";
import React, { useState } from "react";
import { TaskScope } from "../store/models";
import { getUserMap, getVisibleTasks, getScoreboard, formatShortDate, formatDateTime } from "../store/selectors";
import { Button, Card, Field, Pill, Screen, Section, StatCard } from "../ui/primitives";

export function TasksScreen({ theme }: { theme: Theme }) {
  const { state, dispatch } = useAppStore();
  const users = getUserMap(state.users);
  const tasks = getVisibleTasks(state);
  const scoreboard = getScoreboard(state);

  const [title, setTitle] = useState('');
  const [scope, setScope] = useState<TaskScope>('shared');
  const [assigneeUserId, setAssigneeUserId] = useState(state.settings.activeUserId);
  const [points, setPoints] = useState('3');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));

  function submit() {
    const pointsNumber = Number(points);

    if (!title.trim() || Number.isNaN(pointsNumber) || pointsNumber <= 0) {
      Alert.alert('Invalid task', 'Title and points are required.');
      return;
    }

    dispatch({
      type: 'ADD_TASK',
      payload: {
        title: title.trim(),
        scope,
        assigneeUserId: scope === 'personal' ? assigneeUserId : undefined,
        points: pointsNumber,
        dueAt: dueDate ? new Date(`${dueDate}T20:00:00`).toISOString() : undefined,
      },
    });

    setTitle('');
    setPoints('3');
  }
  
  return (
    <Screen theme={theme}>
      <Section theme={theme} title="Current cycle">
        {scoreboard.currentScores.map(item => (
          <StatCard
            key={item.userId}
            theme={theme}
            label={users[item.userId]?.name ?? 'Unknown'}
            value={`${item.points}`}
            hint={`Cycle started ${formatShortDate(scoreboard.current.start.toISOString())}`}
          />
        ))}
      </Section>

      <Section theme={theme} title="New task">
        <Card theme={theme}>
          <Field
            theme={theme}
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Take out trash"
          />

          <Text style={{ color: theme.textMuted, marginBottom: 8 }}>Scope</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
            <Pill
              theme={theme}
              label="Shared"
              selected={scope === 'shared'}
              onPress={() => setScope('shared')}
            />
            <Pill
              theme={theme}
              label="Personal"
              selected={scope === 'personal'}
              onPress={() => setScope('personal')}
            />
          </View>

          {scope === 'personal' ? (
            <>
              <Text style={{ color: theme.textMuted, marginBottom: 8 }}>
                Assignee
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: 8,
                }}>
                {state.users.map(user => (
                  <Pill
                    key={user.id}
                    theme={theme}
                    label={user.name}
                    selected={assigneeUserId === user.id}
                    onPress={() => setAssigneeUserId(user.id)}
                  />
                ))}
              </View>
            </>
          ) : null}

          <Field
            theme={theme}
            label="Points"
            value={points}
            onChangeText={setPoints}
            placeholder="3"
            keyboardType="numeric"
          />
          <Field
            theme={theme}
            label="Due date"
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="2026-04-23"
          />

          <Button theme={theme} label="Add task" onPress={submit} />
        </Card>
      </Section>

      <Section theme={theme} title="Task board">
        {tasks.map(task => (
          <Card key={task.id} theme={theme}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{ color: theme.text, fontWeight: '700', fontSize: 16 }}>
                {task.title}
              </Text>
              <Pressable
                onPress={() =>
                  dispatch({
                    type: 'TOGGLE_TASK_COMPLETE',
                    payload: {
                      taskId: task.id,
                      completedByUserId:
                        task.assigneeUserId ?? state.settings.activeUserId,
                    },
                  })
                }>
                <Text style={{ color: theme.accent, fontWeight: '700' }}>
                  {task.completedAt ? 'Undo' : 'Complete'}
                </Text>
              </Pressable>
            </View>
            <Text style={{ color: theme.textMuted, marginTop: 4 }}>
              {task.scope === 'shared'
                ? 'Shared task'
                : `Personal · ${users[task.assigneeUserId ?? '']?.name ?? 'Unknown'}`}
            </Text>
            <Text style={{ color: theme.textMuted, marginTop: 4 }}>
              {task.points} points
              {task.dueAt ? ` · due ${formatShortDate(task.dueAt)}` : ''}
            </Text>
            {task.completedAt ? (
              <Text style={{ color: theme.success, marginTop: 8 }}>
                Completed {formatDateTime(task.completedAt)}
              </Text>
            ) : null}
          </Card>
        ))}
      </Section>

      <Section theme={theme} title="Previous cycle">
        {scoreboard.previousScores.map(item => (
          <Card key={item.userId} theme={theme}>
            <Text style={{ color: theme.text, fontWeight: '700', fontSize: 16 }}>
              {users[item.userId]?.name ?? 'Unknown'}
            </Text>
            <Text style={{ color: theme.textMuted, marginTop: 4 }}>
              {item.points} points
            </Text>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}