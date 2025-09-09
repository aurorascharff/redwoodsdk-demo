import type { AppContext } from '@/worker';
import Button from '../components/ui/Button';

export function Home({ ctx }: { ctx: AppContext }) {
  return (
    <div className="bg-background dark:bg-background-dark fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-surface dark:bg-surface-dark border-border dark:border-border-dark text-text dark:text-text-dark relative mx-4 flex max-w-6xl flex-col items-center rounded-3xl border-2 px-8 py-12 shadow-2xl backdrop-blur-sm md:px-12 md:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-primary dark:text-primary-dark mb-4 font-serif text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            RedwoodSDK v1.0
          </h1>
          <div className="from-gradient-start dark:from-gradient-start-dark to-gradient-end dark:to-gradient-end-dark bg-gradient-to-br bg-clip-text text-xl font-medium text-transparent md:text-2xl lg:text-3xl">
            Web Standards Meet Full-Stack React
          </div>
        </div>

        <div className="mb-10 max-w-4xl text-center">
          <h2 className="text-accent dark:text-accent-dark mb-6 text-2xl font-semibold">Built for the Edge</h2>
          <p className="text-text-muted dark:text-text-muted-dark mb-8 text-lg leading-relaxed">
            A new way to build full-stack React apps without heavy frameworks or hidden abstractions. Built on web
            standards with direct access to native Requests and Responses.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <FeatureItem>Server Components</FeatureItem>
            <FeatureItem>Edge Optimized</FeatureItem>
            <FeatureItem>Web Standards</FeatureItem>
            <FeatureItem>Cloudflare Ready</FeatureItem>
          </div>
        </div>
        {!ctx.user && (
          <a href="/user/login">
            <Button type="submit">Login</Button>
          </a>
        )}
      </div>
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
