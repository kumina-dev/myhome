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
    calendar: {
      previous: 'Edellinen',
      today: 'Tänään',
      next: 'Seuraava',
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
  calendar: {
    screen: {
      title: 'Yhteinen kalenteri',
      subtitle:
        'Kuukausinäkymä kokonaisuuteen ja agenda selkeään arjen seurantaan.',
      currentGroup: 'Nykyinen ryhmä: {groupName}',
      eventsOn: 'Tapahtumat päivänä {date}',
    },
    actions: {
      addEvent: 'Lisää tapahtuma',
      saveEvent: 'Tallenna tapahtuma',
      viewDetails: 'Näytä tiedot',
      applyTime: 'Käytä aikaa',
    },
    views: {
      month: 'Kuukausi',
      agenda: 'Agenda',
    },
    fields: {
      title: 'Otsikko',
      startDate: 'Alkupäivä',
      startTime: 'Alkuaika',
      endDate: 'Loppupäivä',
      endTime: 'Loppuaika',
      eventColorValue: 'Tapahtuman väri: {value}',
      chooseEventColor: 'Valitse tapahtuman väri',
      notes: 'Muistiinpanot',
      hour: 'Tunti',
      minute: 'Minuutti',
    },
    placeholders: {
      title: 'Illallinen vanhempien kanssa',
      notes: 'Valinnainen muistutuksen lisätieto',
    },
    helpers: {
      hour: 'Käytä arvoa 00-23',
      minute: 'Käytä arvoa 00, 15, 30 tai 45 järkevään aikataulutukseen.',
    },
    empty: {
      dayTitle: 'Ei aikataulua',
      dayBody:
        'Valitse päivä tai lisää tapahtuma, jotta yhteisestä kalenterista tulee hyödyllinen.',
      agendaTitle: 'Agenda on tyhjä',
      agendaBody: 'Lisää ensimmäinen tapahtuma, niin agenda alkaa näyttää sisältöä.',
    },
    eventDetails: {
      title: 'Tapahtuman tiedot',
    },
    eventColors: {
      blue: 'Sininen',
      pink: 'Pinkki',
      green: 'Vihreä',
      amber: 'Meripihka',
      red: 'Punainen',
    },
    weekdays: {
      narrow: {
        monday: 'M',
        tuesday: 'T',
        wednesday: 'K',
        thursday: 'T',
        friday: 'P',
        saturday: 'L',
        sunday: 'S',
      },
      short: {
        monday: 'MA',
        tuesday: 'TI',
        wednesday: 'KE',
        thursday: 'TO',
        friday: 'PE',
        saturday: 'LA',
        sunday: 'SU',
      },
    },
  },
} as const satisfies TranslationShape;
