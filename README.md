# Demo stores – Product Analytics demo site

Two two-level mockup stores built with Next.js (static export) for demoing Datadog Product Analytics. The home page `/` is a directory that links to both stores.

**Supermarket** (grocery)
- **Level 1:** `/supermarket/` – Homepage (hero carousel, promo banners, vouchers, flash deals)
- **Level 2:** `/supermarket/category/snacks--confectionery/` – reached from any hero slide, either side banner, or **Categories → Snacks & Confectionery**

**Furniture Mart** (home furnishing)
- **Level 1:** `/furniture-mart/` – Homepage (hero carousel, Shop by categories / Shop rooms tiles, top picks, lower prices)
- **Level 2:** `/furniture-mart/category/sofas-armchairs/` – reached from any hero slide, the **New**, **Our top picks** or **Sofas & armchairs** tiles, the **Living room** room tile, or **Products → Sofas & armchairs**

Both stores share one RUM application. Each store's layout sets a `store` global context property (`supermarket` or `furniture-mart`, see `app/components/StoreContext.js`), so you can filter funnels and paths by `@context.store`.

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
| 5 (optional) | Datadog Feature Flags (`DatadogProvider` + OpenFeature) for Experiments | `instrumentation-client.js`, `app/components/FlagsProvider.js` |

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

### Product Analytics setup best practices

These are collected from Datadog's Product Analytics and RUM docs. Each one is also noted in the code comments where it applies.

| # | Best practice | Why | In this repo |
|---|---|---|---|
| 1 | **Enable Product Analytics per application** in Datadog (Manage Applications → Product Settings → Product Analytics) | Without this setting, the events only appear in RUM | Done in the Datadog UI |
| 2 | **`sessionSampleRate: 100`** and **`trackUserInteractions: true`** | Funnels, retention and paths need every session, and clicks become the actions they are built from | `instrumentation-client.js` |
| 3 | **Start RUM once, as early as possible** | A second start, or a late start, causes duplicate or missing views | `instrumentation-client.js` (Next.js runs it before the app becomes interactive) |
| 4 | **Keep view names clean**, one name per page type | Each funnel step is a view name; raw URLs split a step into many | `nextjsPlugin()` + `<DatadogAppRouter />` |
| 5 | **Name key actions after what the user intends**, with `data-dd-action-name` or the Action Management **Visual Labeler** (no code, also applies to past data) | Names based on button text change when the copy changes, and identical buttons can't be told apart | Done: `Hero banner: <id>` on hero banners (`Carousel.js`, `FmCarousel.js`) and `Add to cart` on both stores' buttons. Comment in `PromoBanners.js` |
| 6 | **Use `datadogRum.addAction(name, context)`** for important events that aren't clicks, or that need details | Lets you filter funnels by product, price or campaign | Comment in `ProductCard.js` (e.g. `cart_add` with `product_id`) |
| 7 | **Identify users**: call `datadogRum.setUser({ id })` after login and `clearUser()` on logout. Use `setAccount` for business accounts | User profiles and retention group by the user id. Anonymous visitors are still tracked with `usr.anonymous_id` | `instrumentation-client.js` calls `setUser` with a random visitor id kept in localStorage (`app/visitor.js`), because the demo has no login |
| 8 | **Protect privacy**: `defaultPrivacyLevel: 'mask-user-input'` or stricter. Turn on `enablePrivacyForActionName` if button text could contain personal data. Prefer internal user ids over email or name | Session Replay and action names can capture what is on screen. Explicit `data-dd-action-name` values still show when other names are masked | `defaultPrivacyLevel: 'mask-user-input'` in `instrumentation-client.js` |
| 9 | **Tag `service`, `env` and `version`**, and use a separate `env` for test traffic | Lets you filter test traffic out and compare releases | `service: 'supermarket-web'`, `env: 'demo'`, `version: '1.0.0'` |
| 10 | **Add global context when one app covers several sites**: `datadogRum.setGlobalContextProperty('store', ...)` | Every view and action carries the store, so funnels, paths and heatmaps can be filtered per site | `app/components/StoreContext.js`, used in each store's `layout.js` |
| 11 | **Plan for server-side events separately** | Events sent through the Product Analytics API are billed separately | Not used here |

Product Analytics keeps data for 15 months by default.

**References:** [Product Analytics](https://docs.datadoghq.com/product_analytics/) · [Tracking user actions](https://docs.datadoghq.com/real_user_monitoring/browser/tracking_user_actions/) · [Profiles (setUser / setAccount)](https://docs.datadoghq.com/product_analytics/profiles/) · [Action Management](https://docs.datadoghq.com/product_analytics/action_management/) · [Advanced configuration](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/browser/advanced_configuration/)

### Session Replay, Feature Flags and Experiments

- **RUM and Session Replay record 100% of sessions** (`sessionSampleRate: 100`, `sessionReplaySampleRate: 100`), with `defaultPrivacyLevel: 'mask-user-input'`, so typed text is masked in replays.
- **Remote Configuration overrides these values.** The configuration behind `NEXT_PUBLIC_DD_REMOTE_CONFIG_ID` is currently empty, so the values in code apply. If you set sample rates or privacy there, set them to the same values.

**Feature flags on the hero banners.** Each store's home page asks a string flag which campaign to show first. The flag value is a slide id:

| Flag key | Variants | Control (code default) |
|---|---|---|
| `supermarket_hero_campaign` | `free-gift-tote`, `snack-fest`, `weekly-deals` | `free-gift-tote` |
| `furniture_mart_hero_campaign` | `make-room-to-celebrate`, `sofa-week`, `cosy-corners` | `make-room-to-celebrate` |

- If a flag doesn't exist, or the flags can't be loaded within 3 seconds, the banner falls back to the control.
- While flags load, the banner keeps its space but shows no campaign, so visitors don't see one campaign swap to another.
- Flag values are attached to RUM views, errors and (via `trackFeatureFlagsForEvents: ['action']`) clicks.

**Why a visitor id?** Experiments assign each subject to a variant using the flag `targetingKey`, then join those exposures to RUM and Product Analytics events by `usr.id`. Both must be the same and must stay the same between visits. With no login, `app/visitor.js` generates a random id once and keeps it in localStorage. A real app would use its internal user id after login.

**Set up in Datadog (UI)**

1. **Product Analytics:** Digital Experience → Manage Applications → this app → Product Settings → Product Analytics → Enable.
2. **Feature Flags:** create both string flags with the variants above. Enable them in the flag environment that `env: 'demo'` maps to. In this org that is **Staging**: the flags API answers for `demo` with the environment "Staging". The default (served) variant is the control.
3. **Experiments:** on each flag, click **Create New Experiment**, or use Product Analytics → Experiments.
   - **Subject type:** User (`@usr.id`).
   - **Variants:** control vs `snack-fest` / `sofa-week`, 50/50.
   - **Primary metric:** sessions that view the level-2 page (`/supermarket/category/snacks--confectionery`, `/furniture-mart/category/sofas-armchairs`).
   - **Secondary metrics:** `Hero banner: *` clicks and `Add to cart` clicks.

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
