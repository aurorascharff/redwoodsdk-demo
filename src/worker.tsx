import { env } from 'cloudflare:workers';
import { realtimeRoute } from 'rwsdk/realtime/worker';
import { route, render, prefix, index, layout } from 'rwsdk/router';
import { defineApp, ErrorResponse } from 'rwsdk/worker';
import { Document } from '@/app/Document';
import { setCommonHeaders } from '@/app/headers';
import { Home } from '@/app/pages/Home';
import { userRoutes } from '@/app/pages/user/routes';
import { type User, db, setupDb } from '@/db';
import AppLayout from './app/layouts/AppLayout';
import Profile from './app/pages/Profile';
import { ReactionPage } from './app/pages/reactions/Reactions';
import { sessions, setupSessionStore } from './session/store';
import type { Session } from './session/durableObject';
export { SessionDurableObject } from './session/durableObject';
export { RealtimeDurableObject } from 'rwsdk/realtime/durableObject';

export type AppContext = {
  session: Session | null;
  user: User | null;
};

const isAuthenticated = ({ ctx }: { ctx: AppContext }) => {
  if (!ctx.user) {
    return new Response(null, {
      headers: { Location: '/user/login' },
      status: 302,
    });
  }
};

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, headers }) => {
    await setupDb(env);
    setupSessionStore(env);

    try {
      ctx.session = await sessions.load(request);
    } catch (error) {
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, headers);
        headers.set('Location', '/user/login');

        return new Response(null, {
          headers,
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
  realtimeRoute(env => {
    return env.REALTIME_DURABLE_OBJECT;
  }),
  render(Document, [
    route('/hello', () => {
      return new Response('Hello, World!');
    }),
    layout(AppLayout, [
      index(Home),
      route('/profile', [isAuthenticated, Profile]),
      prefix('/user', userRoutes),
      route('/realtime', ReactionPage),
    ]),
  ]),
]);
