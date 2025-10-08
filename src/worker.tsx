import { realtimeRoute } from 'rwsdk/realtime/worker';
import { route, render, prefix, index, layout } from 'rwsdk/router';
import { defineApp } from 'rwsdk/worker';
import { Document } from '@/app/Document';
import { setCommonHeaders } from '@/app/headers';
import { HomePage } from '@/app/pages/HomePage';
import { userRoutes } from '@/app/pages/user/routes';
import { type User, type PrismaClient, db } from '@/db';
import { NoJSDocument } from './app/NoJSDocument';
import { RealtimeDocument } from './app/RealtimeDocument';
import { apiRoutes } from './app/api/routes';
import AppLayout from './app/layouts/AppLayout';
import MainLayout from './app/layouts/MainLayout';
import { RealtimePage } from './app/pages/realtime/RealtimePage';
import FancyTodosPage from './app/pages/todos/FancyTodosPage';
import SimpleTodosPage from './app/pages/todos/SimpleTodosPage';
import { sessionMiddleware } from './session/sessionMiddleware';
import type { Session } from './session/durableObject';
export { SessionDurableObject } from './session/durableObject';
export { ReactionsDurableObject } from './app/pages/realtime/reactionsDurableObject';
export { RealtimeDurableObject } from 'rwsdk/realtime/durableObject';

export type AppContext = {
  db: PrismaClient;
  session: Session | null;
  user: User | null;
};

export default defineApp([
  // Middleware
  setCommonHeaders(),
  sessionMiddleware,
  async function stressTestMiddleware() {
    try {
      // D1 does not support interactive transactions. To simulate a long-running
      // operation, we perform the steps sequentially on every request.
      const newTodo = await db.todo.create({
        data: {
          title: `stress-test-todo-${crypto.randomUUID()}`,
        },
      });

      // Hold the request open to increase likelihood of overlapping.
      await new Promise(resolve => setTimeout(resolve, 100));

      // Clean up the created todo.
      await db.todo.delete({
        where: { id: newTodo.id },
      });
    } catch (error) {
      // Log the error but don't block the request from completing.
      console.error('Stress test middleware failed:', error);
    }
  },
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
  render(Document, [
    layout(AppLayout, [
      index(HomePage),
      layout(MainLayout, [
        prefix('/user', userRoutes),
        route('/todos', FancyTodosPage)]),
    ]),
  ]),
  render(RealtimeDocument, [
    layout(AppLayout, [
      route('/realtime', RealtimePage),
    ])
  ]),
  render(NoJSDocument, [
    layout(AppLayout, [
      layout(MainLayout, [
        route('/todos/simple', SimpleTodosPage)
      ])
    ])
  ]),
]);
