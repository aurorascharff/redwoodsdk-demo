import { route } from 'rwsdk/router';
import { db } from '@/db';

export const apiRoutes = [
  route('/stress-test', async () => {
    // Add delay to increase likelihood of concurrent request overlap
    await new Promise(resolve => setTimeout(resolve, 100));

    // Perform a simple database query to test request-scoped state
    const count = await db.todo.count();

    // Add another delay to keep the request open longer
    await new Promise(resolve => setTimeout(resolve, 50));

    return Response.json({ count, timestamp: Date.now() });
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
