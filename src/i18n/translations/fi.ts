import { TranslationShape } from './en';

export const fi = {
  common: {
    actions: {
      add: 'Lisää',
      apply: 'Käytä',
      cancel: 'Peruuta',
      close: 'Sulje',
      continue: 'Jatka',
      remove: 'Poista',
      save: 'Tallenna',
    },
    states: {
      unknown: 'Tuntematon',
    },
  },
  navigation: {
    home: 'Koti',
    expenses: 'Kulut',
    notes: 'Muistiinpanot',
    calendar: 'Kalenteri',
    tasks: 'Tehtävät',
    settings: 'Asetukset',
  },
  app: {
    fallbackGroupName: 'Ryhmä',
    headerSubtitle: 'Yhteinen suunnittelu pienelle luotetulle ryhmälle',
    lock: 'Lukitse',
  },
  auth: {
    accessTitle: 'Pääsy',
    signIn: 'Kirjaudu',
    createGroup: 'Luo ryhmä',
    acceptInvite: 'Hyväksy kutsu',
  },
  settings: {
    locale: {
      system: 'Järjestelmä',
      english: 'Englanti',
      finnish: 'Suomi',
    },
    currencyCode: 'Valuuttakoodi',
  },
  validation: {
    unexpectedError: 'Odottamaton virhe.',
  },
} as const satisfies TranslationShape;
