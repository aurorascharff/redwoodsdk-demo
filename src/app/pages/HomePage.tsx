// @ts-expect-error - unstable API but works in React 19
import { unstable_ViewTransition as ViewTransition } from 'react';
import { link } from '@/app/shared/links';
import type { AppContext } from '@/worker';
import Button from '../components/ui/Button';
import GitHubIcon from '../components/ui/icons/GitHubIcon';

export function HomePage({ ctx }: { ctx: AppContext }) {
  return (
    <div className="bg-background dark:bg-background-dark flex h-full w-full items-center justify-center justify-items-center px-4 py-8">
      <div className="w-full max-w-4xl text-center">
        <div className="mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-primary dark:text-primary-dark mb-4 font-serif text-4xl font-bold tracking-tight sm:mb-6 sm:text-6xl md:text-7xl lg:text-8xl">
            RedwoodSDK
          </h1>
          <p className="text-text dark:text-text-dark text-lg font-medium sm:text-xl md:text-2xl lg:text-3xl">
            Web Standards Meet Full-Stack React
          </p>
        </div>
        <p className="text-text-muted dark:text-text-muted-dark mx-auto mb-8 max-w-2xl text-base leading-relaxed sm:mb-12 sm:text-lg md:mb-16">
          A full-stack React framework that strips web development back to its essentials. TypeScript-only, composable,
          and built on web standards.
        </p>
        <div className="mb-8 flex flex-col flex-wrap justify-center gap-3 sm:mb-12 sm:flex-row sm:gap-4">
          {ctx.user ? (
            <a href={link('/user/profile')} className="w-full sm:w-auto">
              <Button type="button" variant="secondary" className="w-full sm:w-auto">
                Profile
              </Button>
            </a>
          ) : (
            <a href={link('/user/login')} className="w-full sm:w-auto">
              <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                Login
              </Button>
            </a>
          )}
          <a href={link('/todos/simple')} className="w-full sm:w-auto">
            <Button type="button" variant="secondary" className="w-full sm:w-auto">
              Simple Todos
            </Button>
          </a>
          <a href={link('/todos')} className="w-full sm:w-auto">
            <Button type="button" variant="secondary" className="w-full sm:w-auto">
              <ViewTransition name="todos">
                <span>Fancy Todos</span>
              </ViewTransition>
            </Button>
          </a>
          <a href={link('/realtime')} className="w-full sm:w-auto">
            <Button type="button" variant="secondary" className="w-full sm:w-auto">
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
  );
}
