export type Theme = 'lasvegas' | 'react';

export type ThemeState = {
  currentTheme: Theme;
  lastChanged: number;
  remainingCooldown?: number;
};

export type Reaction = {
  emoji: string;
  id: string;
  timestamp: number;
};
