import { link } from '@/app/shared/links';
import type { AppContext } from '@/worker';
import Button from '../components/ui/Button';
import GitHubIcon from '../components/ui/icons/GitHubIcon';

export function Home({ ctx }: { ctx: AppContext }) {
  return (
    <div className="bg-background dark:bg-background-dark h-full">
      <div className="flex h-full items-center justify-center px-4">
        <div className="max-w-5xl text-center">
          <div className="mb-12">
            <h1 className="text-primary dark:text-primary-dark mb-6 font-serif text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
              RedwoodSDK
            </h1>
            <div className="text-primary/80 dark:text-primary-dark/80 mb-4 text-2xl font-medium sm:text-3xl md:text-4xl">
              v1.0
            </div>
            <p className="from-gradient-start dark:from-gradient-start-dark to-gradient-end dark:to-gradient-end-dark bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl md:text-4xl">
              Web Standards Meet Full-Stack React
            </p>
          </div>

          <p className="text-text-muted dark:text-text-muted-dark mx-auto mb-16 max-w-3xl text-lg leading-relaxed sm:text-xl">
            A full-stack React framework that strips web development back to its essentials. TypeScript-only,
            composable, and built on web standards with native Request/Response access.
          </p>
          <div className="mb-16 flex flex-wrap justify-center gap-3 text-sm">
            <span className="border-primary/30 dark:border-primary-dark/30 text-primary/80 dark:text-primary-dark/80 rounded-full border px-4 py-2">
              Server Components
            </span>
            <span className="border-primary/30 dark:border-primary-dark/30 text-primary/80 dark:text-primary-dark/80 rounded-full border px-4 py-2">
              Edge Optimized
            </span>
            <span className="border-primary/30 dark:border-primary-dark/30 text-primary/80 dark:text-primary-dark/80 rounded-full border px-4 py-2">
              Web Standards
            </span>
            <span className="border-primary/30 dark:border-primary-dark/30 text-primary/80 dark:text-primary-dark/80 rounded-full border px-4 py-2">
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
