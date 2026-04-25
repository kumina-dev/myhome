import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/theme';
import {
  AppSnapshot,
  CalendarViewMode,
  EventColorKey,
  MemberRole,
  SettingsTab,
  ThemeMode,
} from '../store/models';
import { useAppStore } from '../store/store';
import {
  getActiveGroupProfiles,
  getCurrentGroup,
  getCurrentMemberRole,
  getCurrentProfile,
} from '../store/selectors';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Field,
  ListRow,
  Screen,
  Section,
  SegmentedControl,
  SettingsTabBar,
  ToggleRow,
} from '../ui/primitives';

const tabs: { key: SettingsTab; label: string }[] = [
  { key: 'account', label: 'Account' },
  { key: 'group', label: 'Group' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'tasks', label: 'Tasks & Scores' },
  { key: 'categories', label: 'Categories' },
  { key: 'security', label: 'Security' },
];

export function SettingsScreen({ theme }: { theme: Theme }) {
  const {
    snapshot,
    settingsTab,
    setSettingsTab,
    updateSettings,
    addExpenseCategory,
    removeExpenseCategory,
    inviteMember,
    revokeInvite,
    updateMemberRole,
    removeMember,
    updateAppLockSettings,
    signOut,
  } = useAppStore();

  if (!snapshot) return null;

  return (
    <SettingsScreenContent
      theme={theme}
      snapshot={snapshot}
      settingsTab={settingsTab}
      setSettingsTab={setSettingsTab}
      updateSettings={updateSettings}
      addExpenseCategory={addExpenseCategory}
      removeExpenseCategory={removeExpenseCategory}
      inviteMember={inviteMember}
      revokeInvite={revokeInvite}
      updateMemberRole={updateMemberRole}
      removeMember={removeMember}
      updateAppLockSettings={updateAppLockSettings}
      signOut={signOut}
    />
  );
}

function SettingsScreenContent({
  theme,
  snapshot,
  settingsTab,
  setSettingsTab,
  updateSettings,
  addExpenseCategory,
  removeExpenseCategory,
  inviteMember,
  revokeInvite,
  updateMemberRole,
  removeMember,
  updateAppLockSettings,
  signOut,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  settingsTab: SettingsTab;
  setSettingsTab: (tab: SettingsTab) => void;
  updateSettings: ReturnType<typeof useAppStore>['updateSettings'];
  addExpenseCategory: ReturnType<typeof useAppStore>['addExpenseCategory'];
  removeExpenseCategory: ReturnType<
    typeof useAppStore
  >['removeExpenseCategory'];
  inviteMember: ReturnType<typeof useAppStore>['inviteMember'];
  revokeInvite: ReturnType<typeof useAppStore>['revokeInvite'];
  updateMemberRole: ReturnType<typeof useAppStore>['updateMemberRole'];
  removeMember: ReturnType<typeof useAppStore>['removeMember'];
  updateAppLockSettings: ReturnType<
    typeof useAppStore
  >['updateAppLockSettings'];
  signOut: ReturnType<typeof useAppStore>['signOut'];
}) {
  const styles = createStyles(theme);
  const group = getCurrentGroup(snapshot);
  const profile = getCurrentProfile(snapshot);
  const memberProfiles = getActiveGroupProfiles(snapshot);
  const currentRole = getCurrentMemberRole(snapshot);
  const isOwner = currentRole === 'owner';
  const [newCategory, setNewCategory] = useState('');
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

  function renderAccount() {
    return (
      <Section theme={theme} title="Account">
        <Card theme={theme}>
          {profile ? (
            <View style={styles.accountHeader}>
              <Avatar
                theme={theme}
                label={profile.displayName}
                colorKey={profile.colorKey}
              />
              <View style={styles.accountText}>
                <Text style={styles.title}>{profile.displayName}</Text>
                <Text style={styles.meta}>
                  {snapshot.sessionState.session?.email}
                </Text>
              </View>
            </View>
          ) : null}
          <Badge theme={theme} label={currentRole ?? 'member'} />
          <Button
            theme={theme}
            label="Sign out"
            kind="secondary"
            onPress={() => signOut().catch(() => undefined)}
          />
        </Card>
      </Section>
    );
  }

  function renderGroup() {
    return (
      <>
        <Section theme={theme} title="Group">
          <Card theme={theme}>
            <Field
              theme={theme}
              label="Group name"
              value={snapshot.settings.groupName}
              onChangeText={value => {
                updateSettings({ groupName: value }).catch(() => undefined);
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
                          updateMemberRole(
                            item.member.id,
                            item.member.role === 'member'
                              ? ('owner' as MemberRole)
                              : ('member' as MemberRole),
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
                                  removeMember(item.member.id).catch(
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
                    inviteMember(inviteEmail, inviteName).catch(
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
                      revokeInvite(invite.id).catch(() => undefined)
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

  function renderNotifications() {
    return (
      <Section theme={theme} title="Notifications">
        <Card theme={theme}>
          <ToggleRow
            theme={theme}
            label="Event reminders"
            value={snapshot.settings.notifications.eventReminders}
            onValueChange={value =>
              updateSettings({
                notifications: { eventReminders: value },
              }).catch(() => undefined)
            }
          />
          <ToggleRow
            theme={theme}
            label="Task reminders"
            value={snapshot.settings.notifications.taskReminders}
            onValueChange={value =>
              updateSettings({
                notifications: { taskReminders: value },
              }).catch(() => undefined)
            }
          />
          <ToggleRow
            theme={theme}
            label="Shared note alerts"
            value={snapshot.settings.notifications.noteAlerts}
            onValueChange={value =>
              updateSettings({
                notifications: { noteAlerts: value },
              }).catch(() => undefined)
            }
          />
          <ToggleRow
            theme={theme}
            label="Expense activity"
            value={snapshot.settings.notifications.expenseAlerts}
            onValueChange={value =>
              updateSettings({
                notifications: { expenseAlerts: value },
              }).catch(() => undefined)
            }
          />
          <ToggleRow
            theme={theme}
            label="Shared task broadcasts"
            value={snapshot.settings.notifications.sharedTaskBroadcasts}
            onValueChange={value =>
              updateSettings({
                notifications: { sharedTaskBroadcasts: value },
              }).catch(() => undefined)
            }
          />
        </Card>
      </Section>
    );
  }

  function renderAppearance() {
    return (
      <Section theme={theme} title="Appearance">
        <Card theme={theme}>
          <Text style={styles.kicker}>Theme</Text>
          <SegmentedControl
            theme={theme}
            items={[
              { key: 'system', label: 'System' },
              { key: 'light', label: 'Light' },
              { key: 'dark', label: 'Dark' },
            ]}
            selected={snapshot.settings.themeMode}
            onSelect={next =>
              updateSettings({ themeMode: next as ThemeMode }).catch(
                () => undefined,
              )
            }
          />
          <Text style={styles.kicker}>Default tab</Text>
          <SegmentedControl
            theme={theme}
            items={[
              { key: 'home', label: 'Home' },
              { key: 'expenses', label: 'Expenses' },
              { key: 'notes', label: 'Notes' },
              { key: 'calendar', label: 'Calendar' },
              { key: 'tasks', label: 'Tasks' },
              { key: 'settings', label: 'Settings' },
            ]}
            selected={snapshot.settings.defaultTab}
            onSelect={next =>
              updateSettings({ defaultTab: next }).catch(() => undefined)
            }
          />
        </Card>
      </Section>
    );
  }

  function renderCalendar() {
    return (
      <Section theme={theme} title="Calendar">
        <Card theme={theme}>
          <Text style={styles.kicker}>Default view</Text>
          <SegmentedControl
            theme={theme}
            items={[
              { key: 'month', label: 'Month' },
              { key: 'agenda', label: 'Agenda' },
            ]}
            selected={snapshot.settings.calendarDefaultView}
            onSelect={next =>
              updateSettings({
                calendarDefaultView: next as CalendarViewMode,
              }).catch(() => undefined)
            }
          />
          <Text style={styles.kicker}>Week starts on</Text>
          <SegmentedControl
            theme={theme}
            items={[
              { key: 'monday', label: 'Monday' },
              { key: 'sunday', label: 'Sunday' },
            ]}
            selected={snapshot.settings.weekStartsOn}
            onSelect={next =>
              updateSettings({ weekStartsOn: next }).catch(() => undefined)
            }
          />
          <Text style={styles.kicker}>Default event color</Text>
          <SegmentedControl
            theme={theme}
            items={[
              { key: 'blue', label: 'Blue' },
              { key: 'pink', label: 'Pink' },
              { key: 'green', label: 'Green' },
              { key: 'amber', label: 'Amber' },
              { key: 'red', label: 'Red' },
            ]}
            selected={snapshot.settings.eventColorKey}
            onSelect={next =>
              updateSettings({ eventColorKey: next as EventColorKey }).catch(
                () => undefined,
              )
            }
          />
        </Card>
      </Section>
    );
  }

  function renderTasks() {
    return (
      <Section theme={theme} title="Tasks and scoring">
        <Card theme={theme}>
          <Text style={styles.kicker}>Score cycle</Text>
          <SegmentedControl
            theme={theme}
            items={[
              { key: 7, label: '7 days' },
              { key: 14, label: '14 days' },
              { key: 28, label: '28 days' },
            ]}
            selected={snapshot.settings.scoreCycleDays}
            onSelect={next =>
              updateSettings({ scoreCycleDays: next }).catch(() => undefined)
            }
          />
          <ToggleRow
            theme={theme}
            label="Show completed tasks"
            value={snapshot.settings.showCompletedTasks}
            onValueChange={value =>
              updateSettings({ showCompletedTasks: value }).catch(
                () => undefined,
              )
            }
          />
          <ToggleRow
            theme={theme}
            label="Show personal tasks on Home"
            value={snapshot.settings.showPersonalTasksOnHome}
            onValueChange={value =>
              updateSettings({ showPersonalTasksOnHome: value }).catch(
                () => undefined,
              )
            }
          />
        </Card>
      </Section>
    );
  }

  function renderCategories() {
    return (
      <Section theme={theme} title="Expense categories">
        <Card theme={theme}>
          <Field
            theme={theme}
            label="New category"
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder="Pets"
          />
          <Button
            theme={theme}
            label="Add category"
            kind="secondary"
            onPress={() => {
              addExpenseCategory(newCategory).catch(() => undefined);
              setNewCategory('');
            }}
          />
          {snapshot.settings.expenseCategories.map(item => (
            <ListRow
              key={item}
              theme={theme}
              title={item}
              trailing={
                <Button
                  theme={theme}
                  label="Remove"
                  kind="danger"
                  onPress={() =>
                    removeExpenseCategory(item).catch(() => undefined)
                  }
                />
              }
            />
          ))}
        </Card>
      </Section>
    );
  }

  function renderSecurity() {
    return (
      <Section theme={theme} title="Security">
        <Card theme={theme}>
          <ToggleRow
            theme={theme}
            label="Enable app lock"
            value={snapshot.appLockSettings.isEnabled}
            onValueChange={value =>
              updateAppLockSettings({ isEnabled: value }).catch(() => undefined)
            }
          />
          <ToggleRow
            theme={theme}
            label="Enable biometric unlock"
            value={snapshot.appLockSettings.biometricEnabled}
            onValueChange={value =>
              updateAppLockSettings({ biometricEnabled: value }).catch(
                () => undefined,
              )
            }
          />
          <Field
            theme={theme}
            label="App PIN"
            value={snapshot.appLockSettings.pin}
            onChangeText={value => {
              if (value.length <= 6) {
                updateAppLockSettings({ pin: value }).catch(() => undefined);
              }
            }}
            keyboardType="numeric"
          />
          <Text style={styles.kicker}>Lock after</Text>
          <SegmentedControl
            theme={theme}
            items={[
              { key: 1, label: '1 min' },
              { key: 5, label: '5 min' },
              { key: 15, label: '15 min' },
            ]}
            selected={snapshot.appLockSettings.lockAfterMinutes}
            onSelect={next =>
              updateAppLockSettings({ lockAfterMinutes: next }).catch(
                () => undefined,
              )
            }
          />
        </Card>
      </Section>
    );
  }

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title="Settings"
        subtitle="Deep enough to be useful, not deep enough to become a support ticket factory."
      >
        <SettingsTabBar
          theme={theme}
          tabs={tabs}
          activeTab={settingsTab}
          onSelect={setSettingsTab}
        />
      </Section>

      {settingsTab === 'account' ? renderAccount() : null}
      {settingsTab === 'group' ? renderGroup() : null}
      {settingsTab === 'notifications' ? renderNotifications() : null}
      {settingsTab === 'appearance' ? renderAppearance() : null}
      {settingsTab === 'calendar' ? renderCalendar() : null}
      {settingsTab === 'tasks' ? renderTasks() : null}
      {settingsTab === 'categories' ? renderCategories() : null}
      {settingsTab === 'security' ? renderSecurity() : null}
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    accountHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    accountText: {
      gap: 4,
      flex: 1,
    },
    title: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '800',
    },
    meta: {
      color: theme.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    kicker: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    memberActions: {
      gap: 8,
    },
  });
