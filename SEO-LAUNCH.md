# 8NTIC search and AI discoverability

[Certain] No implementation can guarantee first position, indexing, AI citations, or inclusion in every language model. Google explicitly says eligibility does not guarantee indexing or serving. This build provides a crawlable foundation; public release, useful original research and earned authority determine what happens next. [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)

## Implemented foundation

- `lib/seo.ts` provides consistent metadata, canonical URLs, social cards and JSON-LD helpers. The default canonical origin is `https://www.8ntic.com`; `SITE_URL` can override the origin.
- The identity is an independent research umbrella founded by Remco Vroom. QIP is a research project. Metadata does not assert enterprise certifications, sales offers, reviewed scientific results or shipped custom-model capabilities.
- `app/sitemap.ts` lists canonical page URLs and publication routes from the same registry as the visible publication pages. Dates are emitted only when supplied by editors, never derived from build time.
- `app/robots.ts` allows public search, retrieval and training crawlers with a wildcard rule. `/api/` is excluded from crawling. Administrative and subscriber data must be protected by application authorization, not robots directives.
- Vercel preview environments return noindex metadata, disallow crawling and an empty sitemap. `INDEXING_ENABLED=false` explicitly disables indexing elsewhere. Protected previews remain the right access-control measure.
- `app/feed.xml/route.ts` exposes an RSS publication feed. It does not fabricate publication dates.
- `public/llms.txt` provides a concise directory to the same public facts. It is an optional navigation aid, not a ranking instruction, training guarantee or substitute for accessible HTML. If the canonical domain changes, update its absolute links too.
- Site, person, research-project, webpage, article and breadcrumb schema are available. Only add each schema where the corresponding visible content exists. The local QIP thesis introduction is a WebPage about the external publication, avoiding the false implication that the complete original thesis is hosted locally.
- JSON-LD serialization escapes `<` and Unicode line separators before insertion into a script element.

## Integration contract

The root layout uses `siteMetadata` and renders `siteJsonLd` once. Each real page calls `pageMetadata({ title, description, path })` with a unique description and its own path. Publication pages use `publicationMetadata(publication)` and `articleJsonLd(publication)`. Render JSON-LD with `jsonLdStringify()`.

`/opengraph-image` must return the implemented 1200×630 social image. `/icon.svg` must return the approved mascot mark. Visible headings, descriptions and authorship should agree with all machine-readable content. The publication registry, `lib/publications.ts`, owns the slug, title, description, author, source and any verified date.

Do not place the article body exclusively inside a client-side overlay, canvas, video or fetched-on-click panel. Animated previews should link to permanent server-rendered article URLs. Collapsible enhancements can exist around that content without making them the only route to read it.

## What actually supports AI discovery

[Certain] Google applies the normal search fundamentals to AI Overviews and AI Mode: crawl access, internal links, readable text, page experience and structured data that matches visible content. Google does not require a special AI text file or special AI schema. [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)

[Certain] OpenAI separates `OAI-SearchBot` for search from `GPTBot` for potential model training. A site can allow one independently of the other. The current broad public-crawl policy allows both, reflecting the requested openness; training access alone does not establish search visibility. A CDN or firewall can still block valid requests even when robots.txt allows them. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)

[Certain] Bing identifies canonical sitemaps, crawlable links, content clarity and IndexNow notifications as discovery signals for search and AI grounding. IndexNow notifies participating engines about changes; it does not guarantee indexing. [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)

[Likely] The useful inversion is to make the evidence the acquisition engine. QIP should become a citable primary source through clear definitions, reproducible examples, dated research notes and honest limitations. Adding broad claims solely for machines would reproduce the identity mismatch found in the original-site audit.

## Launch work requiring the live domain

1. Set `SITE_URL=https://www.8ntic.com` for the production build, enable indexing, and redirect the apex domain and other permanent aliases to that canonical host. Keep preview hosts protected and noindex.
2. Verify the domain in Google Search Console and Bing Webmaster Tools. `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` can insert the supplied HTML verification values; domain-level DNS verification is also possible. No account verification has been claimed or performed here.
3. Submit `/sitemap.xml` in both tools and inspect the homepage, QIP page and one publication. Confirm a 200 response, correct canonical, server-readable body and no conflicting response-level `X-Robots-Tag`.
4. Inspect actual CDN/firewall responses to valid Googlebot, Bingbot and OAI-SearchBot requests. Verify crawler IPs with the provider's current published method; a user-agent string alone does not establish authenticity.
5. Connect IndexNow only after the production domain and key are ready, then notify on real publication, update and deletion events. No ping has been sent from this local build.
6. Review the Token Gap source claims, benchmark provenance and chart assumptions editorially. Distinguish opinion, illustration and measured evidence. Do not infer a publication date from the file or build timestamp.
7. Publish substantive research regularly with visible author, verified dates and references. Add each publication to the shared registry so links, sitemap and feed stay aligned.
8. Observe impressions, relevant query positions, qualified visits and research engagement. Check Search Console and Bing's available AI reporting, plus real referred visits. A robots allowance or submitted sitemap is not evidence that any model has read or cited the site.

## Validation before calling the release ready

- Build and type-check the app; load every sitemap URL and unknown article slugs.
- Inspect raw server HTML for title, unique description, canonical, main heading, article body and JSON-LD. Confirm article expansion remains usable by keyboard and touch.
- Validate JSON-LD with Schema.org tooling and eligible rich-result types with Google's Rich Results Test. An informational ResearchProject object does not imply a special Google rich result.
- Check `/robots.txt`, `/sitemap.xml`, `/feed.xml`, `/llms.txt`, `/icon.svg` and `/opengraph-image` on the actual production host after deployment.
- Measure page experience on representative phones and constrained networks. Responsive emulation and automated checks do not equal physical-device certification or field Core Web Vitals.

## Local verification on 20 September 2026

[Certain] The local development server returned 200 for all ten canonical pages. Raw HTML contained one main heading and a unique description/canonical on every real page. The complete Token Gap prose was server-rendered, with Article schema, while the QIP thesis introduction used WebPage schema and linked to the external source. Publication previews use native details elements; the reveal styling does not hide initial content.

[Certain] `/robots.txt`, `/sitemap.xml`, `/feed.xml`, `/llms.txt`, `/icon.svg` and `/opengraph-image` returned 200 with appropriate content types. Generic missing pages and unknown publication slugs returned 404 with noindex and no canonical. The unknown publication in development returns a Next.js fallback shell that requires client rendering for its error UI; this should be checked in the production build.

[Certain] Eight tests in `tests/seo.test.ts` cover canonical configuration, publication URLs, sitemap dates, crawler policy, preview exclusion, schema scope, script-safe serialization and publication discovery links. They passed locally. These checks establish implementation behavior, not deployment, indexing or ranking.

## Sources checked on 20 September 2026

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: request recrawling](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Bing: webmaster guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)
- [Bing: IndexNow](https://www.bing.com/webmasters/help/indexnow-0z209wby)
- [OpenAI: crawler controls](https://developers.openai.com/api/docs/bots)
- [Next.js: metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots), [sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

[QIP_CAPTURE]
tier: L2-mid
type: implementation_decision
project: 8NTIC website
date: 2026-09-20
content: Build discoverability around consistent server-rendered research content, permanent publication URLs, truthful metadata and schema, canonical sitemap, RSS, permissive public crawling and optional llms.txt. Treat OAI-SearchBot search access separately from GPTBot training access. Do not promise ranking or AI citation. Keep previews noindex and dates source-based.
persistence: Local file only. No live QIP write or search-engine submission performed.
[/QIP_CAPTURE]
