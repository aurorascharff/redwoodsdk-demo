export type Theme = 'lasvegas' | 'react';

export interface ThemeState {
  currentTheme: Theme;
  lastChanged: number;
  remainingCooldown?: number;
}

export interface Reaction {
  emoji: string;
  id: string;
  timestamp: number;
}
