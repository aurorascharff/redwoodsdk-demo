import { EmojiPicker } from './EmojiPicker';
import { getReactions } from './functions';

export function ReactionPage() {
  return (
    <div className="bg-background dark:bg-background-dark relative flex flex-col">
      <div className="absolute top-4 right-4 z-10 sm:top-8 sm:right-8">
        <div className="bg-surface dark:bg-surface-dark border-border dark:border-border-dark flex h-24 w-24 items-center justify-center rounded-xl border-2 shadow-lg sm:h-32 sm:w-32">
          <div className="text-center">
            <div className="text-xl sm:text-2xl">📱</div>
            <div className="text-text-muted mt-1 text-xs">QR Code</div>
            <div className="text-text-muted text-xs">Placeholder</div>
          </div>
        </div>
      </div>
      <div className="bg-surface dark:bg-surface-dark border-border dark:border-border-dark text-text dark:text-text-dark relative mx-2 mt-2 mb-4 flex min-h-[400px] flex-1 flex-col items-center justify-center rounded-3xl border-2 px-4 py-8 shadow-2xl backdrop-blur-sm sm:mx-4 sm:my-8 sm:min-h-[600px] sm:px-8 sm:py-12 md:px-12 md:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-primary dark:text-primary-dark mb-4 font-serif text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Live Reactions
          </h1>
        </div>
        <div className="relative flex w-full max-w-4xl flex-1 items-center justify-center text-2xl sm:text-4xl">
          {getReactions().map((emoji, index) => {
            const left = ((index * 37) % 80) + 10;
            const top = ((index * 23) % 80) + 10;

            return (
              <span
                key={index}
                className="float-up absolute"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {emoji}
              </span>
            );
          })}
        </div>
      </div>
      <div className="relative z-20 px-2 pb-4 sm:px-0 sm:pb-8">
        <EmojiPicker />
      </div>
    </div>
  );
}
