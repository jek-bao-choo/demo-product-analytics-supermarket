'use client';

// STEP 4 (Optional): Add error tracking. Part 2 of 2: app/global-error.js
//   Catches errors thrown in the root layout itself, which app/error.js
//   cannot catch. This screen replaces the whole page, so it must render its
//   own <html> and <body>.
//
//   NEW TO DATADOG RUM / EXISTING RUM CUSTOMER: same as app/error.js.

import { useEffect } from 'react';
import { addNextjsError } from '@datadog/browser-rum-nextjs';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    addNextjsError(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
