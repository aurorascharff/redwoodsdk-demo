// @ts-expect-error - unstable API but works in React 19
import { unstable_ViewTransition as ViewTransition } from 'react';
import { Suspense } from 'react';
import Todos, { TodosSkeleton } from './Todos';
import { getTodos } from './queries';

export default async function FancyTodosPage() {
  const initialTodos = getTodos();

  return (
    <>
      <title>Fancy Todos</title>
      <div className="w-full sm:w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="mb-2 bg-gradient-to-r bg-clip-text text-3xl font-bold">Fancy Todos</h1>
        </div>
        <Suspense
          fallback={
            <ViewTransition exit="slide-down">
              <TodosSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="slide-up" default="none">
            <Todos todosPromise={initialTodos} />
          </ViewTransition>
        </Suspense>
      </div>
    </>
  );
}
