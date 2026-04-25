import React from 'react';
import {
  KeyboardTypeOptions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  AppTab,
  EventColorKey,
  ProfileColorKey,
  SettingsTab,
} from '../store/models';
import { Theme } from '../theme/theme';

type ItemKey = string | number;

export function Screen({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  const styles = createStyles(theme);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function Section({
  theme,
  title,
  subtitle,
  action,
  children,
}: {
  theme: Theme;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle ? (
            <Text style={styles.sectionSubtitle}>{subtitle}</Text>
          ) : null}
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}

export function Card({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  const styles = createStyles(theme);
  return <View style={styles.card}>{children}</View>;
}

export function StatCard({
  theme,
  label,
  value,
  hint,
}: {
  theme: Theme;
  label: string;
  value: string;
  hint?: string;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.statCard}>
      <Text style={styles.kicker}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {hint ? <Text style={styles.bodyMuted}>{hint}</Text> : null}
    </View>
  );
}

export function EmptyState({
  theme,
  title,
  body,
}: {
  theme: Theme;
  title: string;
  body: string;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.bodyMuted}>{body}</Text>
    </View>
  );
}

export function Button({
  theme,
  label,
  onPress,
  kind = 'primary',
}: {
  theme: Theme;
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'ghost' | 'danger';
}) {
  const styles = createStyles(theme);
  const buttonStyle =
    kind === 'secondary'
      ? styles.buttonSecondary
      : kind === 'ghost'
      ? styles.buttonGhost
      : kind === 'danger'
      ? styles.buttonDanger
      : styles.buttonPrimary;
  const textStyle =
    kind === 'ghost' ? styles.buttonGhostText : styles.buttonPrimaryText;

  return (
    <Pressable onPress={onPress} style={[styles.buttonBase, buttonStyle]}>
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  theme,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  helper,
  secureTextEntry,
}: {
  theme: Theme;
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  helper?: string;
  secureTextEntry?: boolean;
}) {
  const styles = createStyles(theme);
  const inputStyle = multiline ? styles.inputMultiline : styles.input;

  return (
    <View style={styles.field}>
      <Text style={styles.kicker}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        style={[styles.inputBase, inputStyle]}
      />
      {helper ? <Text style={styles.fieldHelper}>{helper}</Text> : null}
    </View>
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
        const segmentStyle = isSelected
          ? styles.segmentSelected
          : styles.segment;
        const labelStyle = isSelected
          ? styles.segmentTextSelected
          : styles.segmentText;

        return (
          <Pressable
            key={String(item.key)}
            onPress={() => onSelect(item.key)}
            style={[styles.segmentBase, segmentStyle]}
          >
            <Text style={labelStyle}>{item.label}</Text>
          </Pressable>
        );
      })}
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
    <View style={styles.toggleRow}>
      <Text style={styles.bodyText}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
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
        {subtitle ? <Text style={styles.bodyMuted}>{subtitle}</Text> : null}
      </View>
      {trailing}
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
  const colorStyle = avatarStyleMap[colorKey](theme);

  return (
    <View style={[styles.avatar, colorStyle]}>
      <Text style={styles.avatarText}>{label.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

export function ColorSwatch({
  theme,
  colorKey,
  selected,
  onPress,
}: {
  theme: Theme;
  colorKey: EventColorKey;
  selected: boolean;
  onPress: () => void;
}) {
  const styles = createStyles(theme);
  const dotStyle = swatchStyleMap[colorKey](theme);
  const containerStyle = selected
    ? styles.swatchSelected
    : styles.swatchContainer;

  return (
    <Pressable onPress={onPress} style={[styles.swatchBase, containerStyle]}>
      <View style={[styles.swatchDot, dotStyle]} />
      <Text style={styles.bodyText}>{colorKey}</Text>
    </Pressable>
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

export function ModalSheet({
  theme,
  visible,
  title,
  onClose,
  children,
}: {
  theme: Theme;
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const styles = createStyles(theme);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Button
              theme={theme}
              label="Close"
              kind="ghost"
              onPress={onClose}
            />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function AppTabBar({
  theme,
  tabs,
  activeTab,
  onSelect,
}: {
  theme: Theme;
  tabs: { key: AppTab; label: string }[];
  activeTab: AppTab;
  onSelect: (key: AppTab) => void;
}) {
  const styles = createStyles(theme);

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => {
        const selected = activeTab === tab.key;
        const labelStyle = selected ? styles.tabLabelSelected : styles.tabLabel;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={styles.tabItem}
          >
            <Text style={labelStyle}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SettingsTabBar({
  theme,
  tabs,
  activeTab,
  onSelect,
}: {
  theme: Theme;
  tabs: { key: SettingsTab; label: string }[];
  activeTab: SettingsTab;
  onSelect: (key: SettingsTab) => void;
}) {
  const styles = createStyles(theme);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.settingsTabs}
      contentContainerStyle={styles.settingsTabsContent}
    >
      {tabs.map(tab => {
        const selected = tab.key === activeTab;
        const tabStyle = selected
          ? styles.settingsTabSelected
          : styles.settingsTab;
        const labelStyle = selected
          ? styles.settingsTabTextSelected
          : styles.settingsTabText;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={[styles.settingsTabBase, tabStyle]}
          >
            <Text style={labelStyle}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const avatarStyleMap = {
  blue: (theme: Theme) => ({ backgroundColor: theme.profileColors.blue }),
  pink: (theme: Theme) => ({ backgroundColor: theme.profileColors.pink }),
  green: (theme: Theme) => ({ backgroundColor: theme.profileColors.green }),
  amber: (theme: Theme) => ({ backgroundColor: theme.profileColors.amber }),
};

const swatchStyleMap = {
  blue: (theme: Theme) => ({ backgroundColor: theme.eventColors.blue }),
  pink: (theme: Theme) => ({ backgroundColor: theme.eventColors.pink }),
  green: (theme: Theme) => ({ backgroundColor: theme.eventColors.green }),
  amber: (theme: Theme) => ({ backgroundColor: theme.eventColors.amber }),
  red: (theme: Theme) => ({ backgroundColor: theme.eventColors.red }),
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },
    screenContent: {
      padding: 16,
      paddingBottom: 32,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      gap: 12,
    },
    sectionHeading: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
    },
    sectionSubtitle: {
      marginTop: 4,
      color: theme.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      gap: 10,
    },
    statCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
    },
    kicker: {
      color: theme.textMuted,
      textTransform: 'uppercase',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.6,
      marginBottom: 6,
    },
    statValue: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 4,
    },
    bodyText: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 21,
    },
    bodyMuted: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    emptyState: {
      backgroundColor: theme.surfaceMuted,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 6,
    },
    emptyTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: '700',
    },
    buttonBase: {
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPrimary: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    buttonSecondary: {
      backgroundColor: theme.surfaceMuted,
      borderColor: theme.border,
    },
    buttonGhost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      paddingHorizontal: 0,
      alignItems: 'flex-start',
    },
    buttonDanger: {
      backgroundColor: theme.danger,
      borderColor: theme.danger,
    },
    buttonPrimaryText: {
      color: theme.inverseText,
      fontWeight: '700',
      fontSize: 15,
    },
    buttonGhostText: {
      color: theme.accent,
      fontWeight: '700',
      fontSize: 15,
    },
    field: {
      marginBottom: 12,
    },
    inputBase: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      color: theme.text,
      borderRadius: 14,
      fontSize: 15,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    input: {
      minHeight: 48,
    },
    inputMultiline: {
      minHeight: 104,
      textAlignVertical: 'top',
    },
    fieldHelper: {
      marginTop: 6,
      color: theme.textMuted,
      fontSize: 12,
      lineHeight: 16,
    },
    segmented: {
      flexDirection: 'row',
      backgroundColor: theme.surfaceMuted,
      borderRadius: 16,
      padding: 4,
      gap: 4,
      marginBottom: 8,
    },
    segmentBase: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
    },
    segment: {
      backgroundColor: 'transparent',
    },
    segmentSelected: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
    },
    segmentText: {
      color: theme.textMuted,
      fontWeight: '700',
    },
    segmentTextSelected: {
      color: theme.text,
      fontWeight: '700',
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
      gap: 12,
    },
    listRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 8,
    },
    listContent: {
      flex: 1,
      gap: 4,
    },
    listTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '700',
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
      fontWeight: '800',
      fontSize: 14,
    },
    swatchBase: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1,
      marginBottom: 8,
    },
    swatchContainer: {
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    swatchSelected: {
      borderColor: theme.accent,
      backgroundColor: theme.accentSoft,
    },
    swatchDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.accentSoft,
      alignSelf: 'flex-start',
    },
    badgeText: {
      color: theme.accent,
      fontWeight: '700',
      fontSize: 12,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'flex-end',
      padding: 16,
    },
    modalCard: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      maxHeight: '82%',
      padding: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      gap: 12,
    },
    modalTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '800',
      flex: 1,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.tabBar,
      borderTopWidth: 1,
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
      fontWeight: '700',
    },
    tabLabelSelected: {
      color: theme.accent,
      fontSize: 12,
      fontWeight: '800',
    },
    settingsTabs: {
      marginBottom: 16,
    },
    settingsTabsContent: {
      gap: 8,
      paddingRight: 16,
    },
    settingsTabBase: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
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
      fontWeight: '700',
    },
    settingsTabTextSelected: {
      color: theme.accent,
      fontWeight: '800',
    },
  });
