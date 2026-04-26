import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../../shared/theme/theme';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { Field } from '../../../shared/ui/Field';
import { Section } from '../../../shared/ui/Section';
import {
  AppSnapshot,
  Group,
  GroupMember,
  MemberRole,
  UpdateSettingsInput,
  UserProfile,
} from '../../../store/models';
import { ListRow } from '../SettingsRows';

interface ActiveGroupProfile {
  member: GroupMember;
  profile: UserProfile;
}

export function GroupSettings({
  theme,
  snapshot,
  group,
  memberProfiles,
  isOwner,
  onUpdateSettings,
  onInviteMember,
  onRevokeInvite,
  onUpdateMemberRole,
  onRemoveMember,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  group: Group;
  memberProfiles: ActiveGroupProfile[];
  isOwner: boolean;
  onUpdateSettings: (input: UpdateSettingsInput) => Promise<void>;
  onInviteMember: (email: string, profileNameHint: string) => Promise<void>;
  onRevokeInvite: (inviteId: string) => Promise<void>;
  onUpdateMemberRole: (memberId: string, role: MemberRole) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
}) {
  const styles = createStyles(theme);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const pendingInvites = useMemo(
    () =>
      snapshot.invites.filter(
        invite =>
          invite.groupId === group.id &&
          !invite.acceptedAt &&
          !invite.revokedAt,
      ),
    [group.id, snapshot.invites],
  );

  return (
    <>
      <Section theme={theme} title="Group">
        <Card theme={theme}>
          <Field
            theme={theme}
            label="Group name"
            value={snapshot.settings.groupName}
            onChangeText={value => {
              onUpdateSettings({ groupName: value }).catch(() => undefined);
            }}
            helper="Covers family, flatmates, close friends, and other sane private groups."
          />
        </Card>
      </Section>

      <Section theme={theme} title="Members">
        {memberProfiles.map(item => (
          <Card key={item.member.id} theme={theme}>
            <ListRow
              theme={theme}
              title={item.profile.displayName}
              subtitle={item.member.role}
              trailing={
                isOwner && item.member.role !== 'owner' ? (
                  <View style={styles.memberActions}>
                    <Button
                      theme={theme}
                      label={
                        item.member.role === 'member'
                          ? 'Make owner'
                          : 'Make member'
                      }
                      kind="secondary"
                      onPress={() =>
                        onUpdateMemberRole(
                          item.member.id,
                          item.member.role === 'member' ? 'owner' : 'member',
                        ).catch(() => undefined)
                      }
                    />
                    <Button
                      theme={theme}
                      label="Remove"
                      kind="danger"
                      onPress={() => {
                        Alert.alert(
                          'Remove member',
                          `Remove ${item.profile.displayName} from the group?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Remove',
                              style: 'destructive',
                              onPress: () => {
                                onRemoveMember(item.member.id).catch(
                                  () => undefined,
                                );
                              },
                            },
                          ],
                        );
                      }}
                    />
                  </View>
                ) : undefined
              }
            />
          </Card>
        ))}
      </Section>

      {isOwner ? (
        <>
          <Section theme={theme} title="Invite member">
            <Card theme={theme}>
              <Field
                theme={theme}
                label="Email"
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="friend@example.com"
              />
              <Field
                theme={theme}
                label="Name hint"
                value={inviteName}
                onChangeText={setInviteName}
                placeholder="June"
              />
              <Button
                theme={theme}
                label="Create invite"
                onPress={() => {
                  onInviteMember(inviteEmail, inviteName).catch(
                    () => undefined,
                  );
                  setInviteEmail('');
                  setInviteName('');
                }}
              />
            </Card>
          </Section>

          <Section theme={theme} title="Pending invites">
            {pendingInvites.map(invite => (
              <Card key={invite.id} theme={theme}>
                <Text style={styles.title}>{invite.email}</Text>
                <Text style={styles.meta}>Code: {invite.code}</Text>
                <Text style={styles.meta}>
                  Hint: {invite.profileNameHint ?? 'none'}
                </Text>
                <Button
                  theme={theme}
                  label="Revoke invite"
                  kind="danger"
                  onPress={() =>
                    onRevokeInvite(invite.id).catch(() => undefined)
                  }
                />
              </Card>
            ))}
          </Section>
        </>
      ) : null}
    </>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    memberActions: {
      gap: theme.spacing.sm,
    },
    title: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '900',
    },
    meta: {
      color: theme.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
  });
