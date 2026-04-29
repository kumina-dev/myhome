import { EventColorKey, ProfileColorKey } from '../../store/models';

export interface ColorTokens {
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

export const lightColors: ColorTokens = {
  background: '#F5F1EA',
  backgroundElevated: '#E9E2D8',
  surface: '#FFFCF6',
  surfaceMuted: '#ECE5DA',
  surfaceStrong: '#D9CEC0',
  border: '#CEC2B4',
  text: '#211D19',
  textMuted: '#71675D',
  accent: '#3F7667',
  accentSoft: '#D8E8E1',
  success: '#577B57',
  warning: '#B5863D',
  danger: '#A3443E',
  tabBar: '#FCF7EF',
  overlay: 'rgba(33, 29, 25, 0.58)',
  inverseText: '#FFFCF6',
  calendarToday: '#DDE9DE',
  profileColors: {
    blue: '#3F7667',
    pink: '#A04C68',
    green: '#687A4A',
    amber: '#C49A45',
  },
  eventColors: {
    blue: '#4F6F6A',
    pink: '#A04C68',
    green: '#687A4A',
    amber: '#C49A45',
    red: '#A33A32',
  },
};

export const darkColors: ColorTokens = {
  background: '#171412',
  backgroundElevated: '#211D19',
  surface: '#26211C',
  surfaceMuted: '#302921',
  surfaceStrong: '#41372D',
  border: '#57493C',
  text: '#F5EDE2',
  textMuted: '#C5B6A5',
  accent: '#82B9A8',
  accentSoft: '#243F38',
  success: '#9CAF75',
  warning: '#D7B15B',
  danger: '#D0655B',
  tabBar: '#1F1A16',
  overlay: 'rgba(0, 0, 0, 0.72)',
  inverseText: '#171412',
  calendarToday: '#4A3A22',
  profileColors: {
    blue: '#7AA09A',
    pink: '#D7839D',
    green: '#9CAF75',
    amber: '#D7B15B',
  },
  eventColors: {
    blue: '#7AA09A',
    pink: '#D7839D',
    green: '#9CAF75',
    amber: '#D7B15B',
    red: '#D0655B',
  },
};
