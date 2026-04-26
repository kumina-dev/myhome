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
  background: '#F7F2EA',
  backgroundElevated: '#EEE5D8',
  surface: '#FFFDF8',
  surfaceMuted: '#F1E8DA',
  surfaceStrong: '#E2D4C1',
  border: '#D7C7B3',
  text: '#241D18',
  textMuted: '#75685D',
  accent: '#B65A3C',
  accentSoft: '#F1D7C8',
  success: '#687A4A',
  warning: '#C49A45',
  danger: '#A33A32',
  tabBar: '#FFF9F0',
  overlay: 'rgba(36, 29, 24, 0.58)',
  inverseText: '#FFFDF8',
  calendarToday: '#EAD9BA',
  profileColors: {
    blue: '#4F6F6A',
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
  accent: '#D9825F',
  accentSoft: '#523123',
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
