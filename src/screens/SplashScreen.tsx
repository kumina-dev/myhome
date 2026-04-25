import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/theme';

export function SplashScreen({ theme }: { theme: Theme }) {
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>North Circle</Text>
      <Text style={styles.body}>
        Loading a private group workspace that behaves like a real app instead
        of a stack of loose notes.
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      gap: 12,
    },
    title: {
      color: theme.text,
      fontSize: 30,
      fontWeight: '900',
    },
    body: {
      color: theme.textMuted,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
    },
  });
