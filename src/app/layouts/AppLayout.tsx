import GitHubIcon from '../components/ui/icons/GitHubIcon';
import type { LayoutProps } from 'rwsdk/router';

export default async function AppLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-dvh flex-col justify-between px-4 xl:px-40 2xl:px-60">
      {children}
      <footer className="relative z-10">
        <div className="flex flex-col items-center justify-center gap-4 p-4 sm:flex-row sm:justify-between sm:p-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a href="https://rwsdk.com/" target="_blank" rel="noopener noreferrer" className="nav-link">
              <span>📚</span>
              <span>RedwoodSDK</span>
            </a>
            <span className="hidden opacity-30 sm:inline">•</span>
            <a href="https://github.com/redwoodjs/sdk" target="_blank" rel="noopener noreferrer" className="nav-link">
              <GitHubIcon className="h-4 w-4" />
              <span>RedwoodSDK</span>
            </a>
          </div>
          <div className="text-xs opacity-50">Built with RedwoodSDK</div>
        </div>
      </footer>
    </div>
  );
}
