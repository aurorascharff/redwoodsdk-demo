/* eslint-disable autofix/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { route } from 'rwsdk/router';
import { defineApp } from 'rwsdk/worker';
import { setCommonHeaders } from '@/app/headers';
import { type User } from '@/db';
import { Document } from './app/Document';
import { NoJSDocument } from './app/NoJSDocument';
import { apiRoutes } from './app/api/routes';
import { sessionMiddleware } from './session/sessionMiddleware';
import type { Session } from './session/durableObject';
export { SessionDurableObject } from './session/durableObject';
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
  // Route handlers
  route('/', () => {
    return new Response('pong', { status: 200 });
  }),
  route('/hello/:name', requestInfo => {
    const { name } = requestInfo.params;
    return new Response(`Hello ${name}`, { status: 200 });
  }),
]);
