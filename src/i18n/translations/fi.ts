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
    roles: {
      owner: 'Omistaja',
      member: 'Jäsen',
    },
    durations: {
      minutes: '{count} min',
      days: '{count} päivää',
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
    brandName: 'Circl',
    fallbackGroupName: 'Ryhmä',
    headerSubtitle: 'Yhteinen suunnittelu pienelle luotetulle ryhmälle',
    splashBody:
      'Ladataan yhteistä paikkaa suunnitelmille, tehtäville, muistiinpanoille ja arjen päätöksille.',
    lock: 'Lukitse',
  },
  auth: {
    accessTitle: 'Pääsy',
    signIn: 'Kirjaudu',
    createGroup: 'Luo ryhmä',
    acceptInvite: 'Hyväksy kutsu',
    subtitle: 'Yksityinen sovellus kutsutuille jäsenille ja selkeä reitti sisäänkirjautumiseen.',
    fields: {
      groupName: 'Ryhmän nimi',
      displayName: 'Näyttönimi',
      inviteCode: 'Kutsukoodi',
      email: 'Sähköposti',
      password: 'Salasana',
    },
    placeholders: {
      groupName: 'Koti piiri',
      displayName: 'June',
      inviteCode: 'GROUP-1234',
      email: 'sinä@example.com',
      password: 'Salasana',
    },
    validation: {
      createGroupRequired: 'Ryhmän nimi ja näyttönimi vaaditaan.',
      inviteRequired: 'Kutsukoodi ja näyttönimi vaaditaan.',
    },
    errors: {
      failed: 'Kirjautuminen epäonnistui',
    },
  },
  appLock: {
    title: 'Sovelluslukko',
    subtitle: 'Istunto on olemassa, mutta käyttö vaatii paikallisen lukituksen.',
    fields: {
      pin: 'PIN',
    },
    helpers: {
      seededPin: 'Nykyinen testauksen PIN: 2580',
      nativeBiometric: 'Biometristä avausta ei ole kytketty tässä muistissa toimivassa versiossa.',
    },
    actions: {
      unlock: 'Avaa',
      signOut: 'Kirjaudu ulos',
    },
    settings: {
      biometricUnlock: 'Biometrinen avaus',
    },
    errors: {
      unlockFailed: 'Avaus epäonnistui',
    },
  },
  expenses: {
    screen: {
      thisMonth: 'Tämä kuukausi',
      total: 'Yhteensä',
      monthlySummaryHint: 'Kategorioittain, jäsenittäin ja viimeisimmän toiminnan mukaan',
      logPurchase: 'Kirjaa ostos',
      logPurchaseSubtitle: 'Rakenteiset kentät voittavat epämääräiset vapaatekstit.',
    },
    sections: {
      byCategory: 'Kategorioittain',
      byMember: 'Jäsenittäin',
      recentExpenses: 'Viimeisimmät kulut',
    },
    fields: {
      title: 'Mitä ostettiin',
      amount: 'Summa',
      purchaseDate: 'Ostopäivä',
      notes: 'Muistiinpanot',
    },
    placeholders: {
      title: 'Viikon ruokaostokset',
      amount: '84.20',
      notes: 'Valinnainen lisätieto',
    },
    actions: {
      addExpense: 'Lisää kulu',
    },
    validation: {
      invalidTitle: 'Virheellinen kulu',
      invalidBody: 'Otsikko ja summa vaaditaan.',
    },
    empty: {
      noSpendingTitle: 'Ei kuluja vielä',
      noSpendingBody: 'Lisää ensimmäinen ostos, niin kuukausinäkymä alkaa olla hyödyllinen.',
    },
  },
  notes: {
    screen: {
      title: 'Yhteiset muistiinpanot',
      subtitle: 'Kiinnitetyt muistiinpanot pysyvät näkyvillä. Muut löytyvät silti helposti.',
      currentNotes: 'Nykyiset muistiinpanot',
    },
    fields: {
      title: 'Otsikko',
      body: 'Sisältö',
      pin: 'Kiinnitä tämä muistiinpano',
    },
    placeholders: {
      title: 'Viikonlopun suunnitelma',
      body: 'Mitä kaikkien pitää tietää',
    },
    actions: {
      saveNote: 'Tallenna muistiinpano',
    },
    validation: {
      invalidTitle: 'Virheellinen muistiinpano',
      invalidBody: 'Otsikko ja sisältö vaaditaan.',
    },
    empty: {
      title: 'Ei muistiinpanoja vielä',
      body: 'Luo ensimmäinen yhteinen muistiinpano suunnitelmille, ostosmuistutuksille tai muille tärkeille asioille.',
    },
  },
  home: {
    screen: {
      subtitle: 'Yksityinen ryhmän suunnittelu, kulut ja tehtävät ilman turhaa säätöä.',
      overview: 'Yhteenveto',
    },
    overview: {
      thisMonth: 'Tämä kuukausi',
      thisMonthHint: 'Ryhmän kulut nykyiseltä kuukaudelta',
      pinnedNotes: 'Kiinnitetyt muistiinpanot',
      pinnedNotesHint: 'Kaikille näkyvät tärkeimmät asiat',
      cycleLeader: 'Jakson johtaja',
      noScoreYet: 'Ei pisteitä vielä',
      pointsThisCycle: '{count} pistettä tässä jaksossa',
      completeTasksToStart: 'Aloita suorittamalla tehtäviä',
    },
    notifications: {
      title: 'Ilmoitukset',
      markAllRead: 'Merkitse kaikki luetuiksi',
      emptyTitle: 'Hiljaista nyt',
      emptyBody: 'Ei lukemattomia päivityksiä.',
      types: {
        event: 'Tapahtuma',
        task: 'Tehtävä',
        note: 'Muistiinpano',
        expense: 'Kulu',
        group: 'Ryhmä',
      },
    },
    upcoming: {
      title: 'Tulossa',
      emptyTitle: 'Ei tulevia tapahtumia',
      emptyBody: 'Lisää suunnitelmia, muistutuksia tai tärkeitä päivämääriä ryhmän koordinointiin.',
    },
  },
  tasks: {
    screen: {
      currentCycle: 'Nykyinen jakso',
      newTask: 'Uusi tehtävä',
      newTaskSubtitle:
        'Yhteiset ja henkilökohtaiset tehtävät ovat samassa järjestelmässä ilman turhaa raskautta.',
      taskBoard: 'Tehtävätaulu',
    },
    fields: {
      title: 'Otsikko',
      points: 'Pisteet',
      dueDate: 'Määräpäivä',
    },
    placeholders: {
      title: 'Vie roskat',
    },
    scopes: {
      shared: 'Yhteinen',
      personal: 'Henkilökohtainen',
    },
    actions: {
      addTask: 'Lisää tehtävä',
      complete: 'Valmis',
      undo: 'Kumoa',
    },
    labels: {
      sharedTask: 'Yhteinen tehtävä',
      personalTask: 'Henkilökohtainen - {name}',
      points: '{count} pistettä',
      due: 'määräpäivä {date}',
      completed: 'Valmis {date}',
    },
    validation: {
      invalidTitle: 'Virheellinen tehtävä',
      invalidBody: 'Otsikko ja positiiviset pisteet vaaditaan.',
    },
    empty: {
      title: 'Ei tehtäviä vielä',
      body: 'Lisää ensimmäinen yhteinen tai henkilökohtainen tehtävä, jotta pistejakso tekee jotain hyödyllistä.',
    },
    scoreboard: {
      previousCycle: 'Edellinen jakso',
      cycleStarted: 'Jakso alkoi {date}',
      previousScoringWindow: 'Edellinen pisteytysjakso',
    },
  },
  settings: {
    screen: {
      title: 'Asetukset',
      subtitle: 'Riittävän kattavat asetukset ilman turhaa monimutkaisuutta.',
    },
    tabs: {
      account: 'Tili',
      group: 'Ryhmä',
      notifications: 'Ilmoitukset',
      appearance: 'Ulkoasu',
      calendar: 'Kalenteri',
      tasks: 'Tehtävät ja pisteet',
      categories: 'Kategoriat',
      security: 'Turvallisuus',
    },
    locale: {
      system: 'Järjestelmä',
      english: 'Englanti',
      finnish: 'Suomi',
    },
    currencyCode: 'Valuuttakoodi',
    appearance: {
      theme: 'Teema',
      language: 'Kieli',
      defaultTab: 'Oletusvälilehti',
      light: 'Vaalea',
      dark: 'Tumma',
      currencyPlaceholder: 'EUR',
    },
    group: {
      members: 'Jäsenet',
      groupName: 'Ryhmän nimi',
      groupNameHelper:
        'Sopii perheille, kämppiksille, läheisille ystäville ja muille yksityisille ryhmille.',
      makeOwner: 'Tee omistajaksi',
      makeMember: 'Tee jäseneksi',
      removeMemberTitle: 'Poista jäsen',
      removeMemberBody: 'Poistetaanko {name} ryhmästä?',
      inviteMember: 'Kutsu jäsen',
      nameHint: 'Nimivihje',
      inviteEmailPlaceholder: 'kaveri@example.com',
      createInvite: 'Luo kutsu',
      pendingInvites: 'Odottavat kutsut',
      code: 'Koodi: {code}',
      hint: 'Vihje: {hint}',
      noHint: 'ei mitään',
      revokeInvite: 'Peru kutsu',
    },
    categories: {
      title: 'Kulu kategoriat',
      newCategory: 'Uusi kategoria',
      newCategoryPlaceholder: 'Lemmikit',
      addCategory: 'Lisää kategoria',
    },
    notifications: {
      eventReminders: 'Tapahtumamuistutukset',
      taskReminders: 'Tehtävämuistutukset',
      noteAlerts: 'Yhteisten muistiinpanojen ilmoitukset',
      expenseAlerts: 'Kulutapahtumat',
      sharedTaskBroadcasts: 'Yhteisten tehtävien ilmoitukset',
    },
    security: {
      enableAppLock: 'Ota sovelluslukko käyttöön',
      enableBiometricUnlock: 'Ota biometrinen avaus käyttöön',
      appPin: 'Sovelluksen PIN',
      lockAfter: 'Lukitse ajan jälkeen',
    },
    tasks: {
      title: 'Tehtävät ja pisteytys',
      scoreCycle: 'Pistejakso',
      showCompletedTasks: 'Näytä valmiit tehtävät',
      showPersonalTasksOnHome: 'Näytä henkilökohtaiset tehtävät etusivulla',
    },
  },
  validation: {
    unexpectedError: 'Odottamaton virhe.',
    requiredText: 'Tämä kenttä vaaditaan.',
    invalidEmail: 'Anna kelvollinen sähköpostiosoite.',
    invalidCurrencyCode: 'Käytä kolmikirjaimista valuuttakoodia.',
    invalidPin: 'PIN-koodin pitää olla 4-6 numeroa.',
    invalidTimeTitle: 'Virheellinen aika',
    invalidTimeBody: 'Käytä kelvollista 24 tunnin aikaa.',
  },
  calendar: {
    validation: {
      invalidEvent: 'Virheellinen tapahtuma',
      invalidTimeRange: 'Virheellinen aikaväli',
      endAfterStart: 'Loppuajan pitää olla alkuajan jälkeen.',
    },
    screen: {
      title: 'Yhteinen kalenteri',
      subtitle: 'Kuukausinäkymä kokonaisuuteen ja agenda selkeään arjen seurantaan.',
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
      weekStartsOn: 'Viikko alkaa',
      defaultEventColor: 'Tapahtuman oletusväri',
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
      full: {
        monday: 'Maanantai',
        sunday: 'Sunnuntai',
      },
    },
  },
} as const satisfies TranslationShape;
