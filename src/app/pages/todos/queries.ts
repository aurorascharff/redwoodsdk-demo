import type { Todo } from '@/db';
import { getDb } from '@/db';
import { slow } from '@/utils/slow';

export async function getTodos(userId: string): Promise<Todo[]> {
  await slow();

  const todos = await getDb().todo.findMany({
    where: {
      userId: userId,
    },
    orderBy: { createdAt: 'desc' },
  });
  return todos;
}
