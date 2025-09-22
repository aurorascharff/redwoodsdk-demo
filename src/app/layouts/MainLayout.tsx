import { link } from '@/app/shared/links';
import Button from '../components/ui/Button';
import type { PropsWithChildren } from 'react';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative">
      <div className="absolute top-8 left-8 z-10 sm:top-12 sm:left-12">
        <a href={link('/')}>
          <Button type="button" variant="tertiary" className="flex items-center gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
        </a>
      </div>
      {children}
    </div>
  );
}
