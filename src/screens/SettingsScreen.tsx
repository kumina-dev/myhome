import { Switch, Text, View } from 'react-native';
import { Theme } from '../theme/theme';
import { AppTab, ThemeMode } from '../store/models';
import { useAppStore } from '../store/store';
import React, { useState } from 'react';
import { Button, Card, Field, Pill, Screen, Section } from '../ui/primitives';

const tabs: AppTab[] = ['home', 'expenses', 'notes', 'calendar', 'tasks'];
const themes: ThemeMode[] = ['system', 'light', 'dark'];

export function SettingsScreen({
  theme,
  onClose,
}: {
  theme: Theme;
  onClose: () => void;
}) {
  const { state, dispatch } = useAppStore();
  const [newCategory, setNewCategory] = useState('');

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title="Settings"
        action={
          <Button
            theme={theme}
            label="Close"
            kind="secondary"
            onPress={onClose}
          />
        }
      >
        <Card theme={theme}>
          <Field
            theme={theme}
            label="Household name"
            value={state.settings.householdName}
            onChangeText={value =>
              dispatch({
                type: 'UPDATE_SETTINGS',
                payload: { householdName: value },
              })
            }
          />
        </Card>
      </Section>

      <Section theme={theme} title="Active user">
        <Card theme={theme}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {state.users.map(user => (
              <Pill
                key={user.id}
                theme={theme}
                label={user.name}
                selected={state.settings.activeUserId === user.id}
                onPress={() =>
                  dispatch({
                    type: 'UPDATE_SETTINGS',
                    payload: { activeUserId: user.id },
                  })
                }
              />
            ))}
          </View>
        </Card>
      </Section>

      <Section theme={theme} title="Appearance">
        <Card theme={theme}>
          <Text style={{ color: theme.textMuted, marginBottom: 8 }}>Theme</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {themes.map(mode => (
              <Pill
                key={mode}
                theme={theme}
                label={mode}
                selected={state.settings.themeMode === mode}
                onPress={() =>
                  dispatch({
                    type: 'UPDATE_SETTINGS',
                    payload: { themeMode: mode },
                  })
                }
              />
            ))}
          </View>

          <Text
            style={{ color: theme.textMuted, marginTop: 12, marginBottom: 8 }}
          >
            Default tab
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <Pill
                key={tab}
                theme={theme}
                label={tab}
                selected={state.settings.defaultTab === tab}
                onPress={() =>
                  dispatch({
                    type: 'UPDATE_SETTINGS',
                    payload: { defaultTab: tab },
                  })
                }
              />
            ))}
          </View>
        </Card>
      </Section>

      <Section theme={theme} title="Notifications">
        <Card theme={theme}>
          {(
            [
              ['eventReminders', 'Event reminders'],
              ['taskReminders', 'Task reminders'],
              ['noteAlerts', 'Shared note alerts'],
              ['expenseAlerts', 'Expense activity'],
              ['sharedTaskBroadcasts', 'Shared task broadcasts'],
            ] as const
          ).map(([key, label]) => (
            <View
              key={key}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Text style={{ color: theme.text }}>{label}</Text>
              <Switch
                value={state.settings.notifications[key]}
                onValueChange={value =>
                  dispatch({
                    type: 'UPDATE_SETTINGS',
                    payload: {
                      notifications: {
                        ...state.settings.notifications,
                        [key]: value,
                      },
                    },
                  })
                }
              />
            </View>
          ))}
        </Card>
      </Section>

      <Section theme={theme} title="Tasks and scoring">
        <Card theme={theme}>
          <Text style={{ color: theme.textMuted, marginBottom: 8 }}>
            Score cycle
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {[7, 14, 28].map(days => (
              <Pill
                key={days}
                theme={theme}
                label={`${days} days`}
                selected={state.settings.scoreCycleDays === days}
                onPress={() =>
                  dispatch({
                    type: 'UPDATE_SETTINGS',
                    payload: { scoreCycleDays: days },
                  })
                }
              />
            ))}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: theme.text }}>Show completed tasks</Text>
            <Switch
              value={state.settings.showCompletedTasks}
              onValueChange={value =>
                dispatch({
                  type: 'UPDATE_SETTINGS',
                  payload: { showCompletedTasks: value },
                })
              }
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: theme.text }}>Personal tasks on Home</Text>
            <Switch
              value={state.settings.showPersonalTasksOnHome}
              onValueChange={value =>
                dispatch({
                  type: 'UPDATE_SETTINGS',
                  payload: { showPersonalTasksOnHome: value },
                })
              }
            />
          </View>
        </Card>
      </Section>

      <Section theme={theme} title="Calendar and layout">
        <Card theme={theme}>
          <Text style={{ color: theme.textMuted, marginBottom: 8 }}>
            Week starts on
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Pill
              theme={theme}
              label="Monday"
              selected={state.settings.weekStartsOn === 'monday'}
              onPress={() =>
                dispatch({
                  type: 'UPDATE_SETTINGS',
                  payload: { weekStartsOn: 'monday' },
                })
              }
            />
            <Pill
              theme={theme}
              label="Sunday"
              selected={state.settings.weekStartsOn === 'sunday'}
              onPress={() =>
                dispatch({
                  type: 'UPDATE_SETTINGS',
                  payload: { weekStartsOn: 'sunday' },
                })
              }
            />
          </View>
        </Card>
      </Section>

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
              dispatch({
                type: 'ADD_EXPENSE_CATEGORY',
                payload: { value: newCategory },
              });
              setNewCategory('');
            }}
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {state.settings.expenseCategories.map(item => (
              <Pill
                key={item}
                theme={theme}
                label={`Remove ${item}`}
                onPress={() =>
                  dispatch({
                    type: 'REMOVE_EXPENSE_CATEGORY',
                    payload: { value: item },
                  })
                }
              />
            ))}
          </View>
        </Card>
      </Section>
    </Screen>
  );
}
