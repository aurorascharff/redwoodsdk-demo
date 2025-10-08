import HomeButton from '@/app/components/HomeButton';
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
    <div className="w-full">
      <title>Realtime</title>
      <div className="relative w-full flex-col">
        <AnimatedBackground colors={currentThemeData.colors} />
        <div className="absolute top-4 right-4 z-10 sm:top-8 sm:right-8">
          <Card className="hidden h-12 w-12 items-center justify-center overflow-hidden rounded-xl sm:flex sm:h-24 sm:w-24 lg:h-32 lg:w-32">
            <img src="/images/QR.jpeg" alt="QR Code" className="h-full w-full object-cover" />
          </Card>
        </div>
        <Card className="realtime-card-main">
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
            <HomeButton />
          </div>
          <RealtimeHeader colors={currentThemeData.colors} description={currentThemeData.description} />
          <Reactions />
        </Card>
      </div>
      <div className="relative z-20 p-4 sm:p-8">
        <EmojiPicker
          theme={themeState.currentTheme as Theme}
          remainingCooldown={themeState.remainingCooldown || 0}
          currentThemeData={currentThemeData}
        />
      </div>
    </div>
  );
}

function AnimatedBackground({ colors }: { colors: string }) {
  return (
    <div
      className={cn('fixed inset-0 h-full animate-pulse bg-gradient-to-br opacity-5', colors)}
      style={{
        animationDuration: '4s',
        background: `linear-gradient(45deg, ${colors.replace('from-', '').replace('via-', ', ').replace('to-', ', ')})`,
      }}
    />
  );
}

function RealtimeHeader({ colors, description }: { colors: string; description: string }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="mb-4 font-serif tracking-tight sm:text-4xl md:text-5xl">
        <span className={cn('bg-gradient-to-r bg-clip-text text-transparent', colors)}>✨ Live Reactions ✨</span>
      </h1>
      <p className="text-text-muted text-sm font-medium sm:text-base">{description}</p>
    </div>
  );
}
