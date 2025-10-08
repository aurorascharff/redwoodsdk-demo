import { route } from 'rwsdk/router';
import { getDb } from '@/db';

export const apiRoutes = [
  route('/todos/add', async ({ request }) => {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const title = formData.get('title') as string;

      if (!title || title.trim() === '') {
        const url = new URL(request.url);
        return Response.redirect(`${url.origin}/todos/simple`);
      }

      await getDb().todo.create({
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

      await getDb().todo.update({
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

      await getDb().todo.delete({
        where: { id },
      });

      const url = new URL(request.url);
      return Response.redirect(`${url.origin}/todos/simple`);
    }
  }),
];
