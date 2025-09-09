'use client';

import { useState, useEffect } from 'react';
import { addReaction } from './functions';

export type Theme = 'lasvegas' | 'react';

export const themes = {
  lasvegas: {
    colors: 'from-yellow-400 to-red-600',
    description: 'What happens in Vegas...',
    emojis: ['🎰', '🎲', '🃏', '💎', '🎯', '🎊', '💸', '🏆', '🔥'],
    name: 'Las Vegas',
  },
  react: {
    colors: 'from-blue-400 to-cyan-600',
    description: 'Build amazing UIs',
    emojis: ['⚛️', '🚀', '💙', '🔥', '⚡', '🧪', '🎯', '💻', '🛠️'],
    name: 'React',
  },
} as const;

export function EmojiPicker({ onThemeChange }: { onThemeChange?: (theme: Theme) => void }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('react');
  const currentThemeData = themes[currentTheme];

  useEffect(() => {
    onThemeChange?.(currentTheme);
  }, [currentTheme, onThemeChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyNum = parseInt(event.key);
      if (keyNum >= 1 && keyNum <= 9) {
        const emojiIndex = keyNum - 1;
        if (emojiIndex < currentThemeData.emojis.length) {
          addReaction(currentThemeData.emojis[emojiIndex]);
        }
      }
      if (event.key.toLowerCase() === 't') {
        const newTheme = currentTheme === 'react' ? 'lasvegas' : 'react';
        setCurrentTheme(newTheme);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentTheme, currentThemeData.emojis]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Theme Selector */}
      <div className="bg-surface border-border dark:bg-surface-dark dark:border-border-dark flex items-center gap-4 rounded-full border px-6 py-2">
        <span className="text-text-muted text-sm">Theme:</span>
        {Object.entries(themes).map(([key, theme]) => {
          return (
            <button
              key={key}
              onClick={() => {
                return setCurrentTheme(key as Theme);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                currentTheme === key
                  ? `bg-gradient-to-r ${theme.colors} text-white shadow-lg`
                  : 'bg-background text-text-muted hover:bg-accent/10 dark:bg-background-dark'
              }`}
            >
              {theme.name}
            </button>
          );
        })}
        <kbd className="text-text-muted bg-background border-border dark:bg-background-dark dark:border-border-dark rounded border px-2 py-1 text-xs">
          T
        </kbd>
      </div>
      <div
        className={`relative flex items-center justify-center gap-4 overflow-visible rounded-2xl bg-gradient-to-r ${currentThemeData.colors} p-1`}
      >
        <div className="bg-surface/95 dark:bg-surface-dark/95 flex items-center gap-4 rounded-xl px-6 py-4 backdrop-blur-sm">
          {currentThemeData.emojis.map((emoji, index) => {
            return (
              <div
                key={emoji}
                className="group relative flex cursor-pointer flex-col items-center text-4xl transition-transform hover:scale-125"
                onClick={() => {
                  return addReaction(emoji);
                }}
              >
                {emoji}
                <span className="bg-text/70 text-background mt-1 rounded px-1.5 py-0.5 text-xs">{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-text-muted text-center text-sm">
        {currentThemeData.description} • Press 1-9 or click to react
      </p>
    </div>
  );
}
