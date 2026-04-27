import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/theme';

type ItemKey = string | number;

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

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
  });
