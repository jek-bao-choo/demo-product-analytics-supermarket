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

The instrumentation follows the 4-step setup guide in the Datadog app. Each step is marked `STEP 1`–`STEP 4` in the code comments. Every step also says what to change if you are **new to Datadog RUM** and what is **new for an existing RUM customer**.

| Step | What | Where |
|---|---|---|
| 1 | `npm install @datadog/browser-rum @datadog/browser-rum-nextjs` | `package.json` |
| 2 | Initialise RUM with `nextjsPlugin()` | `instrumentation-client.js` |
| 3 | Add `<DatadogAppRouter />` | `app/layout.js` |
| 4 | (Optional) Report errors with `addNextjsError()` | `app/error.js`, `app/global-error.js` |

**Why is there no separate Product Analytics SDK?** Product Analytics uses the same SDK and data as RUM: sessions, views and actions. Turn it on per application in Datadog under **Digital Experience → Manage Applications → your app → Product Settings → Product Analytics → Enable**. `@datadog/browser-rum-nextjs` is the Next.js routing integration, not a Product Analytics module.

**Existing RUM customers, in short:**
- Add `@datadog/browser-rum-nextjs`.
- Add `nextjsPlugin()` and the `onRouterTransitionStart` export.
- Add `<DatadogAppRouter />`.
- Use `sessionSampleRate: 100` and `trackUserInteractions: true`.
- Enable Product Analytics in the Datadog UI.

### Configuration
The Datadog IDs are read from environment variables so they are not committed:
```bash
cp .env.example .env.local   # then fill in the values from Datadog
```
On **AWS Amplify**, add the same `NEXT_PUBLIC_DD_*` keys under **App settings → Environment variables** and redeploy. Next.js inlines them at build time. If the variables are missing, the site still works, but RUM stays off.
