'use client';

import { useEffect, useOptimistic, useTransition } from 'react';
import type { Theme } from '@/types/reaction';
import { cn } from '@/utils/cn';
import { themes } from './Realtime';
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
      <div className="bg-surface border-border dark:bg-surface-dark dark:border-border-dark flex flex-wrap items-center justify-center gap-2 rounded-full border px-3 py-2 sm:gap-4 sm:px-6">
        <span className="text-text-muted text-xs sm:text-sm">Theme:</span>
        {Object.entries(themes).map(([key, theme]) => {
          const isDisabled = remainingCooldown > 0 || isPending;
          return (
            <button
              key={key}
              onClick={() => {
                changeThemeAction(key as Theme);
              }}
              disabled={isDisabled}
              className={cn(
                'min-w-20 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all sm:min-w-24 sm:px-4 sm:py-2 sm:text-sm',
                'bg-background text-text-muted hover:bg-accent/10 dark:bg-background-dark',
                'disabled:hover:bg-background disabled:dark:hover:bg-background-dark disabled:cursor-not-allowed disabled:opacity-50',
                optimisticTheme === key && 'bg-gradient-to-r text-white shadow-lg',
                optimisticTheme === key && theme.colors,
              )}
            >
              {theme.name}
            </button>
          );
        })}
        <kbd className="text-text-muted bg-background border-border dark:bg-background-dark dark:border-border-dark rounded border px-1.5 py-0.5 text-xs sm:px-2 sm:py-1">
          T{remainingCooldown > 0 ? ` (${remainingCooldown}s)` : ''}
        </kbd>
      </div>
      <div
        className={cn(
          'relative w-full overflow-visible rounded-xl bg-gradient-to-r p-0.5 transition-all duration-300 sm:flex sm:w-fit sm:items-center sm:justify-center sm:rounded-2xl sm:p-1',
          currentThemeData.colors,
          isPending && 'opacity-60 saturate-50',
        )}
      >
        <div
          className={cn(
            'bg-surface/95 dark:bg-surface-dark/95 w-full rounded-lg px-3 py-3 backdrop-blur-sm transition-all duration-300 sm:rounded-xl sm:px-6 sm:py-4',
            isPending && 'bg-surface/50 dark:bg-surface-dark/50',
          )}
        >
          <div className="grid w-full grid-cols-4 gap-3 sm:hidden">
            {currentThemeData.emojis.map(emoji => {
              return (
                <button
                  key={emoji}
                  type="button"
                  disabled={isPending}
                  className={cn(
                    'bg-background/50 hover:bg-background/70 flex aspect-square items-center justify-center rounded-lg py-4 text-2xl transition-all hover:scale-110 active:scale-95',
                    'disabled:hover:bg-background/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
                  )}
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
                  className={cn(
                    'group relative flex flex-col items-center text-4xl transition-transform hover:scale-125',
                    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
                  )}
                  onClick={() => {
                    return addReaction(emoji);
                  }}
                >
                  {emoji}
                  <span className="bg-text/70 text-background mt-1 rounded px-1.5 py-0.5 text-xs">{index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
