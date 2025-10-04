import Button from '@/app/components/ui/Button';
import { cn } from '@/utils/cn';
import { getTodos } from './queries';

export default async function SimpleTodosPage() {
  const todos = await getTodos();

  return (
    <>
      <title>Simple Todos</title>
      <div className="w-full sm:w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="mb-2 bg-gradient-to-r bg-clip-text text-3xl font-bold">Simple Todos</h1>
        </div>
        <form action="/api/todos/add" method="POST" className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              name="title"
              placeholder="Add a new todo..."
              className="bg-background border-border text-text dark:bg-background-dark dark:border-border-dark dark:text-text-dark flex-1 rounded-lg border px-3 py-2 transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
            <Button type="submit">Add Todo</Button>
          </div>
        </form>
        <div className="space-y-2">
          {todos.length === 0 ? (
            <div className="bg-surface border-border dark:bg-surface-dark dark:border-border-dark rounded-lg border p-8 text-center">
              <p className="text-text-muted">No todos yet. Add your first todo above! 🎯</p>
            </div>
          ) : (
            todos.map(todo => {
              return (
                <div
                  key={todo.id}
                  className="bg-surface border-border dark:bg-surface-dark dark:border-border-dark flex items-center gap-3 rounded-lg border p-3 transition-colors"
                >
                  <form action="/api/todos/toggle" method="POST" className="flex items-center">
                    <input type="hidden" name="id" value={todo.id} />
                    <input type="hidden" name="done" value={todo.done.toString()} />
                    <button
                      type="submit"
                      aria-label={todo.done ? 'Mark as incomplete' : 'Mark as complete'}
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded border-2 border-gray-300 text-orange-600 transition-colors focus:ring-orange-500',
                        todo.done
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-border dark:border-border-dark hover:border-orange-500',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                    >
                      {todo.done && (
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </form>
                  <span
                    className={cn(
                      'flex-1 transition-all',
                      todo.done ? 'text-text-muted line-through' : 'text-text dark:text-text-dark',
                    )}
                  >
                    {todo.title}
                  </span>
                  <form action="/api/todos/delete" method="POST">
                    <input type="hidden" name="id" value={todo.id} />
                    <button
                      type="submit"
                      aria-label="Delete todo"
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full p-0 text-lg font-bold text-red-500',
                        'transition-colors hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30',
                        'focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2',
                        'active:scale-95',
                      )}
                    >
                      ×
                    </button>
                  </form>
                </div>
              );
            })
          )}
        </div>
        <div className="mt-8 text-center">
          <p className="text-text-muted text-sm">
            Total: {todos.length} • Completed:{' '}
            {
              todos.filter(todo => {
                return todo.done;
              }).length
            }{' '}
            • Remaining:{' '}
            {
              todos.filter(todo => {
                return !todo.done;
              }).length
            }
          </p>
        </div>
      </div>
    </>
  );
}
