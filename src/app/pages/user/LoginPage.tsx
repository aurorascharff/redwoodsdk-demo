'use client';

import { useActionState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { link } from '@/app/shared/links';
import { login, register } from './functions';

type State = {
  error?: string;
  message?: string;
};

export function LoginPage() {
  const [state, formAction] = useActionState(async (_prevState: State | undefined, formData: FormData) => {
    const action = formData.get('action') as string;
    const username = formData.get('username') as string;

    if (action === 'login') {
      const success = await login(username);
      if (success) {
        window.location.href = link('/');
        return { message: 'Login successful!' };
      }
      return { error: 'User not found' };
    }

    if (action === 'register') {
      const success = await register(username);
      if (success) {
        window.location.href = link('/');
        return { message: 'Registration successful!' };
      }
      return { error: 'Username already exists' };
    }

    return { error: 'Invalid action' };
  }, {} as State);

  return (
    <>
      <title>Login</title>
      <Card className="w-full max-w-md space-y-6 px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login</h1>
        </div>
        <ErrorBoundary fallbackRender={ErrorFallback}>
          <div className="space-y-6">
            <form action={formAction} className="space-y-3">
              <input
                type="text"
                minLength={3}
                name="username"
                placeholder="Username"
                className="w-full rounded-md border p-3"
                required
              />
              <Button name="action" value="login" className="h-10 w-full min-w-[120px]">
                Login
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background text-text-muted px-2">or</span>
              </div>
            </div>
            <form action={formAction} className="space-y-3">
              <input
                type="text"
                minLength={3}
                name="username"
                placeholder="Username"
                className="w-full rounded-md border p-3"
                required
              />
              <Button variant="secondary" name="action" value="register" className="h-10 w-full min-w-[140px]">
                Register
              </Button>
            </form>
          </div>
        </ErrorBoundary>
        {state?.error && <div className="error-message">{state.error}</div>}
        {state?.message && <div className="success-message">{state.message}</div>}
      </Card>
    </>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="info-card">
      <p className="mb-2">Something went wrong</p>
      <p className="mb-3 text-sm">{error?.message}</p>
      <Button type="button" onClick={resetErrorBoundary}>
        Try Again
      </Button>
    </div>
  );
}
