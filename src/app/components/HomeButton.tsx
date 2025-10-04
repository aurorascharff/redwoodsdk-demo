import React from 'react';
import { link } from '../shared/links';

export default function HomeButton() {
  return (
    <a
      href={link('/')}
      className="border-border/20 dark:border-border-dark/30 text-text dark:text-text-dark hover:text-accent dark:hover:text-accent-dark flex h-10 w-10 items-center justify-center rounded-full border bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/95 active:scale-95 dark:bg-black/60 dark:hover:bg-black/80"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </a>
  );
}
