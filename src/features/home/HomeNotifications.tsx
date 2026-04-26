import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Section } from '../../shared/ui/Section';
import { NotificationItem } from '../../store/models';
import { useDateTimeFormatter } from '../../shared/format/dateTime';

export function HomeNotifications({
  theme,
  unread,
  onMarkAllRead,
}: {
  theme: Theme;
  unread: NotificationItem[];
  onMarkAllRead: () => void;
}) {
  const styles = createStyles(theme);
  const { formatDateTime } = useDateTimeFormatter();

  return (
    <Section
      theme={theme}
      title="Notifications"
      action={
        unread.length ? (
          <Button
            theme={theme}
            label="Mark all read"
            kind="secondary"
            onPress={onMarkAllRead}
          />
        ) : undefined
      }
    >
      {unread.length ? (
        unread.map(item => (
          <Card key={item.id} theme={theme}>
            <Badge theme={theme} label={item.type} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.bodyMuted}>{item.body}</Text>
            <Text style={styles.meta}>{formatDateTime(item.createdAt)}</Text>
          </Card>
        ))
      ) : (
        <EmptyState
          theme={theme}
          title="Quiet for now"
          body="No unread updates. A rare but welcome condition."
        />
      )}
    </Section>
  );
}

function Badge({ theme, label }: { theme: Theme; label: string }) {
  const styles = createStyles(theme);
  
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cardTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '900',
    },
    bodyMuted: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    meta: {
      color: theme.textMuted,
      fontSize: 12,
      lineHeight: 18,
    },
    badge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.full,
      backgroundColor: theme.accentSoft,
      alignSelf: 'flex-start',
    },
    badgeText: {
      color: theme.accent,
      fontWeight: '800',
      fontSize: 12,
    },
  });
