import { route } from 'rwsdk/router';
import { link } from '@/app/shared/links';
import { sessions } from '@/session/store';
import type { AppContext } from '@/worker';
import { LoginPage } from './LoginPage';

const shouldRedirectHome = ({ ctx }: { ctx: AppContext }) => {
  if (ctx.user) {
    return new Response(null, {
      headers: { Location: link('/') },
      status: 302,
    });
  }
};

export const userRoutes = [
  route('/login', [shouldRedirectHome, LoginPage]),
  route('/logout', async function ({ request, response }) {
    await sessions.remove(request, response.headers);
    response.headers.set('Location', '/');

    return new Response(null, {
      headers: response.headers,
      status: 302,
    });
  }),
];
