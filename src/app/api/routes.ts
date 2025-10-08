import { route } from 'rwsdk/router';
import { db } from '@/db';

export const apiRoutes = [
  route('/stress-test', async () => {
    try {
      const result = await db.$transaction(async tx => {
        // 1. Create a dummy todo to simulate a write operation.
        const newTodo = await tx.todo.create({
          data: {
            // Use a random title to avoid unique constraint issues if any.
            title: `stress-test-todo-${crypto.randomUUID()}`,
          },
        });

        // 2. Hold the transaction open for a short period to increase the
        //    likelihood of overlapping with other concurrent requests.
        await new Promise(resolve => setTimeout(resolve, 100));

        // 3. Clean up the created todo to keep the database tidy.
        await tx.todo.delete({
          where: { id: newTodo.id },
        });

        return { success: true, createdTodoId: newTodo.id };
      });

      return Response.json({ status: 'ok', ...result, timestamp: Date.now() });
    } catch (error) {
      console.error('Stress test transaction failed:', error);
      // Ensure the response is properly formed in case of an error.
      const message = error instanceof Error ? error.message : 'Unknown error';
      return Response.json({ status: 'error', message }, { status: 500 });
    }
  }),
  route('/todos/add', async ({ request }) => {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const title = formData.get('title') as string;

      if (!title || title.trim() === '') {
        const url = new URL(request.url);
        return Response.redirect(`${url.origin}/todos/simple`);
      }

      await db.todo.create({
        data: {
          done: false,
          id: crypto.randomUUID(),
          title: title.trim(),
        },
      });

      const url = new URL(request.url);
      return Response.redirect(`${url.origin}/todos/simple`);
    }
  }),
  route('/todos/toggle', async ({ request }) => {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const id = formData.get('id') as string;
      const done = formData.get('done') === 'true';

      await db.todo.update({
        data: { done: !done },
        where: { id },
      });

      const url = new URL(request.url);
      return Response.redirect(`${url.origin}/todos/simple`);
    }
  }),
  route('/todos/delete', async ({ request }) => {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const id = formData.get('id') as string;

      await db.todo.delete({
        where: { id },
      });

      const url = new URL(request.url);
      return Response.redirect(`${url.origin}/todos/simple`);
    }
  }),
];
