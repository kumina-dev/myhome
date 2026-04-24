import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { AppStoreProvider, useAppStore } from '../store/store';
import { AppTab } from '../store/models';
import { useEffect, useState } from 'react';
import { getTheme } from '../theme/theme';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ExpensesScreen } from '../screens/ExpensesScreen';
import { NotesScreen } from '../screens/NotesScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const tabs: { key: AppTab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'notes', label: 'Notes' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'tasks', label: 'Tasks' },
];

function AppChrome() {
  const { state } = useAppStore();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<AppTab>(state.settings.defaultTab);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setActiveTab(state.settings.defaultTab);
  }, [state.settings.defaultTab]);

  const mode =
    state.settings.themeMode === 'system'
      ? colorScheme === 'dark'
        ? 'dark'
        : 'light'
      : state.settings.themeMode;

  const theme = getTheme(mode);

  function renderScreen() {
    if (showSettings) {
      return (
        <SettingsScreen theme={theme} onClose={() => setShowSettings(false)} />
      );
    }

    switch (activeTab) {
      case 'expenses':
        return <ExpensesScreen theme={theme} />;
      case 'notes':
        return <NotesScreen theme={theme} />;
      case 'calendar':
        return <CalendarScreen theme={theme} />;
      case 'tasks':
        return <TasksScreen theme={theme} />;
      case 'home':
      default:
        return <HomeScreen theme={theme} />;
    }
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
      />

      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>
            {state.settings.householdName}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Small group, serious enough to need structure.
          </Text>
        </View>
        <Pressable
          onPress={() => setShowSettings(true)}
          style={[
            styles.settingsButton,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.settingsLabel, { color: theme.text }]}>
            Settings
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>{renderScreen()}</View>

      {!showSettings ? (
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: theme.tabBar,
              borderTopColor: theme.border,
            },
          ]}
        >
          {tabs.map(tab => {
            const selected = activeTab === tab.key;

            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={styles.tab}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    { color: selected ? theme.accent : theme.textMuted },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export function AppShell() {
  return (
    <AppStoreProvider>
      <AppChrome />
    </AppStoreProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  settingsButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  settingsLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});
