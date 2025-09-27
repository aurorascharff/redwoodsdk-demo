// @ts-expect-error - unstable API but works in React 19
import { unstable_ViewTransition as ViewTransition } from 'react';
import { link } from '@/app/shared/links';
import type { AppContext } from '@/worker';
import Button from '../components/ui/Button';
import GitHubIcon from '../components/ui/icons/GitHubIcon';

export function Home({ ctx }: { ctx: AppContext }) {
  return (
    <div className="bg-background dark:bg-background-dark h-full">
      <div className="flex h-full items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <div className="mb-16">
            <h1 className="text-primary dark:text-primary-dark mb-6 font-serif text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
              RedwoodSDK v1.0
            </h1>
            <p className="text-text dark:text-text-dark text-xl font-medium sm:text-2xl md:text-3xl">
              Web Standards Meet Full-Stack React
            </p>
          </div>
          <p className="text-text-muted dark:text-text-muted-dark mx-auto mb-16 max-w-2xl text-lg leading-relaxed">
            A full-stack React framework that strips web development back to its essentials. TypeScript-only,
            composable, and built on web standards.
          </p>
          <div className="mb-16 flex flex-wrap justify-center gap-4 text-sm">
            <span className="text-text-muted dark:text-text-muted-dark border-text-muted/20 dark:border-text-muted-dark/20 rounded-full border px-4 py-2">
              Server Components
            </span>
            <span className="text-text-muted dark:text-text-muted-dark border-text-muted/20 dark:border-text-muted-dark/20 rounded-full border px-4 py-2">
              Edge Optimized
            </span>
            <span className="text-text-muted dark:text-text-muted-dark border-text-muted/20 dark:border-text-muted-dark/20 rounded-full border px-4 py-2">
              Web Standards
            </span>
            <span className="text-text-muted dark:text-text-muted-dark border-text-muted/20 dark:border-text-muted-dark/20 rounded-full border px-4 py-2">
              Cloudflare Ready
            </span>
          </div>
          <div className="mb-12 flex flex-wrap justify-center gap-4">
            {ctx.user ? (
              <a href={link('/user/profile')}>
                <Button type="button" variant="secondary">
                  Profile
                </Button>
              </a>
            ) : (
              <a href={link('/user/login')}>
                <Button type="submit">Login</Button>
              </a>
            )}
            <a href={link('/todos/simple')}>
              <Button type="button" variant="secondary">
                Simple Todos
              </Button>
            </a>
            <a href={link('/todos')}>
              <Button type="button" variant="secondary">
                <ViewTransition name="todos">
                  <span>Todos</span>
                </ViewTransition>
              </Button>
            </a>
            <a href={link('/realtime')}>
              <Button type="button" variant="secondary">
                Realtime
              </Button>
            </a>
          </div>
          <div className="text-center">
            <a
              href="https://github.com/aurorascharff/redwoodsdk-v1-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              <GitHubIcon className="h-5 w-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
