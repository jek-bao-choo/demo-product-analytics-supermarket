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

const applicationId = process.env.NEXT_PUBLIC_DD_APPLICATION_ID;
const clientToken = process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN;

if (applicationId && clientToken) {
  datadogRum.init({
    applicationId,
    clientToken,
    remoteConfiguration: {
      // [NEW] Remote Configuration (optional): manage sampling and privacy settings from Datadog
      id: process.env.NEXT_PUBLIC_DD_REMOTE_CONFIG_ID,
    },
    site: process.env.NEXT_PUBLIC_DD_SITE || 'datadoghq.com',
    service: 'supermarket-web',
    env: 'demo', //                   e.g. 'prod', 'staging-1', 'dev'
    version: '1.0.0', //              e.g. '1.0.0'
    sessionSampleRate: 100, //        capture 100% of sessions (recommended for Product Analytics)
    sessionReplaySampleRate: 20, //   capture 20% of sessions with replay
    trackResources: true, //          Enable Resource tracking
    trackUserInteractions: true, //   Enable Action tracking (needed for Product Analytics)
    trackLongTasks: true, //          Enable Long Tasks tracking

    // ----- Recommended Options -----
    // allowedTracingUrls: '<BACKEND_URL>',     // Enable distributed tracing
    // defaultPrivacyLevel: 'mask-user-input',  // 'mask-user-input' | 'allow' | 'mask'
    plugins: [nextjsPlugin()], // [NEW] Next.js integration
  });
} else {
  console.warn('[Datadog] NEXT_PUBLIC_DD_APPLICATION_ID / NEXT_PUBLIC_DD_CLIENT_TOKEN not set - RUM disabled.');
}

// [NEW] Next.js calls this hook on every client-side navigation (for example,
// banner -> category page). The Next.js integration uses it to start a new RUM view.
export { onRouterTransitionStart } from '@datadog/browser-rum-nextjs';
