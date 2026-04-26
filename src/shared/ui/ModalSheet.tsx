import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/theme';
import { Button } from './Button';

export function ModalSheet({
  theme,
  visible,
  title,
  closeLabel,
  onClose,
  children,
}: {
  theme: Theme;
  visible: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const styles = createStyles(theme);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Button
              theme={theme}
              label={closeLabel}
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

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'flex-end',
      padding: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: theme.radius.xl,
      borderWidth: theme.borders.hairline,
      borderColor: theme.border,
      maxHeight: '82%',
      padding: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.md,
    },
    title: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '900',
      flex: 1,
    },
  });
