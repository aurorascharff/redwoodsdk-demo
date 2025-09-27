import { env } from 'cloudflare:workers';
import { ErrorResponse } from 'rwsdk/worker';
import { link } from '@/app/shared/links';
import { setupDb } from '@/db';
import { setupSessionStore, sessions } from './store';
import type { RouteMiddleware } from 'rwsdk/router';

export const sessionMiddleware: RouteMiddleware = async ({ request, response, ctx }) => {
  await setupDb(env);
  setupSessionStore(env);
  try {
    ctx.session = await sessions.load(request);
  } catch (error) {
    if (error instanceof ErrorResponse && error.code === 401) {
      await sessions.remove(request, response.headers);
      response.headers.set('Location', link('/user/login'));
      return new Response(null, {
        headers: response.headers,
        status: 302,
      });
    }
    throw error;
  }
};
