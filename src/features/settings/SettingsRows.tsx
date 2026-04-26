import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../shared/theme/theme';
import { ProfileColorKey } from '../../store/models';

type ItemKey = string | number;

export function Kicker({
  theme,
  children,
}: {
  theme: Theme;
  children: string;
}) {
  const styles = createStyles(theme);

  return <Text style={styles.kicker}>{children}</Text>;
}

export function ListRow({
  theme,
  title,
  subtitle,
  trailing,
}: {
  theme: Theme;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.listRow}>
      <View style={styles.listContent}>
        <Text style={styles.listTitle}>{title}</Text>
        {subtitle ? <Text style={styles.meta}>{subtitle}</Text> : null}
      </View>
      {trailing}
    </View>
  );
}

export function ToggleRow({
  theme,
  label,
  value,
  onValueChange,
}: {
  theme: Theme;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const styles = createStyles(theme);

  return (
    <Pressable onPress={() => onValueChange(!value)} style={styles.toggleRow}>
      <Text style={styles.body}>{label}</Text>
      <View style={value ? styles.toggleTrackOn : styles.toggleTrack}>
        <View style={value ? styles.toggleThumbOn : styles.toggleThumb} />
      </View>
    </Pressable>
  );
}

export function SegmentedControl<T extends ItemKey>({
  theme,
  items,
  selected,
  onSelect,
}: {
  theme: Theme;
  items: { key: T; label: string }[];
  selected: T;
  onSelect: (key: T) => void;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.segmented}>
      {items.map(item => {
        const isSelected = item.key === selected;

        return (
          <Pressable
            key={String(item.key)}
            onPress={() => onSelect(item.key)}
            style={[
              styles.segmentBase,
              isSelected ? styles.segmentSelected : styles.segment,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                isSelected ? styles.segmentTextSelected : null,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Avatar({
  theme,
  label,
  colorKey,
}: {
  theme: Theme;
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

export function Badge({ theme, label }: { theme: Theme; label: string }) {
  const styles = createStyles(theme);

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    kicker: {
      color: theme.textMuted,
      fontSize: theme.typography.kicker.fontSize,
      fontWeight: theme.typography.kicker.fontWeight,
      textTransform: theme.typography.kicker.textTransform,
      marginBottom: theme.spacing.sm,
    },
    body: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 21,
    },
    meta: {
      color: theme.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    listRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    listContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    listTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '800',
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.md,
    },
    toggleTrack: {
      width: 52,
      height: 30,
      borderRadius: theme.radius.full,
      borderWidth: theme.borders.hairline,
      borderColor: theme.border,
      backgroundColor: theme.surfaceMuted,
      padding: 3,
      alignItems: 'flex-start',
    },
    toggleTrackOn: {
      width: 52,
      height: 30,
      borderRadius: theme.radius.full,
      borderWidth: theme.borders.hairline,
      borderColor: theme.accent,
      backgroundColor: theme.accent,
      padding: 3,
      alignItems: 'flex-end',
    },
    toggleThumb: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.textMuted,
    },
    toggleThumbOn: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.inverseText,
    },
    segmented: {
      flexDirection: 'row',
      backgroundColor: theme.surfaceMuted,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xs,
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    segmentBase: {
      flex: 1,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderWidth: theme.borders.hairline,
      borderColor: 'transparent',
    },
    segment: {
      backgroundColor: 'transparent',
    },
    segmentSelected: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
    },
    segmentText: {
      color: theme.textMuted,
      fontWeight: '800',
      textAlign: 'center',
      fontSize: 13,
    },
    segmentTextSelected: {
      color: theme.text,
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
