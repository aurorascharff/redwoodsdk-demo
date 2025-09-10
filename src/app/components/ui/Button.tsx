'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/utils/cn';
import Spinner from './Spinner';

type Props = {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export default function Button({
  children,
  loading,
  type = 'submit',
  variant = 'primary',
  className,
  disabled,
  ...otherProps
}: Props & React.HTMLProps<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  const isSubmitting = pending || loading;

  return (
    <button
      disabled={isSubmitting || disabled}
      type={type}
      className={cn(
        'focus-visible:outline-primary rounded-lg border px-4 py-2 font-medium -outline-offset-1 transition-colors focus-visible:outline-2',
        variant === 'primary'
          ? 'bg-primary border-primary enabled:hover:bg-primary-dark disabled:bg-primary-darker text-white'
          : 'border-border bg-surface dark:bg-surface-dark enabled:hover:bg-surface-elevated dark:enabled:hover:bg-surface-elevated-dark enabled:hover:border-text-muted dark:enabled:hover:border-text-muted-dark text-text dark:text-text-dark disabled:opacity-60',
        className,
      )}
      {...otherProps}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center gap-2">
          {children}
          <Spinner
            className={variant === 'primary' ? 'text-white' : 'text-amber-900 dark:text-amber-100'}
            width={16}
            height={16}
          />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
