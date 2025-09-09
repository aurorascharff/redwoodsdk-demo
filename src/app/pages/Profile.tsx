import Button from '@/app/components/Button';
import type { AppContext } from '@/worker';

export default function Profile({ ctx }: { ctx: AppContext }) {
  return (
    <div className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="space-y-2">
        <p>
          <strong>Username:</strong> {ctx.user?.username}
        </p>
        <p>
          <strong>ID:</strong> {ctx.user?.id}
        </p>
      </div>
      <a href="/user/logout">
        <Button type="submit">Logout</Button>
      </a>
    </div>
  );
}
