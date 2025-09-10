import { cn } from '@/utils/cn';
import type { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface dark:bg-surface-dark border-border dark:border-border-dark text-text dark:text-text-dark relative rounded-3xl border-2 shadow-2xl backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
