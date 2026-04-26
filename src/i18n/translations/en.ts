export const en = {
  common: {
    actions: {
      add: 'Add',
      apply: 'Apply',
      cancel: 'Cancel',
      close: 'Close',
      continue: 'Continue',
      remove: 'Remove',
      save: 'Save',
    },
    states: {
      unknown: 'Unknown',
    },
  },
  navigation: {
    home: 'Home',
    expenses: 'Expenses',
    notes: 'Notes',
    calendar: 'Calendar',
    tasks: 'Tasks',
    settings: 'Settings',
  },
  app: {
    fallbackGroupName: 'Group',
    headerSubtitle: 'Shared planning for a small trusted group',
    lock: 'Lock',
  },
  auth: {
    accessTitle: 'Access',
    signIn: 'Sign in',
    createGroup: 'Create group',
    acceptInvite: 'Accept invite',
  },
  settings: {
    locale: {
      system: 'System',
      english: 'English',
      finnish: 'Finnish',
    },
    currencyCode: 'Currency code',
  },
  validation: {
    unexpectedError: 'Unexpected error.',
  },
} as const;

type TranslationLeaf = string;
export type TranslationShape = {
  common: {
    actions: {
      add: TranslationLeaf;
      apply: TranslationLeaf;
      cancel: TranslationLeaf;
      close: TranslationLeaf;
      continue: TranslationLeaf;
      remove: TranslationLeaf;
      save: TranslationLeaf;
    };
    states: {
      unknown: TranslationLeaf;
    };
  };
  navigation: Record<
    'home' | 'expenses' | 'notes' | 'calendar' | 'tasks' | 'settings',
    TranslationLeaf
  >;
  app: Record<'fallbackGroupName' | 'headerSubtitle' | 'lock', TranslationLeaf>;
  auth: Record<
    'accessTitle' | 'signIn' | 'createGroup' | 'acceptInvite',
    TranslationLeaf
  >;
  settings: {
    locale: Record<'system' | 'english' | 'finnish', TranslationLeaf>;
    currencyCode: TranslationLeaf;
  };
  validation: Record<'unexpectedError', TranslationLeaf>;
};
