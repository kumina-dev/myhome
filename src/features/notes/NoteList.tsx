import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Card } from '../../shared/ui/Card';
import { EmptyState } from '../../shared/ui/EmptyState';
import {
  GroupMember,
  Note,
  ProfileColorKey,
  UserProfile,
} from '../../store/models';
import { useDateTimeFormatter } from '../../shared/format/dateTime';
import { useTranslation } from '../../i18n';

interface ActiveGroupProfile {
  member: GroupMember;
  profile: UserProfile;
}

export function NoteList({
  theme,
  notes,
  memberProfiles,
  onTogglePinned,
}: {
  theme: Theme;
  notes: Note[];
  memberProfiles: ActiveGroupProfile[];
  onTogglePinned: (noteId: string) => void;
}) {
  const styles = createStyles(theme);
  const { formatDateTime } = useDateTimeFormatter();
  const { t } = useTranslation();

  if (!notes.length) {
    return (
      <EmptyState
        theme={theme}
        title={t('notes.empty.title')}
        body={t('notes.empty.body')}
      />
    );
  }

  return (
    <>
      {notes.map(note => {
        const profile = memberProfiles.find(
          item => item.member.userId === note.authorUserId,
        )?.profile;

        return (
          <Card key={note.id} theme={theme}>
            <View style={styles.headerRow}>
              <View style={styles.authorRow}>
                {profile ? (
                  <Avatar
                    theme={theme}
                    label={profile.displayName}
                    colorKey={profile.colorKey}
                  />
                ) : null}
                <View style={styles.authorText}>
                  <Text style={styles.cardTitle}>{note.title}</Text>
                  <Text style={styles.meta}>
                    {profile?.displayName ?? t('common.states.unknown')} -{' '}
                    {formatDateTime(note.updatedAt)}
                  </Text>
                </View>
              </View>
              <ActionTextButton
                theme={theme}
                label={note.isPinned ? 'Unpin' : 'Pin'}
                onPress={() => onTogglePinned(note.id)}
              />
            </View>
            <Text style={styles.body}>{note.body}</Text>
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
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
    },
    authorRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      flex: 1,
    },
    authorText: {
      gap: theme.spacing.xs,
      flex: 1,
    },
    cardTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '900',
    },
    meta: {
      color: theme.textMuted,
      fontSize: 12,
    },
    body: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 21,
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
