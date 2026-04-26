import React from 'react';
import { Theme } from '../../shared/theme/theme';
import { Card } from '../../shared/ui/Card';
import { Screen } from '../../shared/ui/Screen';
import { Section } from '../../shared/ui/Section';
import { useAppStore } from '../../store/store';
import { useTranslation } from '../../i18n';
import { AuthForm } from './AuthForm';

export function AuthScreen({ theme }: { theme: Theme }) {
  const { authMode, setAuthMode, signIn, createGroupOwner, acceptInvite } =
    useAppStore();

  const { t } = useTranslation();

  return (
    <Screen theme={theme}>
      <Section
        theme={theme}
        title={t('auth.accessTitle')}
        subtitle="Private app, invited members, and an actual path through the flow instead of guesswork."
      >
        <Card theme={theme}>
          <AuthForm
            theme={theme}
            authMode={authMode}
            onAuthModeChange={setAuthMode}
            onSignIn={signIn}
            onCreateGroup={createGroupOwner}
            onAcceptInvite={acceptInvite}
          />
        </Card>
      </Section>
    </Screen>
  );
}
