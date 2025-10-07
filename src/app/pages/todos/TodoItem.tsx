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
    <div className="todo-item-container">
      <input
        type="checkbox"
        name="done"
        checked={done}
        onChange={e => {
          startTransition(async () => {
            await statusChangeAction(e.target.checked);
          });
        }}
        className="todo-checkbox"
      />
      <span
        className={cn('flex-1 transition-all', done ? 'text-text-muted line-through' : 'text-text dark:text-text-dark')}
      >
        {children}
      </span>
      <form action={deleteAction}>
        <button type="submit" className="delete-button" aria-label="Delete todo">
          ×
        </button>
      </form>
    </div>
  );
}
