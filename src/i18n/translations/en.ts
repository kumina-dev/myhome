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
    calendar: {
      previous: 'Previous',
      today: 'Today',
      next: 'Next',
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
  calendar: {
    screen: {
      title: 'Shared calendar',
      subtitle:
        'Month view for context, agenda for clarity, and no one has to reverse-engineer date strings.',
      currentGroup: 'Current group: {groupName}',
      eventsOn: 'Events on {date}',
    },
    actions: {
      addEvent: 'Add event',
      saveEvent: 'Save event',
      viewDetails: 'View details',
      applyTime: 'Apply time',
    },
    views: {
      month: 'Month',
      agenda: 'Agenda',
    },
    fields: {
      title: 'Title',
      startDate: 'Start date',
      startTime: 'Start time',
      endDate: 'End date',
      endTime: 'End time',
      eventColorValue: 'Event color: {value}',
      chooseEventColor: 'Choose event color',
      notes: 'Notes',
      hour: 'Hour',
      minute: 'Minute',
    },
    placeholders: {
      title: 'Dinner with parents',
      notes: 'Optional reminder context',
    },
    helpers: {
      hour: 'Use 00-23',
      minute: 'Use 00, 15, 30, or 45 for sane scheduling.',
    },
    empty: {
      dayTitle: 'Nothing scheduled',
      dayBody:
        'Select a day or add an event to start building a usable shared calendar.',
      agendaTitle: 'Agenda is empty',
      agendaBody:
        'Add the first event and the agenda view will start doing actual work.',
    },
    eventDetails: {
      title: 'Event details',
    },
    eventColors: {
      blue: 'Blue',
      pink: 'Pink',
      green: 'Green',
      amber: 'Amber',
      red: 'Red',
    },
    weekdays: {
      narrow: {
        monday: 'M',
        tuesday: 'T',
        wednesday: 'W',
        thursday: 'T',
        friday: 'F',
        saturday: 'S',
        sunday: 'S',
      },
      short: {
        monday: 'MON',
        tuesday: 'TUE',
        wednesday: 'WED',
        thursday: 'THU',
        friday: 'FRI',
        saturday: 'SAT',
        sunday: 'SUN',
      },
    },
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
    calendar: {
      previous: TranslationLeaf;
      today: TranslationLeaf;
      next: TranslationLeaf;
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
  calendar: {
    screen: Record<
      'title' | 'subtitle' | 'currentGroup' | 'eventsOn',
      TranslationLeaf
    >;
    actions: Record<
      'addEvent' | 'saveEvent' | 'viewDetails' | 'applyTime',
      TranslationLeaf
    >;
    views: Record<'month' | 'agenda', TranslationLeaf>;
    fields: Record<
      | 'title'
      | 'startDate'
      | 'startTime'
      | 'endDate'
      | 'endTime'
      | 'eventColorValue'
      | 'chooseEventColor'
      | 'notes'
      | 'hour'
      | 'minute',
      TranslationLeaf
    >;
    placeholders: Record<'title' | 'notes', TranslationLeaf>;
    helpers: Record<'hour' | 'minute', TranslationLeaf>;
    empty: Record<
      'dayTitle' | 'dayBody' | 'agendaTitle' | 'agendaBody',
      TranslationLeaf
    >;
    eventDetails: Record<'title', TranslationLeaf>;
    eventColors: Record<
      'blue' | 'pink' | 'green' | 'amber' | 'red',
      TranslationLeaf
    >;
    weekdays: {
      narrow: Record<
        | 'monday'
        | 'tuesday'
        | 'wednesday'
        | 'thursday'
        | 'friday'
        | 'saturday'
        | 'sunday',
        TranslationLeaf
      >;
      short: Record<
        | 'monday'
        | 'tuesday'
        | 'wednesday'
        | 'thursday'
        | 'friday'
        | 'saturday'
        | 'sunday',
        TranslationLeaf
      >;
    };
  };
};
