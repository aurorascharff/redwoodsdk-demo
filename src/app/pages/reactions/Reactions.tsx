import Card from '@/app/components/ui/Card';
import type { Theme } from '@/types/reaction';
import { EmojiPicker } from './EmojiPicker';
import { getReactions, getThemeState } from './functions';

export const themes = {
  lasvegas: {
    colors: 'from-yellow-400 via-orange-500 to-red-600',
    description: '🎲 What happens in Vegas... gets reacted to! 🎰',
    emojis: ['🎰', '🎲', '🃏', '💎', '🎯', '🎊', '💸', '🏆', '🔥'],
    name: 'Las Vegas',
  },
  react: {
    colors: 'from-blue-400 via-cyan-500 to-blue-600',
    description: '⚛️ Building the future, one emoji at a time! 🚀',
    emojis: ['⚛️', '🚀', '💙', '🔥', '⚡', '🧪', '🎯', '💻', '🛠️'],
    name: 'React',
  },
} as const;

export async function ReactionPage() {
  const reactions = await getReactions();
  const themeState = await getThemeState();
  const currentThemeData = themes[themeState.currentTheme as Theme];

  return (
    <div className="relative flex flex-col py-4 sm:py-8">
      <div
        className={`fixed inset-0 bg-gradient-to-br ${currentThemeData.colors} animate-pulse opacity-5`}
        style={{
          animationDuration: '4s',
          background: `linear-gradient(45deg, ${currentThemeData.colors.replace('from-', '').replace('via-', ', ').replace('to-', ', ')})`,
        }}
      />
      <div className="absolute top-8 right-4 z-10 sm:top-12 sm:right-8">
        <Card className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl transition-transform duration-300 hover:scale-110 sm:h-32 sm:w-32">
          <div className="text-center">
            <div className="animate-bounce text-xl sm:text-2xl">📱</div>
            <div className="text-text-muted text-xs font-semibold">QR</div>
          </div>
        </Card>
      </div>
      <Card className="hover:shadow-3xl group relative mx-2 mb-4 flex min-h-[400px] flex-col items-center justify-center px-4 py-8 transition-all duration-500 sm:mx-4 sm:mb-8 sm:min-h-[600px] sm:px-8 sm:py-12 md:px-12 md:py-16">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-serif tracking-tight transition-transform duration-300 group-hover:scale-105 sm:text-4xl md:text-5xl">
            <span className={`bg-gradient-to-r ${currentThemeData.colors} animate-pulse bg-clip-text text-transparent`}>
              ✨ Live Reactions ✨
            </span>
          </h1>
          <p className="text-text-muted text-sm font-medium sm:text-base">{currentThemeData.description}</p>
        </div>
        <div className="relative flex w-full max-w-4xl flex-1 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent text-2xl sm:text-4xl">
          {reactions.length === 0 && (
            <div className="text-center opacity-50">
              <div className="mb-4 animate-pulse text-6xl">👋</div>
              <p className="text-lg">Send the first reaction!</p>
            </div>
          )}
          {reactions.map((reaction, index) => {
            const left = ((index * 37) % 80) + 10;
            const top = ((index * 23) % 80) + 10;
            const delay = (index * 0.1) % 2;

            return (
              <span
                key={reaction.id}
                className="float-up absolute cursor-pointer transition-transform duration-200 hover:scale-150"
                style={{
                  animationDelay: `${delay}s`,
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {reaction.emoji}
              </span>
            );
          })}
        </div>
      </Card>
      <div className="relative z-20 px-2 pb-4 sm:px-0 sm:pb-8">
        <EmojiPicker
          theme={themeState.currentTheme}
          remainingCooldown={themeState.remainingCooldown || 0}
          currentThemeData={currentThemeData}
        />
      </div>
    </div>
  );
}
