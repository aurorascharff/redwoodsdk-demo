import Button from '@/app/components/ui/Button';
import { link } from '@/app/shared/links';
import type { AppContext } from '@/worker';

export default function Profile({ ctx }: { ctx: AppContext }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-10" />
      <div className="bg-background/80 dark:bg-background-dark/80 absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 flex flex-col">
        <div className="bg-surface/95 dark:bg-surface-dark/95 border-border dark:border-border-dark text-text dark:text-text-dark relative mx-2 mt-8 mb-4 flex min-h-[400px] flex-1 flex-col items-center justify-center rounded-3xl border-2 px-4 py-8 shadow-2xl backdrop-blur-sm sm:mx-4 sm:my-8 sm:min-h-[500px] sm:px-8 sm:py-12 md:px-12 md:py-16">
          <div className="mb-8 text-center">
            <h1 className="mb-4 font-serif text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Profile
              </span>
            </h1>
            <p className="text-text-muted text-sm sm:text-base">Your account information</p>
          </div>
          
          <div className="w-full max-w-md space-y-6">
            <div className="bg-surface/50 dark:bg-surface-dark/50 border-border dark:border-border-dark rounded-xl border p-6 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm font-medium">Username</span>
                  <span className="text-text dark:text-text-dark font-semibold">{ctx.user?.username}</span>
                </div>
                <div className="border-border dark:border-border-dark border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm font-medium">User ID</span>
                    <span className="text-text dark:text-text-dark font-mono text-sm">{ctx.user?.id}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <a href={link('/user/logout')}>
                <Button type="submit" className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                  Logout
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
