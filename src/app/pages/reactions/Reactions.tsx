import { EmojiPicker } from './EmojiPicker';
import { getReactions, getThemeState } from './functions';

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

export async function ReactionPage() {
  const reactions = await getReactions();
  const theme = await getThemeState();
  const currentThemeData = themes[theme.currentTheme];

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Themed background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentThemeData.colors} opacity-10`} />
      <div className="bg-background/80 dark:bg-background-dark/80 absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 flex flex-col">
        <div className="absolute top-4 right-4 z-10 sm:top-8 sm:right-8">
          <div className="bg-surface/95 dark:bg-surface-dark/95 border-border dark:border-border-dark flex h-24 w-24 items-center justify-center rounded-xl border-2 shadow-lg backdrop-blur-sm sm:h-32 sm:w-32">
            <div className="text-center">
              <div className="text-xl sm:text-2xl">📱</div>
              <div className="text-text-muted mt-1 text-xs">QR Code</div>
              <div className="text-text-muted text-xs">Placeholder</div>
            </div>
          </div>
        </div>
        <div className="bg-surface/95 dark:bg-surface-dark/95 border-border dark:border-border-dark text-text dark:text-text-dark relative mx-2 mt-2 mb-4 flex min-h-[400px] flex-1 flex-col items-center justify-center rounded-3xl border-2 px-4 py-8 shadow-2xl backdrop-blur-sm sm:mx-4 sm:my-8 sm:min-h-[600px] sm:px-8 sm:py-12 md:px-12 md:py-16">
          <div className="mb-8 text-center">
            <h1 className="mb-4 font-serif text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              <span className={`bg-gradient-to-r ${currentThemeData.colors} bg-clip-text text-transparent`}>
                Live Reactions
              </span>
            </h1>
            <p className="text-text-muted text-sm sm:text-base">{currentThemeData.description}</p>
          </div>
          <div className="relative flex w-full max-w-4xl flex-1 items-center justify-center text-2xl sm:text-4xl">
            {reactions.map((reaction, index) => {
              const left = ((index * 37) % 80) + 10;
              const top = ((index * 23) % 80) + 10;

              return (
                <span
                  key={reaction.id}
                  className="float-up absolute"
                  style={{
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
        </div>
        <div className="relative z-20 px-2 pb-4 sm:px-0 sm:pb-8">
          <EmojiPicker lastChanged={theme.lastChanged} theme={theme.currentTheme} currentThemeData={currentThemeData} />
        </div>
      </div>
    </div>
  );
}
