import type { MetadataRoute } from "next";
import { absoluteUrl, INDEXING_ENABLED, PUBLIC_ROUTES, PUBLICATION_SEO } from "../lib/seo.ts";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXING_ENABLED) return [];

  return [
    ...PUBLIC_ROUTES.map((path) => ({ url: absoluteUrl(path) })),
    ...PUBLICATION_SEO.map((publication) => ({
      url: absoluteUrl(`/publications/${publication.slug}`),
      // Build time is not content freshness. Only emit dates editors have verified.
      ...(publication.updatedAt || publication.date
        ? { lastModified: publication.updatedAt || publication.date }
        : {}),
    })),
  ];
}
