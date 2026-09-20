import type { MetadataRoute } from "next";
import { absoluteUrl, INDEXING_ENABLED } from "../lib/seo.ts";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXING_ENABLED) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    // Public search, retrieval and training crawlers are all allowed. robots.txt
    // is crawl guidance, never access control for subscriber or administrative data.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
