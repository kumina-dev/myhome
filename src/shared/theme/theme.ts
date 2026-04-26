import { ThemeMode } from "../../store/models";
import { borders } from "./borders";
import { darkColors, lightColors } from "./colors";
import { elevation } from "./elevation";
import { motion } from "./motion";
import { radius } from "./radius";
import { spacing } from "./spacing";
import { typography } from "./typography";

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
  profileColors: typeof lightColors.profileColors;
  eventColors: typeof lightColors.eventColors;
  spacing: typeof spacing;
  radius: typeof radius;
  borders: typeof borders;
  elevation: typeof elevation;
  motion: typeof motion;
  typography: typeof typography;
}

export function getTheme(mode: Exclude<ThemeMode, 'system'>): Theme {
  const colors = mode === 'dark' ? darkColors : lightColors;

  return {
    ...colors,
    spacing,
    radius,
    borders,
    elevation,
    motion,
    typography,
  };
}
