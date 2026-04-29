type TranslationLeaf = string;

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
    roles: {
      owner: 'Owner',
      member: 'Member',
    },
    durations: {
      minutes: '{count} min',
      days: '{count} days',
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
    brandName: 'Circl',
    fallbackGroupName: 'Group',
    headerSubtitle: 'Private coordination for your trusted circle',
    splashBody:
      'Loading your shared home for plans, tasks, notes, and everyday decisions.',
    lock: 'Lock',
  },
  auth: {
    accessTitle: 'Access',
    signIn: 'Sign in',
    createGroup: 'Create group',
    acceptInvite: 'Accept invite',
    subtitle: 'Sign in, create a private group, or join one with an invite.',
    fields: {
      groupName: 'Group name',
      displayName: 'Display name',
      inviteCode: 'Invite code',
      email: 'Email',
      password: 'Password',
    },
    placeholders: {
      groupName: 'Home circle',
      displayName: 'June',
      inviteCode: 'GROUP-1234',
      email: 'you@example.com',
      password: 'Password',
    },
    validation: {
      createGroupRequired: 'Group name and display name are required.',
      inviteRequired: 'Invite code and display name are required.',
    },
    errors: {
      failed: 'Auth failed',
    },
    helper: {
      seededCredentials:
        'Seeded credentials for local testing: owner@northcircle.app / 1234.',
    },
  },
  appLock: {
    title: 'App lock',
    subtitle:
      'The session exists, but access still requires the local device lock.',
    fields: {
      pin: 'PIN',
    },
    helpers: {
      seededPin: 'Current seeded PIN: 2580',
      nativeBiometric:
        'Native biometric unlock is not wired in this in-memory build.',
    },
    actions: {
      unlock: 'Unlock',
      signOut: 'Sign out',
    },
    settings: {
      biometricUnlock: 'Biometric unlock',
    },
    errors: {
      unlockFailed: 'Unlock failed',
    },
  },
  expenses: {
    screen: {
      thisMonth: 'This month',
      total: 'Total',
      monthlySummaryHint: 'By category, by member, and recent activity',
      logPurchase: 'Log purchase',
      logPurchaseSubtitle:
        'Track shared purchases with clear amounts, dates, and categories.',
    },
    sections: {
      byCategory: 'By category',
      byMember: 'By member',
      recentExpenses: 'Recent expenses',
    },
    fields: {
      title: 'What was bought',
      amount: 'Amount',
      purchaseDate: 'Purchase date',
      notes: 'Notes',
    },
    placeholders: {
      title: 'Weekly groceries',
      amount: '84.20',
      notes: 'Optional context',
    },
    actions: {
      addExpense: 'Add expense',
    },
    validation: {
      invalidTitle: 'Invalid expense',
      invalidBody: 'Title and amount are required.',
    },
    empty: {
      noSpendingTitle: 'No spending yet',
      noSpendingBody:
        'Add the first purchase and the monthly view will start making sense.',
    },
  },
  notes: {
    screen: {
      title: 'Shared notes',
      subtitle: 'Pinned notes keep important plans and reminders visible.',
      currentNotes: 'Current notes',
    },
    fields: {
      title: 'Title',
      body: 'Body',
      pin: 'Pin this note',
    },
    placeholders: {
      title: 'Weekend plan',
      body: 'What everyone needs to know',
    },
    actions: {
      saveNote: 'Save note',
    },
    validation: {
      invalidTitle: 'Invalid note',
      invalidBody: 'Title and body are required.',
    },
    empty: {
      title: 'No notes yet',
      body: 'Create the first shared note for plans, shopping reminders, or things no one should need to ask twice.',
    },
  },
  home: {
    screen: {
      subtitle:
        'Private planning, spending, notes, and chores for trusted groups.',
      overview: 'Overview',
    },
    overview: {
      thisMonth: 'This month',
      thisMonthHint: 'Shared spending for the current month',
      pinnedNotes: 'Pinned notes',
      pinnedNotesHint: 'Visible priorities for everyone',
      cycleLeader: 'Cycle leader',
      noScoreYet: 'No score yet',
      pointsThisCycle: '{count} points this cycle',
      completeTasksToStart: 'Complete tasks to start',
    },
    notifications: {
      title: 'Notifications',
      markAllRead: 'Mark all read',
      emptyTitle: 'Quiet for now',
      emptyBody: 'No unread updates. A rare but welcome condition.',
      types: {
        event: 'Event',
        task: 'Task',
        note: 'Note',
        expense: 'Expense',
        group: 'Group',
      },
    },
    upcoming: {
      title: 'Upcoming',
      emptyTitle: 'No upcoming events',
      emptyBody:
        'Add plans, reminders, or important dates to keep the group coordinated.',
    },
  },
  tasks: {
    screen: {
      currentCycle: 'Current cycle',
      newTask: 'New task',
      newTaskSubtitle:
        'Shared and personal tasks stay together without forcing every routine into the same shape.',
      taskBoard: 'Task board',
    },
    fields: {
      title: 'Title',
      points: 'Points',
      dueDate: 'Due date',
    },
    placeholders: {
      title: 'Take out trash',
    },
    scopes: {
      shared: 'Shared',
      personal: 'Personal',
    },
    actions: {
      addTask: 'Add task',
      complete: 'Complete',
      undo: 'Undo',
    },
    labels: {
      sharedTask: 'Shared task',
      personalTask: 'Personal - {name}',
      points: '{count} points',
      due: 'due {date}',
      completed: 'Completed {date}',
    },
    validation: {
      invalidTitle: 'Invalid task',
      invalidBody: 'Title and positive points are required.',
    },
    empty: {
      title: 'No tasks yet',
      body: 'Add the first shared or personal task to make the score cycle do something useful.',
    },
    scoreboard: {
      previousCycle: 'Previous cycle',
      cycleStarted: 'Cycle started {date}',
      previousScoringWindow: 'Previous scoring window',
    },
  },
  settings: {
    screen: {
      title: 'Settings',
      subtitle: 'Detailed controls for the way your group uses Circl.',
    },
    tabs: {
      account: 'Account',
      group: 'Group',
      notifications: 'Notifications',
      appearance: 'Appearance',
      calendar: 'Calendar',
      tasks: 'Tasks & Scores',
      categories: 'Categories',
      security: 'Security',
    },
    locale: {
      system: 'System',
      english: 'English',
      finnish: 'Finnish',
    },
    currencyCode: 'Currency code',
    appearance: {
      theme: 'Theme',
      language: 'Language',
      defaultTab: 'Default tab',
      light: 'Light',
      dark: 'Dark',
      currencyPlaceholder: 'EUR',
    },
    group: {
      members: 'Members',
      groupName: 'Group name',
      groupNameHelper:
        'Covers family, flatmates, close friends, and other private groups.',
      makeOwner: 'Make owner',
      makeMember: 'Make member',
      removeMemberTitle: 'Remove member',
      removeMemberBody: 'Remove {name} from the group?',
      inviteMember: 'Invite member',
      nameHint: 'Name hint',
      inviteEmailPlaceholder: 'friend@example.com',
      createInvite: 'Create invite',
      pendingInvites: 'Pending invites',
      code: 'Code: {code}',
      hint: 'Hint: {hint}',
      noHint: 'none',
      revokeInvite: 'Revoke invite',
    },
    categories: {
      title: 'Expense categories',
      newCategory: 'New category',
      newCategoryPlaceholder: 'Pets',
      addCategory: 'Add category',
    },
    notifications: {
      eventReminders: 'Event reminders',
      taskReminders: 'Task reminders',
      noteAlerts: 'Shared note alerts',
      expenseAlerts: 'Expense activity',
      sharedTaskBroadcasts: 'Shared task broadcasts',
    },
    security: {
      enableAppLock: 'Enable app lock',
      enableBiometricUnlock: 'Enable biometric unlock',
      appPin: 'App PIN',
      lockAfter: 'Lock after',
    },
    tasks: {
      title: 'Tasks and scoring',
      scoreCycle: 'Score cycle',
      showCompletedTasks: 'Show completed tasks',
      showPersonalTasksOnHome: 'Show personal tasks on Home',
    },
  },
  validation: {
    unexpectedError: 'Unexpected error.',
    requiredText: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    invalidCurrencyCode: 'Use a three-letter currency code.',
    invalidPin: 'PIN must be 4-6 digits.',
    invalidTimeTitle: 'Invalid time',
    invalidTimeBody: 'Use a valid 24-hour time.',
  },
  calendar: {
    validation: {
      invalidEvent: 'Invalid event',
      invalidTimeRange: 'Invalid time range',
      endAfterStart: 'End time must be after the start time.',
    },
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
      weekStartsOn: 'Week starts on',
      defaultEventColor: 'Default event color',
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
      full: {
        monday: 'Monday',
        sunday: 'Sunday',
      },
    },
  },
} as const;

type WidenTranslationLeaves<T> = T extends string
  ? TranslationLeaf
  : {
      readonly [K in keyof T]: WidenTranslationLeaves<T[K]>;
    };

export type TranslationShape = WidenTranslationLeaves<typeof en>;
