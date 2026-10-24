// =============================================================================
// Datadog Product Analytics setup (Next.js App Router)
// =============================================================================
//
// WHY ONLY THE RUM PACKAGES? (no separate "Product Analytics" SDK)
//   Product Analytics uses the same SDK and the same data as Datadog RUM
//   (Real User Monitoring). The RUM SDK records one stream of events:
//   sessions, views (page visits) and actions (clicks). RUM uses those
//   events for performance and error monitoring. Product Analytics uses the
//   same events for funnels, user paths, retention and heatmaps.
//     - @datadog/browser-rum        = the browser SDK that collects the events.
//     - @datadog/browser-rum-nextjs = the Next.js integration. It tracks
//       App Router page changes and gives views clean names. It is not a
//       Product Analytics module; RUM-only users also use it.
//   So you turn on Product Analytics in Datadog, not with extra code:
//     Digital Experience > Manage Applications > <your app> >
//     Product Settings > Product Analytics > Enable
//
// The setup has 4 steps:
//   Step 1: install the packages        -> package.json (see README)
//   Step 2: initialise RUM              -> this file
//   Step 3: add the Datadog component   -> app/layout.js
//   Step 4: add error tracking (optional) -> app/error.js, app/global-error.js
//   Step 5: Feature Flags + Experiments (optional) -> this file, app/components/FlagsProvider.js
//
// -----------------------------------------------------------------------------
// STEP 1: Install packages  (requires Next.js v15.3+ and Node.js 18+)
//   npm install @datadog/browser-rum @datadog/browser-rum-nextjs
//
//   NEW TO DATADOG RUM:
//     Install both packages.
//   EXISTING RUM CUSTOMER:
//     You already have @datadog/browser-rum. Install only
//     @datadog/browser-rum-nextjs, and update @datadog/browser-rum to the
//     same version so the two match. Product Analytics needs no extra package.
// -----------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------
// STEP 2: Initialise RUM in instrumentation-client.js (this file)
//   Next.js (v15.3+) runs this file in the browser before the app becomes
//   interactive, so RUM starts collecting events from the very first page.
//
//   NEW TO DATADOG RUM:
//     Create this file with the whole datadogRum.init() call below.
//   EXISTING RUM CUSTOMER:
//     Keep your existing applicationId, clientToken, site, service, env and
//     version. The additions are marked "[NEW]" below:
//       1. plugins: [nextjsPlugin()] and the onRouterTransitionStart export
//          at the bottom of this file. Together they let RUM track App Router
//          page changes.
//       2. remoteConfiguration.id (optional): lets you change sample rates and
//          privacy level from Datadog without redeploying.
//       3. Check these two settings, because Product Analytics depends on them:
//            - sessionSampleRate: 100 (recommended). Funnels and retention
//              need every session; at a lower rate, sessions drop out and the
//              numbers are less accurate.
//            - trackUserInteractions: true. Clicks become "actions", which
//              funnels and heatmaps are built from.
//     If you currently call datadogRum.init() somewhere else (a useEffect, a
//     custom provider, or the CDN <script> snippet), move it here and delete
//     the old call, so RUM is not started twice.
//
//   ARE THE [NEW] LINES REQUIRED FOR PRODUCT ANALYTICS?
//     Not strictly. Datadog's docs say that if RUM is already set up, you do
//     not need to re-instrument for Product Analytics; turning it on is a
//     setting in Datadog. The [NEW] lines come from the current Next.js setup
//     guide, and they are recommended because they make the data cleaner:
//       - Plain RUM notices a page change only after the browser URL changes,
//         and names each view after its raw URL. That is fine for RUM, which
//         mostly looks at single pages and single sessions.
//       - Product Analytics compares steps across many users, and each step
//         is a view name. With nextjsPlugin + onRouterTransitionStart +
//         <DatadogAppRouter />, a page change is recorded the moment it starts
//         (in the right order after the click), and views are named after
//         the route pattern (/product/[id]) instead of every individual URL.
//         Without this, a funnel step like "Product" breaks into one step per
//         product URL.
//       - remoteConfiguration lets you raise sessionSampleRate to 100 for
//         Product Analytics without a redeploy.
//     See the README section "What the [NEW] lines do, and are they required?"
//
//   The values come from NEXT_PUBLIC_DD_* environment variables (see
//   .env.example), so the IDs are not committed to this public repo.
//   Next.js copies them into the browser bundle at build time.
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// STEP 5 (Optional): Datadog Feature Flags and Experiments
//   npm install @datadog/openfeature-browser @openfeature/web-sdk @openfeature/core @openfeature/react-sdk
//
//   Feature Flags use the OpenFeature standard. The DatadogProvider below
//   downloads the flag values for this visitor once, then every flag is
//   evaluated locally (no request per flag). It must start after RUM, so flag
//   evaluations are attached to RUM events, and it uses the same applicationId,
//   clientToken, site and env as RUM.
//
//   Experiments are set up in Datadog on top of a flag. Each evaluation records
//   an "exposure" (this visitor saw variant X). Datadog joins exposures to RUM /
//   Product Analytics events by user id, so the flag targetingKey and
//   datadogRum.setUser({ id }) must be the same value (see app/visitor.js).
//
//   This demo uses two string flags to choose the lead hero banner in each store
//   (see app/flags.js). React components read them with useStringFlagValue();
//   the React provider is in app/components/FlagsProvider.js.
//
//   NOTE: remoteConfiguration (below) overrides the sample rates and privacy level
//   set in code. Set them to the same values in Datadog's Remote Configuration.
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// PRODUCT ANALYTICS SETUP BEST PRACTICES (details in README "Best practices")
//   1. Enable Product Analytics for the app in Datadog. Without the setting,
//      the events only appear in RUM.
//   2. sessionSampleRate: 100 and trackUserInteractions: true (see below).
//   3. Start RUM once, as early as possible: here in instrumentation-client.js.
//   4. Keep view names clean: the Next.js plugin names views by route pattern.
//   5. Name key actions after what the user intends (data-dd-action-name or
//      the Action Management Visual Labeler). See ProductCard.js and Carousel.js.
//   6. Use datadogRum.addAction(name, context) for important events that are
//      not clicks, or that need details (product id, price). See ProductCard.js.
//   7. Identify logged-in users with setUser / clearUser. See Header.js.
//   8. Protect privacy: defaultPrivacyLevel 'mask-user-input' (or stricter),
//      and enablePrivacyForActionName if button text could contain personal data.
//   9. Tag every event with service, env and version. Use a separate env for
//      test traffic (this demo uses env: 'demo') so it can be filtered out.
// -----------------------------------------------------------------------------
import { datadogRum } from '@datadog/browser-rum';
import { nextjsPlugin } from '@datadog/browser-rum-nextjs'; // [NEW] Next.js integration
import { DatadogProvider, withTimeout } from '@datadog/openfeature-browser'; // Step 5: Feature Flags
import { OpenFeature } from '@openfeature/web-sdk'; //                              Step 5: Feature Flags
import { getVisitorId } from './app/visitor';

const applicationId = process.env.NEXT_PUBLIC_DD_APPLICATION_ID;
const clientToken = process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN;
const site = process.env.NEXT_PUBLIC_DD_SITE || 'datadoghq.com';
const env = 'demo'; //                e.g. 'prod', 'staging-1', 'dev'

if (applicationId && clientToken) {
  datadogRum.init({
    applicationId,
    clientToken,
    remoteConfiguration: {
      // [NEW] Remote Configuration (optional): manage sampling and privacy settings from Datadog
      id: process.env.NEXT_PUBLIC_DD_REMOTE_CONFIG_ID,
    },
    site,
    service: 'supermarket-web',
    env,
    version: '1.0.0', //              e.g. '1.0.0'
    sessionSampleRate: 100, //        capture 100% of sessions (recommended for Product Analytics)
    sessionReplaySampleRate: 100, //  capture 100% of sessions with replay
    trackResources: true, //          Enable Resource tracking
    trackUserInteractions: true, //   Enable Action tracking (needed for Product Analytics)
    trackLongTasks: true, //          Enable Long Tasks tracking
    trackFeatureFlagsForEvents: ['action'], // also attach flag values to clicks (views and errors get them by default)

    // ----- Recommended Options -----
    // allowedTracingUrls: '<BACKEND_URL>',     // Enable distributed tracing
    defaultPrivacyLevel: 'mask-user-input', // 'mask-user-input' | 'allow' | 'mask'
    plugins: [nextjsPlugin()], // [NEW] Next.js integration
  });

  // Identify the visitor (best practice 7). The demo has no login, so a random id
  // kept in localStorage stands in for the user id. Experiments need it to match
  // the flag targetingKey below.
  const visitorId = getVisitorId();
  datadogRum.setUser({ id: visitorId });

  // Step 5: start Datadog Feature Flags after RUM. setProvider() does not block
  // the page; flag hooks return their default value until the flags arrive.
  const flagProvider = new DatadogProvider({
    applicationId,
    clientToken,
    site,
    env,
    flagConfigurationFetch: withTimeout(globalThis.fetch, 3_000),
  });
  OpenFeature.setProvider(flagProvider, { targetingKey: visitorId });
} else {
  console.warn('[Datadog] NEXT_PUBLIC_DD_APPLICATION_ID / NEXT_PUBLIC_DD_CLIENT_TOKEN not set - RUM disabled.');
}

// [NEW] Next.js calls this hook on every client-side navigation (for example,
// banner -> category page). The Next.js integration uses it to start a new RUM view.
export { onRouterTransitionStart } from '@datadog/browser-rum-nextjs';
