import HomeButton from '../components/HomeButton';
import type { LayoutProps } from 'rwsdk/router';

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className="relative my-4 h-full w-full sm:my-16">
      <div className="absolute top-0 left-0 z-10 sm:top-6 sm:left-6">
        <HomeButton />
      </div>
      <div className="flex w-full justify-center py-16">{children}</div>
    </div>
  );
}
