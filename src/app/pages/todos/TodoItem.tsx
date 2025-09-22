import { useTransition } from 'react';

import Button from '@/app/components/ui/Button';
import { cn } from '@/utils/cn';

type Props = {
  done: boolean;
  statusChangeAction: (formData: FormData) => void;
  deleteAction: () => void;
  children: React.ReactNode;
};

export function TodoItem({ done, statusChangeAction, deleteAction, children = false }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="bg-surface border-border dark:bg-surface-dark dark:border-border-dark flex items-center gap-3 rounded-lg border p-3 transition-colors">
      <form action={statusChangeAction}>
        <input
          type="checkbox"
          name="done"
          checked={done}
          onChange={e => {
            startTransition(() => {
              const formData = new FormData();
              formData.set('done', e.target.checked.toString());
              statusChangeAction(formData);
            });
          }}
          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </form>
      <span
        className={cn(
          'flex-1 transition-all',
          done ? 'text-text-muted line-through' : 'text-text dark:text-text-dark',
          isPending && 'opacity-50',
        )}
      >
        {children}
      </span>
      <form
        action={() => {
          return startTransition(() => {
            return deleteAction();
          });
        }}
      >
        <Button
          type="submit"
          variant="secondary"
          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          ×
        </Button>
      </form>
    </div>
  );
}
