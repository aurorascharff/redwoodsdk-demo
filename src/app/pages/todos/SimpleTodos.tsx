import Button from '@/app/components/ui/Button';
import { getTodos } from './queries';

export default async function SimpleTodos() {
  const todos = await getTodos();

  return (
    <>
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
                className="bg-surface border-border dark:bg-surface-dark dark:border-border-dark flex items-center gap-3 rounded-lg border p-4"
              >
                <form action="/api/todos/toggle" method="POST" className="flex items-center">
                  <input type="hidden" name="id" value={todo.id} />
                  <input type="hidden" name="done" value={todo.done.toString()} />
                  <button
                    type="submit"
                    className={`h-5 w-5 rounded border-2 transition-colors ${
                      todo.done
                        ? 'border-green-500 bg-green-500'
                        : 'border-border dark:border-border-dark hover:border-green-500'
                    }`}
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
                  className={`flex-1 ${todo.done ? 'text-text-muted line-through' : 'text-text dark:text-text-dark'}`}
                >
                  {todo.title}
                </span>
                <form action="/api/todos/delete" method="POST" className="flex items-center">
                  <input type="hidden" name="id" value={todo.id} />
                  <button
                    type="submit"
                    className="text-text-muted p-1 transition-colors hover:text-red-500"
                    title="Delete todo"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
    </>
  );
}
