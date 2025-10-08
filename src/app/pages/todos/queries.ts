import type { Todo } from '@/db';
import { getDb } from '@/db';
import { slow } from '@/utils/slow';

export async function getTodos(): Promise<Todo[]> {
  await slow();

  const todos = await getDb().todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return todos;
}
