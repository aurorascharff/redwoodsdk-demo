import { EmojiPicker } from './EmojiPicker';
import { getReactions } from './functions';

export function ReactionPage() {
  return (
    <div className="bg-background dark:bg-background-dark relative flex flex-col overflow-hidden">
      <div className="absolute top-8 right-8 z-10">
        <div className="bg-surface dark:bg-surface-dark border-border dark:border-border-dark flex h-32 w-32 items-center justify-center rounded-xl border-2 shadow-lg">
          <div className="text-center">
            <div className="text-2xl">📱</div>
            <div className="text-text-muted mt-1 text-xs">QR Code</div>
            <div className="text-text-muted text-xs">Placeholder</div>
          </div>
        </div>
      </div>
      <div className="bg-surface dark:bg-surface-dark border-border dark:border-border-dark text-text dark:text-text-dark relative mx-4 my-8 flex min-h-[600px] flex-1 flex-col items-center justify-center rounded-3xl border-2 px-8 py-12 shadow-2xl backdrop-blur-sm md:px-12 md:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-primary dark:text-primary-dark mb-4 font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Live Reactions
          </h1>
        </div>
        <div className="relative flex w-full max-w-4xl flex-1 items-center justify-center text-4xl">
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
      <div className="relative z-20 pb-8">
        <EmojiPicker />
      </div>
    </div>
  );
}
