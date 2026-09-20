import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import {
  absoluteUrl, articleJsonLd, breadcrumbJsonLd, jsonLdStringify,
  pageMetadata, publicationMetadata, PUBLICATION_SEO, PUBLIC_ROUTES, INDEXING_ENABLED,
  qipJsonLd, SITE_URL, siteJsonLd,
} from "../lib/seo.ts";
import sitemap from "../app/sitemap.ts";
import robots from "../app/robots.ts";
import { GET as getFeed } from "../app/feed.xml/route.ts";

test("every public route has an absolute canonical and unique publication slugs", () => {
  const slugs = PUBLICATION_SEO.map(({ slug }) => slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const path of PUBLIC_ROUTES) {
    const metadata = pageMetadata({ path, title: "An authored title", description: "An authored description" });
    assert.equal(metadata.alternates?.canonical, `${SITE_URL}${path}`);
    assert.deepEqual(metadata.title, { absolute: "An authored title | 8NTIC" });
    assert.equal(new URL(String(metadata.alternates?.canonical)).origin, SITE_URL);
  }
  for (const publication of PUBLICATION_SEO) {
    assert.equal(publicationMetadata(publication).alternates?.canonical, absoluteUrl(`/publications/${publication.slug}`));
    assert.match(publication.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});

test("sitemap contains exactly the canonical public pages without invented freshness", () => {
  const entries = sitemap();
  const expected = [...PUBLIC_ROUTES, ...PUBLICATION_SEO.map(({ slug }) => `/publications/${slug}`)].map(absoluteUrl);
  assert.deepEqual(entries.map(({ url }) => url).sort(), INDEXING_ENABLED ? expected.sort() : []);
  for (const entry of entries) {
    assert.equal(entry.url.includes("#"), false);
    assert.equal(entry.url.includes("?"), false);
    if (entry.lastModified) assert.ok(Number.isFinite(new Date(entry.lastModified).getTime()));
  }
  for (const publication of PUBLICATION_SEO.filter((item) => !item.date && !item.updatedAt)) {
    const entry = entries.find(({ url }) => url.endsWith(`/publications/${publication.slug}`));
    assert.equal(entry?.lastModified, undefined);
  }
});

test("crawl policy follows deployment eligibility without blocking rendering resources", () => {
  const rules = robots();
  assert.deepEqual(rules.rules, INDEXING_ENABLED
    ? { userAgent: "*", allow: "/", disallow: ["/api/"] }
    : { userAgent: "*", disallow: "/" });
  assert.equal(rules.sitemap, INDEXING_ENABLED ? absoluteUrl("/sitemap.xml") : undefined);
});

test("preview and explicit disable cannot advertise an indexable deployment", () => {
  for (const environment of [
    { VERCEL_ENV: "preview", INDEXING_ENABLED: "true" },
    { VERCEL_ENV: "development", INDEXING_ENABLED: "true" },
    { VERCEL_ENV: "production", INDEXING_ENABLED: "false" },
  ]) {
    const script = `
      import { INDEXING_ENABLED, siteMetadata } from './lib/seo.ts';
      import robots from './app/robots.ts';
      import sitemap from './app/sitemap.ts';
      console.log(JSON.stringify({enabled:INDEXING_ENABLED, metadata:siteMetadata.robots, robots:robots(), sitemap:sitemap()}));
    `;
    const child = spawnSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "-e", script], {
      cwd: new URL("..", import.meta.url),
      env: { ...process.env, ...environment }, encoding: "utf8",
    });
    assert.equal(child.status, 0, child.stderr);
    const output = JSON.parse(child.stdout.trim());
    assert.equal(output.enabled, false);
    assert.deepEqual(output.metadata, { index: false, follow: false });
    assert.deepEqual(output.robots.rules, { userAgent: "*", disallow: "/" });
    assert.deepEqual(output.sitemap, []);
  }
});

test("canonical origin can be configured without carrying a path or credentials", () => {
  const script = "import { absoluteUrl } from './lib/seo.ts'; console.log(absoluteUrl('/qip'));";
  const custom = spawnSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "-e", script], {
    cwd: new URL("..", import.meta.url), env: { ...process.env, SITE_URL: "https://research.example/some-path" }, encoding: "utf8",
  });
  assert.equal(custom.status, 0, custom.stderr);
  assert.equal(custom.stdout.trim(), "https://research.example/qip");
  const invalid = spawnSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "-e", script], {
    cwd: new URL("..", import.meta.url), env: { ...process.env, SITE_URL: "https://user:password@example.com" }, encoding: "utf8",
  });
  assert.notEqual(invalid.status, 0);
});

test("research and publication schema reflect author, source and actual content scope", () => {
  assert.equal(qipJsonLd["@type"], "ResearchProject");
  assert.equal(qipJsonLd.name, "Quantum Intelligence Protocol");
  assert.match(qipJsonLd.description, /research/i);
  assert.equal(siteJsonLd["@graph"].some((entry) => entry["@type"] === "Person" && entry.name === "Remco Vroom"), true);
  for (const publication of PUBLICATION_SEO) {
    const schema = articleJsonLd(publication);
    assert.equal(schema.url, absoluteUrl(`/publications/${publication.slug}`));
    if (publication.type === "research-thesis") {
      assert.equal(schema["@type"], "WebPage");
      assert.ok("about" in schema);
      if ("about" in schema) assert.equal(schema.about.url, publication.source?.url);
    } else {
      assert.equal(schema["@type"], "Article");
      assert.ok("author" in schema);
      if ("author" in schema) assert.equal(schema.author.name, publication.author);
      assert.equal("datePublished" in schema, Boolean(publication.date));
    }
  }
  const encoded = JSON.stringify([siteJsonLd, qipJsonLd]);
  for (const unsupported of ["AggregateRating", "SearchAction", "SOC 2", "ISO 27001"]) assert.equal(encoded.includes(unsupported), false);
});

test("JSON-LD cannot terminate its script and survives a round trip", () => {
  const value = { headline: '</script><script>alert("x")</script>\u2028\u2029' };
  const serialized = jsonLdStringify(value);
  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes("\u2028"), false);
  assert.equal(serialized.includes("\u2029"), false);
  assert.deepEqual(JSON.parse(serialized), value);
  const breadcrumbs = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Publications", path: "/publications" }]);
  assert.deepEqual(breadcrumbs.itemListElement.map(({ position }) => position), [1, 2]);
});

test("RSS and llms directory link to the publication registry and public page routes", async () => {
  const response = getFeed();
  const xml = await response.text();
  assert.match(response.headers.get("Content-Type") || "", /application\/rss\+xml/);
  assert.equal((xml.match(/<item>/g) || []).length, PUBLICATION_SEO.length);
  for (const publication of PUBLICATION_SEO) assert.ok(xml.includes(absoluteUrl(`/publications/${publication.slug}`)));
  assert.equal((xml.match(/<pubDate>/g) || []).length, PUBLICATION_SEO.filter(({ date }) => date).length);
  const llms = readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8");
  const knownPaths = new Set([...PUBLIC_ROUTES, ...PUBLICATION_SEO.map(({ slug }) => `/publications/${slug}`), "/feed.xml", "/sitemap.xml"]);
  for (const match of llms.matchAll(/\]\((https:\/\/www\.8ntic\.com[^)]*)\)/g)) {
    assert.ok(knownPaths.has(new URL(match[1]).pathname), `Unknown llms.txt path: ${match[1]}`);
  }
});
