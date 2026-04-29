import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../shared/theme/theme';
import { useTranslation } from '../i18n';

export function SplashScreen({ theme }: { theme: Theme }) {
  const styles = createStyles(theme);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('app.brandName')}</Text>
      <Text style={styles.body}>{t('app.splashBody')}</Text>
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
