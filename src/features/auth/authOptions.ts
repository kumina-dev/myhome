import { TranslationKey } from '../../i18n';
import { AuthFlowMode } from '../../store/models';

export const authOptions: { key: AuthFlowMode; labelKey: TranslationKey }[] = [
  { key: 'sign-in', labelKey: 'auth.signIn' },
  { key: 'create-group', labelKey: 'auth.createGroup' },
  { key: 'accept-invite', labelKey: 'auth.acceptInvite' },
];
