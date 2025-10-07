// @ts-expect-error - unstable API but works in React 19
import { unstable_ViewTransition as ViewTransition } from 'react';
import { link } from '@/app/shared/links';
import type { AppContext } from '@/worker';
import Button from '../components/ui/Button';
import GitHubIcon from '../components/ui/icons/GitHubIcon';

export function HomePage({ ctx }: { ctx: AppContext }) {
  return (
    <ViewTransition exit="slide-out" enter="slide-out" default="none">
      <div className="page-container">
        <div className="w-full max-w-4xl text-center">
          <div className="my-8 sm:my-12 md:my-16">
            <h1 className="hero-title">RedwoodSDK</h1>
            <p className="hero-subtitle">Web Standards Meet Full-Stack React</p>
          </div>
          <p className="hero-description">
            A full-stack React framework that strips web development back to its essentials. TypeScript-only,
            composable, and built on web standards.
          </p>
          <div className="button-grid">
            <a href={link('/todos/simple')} className="w-full sm:w-auto">
              <Button type="button" variant="secondary" className="w-full sm:w-auto">
                Simple Todos
              </Button>
            </a>
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
            <a href={link('/todos')} className="w-full sm:w-auto">
              <Button type="button" variant="secondary" className="w-full sm:w-auto">
                <span>Fancy Todos</span>
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
              href="https://github.com/aurorascharff/redwoodsdk-demo"
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
    </ViewTransition>
  );
}
