'use client';

// STEP 4 (Optional): Add error tracking. Part 1 of 2: app/error.js
//   Next.js shows this screen when a page or component throws an error.
//   addNextjsError() reports that error to Datadog RUM, so it appears in the
//   user's session alongside their views and clicks. In Product Analytics you
//   can then see where errors cause users to drop out of a funnel.
//
//   NEW TO DATADOG RUM:
//     Create this file and app/global-error.js.
//   EXISTING RUM CUSTOMER:
//     This is a new addition. If your error screen already calls
//     datadogRum.addError(error), replace that call with addNextjsError(error).
//     It adds Next.js details such as the error digest.

import { useEffect } from 'react';
import { addNextjsError } from '@datadog/browser-rum-nextjs';

export default function Error({ error, reset }) {
  useEffect(() => {
    addNextjsError(error);
  }, [error]);

  return (
    <section className="section">
      <h2>Something went wrong.</h2>
      <button className="btn btn-solid" onClick={reset}>Try again</button>
    </section>
  );
}
