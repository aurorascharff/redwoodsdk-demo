import { Suspense } from 'react';
// @ts-expect-error - unstable API but works in React 19
import { unstable_ViewTransition as ViewTransition } from 'react';
import HomeButton from '@/app/components/HomeButton';
import Todos, { TodosSkeleton } from './Todos';
import { getTodos } from './queries';

export default function FancyTodosPage() {
  const initialTodos = getTodos();

  return (
    <>
      <div className="absolute top-0 left-0 z-10 sm:top-6 sm:left-6">
        <HomeButton />
      </div>
      <title>Fancy Todos</title>
      <div className="w-full sm:w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Fancy Todos</h1>
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
