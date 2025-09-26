import { cn } from '@/utils/cn';

type Props = {
  className?: string;
  size?: number;
};

export default function SpinnerIcon({ className, size = 16 }: Props) {
  return (
    <svg
      className={cn('animate-spin text-orange-500', className)}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <path d="M15 8A7 7 0 1 1 8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
