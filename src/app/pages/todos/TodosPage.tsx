import Todos from './Todos';
import { getTodos } from './queries';

export default async function TodosPage() {
  const initialTodos = getTodos();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 bg-gradient-to-r bg-clip-text text-3xl font-bold">Todos</h1>
      </div>
      <Todos todosPromise={initialTodos} />
    </div>
  );
}
