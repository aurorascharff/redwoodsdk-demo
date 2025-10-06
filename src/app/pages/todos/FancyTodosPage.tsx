import { Suspense } from 'react';
// @ts-expect-error - unstable API but works in React 19
import { unstable_ViewTransition as ViewTransition } from 'react';
import Todos, { TodosSkeleton } from './Todos';
import { getTodos } from './queries';

export default async function FancyTodosPage() {
  const initialTodos = getTodos();

  return (
    <>
      <title>Fancy Todos</title>
      <div className="w-full sm:w-[500px]">
        <div className="mb-8 text-center">
          <ViewTransition name="todos">
            <h1 className="mb-2 text-3xl font-bold">Fancy Todos</h1>
          </ViewTransition>
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
