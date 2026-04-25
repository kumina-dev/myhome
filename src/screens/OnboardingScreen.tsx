import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthFlowMode } from '../store/models';
import { Theme } from '../theme/theme';
import { Button, Card, Screen, Section } from '../ui/primitives';

export function OnboardingScreen({
  theme,
  onContinue,
}: {
  theme: Theme;
  onContinue: (mode: AuthFlowMode) => void;
}) {
  const styles = createStyles(theme);

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title="Private group coordination"
        subtitle="Shared expenses, notes, calendar, chores, and settings for a small trusted group."
      >
        <Card theme={theme}>
          <View style={styles.copyBlock}>
            <Text style={styles.title}>Built for real everyday use</Text>
            <Text style={styles.body}>
              The app is private by design, structured enough to stay usable,
              and simple enough that you do not need to train everyone manually.
            </Text>
          </View>
          <Button
            theme={theme}
            label="Create a new group"
            onPress={() => onContinue('create-group')}
          />
          <Button
            theme={theme}
            label="Join with invite code"
            kind="secondary"
            onPress={() => onContinue('accept-invite')}
          />
          <Button
            theme={theme}
            label="I already have an account"
            kind="ghost"
            onPress={() => onContinue('sign-in')}
          />
        </Card>
      </Section>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    copyBlock: {
      gap: 8,
      marginBottom: 8,
    },
    title: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '900',
    },
    body: {
      color: theme.textMuted,
      fontSize: 15,
      lineHeight: 22,
    },
  });
