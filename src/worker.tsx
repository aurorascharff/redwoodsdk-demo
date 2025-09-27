import { realtimeRoute } from 'rwsdk/realtime/worker';
import { route, render, prefix, index, layout } from 'rwsdk/router';
import { defineApp } from 'rwsdk/worker';
import { Document } from '@/app/Document';
import { setCommonHeaders } from '@/app/headers';
import { HomePage } from '@/app/pages/HomePage';
import { userRoutes } from '@/app/pages/user/routes';
import { type User, db } from '@/db';
import { NoJSDocument } from './app/NoJSDocument';
import { apiRoutes } from './app/api/routes';
import AppLayout from './app/layouts/AppLayout';
import MainLayout from './app/layouts/MainLayout';
import { RealtimePage } from './app/pages/realtime/RealtimePage';
import SimpleTodosPage from './app/pages/todos/SimpleTodosPage';
import TodosPage from './app/pages/todos/TodosPage';
import { sessionMiddleware } from './session/sessionMiddleware';
import type { Session } from './session/durableObject';
export { SessionDurableObject } from './session/durableObject';
export { RealtimeDurableObject } from 'rwsdk/realtime/durableObject';
export { ReactionsDurableObject } from './app/pages/realtime/reactionsDurableObject';

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
  render(Document, [
    route('/hello', () => {
      return <div className="bg-primary m-4 w-fit rounded p-4"> Hello World!</div>;
    }),
    layout(AppLayout, [
      index(HomePage),
      layout(MainLayout, [prefix('/user', userRoutes), route('/realtime', RealtimePage), route('/todos', TodosPage)]),
    ]),
  ]),
  render(NoJSDocument, [
    layout(AppLayout, [
      layout(MainLayout, [
        route('/todos/simple', async () => {
          return <SimpleTodosPage />;
        }),
      ]),
    ]),
  ]),
]);
