import styles from './styles.css?url';
import type { ReactNode } from 'react';

export const NoJSDocument = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="stylesheet" href={styles} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>RedwoodSDK v1.0</title>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};
