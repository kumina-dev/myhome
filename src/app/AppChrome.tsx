import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTab } from '../store/models';
import { getCurrentGroup, getCurrentProfile } from '../store/selectors';
import { useAppStore } from '../store/store';
import { getTheme } from '../theme/theme';
import { AuthScreen } from '../screens/AuthScreen';
import { AppLockScreen } from '../screens/AppLockScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ExpensesScreen } from '../screens/ExpensesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { NotesScreen } from '../screens/NotesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { AppTabBar, Avatar, Button } from '../ui/primitives';
import { appTabs } from './addTabs';

export function AppChrome() {
  const { phase, snapshot, lockApp, loading } = useAppStore();
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
              {snapshot ? getCurrentGroup(snapshot).groupName : 'Group'}
            </Text>
            <Text style={styles.subtitle}>
              Shared planning for a small trusted group
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
              label="Lock"
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
  });
