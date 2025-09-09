import { route } from 'rwsdk/router';
import { sessions } from '@/session/store';
import type { AppContext } from '@/worker';
import { Login } from './Login';

const shouldRedirect = ({ ctx }: { ctx: AppContext }) => {
  if (ctx.user) {
    return new Response(null, {
      headers: { Location: '/profile' },
      status: 302,
    });
  }
};

export const userRoutes = [
  route('/login', [shouldRedirect, Login]),
  route('/logout', async function ({ request }) {
    const headers = new Headers();
    await sessions.remove(request, headers);
    headers.set('Location', '/');

    return new Response(null, {
      headers,
      status: 302,
    });
  }),
];
