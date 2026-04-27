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
import { useTranslation } from '../../i18n';

export function TasksScreen({ theme }: { theme: Theme }) {
  const { snapshot, addTask, toggleTaskComplete } = useAppStore();
  const { t } = useTranslation();

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
      <Section theme={theme} title={t('tasks.screen.currentCycle')}>
        <Scoreboard
          theme={theme}
          scoreboard={scoreboard}
          memberProfiles={memberProfiles}
        />
      </Section>

      <Section
        theme={theme}
        title={t('tasks.screen.newTask')}
        subtitle={t('tasks.screen.newTaskSubtitle')}
      >
        <TaskForm
          theme={theme}
          snapshot={snapshot}
          memberProfiles={memberProfiles}
          currentUserId={currentUserId}
          onAddTask={addTask}
        />
      </Section>

      <Section theme={theme} title={t('tasks.screen.taskBoard')}>
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
