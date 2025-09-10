'use client';

import { startTransition, useEffect, useOptimistic, useTransition } from 'react';
import type { Theme } from '@/reactionsDurableObject';
import { cn } from '@/utils/cn';
import { themes } from './Reactions';
import { addReaction, setTheme } from './functions';

export function EmojiPicker({
  theme,
  currentThemeData,
  remainingCooldown = 0,
}: {
  theme: Theme;
  currentThemeData: (typeof themes)[Theme];
  remainingCooldown?: number;
}) {
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(theme);
  const [isPending, startThemeTransition] = useTransition();

  const handleThemeChange = async (newTheme: Theme) => {
    if (isPending || remainingCooldown > 0) return;

    startThemeTransition(async () => {
      setOptimisticTheme(newTheme);
      await setTheme(newTheme);
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyNum = parseInt(event.key);
      if (keyNum >= 1 && keyNum <= 9) {
        const emojiIndex = keyNum - 1;
        if (emojiIndex < currentThemeData.emojis.length) {
          startTransition(async () => {
            await addReaction(currentThemeData.emojis[emojiIndex]);
          });
        }
      }
      if (event.key.toLowerCase() === 't') {
        const newTheme = optimisticTheme === 'react' ? 'lasvegas' : 'react';
        handleThemeChange(newTheme);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [optimisticTheme, currentThemeData.emojis]);

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <div className="bg-surface border-border dark:bg-surface-dark dark:border-border-dark flex flex-wrap items-center justify-center gap-2 rounded-full border px-3 py-2 sm:gap-4 sm:px-6">
        <span className="text-text-muted text-xs sm:text-sm">Theme:</span>
        {Object.entries(themes).map(([key, theme]) => {
          const isDisabled = isPending || remainingCooldown > 0;
          return (
            <button
              key={key}
              disabled={isDisabled}
              onClick={() => {
                return handleThemeChange(key as Theme);
              }}
              className={cn(
                'min-w-20 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all sm:min-w-24 sm:px-4 sm:py-2 sm:text-sm',
                optimisticTheme === key
                  ? `bg-gradient-to-r ${theme.colors} text-white shadow-lg`
                  : isDisabled
                    ? 'bg-background text-text-muted dark:bg-background-dark cursor-not-allowed opacity-50'
                    : 'bg-background text-text-muted hover:bg-accent/10 dark:bg-background-dark',
              )}
            >
              {isPending && optimisticTheme === key ? '...' : theme.name}
            </button>
          );
        })}
        <kbd className="text-text-muted bg-background border-border dark:bg-background-dark dark:border-border-dark rounded border px-1.5 py-0.5 text-xs sm:px-2 sm:py-1">
          T{remainingCooldown > 0 ? ` (${remainingCooldown}s)` : ''}
        </kbd>
      </div>
      <div
        className={cn(
          'relative flex items-center justify-center overflow-visible rounded-xl bg-gradient-to-r p-0.5 sm:rounded-2xl sm:p-1',
          currentThemeData.colors,
        )}
      >
        <div className="bg-surface/95 dark:bg-surface-dark/95 flex items-center gap-2 rounded-lg px-3 py-3 backdrop-blur-sm sm:gap-4 sm:rounded-xl sm:px-6 sm:py-4">
          {currentThemeData.emojis.map((emoji, index) => {
            return (
              <div
                key={emoji}
                className="group relative flex cursor-pointer flex-col items-center text-2xl transition-transform hover:scale-125 sm:text-4xl"
                onClick={() => {
                  return addReaction(emoji);
                }}
              >
                {emoji}
                <span className="bg-text/70 text-background mt-0.5 rounded px-1 py-0.5 text-xs sm:mt-1 sm:px-1.5">
                  {index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
