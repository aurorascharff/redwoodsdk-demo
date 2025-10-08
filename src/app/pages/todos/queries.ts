import type { Todo } from '@/db';
import { getDb } from '@/db';
import { slow } from '@/utils/slow';
import { requestInfo } from 'rwsdk/worker';

export async function getTodos(): Promise<Todo[]> {
  const { ctx } = requestInfo;
  if (!ctx.user) {
    throw new Error('User must be logged in');
  }

  await slow();

  const todos = await getDb().todo.findMany({
    where: {
      userId: ctx.user.id,
    },
    orderBy: { createdAt: 'desc' },
  });
  return todos;
}
