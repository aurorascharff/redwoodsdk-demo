import Card from '@/app/components/ui/Card';
import type { Theme } from '@/types/reaction';
import { cn } from '@/utils/cn';
import { EmojiPicker } from './EmojiPicker';
import Reactions from './Reactions';
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
      <title>Realtime</title>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          className={cn('fixed inset-0 h-full animate-pulse bg-gradient-to-br opacity-5', currentThemeData.colors)}
          style={{
            animationDuration: '4s',
          }}
        />
        <div className="absolute top-4 right-4 z-10 sm:top-8 sm:right-8">
          <Card className="hidden h-12 w-12 items-center justify-center overflow-hidden rounded-xl sm:flex sm:h-24 sm:w-24 lg:h-32 lg:w-32">
            <img src="/images/QR.jpeg" alt="QR Code" className="h-full w-full object-cover" />
          </Card>
        </div>
        <div className="relative flex flex-1 flex-col">
          <Card className="relative mx-4 mb-4 flex min-h-[70vh] flex-1 flex-col items-center justify-center px-4 py-6 sm:mx-0 sm:mb-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
            <div className="mb-6 text-center sm:mb-8">
              <h1 className="mb-2 font-serif text-2xl tracking-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
                <span className={cn('bg-gradient-to-r bg-clip-text text-transparent', currentThemeData.colors)}>
                  ✨ Live Reactions ✨
                </span>
              </h1>
              <p className="text-text-muted text-sm font-medium sm:text-base lg:text-lg">
                {currentThemeData.description}
              </p>
            </div>
            <div className="flex w-full flex-1 items-center justify-center">
              <Reactions />
            </div>
          </Card>
          <div className="relative z-20 px-4 pb-4 sm:px-0 sm:pb-6">
            <EmojiPicker
              theme={themeState.currentTheme}
              remainingCooldown={themeState.remainingCooldown || 0}
              currentThemeData={currentThemeData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
