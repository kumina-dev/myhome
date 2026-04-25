import { EventColorKey, ProfileColorKey, ThemeMode } from '../store/models';

export interface Theme {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceMuted: string;
  surfaceStrong: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  success: string;
  warning: string;
  danger: string;
  tabBar: string;
  overlay: string;
  inverseText: string;
  calendarToday: string;
  profileColors: Record<ProfileColorKey, string>;
  eventColors: Record<EventColorKey, string>;
}

const lightTheme: Theme = {
  background: '#F2F5FB',
  backgroundElevated: '#E7EDF8',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF3FA',
  surfaceStrong: '#DDE7F5',
  border: '#D1DBEA',
  text: '#112033',
  textMuted: '#5C6D86',
  accent: '#0F62FE',
  accentSoft: '#DBE8FF',
  success: '#047857',
  warning: '#B45309',
  danger: '#C2410C',
  tabBar: '#FBFCFE',
  overlay: 'rgba(10, 16, 26, 0.55)',
  inverseText: '#FFFFFF',
  calendarToday: '#E0EBFF',
  profileColors: {
    blue: '#2563EB',
    pink: '#DB2777',
    green: '#059669',
    amber: '#D97706',
  },
  eventColors: {
    blue: '#2563EB',
    pink: '#DB2777',
    green: '#059669',
    amber: '#D97706',
    red: '#DC2626',
  },
};

const darkTheme: Theme = {
  background: '#0B1220',
  backgroundElevated: '#111B2D',
  surface: '#152033',
  surfaceMuted: '#1B2940',
  surfaceStrong: '#24344F',
  border: '#334863',
  text: '#E7EEF8',
  textMuted: '#9DAFD0',
  accent: '#60A5FA',
  accentSoft: '#1B3C67',
  success: '#34D399',
  warning: '#FDBA74',
  danger: '#FB7185',
  tabBar: '#10192A',
  overlay: 'rgba(0, 0, 0, 0.72)',
  inverseText: '#FFFFFF',
  calendarToday: '#173359',
  profileColors: {
    blue: '#60A5FA',
    pink: '#F472B6',
    green: '#34D399',
    amber: '#FBBF24',
  },
  eventColors: {
    blue: '#60A5FA',
    pink: '#F472B6',
    green: '#34D399',
    amber: '#FBBF24',
    red: '#FB7185',
  },
};

export function getTheme(mode: Exclude<ThemeMode, 'system'>): Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
