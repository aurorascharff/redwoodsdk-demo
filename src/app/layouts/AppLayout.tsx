import type { PropsWithChildren } from 'react';

export default async function AppLayout({ children }: PropsWithChildren) {
  return <div className="mb-12 flex grow flex-col px-4 py-2 sm:p-10 xl:px-40 2xl:px-60">{children}</div>;
}
