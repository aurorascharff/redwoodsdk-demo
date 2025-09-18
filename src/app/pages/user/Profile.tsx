import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { link } from '@/app/shared/links';
import type { AppContext } from '@/worker';

export default function Profile({ ctx }: { ctx: AppContext }) {
  return (
    <div className="bg-background dark:bg-background-dark flex justify-center py-2 backdrop-blur-md sm:py-8">
      <Card className="mx-4 flex w-full max-w-2xl flex-col items-center px-4 py-6 sm:px-8 sm:py-12 md:px-12 md:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-primary dark:text-primary-dark mb-4 font-serif text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Profile
          </h1>
          <p className="text-text-muted dark:text-text-muted-dark text-sm sm:text-base">Your account information</p>
        </div>
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <span className="text-text-muted dark:text-text-muted-dark text-sm font-medium">Username</span>
              <span className="text-text dark:text-text-dark font-semibold">{ctx.user?.username}</span>
            </div>
            <div className="border-border dark:border-border-dark border-t" />
            <div className="flex items-center justify-between py-3">
              <span className="text-text-muted dark:text-text-muted-dark text-sm font-medium">User ID</span>
              <span className="text-text dark:text-text-dark font-mono text-sm">{ctx.user?.id}</span>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <form action={link('/user/logout')}>
              <Button type="submit">Logout</Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
