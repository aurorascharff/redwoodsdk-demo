import { realtimeRoute } from 'rwsdk/realtime/worker';
import { route, render, prefix, index, layout } from 'rwsdk/router';
import { defineApp } from 'rwsdk/worker';
import { type User, db } from '@/db';
import { setCommonHeaders } from '@/app/headers';
import { sessionMiddleware } from './session/sessionMiddleware';
import type { Session } from './session/durableObject';
export { SessionDurableObject } from './session/durableObject';
import { Document } from '@/app/Document';
import { NoJSDocument } from './app/NoJSDocument';
import { RealtimeDocument } from './app/RealtimeDocument';
import { apiRoutes } from './app/api/routes';
import AppLayout from './app/layouts/AppLayout';
import MainLayout from './app/layouts/MainLayout';
import { HomePage } from '@/app/pages/HomePage';
import { userRoutes } from '@/app/pages/user/routes';
import { RealtimePage } from './app/pages/realtime/RealtimePage';
import FancyTodosPage from './app/pages/todos/FancyTodosPage';
import SimpleTodosPage from './app/pages/todos/SimpleTodosPage';
export { ReactionsDurableObject } from './app/pages/realtime/reactionsDurableObject';
export { RealtimeDurableObject } from 'rwsdk/realtime/durableObject';

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
  realtimeRoute(env => {
    return env.REALTIME_DURABLE_OBJECT;
  }),

  // Route handlers
  prefix('/api', apiRoutes),
  route('/ping', () => {
    return new Response('pong', { status: 200 });
  }),
  route('/hello/:name', requestInfo => {
    const { name } = requestInfo.params;
    return new Response(`Hello ${name}`, { status: 200 });
  }),
  route('/hello', () => {
    return <h1>Hello World!</h1>;
  }),

  // Hydrated Pages (with client-side JavaScript)
  render(Document, [
    layout(AppLayout, [
      index(HomePage),
      layout(MainLayout, [
        prefix('/user', userRoutes),
        route('/todos', FancyTodosPage),
      ]),
    ]),
  ]),

  // Real-time Pages (streaming RSC over WebSockets)
  render(RealtimeDocument, [
    layout(AppLayout, [
      route('/realtime', RealtimePage),
    ])
  ]),

  // SSR Pages (no client-side JavaScript)
  render(NoJSDocument, [
    layout(AppLayout, [
      layout(MainLayout, [
        route('/todos/simple', SimpleTodosPage)
      ])
    ]),
  ]),
]);
