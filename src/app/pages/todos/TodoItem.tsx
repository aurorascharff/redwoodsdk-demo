'use client';

import { startTransition } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  done: boolean;
  statusChangeAction: (done: boolean) => Promise<void> | void;
  deleteAction: () => Promise<void> | void;
  children: React.ReactNode;
};

export function TodoItem({ done, statusChangeAction, deleteAction, children = false }: Props) {
  return (
    <div className="bg-surface border-border dark:bg-surface-dark dark:border-border-dark flex items-center gap-3 rounded-lg border p-3 transition-colors">
      <input
        type="checkbox"
        name="done"
        checked={done}
        onChange={e => {
          startTransition(async () => {
            await statusChangeAction(e.target.checked);
          });
        }}
        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span
        className={cn('flex-1 transition-all', done ? 'text-text-muted line-through' : 'text-text dark:text-text-dark')}
      >
        {children}
      </span>
      <form action={deleteAction}>
        <button
          type="submit"
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full p-0 text-lg font-bold text-red-500',
            'transition-colors hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30',
            'focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2',
            'active:scale-95',
          )}
          aria-label="Delete todo"
        >
          ×
        </button>
      </form>
    </div>
  );
}
