import { env } from 'cloudflare:workers';
import { route, render } from 'rwsdk/router';
import { defineApp, ErrorResponse } from 'rwsdk/worker';
import { Document } from '@/app/Document';
import { setCommonHeaders } from '@/app/headers';
import { link } from '@/app/shared/links';
import { type User, db, setupDb } from '@/db';
import { sessions, setupSessionStore } from './session/store';
import type { Session } from './session/durableObject';
export { SessionDurableObject } from './session/durableObject';
export { RealtimeDurableObject } from 'rwsdk/realtime/durableObject';
export { ReactionsDurableObject } from './app/pages/realtime/reactionsDurableObject';

export type AppContext = {
  session: Session | null;
  user: User | null;
};

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, response }) => {
    await setupDb(env);
    setupSessionStore(env);
    try {
      ctx.session = await sessions.load(request);
    } catch (error) {
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, response.headers);
        response.headers.set('Location', link('/user/login'));

        return new Response(null, {
          headers: response.headers,
          status: 302,
        });
      }
      throw error;
    }
    if (ctx.session?.userId) {
      ctx.user = await db.user.findUnique({
        where: {
          id: ctx.session.userId,
        },
      });
    }
  },
  render(Document, [
    route('/ping', () => {
      return new Response('pong', { status: 200 });
    }),
    route('/hello', () => {
      return <div className="bg-primary m-4 w-fit rounded p-4"> Hello World!</div>;
    }),
  ]),
]);
