import { cn } from '@/utils/cn';

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface dark:bg-surface-dark border-border dark:border-border-dark text-text dark:text-text-dark rounded-3xl border-2 shadow-2xl backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
