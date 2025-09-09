import Button from '@/app/components/Button';

export function Home() {
  return (
    <div className="bg-primary-variant-1/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-card border-divider text-primary-variant-3 relative mx-4 flex max-w-4xl flex-col items-center rounded-3xl border-4 px-6 py-8 shadow-2xl md:px-10 md:py-12">
        <div className="text-primary-dark mb-6 text-center text-2xl font-extrabold md:text-3xl lg:text-5xl">
          RedwoodSDK v1.0
          <br />
          <span className="from-primary to-primary-dark bg-gradient-to-r bg-clip-text text-xl text-transparent md:text-2xl lg:text-4xl">
            Web Standards Meet Full-Stack React
          </span>
        </div>
        <div className="mb-8 max-w-3xl text-center">
          <h3 className="text-accent-dark mb-4 text-xl font-bold">Built for the Edge</h3>
          <p className="mb-6 text-lg leading-relaxed">
            A new way to build full-stack React apps without heavy frameworks or hidden abstractions. Built on web
            standards with direct access to native Requests and Responses.
          </p>
          <ul className="inline-flex flex-wrap justify-center gap-2 text-lg sm:gap-4">
            <FeatureItem>Server Components</FeatureItem>
            <FeatureItem>Edge Optimized</FeatureItem>
            <FeatureItem>Web Standards</FeatureItem>
            <FeatureItem>Cloudflare Ready</FeatureItem>
          </ul>
        </div>
        <form className="mt-4">
          <Button type="submit" className="px-8 py-3 text-lg">
            Explore RedwoodSDK v1
          </Button>
        </form>
      </div>
    </div>
  );
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center">
      <span className="text-accent-dark mr-2">▶</span>
      <code className="bg-primary-variant-1/20 rounded px-2 py-1 text-sm">{children}</code>
    </li>
  );
}
