import { env } from 'cloudflare:workers';
import { realtimeRoute } from 'rwsdk/realtime/worker';
import { route, render, prefix, index, layout } from 'rwsdk/router';
import { defineApp, ErrorResponse } from 'rwsdk/worker';
import { Document } from '@/app/Document';
import { setCommonHeaders } from '@/app/headers';
import { Home } from '@/app/pages/Home';
import { userRoutes } from '@/app/pages/user/routes';
import { link } from '@/app/shared/links';
import { type User, db, setupDb } from '@/db';
import { NoJSDocument } from './app/NoJSDocument';
import { apiRoutes } from './app/api/routes';
import AppLayout from './app/layouts/AppLayout';
import MainLayout from './app/layouts/MainLayout';
import { RealtimePage } from './app/pages/realtime/RealtimePage';
import SimpleTodos from './app/pages/todos/SimpleTodos';
import TodosPage from './app/pages/todos/TodosPage';
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
  async ({ ctx, request, headers }) => {
    await setupDb(env);
    setupSessionStore(env);
    try {
      ctx.session = await sessions.load(request);
    } catch (error) {
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, headers);
        headers.set('Location', link('/user/login'));

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
  prefix('/api', apiRoutes),
  render(Document, [
    route('/ping', () => {
      return new Response('pong', { status: 200 });
    }),
    route('/hello', () => {
      return <div className="bg-primary m-4 w-fit rounded p-4"> Hello World!</div>;
    }),
    layout(AppLayout, [
      index(Home),
      layout(MainLayout, [prefix('/user', userRoutes), route('/realtime', RealtimePage), route('/todos', TodosPage)]),
    ]),
    render(NoJSDocument, [
      layout(AppLayout, [
        layout(MainLayout, [
          route('/todos/simple', () => {
            return (
              <div className="mx-auto max-w-2xl p-6">
                <div className="mb-8 text-center">
                  <h1 className="mb-2 bg-gradient-to-r bg-clip-text text-3xl font-bold">Simple Todos</h1>
                </div>
                <SimpleTodos />
              </div>
            );
          }),
        ]),
      ]),
    ]),
  ]),
]);
