import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Card } from '../../shared/ui/Card';
import { EmptyState } from '../../shared/ui/EmptyState';
import {
  GroupMember,
  ProfileColorKey,
  Task,
  UserProfile,
} from '../../store/models';
import { formatDateTime, formatShortDate } from '../../store/selectors';

interface ActiveGroupProfile {
  member: GroupMember;
  profile: UserProfile;
}

export function TaskBoard({
  theme,
  tasks,
  memberProfiles,
  currentUserId,
  onToggleTaskComplete,
}: {
  theme: Theme;
  tasks: Task[];
  memberProfiles: ActiveGroupProfile[];
  currentUserId: string;
  onToggleTaskComplete: (taskId: string, completedByUserId: string) => void;
}) {
  const styles = createStyles(theme);

  if (!tasks.length) {
    return (
      <EmptyState
        theme={theme}
        title="No tasks yet"
        body="Add the first shared or personal task to make the score cycle do something useful."
      />
    );
  }

  return (
    <>
      {tasks.map(task => {
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
                  {task.dueAt ? ` · due ${formatShortDate(task.dueAt)}` : ''}
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
                  onToggleTaskComplete(
                    task.id,
                    task.assigneeUserId ?? currentUserId,
                  )
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
      })}
    </>
  );
}

function Avatar({
  theme,
  label,
  colorKey,
}: {
  theme: Theme;
  label: string;
  colorKey: ProfileColorKey;
}) {
  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.avatar,
        { backgroundColor: theme.profileColors[colorKey] },
      ]}
    >
      <Text style={styles.avatarText}>{label.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

function ActionTextButton({
  theme,
  label,
  onPress,
}: {
  theme: Theme;
  label: string;
  onPress: () => void;
}) {
  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress} style={styles.actionTextButton}>
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    taskHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    taskText: {
      gap: theme.spacing.xs,
      flex: 1,
    },
    taskTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '900',
    },
    taskMeta: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    taskDone: {
      color: theme.success,
      fontSize: 13,
      fontWeight: '800',
    },
    assigneeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: theme.inverseText,
      fontWeight: '900',
      fontSize: 14,
    },
    actionTextButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
    },
    actionText: {
      color: theme.accent,
      fontWeight: '900',
    },
  });
