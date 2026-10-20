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

## Where to add Datadog
Initialise the Datadog Browser SDK in a client component rendered from `app/layout.js` (see the TODO comment there).
