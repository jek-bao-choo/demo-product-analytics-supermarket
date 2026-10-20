# Supermarket – Product Analytics demo site

A two-level mockup grocery site built with Next.js (static export) for demoing Datadog Product Analytics.

- **Level 1:** `/` – Homepage (hero carousel, promo banners, vouchers, flash deals)
- **Level 2:** `/category/snacks--confectionery/` – reached from any hero slide, either side banner, or **Categories → Snacks & Confectionery**

## Run locally
```bash
npm install
npm run dev          # http://localhost:3000
```

## Build the static site
```bash
npm run build        # outputs to ./out
npm start            # serves ./out for a quick check
```

## Deploy to AWS Amplify Hosting
1. Push this folder to a Git repo (GitHub/CodeCommit/etc.).
2. In Amplify, choose **Create new app → Host web app**, connect the repo and branch.
3. Amplify detects `amplify.yml` (`npm ci` → `npm run build` → publish `out/`). Deploy.

   Alternatively, run `npm run build` and drag-and-drop the `out/` folder via **Deploy without Git**.

## Datadog Product Analytics

The instrumentation follows the 4-step setup guide in the Datadog app. Each step is marked `STEP 1`–`STEP 4` in the code comments. Every step also says what to change if you are **new to Datadog RUM** and what is **new for an existing RUM customer**. In Step 2, the lines an existing customer adds are marked `[NEW]`.

### Where each step lives

| Step | What | File |
|---|---|---|
| 1 | Install `@datadog/browser-rum` and `@datadog/browser-rum-nextjs` | `package.json` (comment in `instrumentation-client.js`) |
| 2 | Start RUM with `nextjsPlugin()` and export `onRouterTransitionStart` | `instrumentation-client.js` |
| 3 | Add `<DatadogAppRouter />` | `app/layout.js` |
| 4 (optional) | Report errors with `addNextjsError()` | `app/error.js`, `app/global-error.js` |

### Why is there no separate Product Analytics SDK?
Product Analytics uses the same SDK and the same data as RUM: sessions, page views and clicks (actions). The SDK collects one stream of events. RUM uses it for performance and error monitoring, and Product Analytics uses it for funnels, user paths, retention and heatmaps. So Product Analytics is turned on in Datadog, not in code:

**Digital Experience → Manage Applications → your app → Product Settings → Product Analytics → Enable**

`@datadog/browser-rum-nextjs` is the Next.js integration. It tracks page changes and names views. It is not a Product Analytics module, and customers who only use RUM use it too.

### What the `[NEW]` lines do, and are they required?

**Short answer: Product Analytics itself does not require the `[NEW]` lines.** Datadog's docs state that if RUM is already set up, you don't need to instrument the app again for Product Analytics. The `[NEW]` lines come from the current **Next.js** setup guide, which now includes the Next.js integration and Remote Configuration. They are recommended because they make Product Analytics data cleaner.

| `[NEW]` line | What it does | Without it (plain RUM) | Why it helps Product Analytics |
|---|---|---|---|
| `import { nextjsPlugin }` + `plugins: [nextjsPlugin()]` | Connects the RUM SDK to Next.js | RUM still works. It notices page changes when the browser URL changes. | Views are named after the route pattern, such as `/product/[id]`, instead of every individual URL. |
| `export { onRouterTransitionStart }` | Next.js calls this when a navigation **starts**, for example the moment a banner is clicked | A new view starts only after the URL has changed | The click and the page change are recorded in the right order, so paths and funnels show what the user actually did. |
| `<DatadogAppRouter />` (Step 3) | Follows App Router page changes and applies the route-pattern view names | You would track page changes yourself, or rely on URL changes | The same as above: one consistent view name per page type |
| `remoteConfiguration.id` | Lets you change sample rates and privacy level from Datadog | Changing settings means editing code and redeploying | You can raise the session sample rate to 100% for Product Analytics without a redeploy. |

**Why plain RUM managed without them:** RUM dashboards mostly look at single pages and single sessions, for example "how slow is this page?" or "what errors did this user hit?". Datadog can also group similar URLs for those views. A raw URL as the view name is usually good enough there.

**Why they matter more for Product Analytics:** funnels, user paths and retention compare steps across thousands of users, and each step is a view name. If every product page has its own URL (`/product/123`, `/product/456`, …), a "Home → Product → Cart" funnel breaks into thousands of separate "Product" steps. Route-pattern names keep them as one step. In this demo the pages have fixed URLs, so the names look the same either way. On a real store with product IDs in the URL, the difference shows.

**The settings Product Analytics really depends on** are existing RUM options, not `[NEW]` lines:
- `sessionSampleRate: 100`, so funnels and retention see every session. Many RUM customers sample lower to save cost.
- `trackUserInteractions: true`, so clicks are recorded as actions.

### For an existing RUM customer, the additions are:
1. Install `@datadog/browser-rum-nextjs`, and update `@datadog/browser-rum` to the same version.
2. Add `nextjsPlugin()` and the `onRouterTransitionStart` export. Optionally add `remoteConfiguration.id`.
3. Check `sessionSampleRate: 100`, so funnels and retention see every session, and `trackUserInteractions: true`, so clicks are recorded as actions.
4. Move any existing `datadogRum.init()` into `instrumentation-client.js`, so RUM isn't started twice.
5. Add `<DatadogAppRouter />`. It replaces any page-change tracking you wrote yourself.
6. Optionally swap `datadogRum.addError` for `addNextjsError`.
7. **Turn on Product Analytics in Datadog** (no code): Digital Experience → Manage Applications → your app → Product Settings → Product Analytics → Enable.

Only step 7 is strictly required to start using Product Analytics. Step 3 is strongly recommended. Steps 1, 2, 4, 5 and 6 adopt the Next.js integration for cleaner data.

### For a customer new to Datadog RUM
Follow Steps 1–4 as they are in this repo, then enable Product Analytics in Datadog (step 7 above).

### Keeping your IDs out of the public repo
- The code reads the IDs from `NEXT_PUBLIC_DD_*` environment variables instead of hardcoding them.
- Put your real values in `.env.local`, which git ignores:
  ```bash
  cp .env.example .env.local   # then fill in the values from Datadog
  ```
- `.env.example` (committed) lists the keys you need, with no values.
- The `clientToken` is designed to be public: it starts with `pub` and ends up in the browser's JavaScript anyway. Keeping it in env vars just avoids publishing it on GitHub for good.

### Before the Amplify site sends data, you need to do two things
1. **Add the variables in Amplify:** App settings → Environment variables. Add the four `NEXT_PUBLIC_DD_*` keys from your `.env.local`, then redeploy. Next.js copies them into the site at build time. Without them the site still works, but Datadog stays off.
2. **Enable Product Analytics** for this application in the Datadog UI, if it isn't already on.

> Note: `@datadog/browser-rum-nextjs` describes itself as being in Preview in its README, so its features and configuration may change.
