# 8NTIC Observatory

A working Next.js website for 8NTIC: QIP as the flagship, custom-model research, experiments, publications and beta notifications. It implements the approved dark Observatory direction and preserves the approved mascot-icon-plus-NTIC identity.

## Run

Node 24+ is recommended. Node 25.8.2 was used for local development.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. `npm run build` creates the production build; `npm run start` serves it.

## Experience

- Server-rendered pages and complete publication prose, with isolated client interactions.
- QIP loop: select each stage and follow an illustrative task into its next cycle.
- NTIC companion: camera-eye mascot, three curiosity prompts with useful destinations, and an experiment chooser using the approved icon.
- Expandable Recorder / QIP Adapter explorations and publication previews.
- The Token Gap: original supplied narrative, a playable token-race illustration, static numbers, historical assumptions and sources.
- Subtle ambience and action tones start only after an explicit sound gesture. Sound pauses when the tab is hidden. Motion has a separate control and respects reduced-motion preferences.
- Responsive single-column phone layouts, 44px controls, safe-area support, 16px form inputs, no scroll interception, keyboard navigation and no-JavaScript article reading.

## Publications

Add publication metadata in `lib/publications.ts` and the corresponding authored article content in `app/publications/[slug]/page.tsx`. The registry powers cards, static routes, metadata, sitemap and RSS. Do not invent publication dates or numerical findings. The initial registry has The Token Gap and a truthful introduction linking to the original QIP thesis.

## Beta data

Development saves to `.data/beta-signups.sqlite`, a real private local database, excluded from version control and deployments. Production uses a Supabase RPC with an atomic insert, duplicate-safe consent state and shared rate limits. While the required production configuration is absent, the website shows a prelaunch panel without personal-data fields. The API continues to fail closed until the migration and credentials exist. Rebuild after connecting production configuration so the static pages can show the form.

See `BETA-OPERATIONS.md` and `supabase/migrations/202609200001_beta_signups.sql`. Copy `.env.example` values into secure environment configuration, never into browser variables. A verified public contact address and privacy/retention ownership are still needed before live collection.

No email delivery is implemented. Future communications require verified withdrawal handling and suppression checks before sending.

## Search and AI discovery

Canonical URLs, unique metadata, structured data, sitemap, robots, RSS, social images and an optional `llms.txt` directory are included. The public narrative and metadata describe the same research scope. Vercel previews are noindex and disallowed to crawlers; only the production domain should be indexed.

See `SEO-LAUNCH.md` for Search Console, Bing, domain migration and live indexing steps. Technical SEO scores do not guarantee ranking, citations or inclusion in AI model training.

## Verify

```sh
npm run typecheck
npm test
npx playwright install chromium webkit
npm run test:browser
```

Browser tests use the running local development server. `TEST_BASE_URL` can target the production build. The live database test is deliberately restricted to local development and removes its synthetic signup after verifying the committed row.

The checks cover responsive touch navigation, interactions, no overflow, article metadata, reduced motion, no-JavaScript reading, 404 recovery, form errors, database persistence and automated accessibility. Browser emulation is not a physical iPhone certification. Test on actual devices before the production cutover.

## Deployment

The source repository is [REMgm/8nticweb](https://github.com/REMgm/8nticweb), connected to the existing Vercel project `8nticweb`. Its `main` branch deploys to production at [www.8ntic.com](https://www.8ntic.com).

`vercel.json` explicitly selects Next.js and its build output. `npx vercel deploy` creates a preview; `npx vercel deploy --prod` creates a fresh production build. Do not promote a preview artifact directly: preview builds deliberately contain noindex metadata and a restrictive robots policy. The source illustrations are excluded from deployments; only the optimized assets used by the site are uploaded.

Environment files, subscriber databases, generated verification reports and local design-planning notes are excluded from version control. Production beta collection requires the configuration documented in `BETA-OPERATIONS.md`.
