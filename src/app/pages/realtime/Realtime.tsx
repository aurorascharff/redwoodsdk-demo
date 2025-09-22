import { Suspense } from 'react';
import { unstable_ViewTransition as ViewTransition } from 'react';
import Card from '@/app/components/ui/Card';
import type { Theme } from '@/types/reaction';
import { EmojiPicker } from './EmojiPicker';
import Reactions, { ReactionsSkeleton } from './Reactions';
import { getThemeState } from './functions';

export const themes = {
  lasvegas: {
    colors: 'from-yellow-400 via-orange-500 to-red-600',
    description: '🎲 What happens in Vegas... gets reacted to! 🎰',
    emojis: ['🤑', '🔥', '💀', '😍', '🎊', '💸', '🏆', '🎰', '🎲', '🃏'],
    name: 'Las Vegas',
  },
  react: {
    colors: 'from-blue-400 via-cyan-500 to-blue-600',
    description: '⚛️ Building the future, one emoji at a time! 🚀',
    emojis: ['🤓', '🚀', '💡', '🤯', '🔥', '⚡', '🧠', '💪', '💻', '⚛️'],
    name: 'React',
  },
} as const;

export async function RealtimePage() {
  const themeState = await getThemeState();
  const currentThemeData = themes[themeState.currentTheme as Theme];

  return (
    <>
      <div className="relative flex h-screen flex-col">
        <div
          className={`fixed inset-0 bg-gradient-to-br ${currentThemeData.colors} animate-pulse opacity-5`}
          style={{
            animationDuration: '4s',
            background: `linear-gradient(45deg, ${currentThemeData.colors.replace('from-', '').replace('via-', ', ').replace('to-', ', ')})`,
          }}
        />
        <div className="absolute top-8 right-8 z-10 sm:top-12 sm:right-12">
          <Card className="hidden h-16 w-16 items-center justify-center overflow-hidden rounded-xl sm:flex sm:h-32 sm:w-32">
            <img src="/images/QR.jpeg" alt="QR Code" className="h-full w-full object-cover" />
          </Card>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-8">
          <Card className="relative flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 md:px-12 md:py-16">
            <div className="mb-8 text-center">
              <h1 className="mb-4 font-serif tracking-tight sm:text-4xl md:text-5xl">
                <span className={`bg-gradient-to-r ${currentThemeData.colors} bg-clip-text text-transparent`}>
                  ✨ Live Reactions ✨
                </span>
              </h1>
              <p className="text-text-muted text-sm font-medium sm:text-base">{currentThemeData.description}</p>
            </div>
            <Suspense
              fallback={
                <ViewTransition exit="slide-down">
                  <ReactionsSkeleton />
                </ViewTransition>
              }
            >
              <ViewTransition enter="slide-up">
                <Reactions />
              </ViewTransition>
            </Suspense>
          </Card>
        </div>
        <div className="relative z-20 p-4 sm:p-8 sm:pt-0">
          <EmojiPicker
            theme={themeState.currentTheme}
            remainingCooldown={themeState.remainingCooldown || 0}
            currentThemeData={currentThemeData}
          />
        </div>
      </div>
    </>
  );
}
