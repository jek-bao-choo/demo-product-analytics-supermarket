'use client';

import { OpenFeatureProvider } from '@openfeature/react-sdk';

// STEP 5 (part 2 of 2): make Datadog Feature Flags available to React components.
// The DatadogProvider itself is registered in instrumentation-client.js. If it is
// not (no env vars), the flag hooks simply return their default values.
export default function FlagsProvider({ children }) {
  return <OpenFeatureProvider>{children}</OpenFeatureProvider>;
}
