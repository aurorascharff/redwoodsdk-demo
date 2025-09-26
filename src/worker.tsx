import { route, render } from 'rwsdk/router';
import { defineApp } from 'rwsdk/worker';
import { Document } from '@/app/Document';
import { setCommonHeaders } from '@/app/headers';
import { type User } from '@/db';
import type { Session } from './session/durableObject';
export { SessionDurableObject } from './session/durableObject';
export { ReactionsDurableObject } from './app/pages/realtime/reactionsDurableObject';

export type AppContext = {
  session: Session | null;
  user: User | null;
};

export default defineApp([
  // Middleware
  setCommonHeaders(),
  // Route handlers
  route('/ping', () => {
    return new Response('pong', { status: 200 });
  }),
  render(Document, [
    route('/hello', () => {
      return <div className="bg-primary m-4 w-fit rounded p-4"> Hello World!</div>;
    }),
  ]),
]);
