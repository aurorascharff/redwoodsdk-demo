import { route } from 'rwsdk/router';
import { link } from '@/app/shared/links';
import { sessions } from '@/session/store';
import type { AppContext } from '@/worker';
import { LoginPage } from './LoginPage';
import Profile from './Profile';

const isAuthenticated = ({ ctx }: { ctx: AppContext }) => {
  if (!ctx.user) {
    return new Response(null, {
      headers: { Location: link('/user/login') },
      status: 302,
    });
  }
};

const shouldRedirectHome = ({ ctx }: { ctx: AppContext }) => {
  if (ctx.user) {
    return new Response(null, {
      headers: { Location: link('/') },
      status: 302,
    });
  }
};

export const userRoutes = [
  route('/login', LoginPage),
  route('/profile', Profile),
  route('/logout', async function ({ request }) {
    const headers = new Headers();
    await sessions.remove(request, headers);
    headers.set('Location', link('/'));

    return new Response(null, {
      headers,
      status: 302,
    });
  }),
];
