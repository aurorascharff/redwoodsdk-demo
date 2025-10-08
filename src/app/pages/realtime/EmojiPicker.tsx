'use client';

import { useEffect, useOptimistic, useTransition } from 'react';
import type { Theme } from '@/types/reaction';
import { cn } from '@/utils/cn';
import { themes } from './RealtimePage';
import { addReaction, setTheme } from './functions';

export function EmojiPicker({
  theme,
  currentThemeData,
  remainingCooldown = 0,
}: {
  theme: Theme;
  currentThemeData: (typeof themes)[keyof typeof themes];
  remainingCooldown?: number;
}) {
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(theme);
  const [isPending, startTransition] = useTransition();

  const changeThemeAction = (newTheme: Theme) => {
    startTransition(async () => {
      setOptimisticTheme(newTheme);
      await setTheme(newTheme);
    });
  };

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      const keyNum = parseInt(event.key);
      if (keyNum >= 1 && keyNum <= 9) {
        const emojiIndex = keyNum - 1;
        if (emojiIndex < currentThemeData.emojis.length) {
          await addReaction(currentThemeData.emojis[emojiIndex]);
        }
      }
      if (event.key.toLowerCase() === 't') {
        const newTheme = optimisticTheme === 'react' ? 'lasvegas' : 'react';
        changeThemeAction(newTheme);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [optimisticTheme, currentThemeData.emojis]);

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <div className="theme-selector-container">
        <span className="text-text-muted text-xs sm:text-sm">Theme:</span>
        {Object.entries(themes).map(([key, theme]) => {
          return (
            <ThemeButton
              key={key}
              themeKey={key as Theme}
              theme={theme}
              isActive={optimisticTheme === key}
              isDisabled={remainingCooldown > 0 || isPending}
              onThemeChange={changeThemeAction}
            />
          );
        })}
        <kbd className="theme-kbd">T{remainingCooldown > 0 ? ` (${remainingCooldown}s)` : ''}</kbd>
      </div>
      <div className={cn('emoji-grid-container', currentThemeData.colors, isPending && 'opacity-60 saturate-50')}>
        <div className={cn('emoji-grid-inner', isPending && 'dark:bg-surface-dark/60 bg-white/90')}>
          <div className="grid w-full grid-cols-4 gap-3 sm:hidden">
            {currentThemeData.emojis.map(emoji => {
              return (
                <button
                  key={emoji}
                  type="button"
                  disabled={isPending}
                  className="emoji-button"
                  onClick={() => {
                    return addReaction(emoji);
                  }}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            {currentThemeData.emojis.map((emoji, index) => {
              return (
                <button
                  key={emoji}
                  type="button"
                  disabled={isPending}
                  className="emoji-button-desktop"
                  onClick={() => {
                    return addReaction(emoji);
                  }}
                >
                  {emoji}
                  <span className="emoji-number-label">{index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ThemeButtonProps {
  themeKey: Theme;
  theme: (typeof themes)[keyof typeof themes];
  isActive: boolean;
  isDisabled: boolean;
  onThemeChange: (theme: Theme) => void;
}

function ThemeButton({ themeKey, theme, isActive, isDisabled, onThemeChange }: ThemeButtonProps) {
  return (
    <button
      onClick={() => {
        if (isActive || isDisabled) return;
        onThemeChange(themeKey);
      }}
      disabled={isDisabled}
      className={cn(
        'min-w-20 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all sm:min-w-24 sm:px-4 sm:py-2 sm:text-sm',
        'bg-background text-text-muted dark:bg-background-dark',
        isActive && 'cursor-default bg-gradient-to-r text-white shadow-lg',
        isActive && theme.colors,
        !isActive &&
          !isDisabled &&
          'hover:bg-accent/25 hover:text-text-dark dark:hover:bg-accent/20 hover:font-semibold dark:hover:text-white',
        isDisabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {theme.name}
    </button>
  );
}
