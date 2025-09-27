'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable autofix/no-unused-vars */
// @ts-expect-error - unstable API but works in React 19
import { unstable_ViewTransition as ViewTransition } from 'react';
import { useActionState, useOptimistic, use, useRef, useState, startTransition } from 'react';
import Button from '@/app/components/ui/Button';
import SpinnerIcon from '@/app/components/ui/icons/SpinnerIcon';
import type { Todo } from '@/types/todo';
import { getSortedTodos, getSortOrderLabel, getNextSortOrder, type SortOrder } from '@/utils/todoSort';
import { TodoItem } from './TodoItem';
import { todosReducer } from './functions';
type Props = {
  todosPromise: Promise<Todo[]>;
};

export default function Todos({ todosPromise }: Props) {
  const initialTodos = use(todosPromise);
  const [todos, dispatch, isPending] = useActionState(todosReducer, initialTodos);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const formRef = useRef<HTMLFormElement>(null);

  const addTodoAction = (formData: FormData) => {
    const title = formData.get('title')?.toString();
    if (!title?.trim()) return;
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const todo = { createdAt, done: false, id, title: title.trim() };

    setOptimisticTodos((prev: Todo[]) => {
      return [todo, ...prev];
    });
    dispatch({ payload: { todo: { done: false, id, title: title.trim() } }, type: 'add' });
    formRef.current?.reset();
  };

  const statusChangeAction = (done: boolean, todo: Todo) => {
    const payload = { id: todo.id, updatedTodo: { ...todo, done } };
    setOptimisticTodos((prev: Todo[]) => {
      return prev.map(item => {
        return item.id === todo.id ? { ...item, done } : item;
      });
    });
    dispatch({ payload, type: 'edit' });
  };

  const deleteAction = (todoId: string) => {
    const payload = { id: todoId };
    setOptimisticTodos((prev: Todo[]) => {
      return prev.filter(item => {
        return item.id !== todoId;
      });
    });
    dispatch({ payload, type: 'delete' });
  };

  const sortedTodos = getSortedTodos(optimisticTodos, sortOrder);

  return (
    <>
      <form ref={formRef} action={addTodoAction} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="title"
            placeholder="Add a new todo..."
            className="bg-background border-border text-text dark:bg-background-dark dark:border-border-dark dark:text-text-dark flex-1 rounded-lg border px-3 py-2 transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
          <Button hideSpinner type="submit">
            Add Todo
          </Button>
        </div>
      </form>
      {optimisticTodos.length > 0 && <SortButton sortOrderAction={setSortOrder} sortOrder={sortOrder} />}
      <div className="space-y-2">
        {optimisticTodos.length === 0 ? (
          <div className="bg-surface border-border dark:bg-surface-dark dark:border-border-dark rounded-lg border p-8 text-center">
            <p className="text-text-muted">No todos yet. Add your first todo above! 🎯</p>
          </div>
        ) : (
          sortedTodos.map(todo => {
            return (
              <TodoItem
                key={todo.id}
                done={todo.done}
                statusChangeAction={done => {
                  statusChangeAction(done, todo);
                }}
                deleteAction={() => {
                  deleteAction(todo.id);
                }}
              >
                {todo.title}
              </TodoItem>
            );
          })
        )}
      </div>
      <div className="mt-8 text-center">
        <p className="text-text-muted text-sm">
          Total: {optimisticTodos.length} • Completed:{' '}
          {
            optimisticTodos.filter(todo => {
              return todo.done;
            }).length
          }{' '}
          • Remaining:{' '}
          {
            optimisticTodos.filter(todo => {
              return !todo.done;
            }).length
          }
        </p>
        {isPending && (
          <div className="mt-2 animate-pulse text-xs font-medium text-orange-600" aria-live="polite">
            <span className="inline-flex items-center gap-1">
              <SpinnerIcon className="h-3 w-3" />
              Syncing to server…
            </span>
          </div>
        )}
      </div>
    </>
  );
}

function SortButton({
  sortOrderAction,
  sortOrder,
  setSortOrder,
}: {
  sortOrderAction?: (order: SortOrder) => Promise<void> | void;
  setSortOrder?: (order: SortOrder) => void;
  sortOrder: SortOrder;
}) {
  return (
    <div className="mb-4 flex justify-end">
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          const newSortOrder = getNextSortOrder(sortOrder);
          setSortOrder?.(newSortOrder);
          startTransition(async () => {
            await sortOrderAction?.(newSortOrder);
          });
        }}
        className="text-sm"
      >
        {getSortOrderLabel(sortOrder)}
      </Button>
    </div>
  );
}

export function TodosSkeleton() {
  return (
    <div className="space-y-2">
      <div className="skeleton-animation mb-7 h-10 rounded-lg" />
      <div className="skeleton-animation h-16 rounded-lg" />
      <div className="skeleton-animation h-16 rounded-lg" />
    </div>
  );
}
