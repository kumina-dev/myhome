import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTab, ProfileColorKey } from '../store/models';
import { getCurrentGroup, getCurrentProfile } from '../store/selectors';
import { useAppStore } from '../store/store';
import { getTheme } from '../shared/theme/theme';
import { AuthScreen } from '../features/auth/AuthScreen';
import { AppLockScreen } from '../features/appLock/AppLockScreen';
import { CalendarScreen } from '../features/calendar/CalendarScreen';
import { ExpensesScreen } from '../features/expenses/ExpensesScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { NotesScreen } from '../features/notes/NotesScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { TasksScreen } from '../features/tasks/TasksScreen';
import { Button } from '../shared/ui/Button';
import { appTabs } from './appTabs';
import { useTranslation } from '../i18n';

export function AppChrome() {
  const { phase, snapshot, lockApp, loading } = useAppStore();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const mode =
    snapshot?.settings.themeMode === 'system'
      ? colorScheme === 'dark'
        ? 'dark'
        : 'light'
      : snapshot?.settings.themeMode ?? 'light';
  const theme = getTheme(mode);
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  useEffect(() => {
    if (snapshot?.settings.defaultTab) {
      setActiveTab(snapshot.settings.defaultTab);
    }
  }, [snapshot?.settings.defaultTab]);

  function renderMainScreen() {
    switch (activeTab) {
      case 'expenses':
        return <ExpensesScreen theme={theme} />;
      case 'notes':
        return <NotesScreen theme={theme} />;
      case 'calendar':
        return <CalendarScreen theme={theme} />;
      case 'tasks':
        return <TasksScreen theme={theme} />;
      case 'settings':
        return <SettingsScreen theme={theme} />;
      case 'home':
      default:
        return <HomeScreen theme={theme} />;
    }
  }

  function renderPhase() {
    if (loading || phase === 'splash') return <SplashScreen theme={theme} />;
    if (phase === 'auth') return <AuthScreen theme={theme} />;
    if (phase === 'app-locked') return <AppLockScreen theme={theme} />;

    return (
      <>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {snapshot ? getCurrentGroup(snapshot).groupName : t('app.fallbackGroupName')}
            </Text>
            <Text style={styles.subtitle}>
              {t('app.headerSubtitle')}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {snapshot && getCurrentProfile(snapshot) ? (
              <Avatar
                theme={theme}
                label={getCurrentProfile(snapshot)?.displayName ?? 'U'}
                colorKey={getCurrentProfile(snapshot)?.colorKey ?? 'blue'}
              />
            ) : null}
            <Button
              theme={theme}
              label={t('app.lock')}
              kind="secondary"
              onPress={() => {
                lockApp().catch(() => undefined);
              }}
            />
          </View>
        </View>
        <View style={styles.content}>{renderMainScreen()}</View>
        <AppTabBar
          theme={theme}
          tabs={appTabs}
          translate={t}
          activeTab={activeTab}
          onSelect={setActiveTab}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      {renderPhase()}
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof getTheme>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },
    headerText: {
      flex: 1,
      gap: 4,
    },
    title: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '900',
    },
    subtitle: {
      color: theme.textMuted,
      fontSize: 13,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    content: {
      flex: 1,
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
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.tabBar,
      borderTopWidth: theme.borders.hairline,
      borderTopColor: theme.border,
      paddingVertical: 10,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    },
    tabLabel: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '800',
    },
    tabLabelSelected: {
      color: theme.accent,
      fontSize: 12,
      fontWeight: '900',
    },
  });

function Avatar({
  theme,
  label,
  colorKey,
}: {
  theme: ReturnType<typeof getTheme>;
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

function AppTabBar({
  theme,
  tabs,
  translate,
  activeTab,
  onSelect,
}: {
  theme: ReturnType<typeof getTheme>;
  tabs: typeof appTabs;
  translate: ReturnType<typeof useTranslation>['t'];
  activeTab: AppTab;
  onSelect: (key: AppTab) => void;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => {
        const selected = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={styles.tabItem}
          >
            <Text style={selected ? styles.tabLabelSelected : styles.tabLabel}>
              {translate(tab.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
