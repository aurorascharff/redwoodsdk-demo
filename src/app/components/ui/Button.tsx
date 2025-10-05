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
  hideSpinner?: boolean;
};

export default function Button({
  children,
  loading,
  type = 'submit',
  variant = 'primary',
  className,
  disabled,
  hideSpinner,
  ...otherProps
}: Props & React.HTMLProps<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  const isSubmitting = (pending || loading) && !hideSpinner;

  return (
    <button
      disabled={isSubmitting || disabled}
      type={type}
      className={cn(
        'focus-visible:outline-primary rounded-lg border px-4 py-2 font-medium -outline-offset-1 transition-colors focus-visible:outline-2',
        variant === 'primary'
          ? 'bg-primary border-primary enabled:hover:bg-primary-dark text-white disabled:cursor-not-allowed disabled:opacity-60'
          : 'border-border bg-surface dark:bg-surface-dark text-text dark:text-text-dark enabled:hover:border-gray-300 enabled:hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:enabled:hover:border-gray-600 dark:enabled:hover:bg-gray-800',
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
