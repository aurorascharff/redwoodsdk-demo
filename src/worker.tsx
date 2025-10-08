import { realtimeRoute } from 'rwsdk/realtime/worker';
import { route,  prefix, index, layout, render } from 'rwsdk/router';
import { defineApp } from 'rwsdk/worker';
import { setCommonHeaders } from '@/app/headers';
import { type User, type PrismaClient, getDb } from '@/db';
import { Document } from './app/Document';
import { NoJSDocument } from './app/NoJSDocument';
import { RealtimeDocument } from './app/RealtimeDocument';
import { apiRoutes } from './app/api/routes';
import AppLayout from './app/layouts/AppLayout';
import { HomePage } from './app/pages/HomePage';
import { RealtimePage } from './app/pages/realtime/RealtimePage';
import FancyTodosPage from './app/pages/todos/FancyTodosPage';
import SimpleTodosPage from './app/pages/todos/SimpleTodosPage';
import { userRoutes } from './app/pages/user/routes';
import { link } from './app/shared/links';
import { sessionMiddleware } from './session/sessionMiddleware';
import type { Session } from './session/durableObject';
export { SessionDurableObject } from './session/durableObject';
export { ReactionsDurableObject } from './app/pages/realtime/reactionsDurableObject';
export { RealtimeDurableObject } from 'rwsdk/realtime/durableObject';

export const isAuthenticated = ({ ctx }: { ctx: AppContext }) => {
  if (!ctx.user) {
    return new Response(null, {
      headers: { Location: link('/user/login') },
      status: 302,
    });
  }
};

export type AppContext = {
  db: PrismaClient;
  session: Session | null;
  user: User | null;
};

export default defineApp([
  // Middleware
  setCommonHeaders(),
  sessionMiddleware,
  async function getUserMiddleware({ ctx }) {
    if (ctx.session?.userId) {
      ctx.user = await getDb().user.findUnique({
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
  render(Document, [
    layout(AppLayout, [
      index(HomePage),
      prefix('/user', userRoutes),
      route('/todos', [isAuthenticated, FancyTodosPage])
    ]),
  ]),
  render(RealtimeDocument, [
    layout(AppLayout, [
      route('/realtime', RealtimePage),
    ])
  ]),
  render(NoJSDocument, [
    layout(AppLayout, [
      route('/todos/simple', [isAuthenticated, SimpleTodosPage])
    ])
  ]),
]);

