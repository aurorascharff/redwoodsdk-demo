import { requestInfo } from 'rwsdk/worker';
import type { Todo } from '@/db';
import { getDb } from '@/db';
import { slow } from '@/utils/slow';

export async function getTodos(): Promise<Todo[]> {
  const { ctx } = requestInfo;
  if (!ctx.user) {
    throw new Error('User must be logged in');
  }

  await slow();

  const todos = await getDb().todo.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      userId: ctx.user.id,
    },
  });
  return todos;
}
