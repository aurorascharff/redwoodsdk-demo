/* eslint-disable autofix/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { route,  prefix, index } from 'rwsdk/router';
import { defineApp } from 'rwsdk/worker';
import { setCommonHeaders } from '@/app/headers';
import { type User, type PrismaClient } from '@/db';
import { Document } from './app/Document';
import { NoJSDocument } from './app/NoJSDocument';
import { apiRoutes } from './app/api/routes';
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
  // Route handlers
  prefix('/api', apiRoutes),
  index(() => {
    return new Response('pong', { status: 200 });
  }),
  route('/hello/:name', requestInfo => {
    const { name } = requestInfo.params;
    return new Response(`Hello ${name}`, { status: 200 });
  }),
]);

