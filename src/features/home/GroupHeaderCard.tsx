import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Card } from '../../shared/ui/Card';
import { GroupMember, ProfileColorKey, UserProfile } from '../../store/models';

interface ActiveGroupProfile {
  member: GroupMember;
  profile: UserProfile;
}

export function GroupHeaderCard({
  theme,
  profiles,
}: {
  theme: Theme;
  profiles: ActiveGroupProfile[];
}) {
  const styles = createStyles(theme);

  return (
    <Card theme={theme}>
      <View style={styles.memberRow}>
        {profiles.map(item => (
          <View key={item.member.id} style={styles.memberChip}>
            <Avatar
              theme={theme}
              label={item.profile.displayName}
              colorKey={item.profile.colorKey}
            />
            <View style={styles.memberText}>
              <Text style={styles.memberName}>{item.profile.displayName}</Text>
              <Text style={styles.memberRole}>{item.member.role}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
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

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    memberRow: {
      gap: theme.spacing.md,
    },
    memberChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    memberText: {
      gap: 2,
    },
    memberName: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '800',
    },
    memberRole: {
      color: theme.textMuted,
      fontSize: 13,
      textTransform: 'capitalize',
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
  });
