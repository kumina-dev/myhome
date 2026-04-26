import React from 'react';
import { Theme } from '../../shared/theme/theme';
import { Screen } from '../../shared/ui/Screen';
import { Section } from '../../shared/ui/Section';
import { useAppStore } from '../../store/store';
import {
  getActiveGroupProfiles,
  getScoreboard,
  getVisibleTasks,
} from '../../store/selectors';
import { Scoreboard } from './Scoreboard';
import { TaskBoard } from './TaskBoard';
import { TaskForm } from './TaskForm';

export function TasksScreen({ theme }: { theme: Theme }) {
  const { snapshot, addTask, toggleTaskComplete } = useAppStore();

  if (!snapshot) return null;

  const memberProfiles = getActiveGroupProfiles(snapshot);
  const scoreboard = getScoreboard(snapshot);
  const tasks = getVisibleTasks(snapshot);
  const currentUserId =
    snapshot.sessionState.session?.userId ??
    memberProfiles[0]?.member.userId ??
    '';

  return (
    <Screen theme={theme}>
      <Section theme={theme} title="Current cycle">
        <Scoreboard
          theme={theme}
          scoreboard={scoreboard}
          memberProfiles={memberProfiles}
        />
      </Section>

      <Section
        theme={theme}
        title="New task"
        subtitle="Shared and personal tasks live in the same system, without making everyday use feel like a spreadsheet prison."
      >
        <TaskForm
          theme={theme}
          snapshot={snapshot}
          memberProfiles={memberProfiles}
          currentUserId={currentUserId}
          onAddTask={addTask}
        />
      </Section>

      <Section theme={theme} title="Task board">
        <TaskBoard
          theme={theme}
          tasks={tasks}
          memberProfiles={memberProfiles}
          currentUserId={currentUserId}
          onToggleTaskComplete={(taskId, completedByUserId) => {
            toggleTaskComplete(taskId, completedByUserId).catch(
              () => undefined,
            );
          }}
        />
      </Section>

      <Scoreboard
        theme={theme}
        scoreboard={scoreboard}
        memberProfiles={memberProfiles}
        mode="previous"
      />
    </Screen>
  );
}
