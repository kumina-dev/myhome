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
import { useTranslation } from '../../../i18n';

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
  const { t } = useTranslation();
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
      <Section theme={theme} title={t('settings.tabs.group')}>
        <Card theme={theme}>
          <Field
            theme={theme}
            label={t('settings.group.groupName')}
            value={snapshot.settings.groupName}
            onChangeText={value => {
              onUpdateSettings({ groupName: value }).catch(() => undefined);
            }}
            helper={t('settings.group.groupNameHelper')}
          />
        </Card>
      </Section>

      <Section theme={theme} title={t('settings.group.members')}>
        {memberProfiles.map(item => (
          <Card key={item.member.id} theme={theme}>
            <ListRow
              theme={theme}
              title={item.profile.displayName}
              subtitle={
                item.member.role === 'owner'
                  ? t('common.roles.owner')
                  : t('common.roles.member')
              }
              trailing={
                isOwner && item.member.role !== 'owner' ? (
                  <View style={styles.memberActions}>
                    <Button
                      theme={theme}
                      label={
                        item.member.role === 'member'
                          ? t('settings.group.makeOwner')
                          : t('settings.group.makeMember')
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
                      label={t('common.actions.remove')}
                      kind="danger"
                      onPress={() => {
                        Alert.alert(
                          t('settings.group.removeMemberTitle'),
                          t('settings.group.removeMemberBody', { name: item.profile.displayName }),
                          [
                            { text: t('common.actions.cancel'), style: 'cancel' },
                            {
                              text: t('common.actions.remove'),
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
          <Section theme={theme} title={t('settings.group.inviteMember')}>
            <Card theme={theme}>
              <Field
                theme={theme}
                label={t('auth.fields.email')}
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="friend@example.com"
              />
              <Field
                theme={theme}
                label={t('settings.group.nameHint')}
                value={inviteName}
                onChangeText={setInviteName}
                placeholder={t('auth.placeholders.displayName')}
              />
              <Button
                theme={theme}
                label={t('settings.group.createInvite')}
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

          <Section theme={theme} title={t('settings.group.pendingInvites')}>
            {pendingInvites.map(invite => (
              <Card key={invite.id} theme={theme}>
                <Text style={styles.title}>{invite.email}</Text>
                <Text style={styles.meta}>{t('settings.group.code', { code: invite.code })}</Text>
                <Text style={styles.meta}>
                  {t('settings.group.hint', { hint: invite.profileNameHint ?? t('settings.group.noHint') })}
                </Text>
                <Button
                  theme={theme}
                  label={t('settings.group.revokeInvite')}
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
