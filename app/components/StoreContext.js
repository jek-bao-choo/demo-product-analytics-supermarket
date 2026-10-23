'use client';

import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

// PRODUCT ANALYTICS BEST PRACTICE: when one RUM application covers several sites or
// brands, add a global context property so every view and action says which one it
// came from. Funnels, paths and heatmaps can then be filtered by @context.store
// (for example store:furniture-mart). The directory page has no store, so the
// property is removed when the user leaves a store.
export default function StoreContext({ store }) {
  useEffect(() => {
    datadogRum.setGlobalContextProperty('store', store);
    return () => datadogRum.removeGlobalContextProperty('store');
  }, [store]);

  return null;
}
