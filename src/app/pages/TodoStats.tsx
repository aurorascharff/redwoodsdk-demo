import { getTodos } from './todos/queries';

export async function TodoStats() {
  const todos = await getTodos();
  const todoStats = {
    completed: todos.filter(t => {
      return t.done;
    }).length,
    pending: todos.filter(t => {
      return !t.done;
    }).length,
    total: todos.length,
  };

  return (
    <div className="mb-6 flex justify-center">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-text dark:text-text-dark text-2xl font-bold">{todoStats.total}</div>
          <div className="text-text-muted dark:text-text-muted-dark text-sm">Total</div>
        </div>
        <div>
          <div className="text-primary dark:text-primary-dark text-2xl font-bold">{todoStats.completed}</div>
          <div className="text-text-muted dark:text-text-muted-dark text-sm">Done</div>
        </div>
        <div>
          <div className="text-text-muted dark:text-text-muted-dark text-2xl font-bold">{todoStats.pending}</div>
          <div className="text-text-muted dark:text-text-muted-dark text-sm">Pending</div>
        </div>
      </div>
    </div>
  );
}

export function TodoStatsSkeleton() {
  return (
    <div className="mb-6 flex justify-center">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="skeleton-animation h-13 w-16 rounded-lg" />
        <div className="skeleton-animation h-13 w-16 rounded-lg" />
        <div className="skeleton-animation h-13 w-16 rounded-lg" />
      </div>
    </div>
  );
}
