import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Screen } from '../../shared/ui/Screen';
import { Section } from '../../shared/ui/Section';
import { AppSnapshot, SettingsTab } from '../../store/models';
import { useAppStore } from '../../store/store';
import {
  getActiveGroupProfiles,
  getCurrentGroup,
  getCurrentMemberRole,
  getCurrentProfile,
} from '../../store/selectors';
import { AccountSettings } from './sections/AccountSettings';
import { AppearanceSettings } from './sections/AppearanceSettings';
import { CalendarSettings } from './sections/CalendarSettings';
import { CategorySettings } from './sections/CategorySettings';
import { GroupSettings } from './sections/GroupSettings';
import { NotificationSettings } from './sections/NotificationSettings';
import { SecuritySettings } from './sections/SecuritySettings';
import { TaskSettings } from './sections/TaskSettings';
import { settingsTabs } from './settingsTabs';
import { useTranslation } from '../../i18n';

export function SettingsScreen({ theme }: { theme: Theme }) {
  const {
    snapshot,
    settingsTab,
    setSettingsTab,
    updateSettings,
    addExpenseCategory,
    removeExpenseCategory,
    updateGroupName,
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
      updateGroupName={updateGroupName}
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
  updateGroupName,
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
  updateGroupName: ReturnType<typeof useAppStore>['updateGroupName'];
  inviteMember: ReturnType<typeof useAppStore>['inviteMember'];
  revokeInvite: ReturnType<typeof useAppStore>['revokeInvite'];
  updateMemberRole: ReturnType<typeof useAppStore>['updateMemberRole'];
  removeMember: ReturnType<typeof useAppStore>['removeMember'];
  updateAppLockSettings: ReturnType<
    typeof useAppStore
  >['updateAppLockSettings'];
  signOut: ReturnType<typeof useAppStore>['signOut'];
}) {
  const group = getCurrentGroup(snapshot);
  const profile = getCurrentProfile(snapshot);
  const memberProfiles = getActiveGroupProfiles(snapshot);
  const currentRole = getCurrentMemberRole(snapshot);
  const isOwner = currentRole === 'owner';
  const { t } = useTranslation();

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title={t('settings.screen.title')}
        subtitle={t('settings.screen.subtitle')}
      >
        <SettingsTabBar
          theme={theme}
          tabs={settingsTabs}
          activeTab={settingsTab}
          onSelect={setSettingsTab}
        />
      </Section>

      {settingsTab === 'account' ? (
        <AccountSettings
          theme={theme}
          snapshot={snapshot}
          profile={profile}
          currentRole={currentRole}
          onSignOut={signOut}
        />
      ) : null}
      {settingsTab === 'group' ? (
        <GroupSettings
          theme={theme}
          snapshot={snapshot}
          group={group}
          memberProfiles={memberProfiles}
          isOwner={isOwner}
          onUpdateGroupName={updateGroupName}
          onInviteMember={inviteMember}
          onRevokeInvite={revokeInvite}
          onUpdateMemberRole={updateMemberRole}
          onRemoveMember={removeMember}
        />
      ) : null}
      {settingsTab === 'notifications' ? (
        <NotificationSettings
          theme={theme}
          snapshot={snapshot}
          onUpdateSettings={updateSettings}
        />
      ) : null}
      {settingsTab === 'appearance' ? (
        <AppearanceSettings
          theme={theme}
          snapshot={snapshot}
          onUpdateSettings={updateSettings}
        />
      ) : null}
      {settingsTab === 'calendar' ? (
        <CalendarSettings
          theme={theme}
          snapshot={snapshot}
          onUpdateSettings={updateSettings}
        />
      ) : null}
      {settingsTab === 'tasks' ? (
        <TaskSettings
          theme={theme}
          snapshot={snapshot}
          onUpdateSettings={updateSettings}
        />
      ) : null}
      {settingsTab === 'categories' ? (
        <CategorySettings
          theme={theme}
          snapshot={snapshot}
          onAddExpenseCategory={addExpenseCategory}
          onRemoveExpenseCategory={removeExpenseCategory}
        />
      ) : null}
      {settingsTab === 'security' ? (
        <SecuritySettings
          theme={theme}
          snapshot={snapshot}
          onUpdateAppLockSettings={updateAppLockSettings}
        />
      ) : null}
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    settingsTabs: {
      marginBottom: theme.spacing.lg,
    },
    settingsTabsContent: {
      gap: theme.spacing.sm,
      paddingRight: theme.spacing.lg,
    },
    settingsTabBase: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.full,
      borderWidth: theme.borders.hairline,
    },
    settingsTab: {
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    settingsTabSelected: {
      borderColor: theme.accent,
      backgroundColor: theme.accentSoft,
    },
    settingsTabText: {
      color: theme.textMuted,
      fontWeight: '800',
    },
    settingsTabTextSelected: {
      color: theme.accent,
      fontWeight: '900',
    },
  });

function SettingsTabBar({
  theme,
  tabs,
  activeTab,
  onSelect,
}: {
  theme: Theme;
  tabs: typeof settingsTabs;
  activeTab: SettingsTab;
  onSelect: (key: SettingsTab) => void;
}) {
  const styles = createStyles(theme);
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.settingsTabs}
      contentContainerStyle={styles.settingsTabsContent}
    >
      {tabs.map(tab => {
        const selected = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={[
              styles.settingsTabBase,
              selected ? styles.settingsTabSelected : styles.settingsTab,
            ]}
          >
            <Text
              style={[
                styles.settingsTabText,
                selected ? styles.settingsTabTextSelected : null,
              ]}
            >
              {t(tab.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
