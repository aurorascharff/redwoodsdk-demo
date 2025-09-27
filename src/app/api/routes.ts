import { route } from 'rwsdk/router';
import { db } from '@/db';

export const apiRoutes = [
  route('/todos/add', async ({ request }) => {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const title = formData.get('title') as string;

      if (!title || title.trim() === '') {
        const url = new URL(request.url);
        const referer = request.headers.get('referer') || url.origin;
        return Response.redirect(referer);
      }

      await db.todo.create({
        data: {
          done: false,
          id: crypto.randomUUID(),
          title: title.trim(),
        },
      });

      const url = new URL(request.url);
      const referer = request.headers.get('referer') || url.origin;
      return Response.redirect(referer);
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
      const referer = request.headers.get('referer') || url.origin;
      return Response.redirect(referer);
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
      const referer = request.headers.get('referer') || url.origin;
      return Response.redirect(referer);
    }
  }),
];
