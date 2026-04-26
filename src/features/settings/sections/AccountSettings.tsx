import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../../shared/theme/theme';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { Section } from '../../../shared/ui/Section';
import { AppSnapshot, MemberRole, UserProfile } from '../../../store/models';
import { Avatar, Badge } from '../SettingsRows';

export function AccountSettings({
  theme,
  snapshot,
  profile,
  currentRole,
  onSignOut,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  profile: UserProfile | null;
  currentRole?: MemberRole;
  onSignOut: () => Promise<void>;
}) {
  const styles = createStyles(theme);

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
          onPress={() => onSignOut().catch(() => undefined)}
        />
      </Card>
    </Section>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    accountHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    accountText: {
      gap: theme.spacing.xs,
      flex: 1,
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
