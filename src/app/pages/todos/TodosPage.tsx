import Todos from './Todos';
import { getTodos } from './queries';

export default async function TodosPage() {
  const initialTodos = getTodos();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 bg-gradient-to-r from-orange-600 via-red-500 to-amber-600 bg-clip-text text-3xl font-bold text-transparent">
          Todo App
        </h1>
      </div>
      <Todos todosPromise={initialTodos} />
    </div>
  );
}
