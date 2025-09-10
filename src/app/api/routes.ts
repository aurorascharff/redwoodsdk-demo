import { env } from 'cloudflare:workers';
import { renderRealtimeClients } from 'rwsdk/realtime/worker';
import { route } from 'rwsdk/router';

export const apiRoutes = [
  route('/reactions', async ({ request }) => {
    if (request.method === 'POST') {
      const body = (await request.json()) as { emoji: string };

      const doId = env.REACTIONS_DURABLE_OBJECT.idFromName('reactions');
      const reactionsDO = env.REACTIONS_DURABLE_OBJECT.get(doId);
      await reactionsDO.addReaction(body.emoji);

      await renderRealtimeClients({
        durableObjectNamespace: env.REALTIME_DURABLE_OBJECT,
        key: 'reactions',
      });

      return new Response(null, { status: 200 });
    }
  }),
  route('/theme', async ({ request }) => {
    if (request.method === 'GET') {
      const doId = env.REACTIONS_DURABLE_OBJECT.idFromName('reactions');
      const reactionsDO = env.REACTIONS_DURABLE_OBJECT.get(doId);
      const themeState = await reactionsDO.getThemeState();
      return new Response(JSON.stringify(themeState), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    if (request.method === 'POST') {
      const body = (await request.json()) as { theme: string };

      const doId = env.REACTIONS_DURABLE_OBJECT.idFromName('reactions');
      const reactionsDO = env.REACTIONS_DURABLE_OBJECT.get(doId);
      const result = await reactionsDO.setTheme(body.theme as 'react' | 'lasvegas');

      if (result.success) {
        await renderRealtimeClients({
          durableObjectNamespace: env.REALTIME_DURABLE_OBJECT,
          key: 'reactions',
        });
      }

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: result.success ? 200 : 429,
      });
    }
    return new Response(null, { status: 405 });
  }),
];
