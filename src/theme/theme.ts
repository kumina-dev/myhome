export interface Theme {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  success: string;
  warning: string;
  danger: string;
  tabBar: string;
}

const lightTheme: Theme = {
  background: '#F4F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF2F8',
  border: '#D7DFEA',
  text: '#142033',
  textMuted: '#5C6C85',
  accent: '#1D4ED8',
  accentSoft: '#DBEAFE',
  success: '#047857',
  warning: '#B45309',
  danger: '#B91C1C',
  tabBar: '#FFFFFF',
};

const darkTheme: Theme = {
  background: '#0F172A',
  surface: '#162033',
  surfaceMuted: '#1E293B',
  border: '#314155',
  text: '#E5EEF9',
  textMuted: '#9FB0C8',
  accent: '#60A5FA',
  accentSoft: '#1E3A5F',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  tabBar: '#111A2D',
};

export function getTheme(mode: 'light' | 'dark'): Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
