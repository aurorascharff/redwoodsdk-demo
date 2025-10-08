import { route, render, index, layout } from 'rwsdk/router';
import { defineApp } from 'rwsdk/worker';
import { type User, db } from '@/db';
import { setCommonHeaders } from '@/app/headers';
import { sessionMiddleware } from './session/sessionMiddleware';
import type { Session } from './session/durableObject';
export { SessionDurableObject } from './session/durableObject';
import { NoJSDocument } from './app/NoJSDocument';
import AppLayout from './app/layouts/AppLayout';
import { HomePage } from '@/app/pages/HomePage';

export type AppContext = {
  session: Session | null;
  user: User | null;
};

export default defineApp([
  // Middleware
  setCommonHeaders(),
  sessionMiddleware,
  async function getUserMiddleware({ ctx }) {
    if (ctx.session?.userId) {
      ctx.user = await db.user.findUnique({
        where: {
          id: ctx.session.userId,
        },
      });
    }
  },

  // Basic Route Handlers
  route('/ping', () => {
    return new Response('pong', { status: 200 });
  }),
  route('/hello/:name', requestInfo => {
    const { name } = requestInfo.params;
    return new Response(`Hello ${name}`, { status: 200 });
  }),

  // Initial SSR Page
  render(NoJSDocument, [
    layout(AppLayout, [
      index(HomePage)
    ]),
  ]),
]);
