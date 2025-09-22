import React from 'react';
import { getReactions } from './functions';

export default async function Reactions() {
  await new Promise(resolve => {
    return setTimeout(resolve, 500);
  });
  const reactions = await getReactions();

  return (
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
            className="float-up absolute"
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
  );
}

export function ReactionsSkeleton() {
  return (
    <div className="relative flex w-full max-w-4xl flex-1 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent text-2xl sm:text-4xl">
      {Array.from({ length: 6 }).map((_, index) => {
        const left = ((index * 37) % 80) + 10;
        const top = ((index * 23) % 80) + 10;
        const delay = (index * 0.3) % 2;

        return (
          <div
            key={index}
            className="border-border/30 bg-surface/40 dark:border-border-dark/30 dark:bg-surface-dark/40 absolute h-8 w-8 animate-pulse rounded-full border sm:h-12 sm:w-12"
            style={{
              animationDelay: `${delay}s`,
              left: `${left}%`,
              top: `${top}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center opacity-30">
          <p className="text-sm font-medium">Loading reactions...</p>
        </div>
      </div>
    </div>
  );
}
