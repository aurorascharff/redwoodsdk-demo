import type { Todo } from '@/db';
import { db } from '@/db';
import { slow } from '@/utils/slow';

export async function getTodos(): Promise<Todo[]> {
  await slow();
  const todos = await db.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return todos;
}
