import { unstable_ViewTransition as ViewTransition } from 'react';
import { link } from '@/app/shared/links';
import type { AppContext } from '@/worker';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import GitHubIcon from '../components/ui/icons/GitHubIcon';

export function Home({ ctx }: { ctx: AppContext }) {
  return (
    <div className="bg-background dark:bg-background-dark flex justify-center py-2 backdrop-blur-md sm:py-8">
      <Card className="mx-4 flex w-full max-w-6xl flex-col items-center px-4 py-6 sm:px-8 sm:py-12 md:px-12 md:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-primary dark:text-primary-dark mb-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl lg:text-7xl">
            RedwoodSDK v1.0
          </h1>
          <div className="from-gradient-start dark:from-gradient-start-dark to-gradient-end dark:to-gradient-end-dark bg-gradient-to-br bg-clip-text text-lg font-medium text-transparent sm:text-xl md:text-2xl lg:text-3xl">
            Web Standards Meet Full-Stack React
          </div>
        </div>
        <div className="mb-10 max-w-4xl text-center">
          <p className="text-text-muted dark:text-text-muted-dark mb-8 text-base leading-relaxed sm:text-lg">
            A full-stack React framework that strips web development back to its essentials. TypeScript-only,
            composable, and built on web standards with native Request/Response access.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <FeatureItem>Server Components</FeatureItem>
            <FeatureItem>Edge Optimized</FeatureItem>
            <FeatureItem>Web Standards</FeatureItem>
            <FeatureItem>Cloudflare Ready</FeatureItem>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {ctx.user ? (
            <a href={link('/user/profile')}>
              <Button type="button" variant="secondary">
                Profile
              </Button>
            </a>
          ) : (
            <a href={link('/user/login')}>
              <Button type="submit" variant="secondary">
                Login
              </Button>
            </a>
          )}
          <a href={link('/realtime')}>
            <Button type="button" variant="secondary">
              Realtime
            </Button>
          </a>
          <ViewTransition name="todos">
            <a href={link('/todos')}>
              <Button type="button" variant="secondary">
                Todos
              </Button>
            </a>
          </ViewTransition>
          <a href={link('/todos/simple')}>
            <Button type="button" variant="secondary">
              Simple Todos
            </Button>
          </a>
        </div>
        <div className="mt-8 text-center">
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
      </Card>
    </div>
  );
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="from-primary/10 to-accent/10 dark:from-primary-dark/10 dark:to-accent-dark/10 border-primary/20 dark:border-primary-dark/20 hover:border-primary dark:hover:border-primary-dark hover:from-primary/20 hover:to-accent/20 inline-flex rounded-full border bg-gradient-to-r px-6 py-2 text-sm font-medium transition-all duration-200 hover:scale-105">
      {children}
    </div>
  );
}
