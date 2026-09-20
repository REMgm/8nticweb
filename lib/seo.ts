import type { Metadata } from "next";
import { publications } from "./publications.ts";

function siteOrigin() {
  const value = process.env.SITE_URL || "https://www.8ntic.com";
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
    throw new Error("SITE_URL must be a public HTTP(S) origin without credentials.");
  }
  return url.origin;
}

export const SITE_URL = siteOrigin();
export const SITE_NAME = "8NTIC";
export const SITE_TITLE = "8NTIC | Always exploring";
export const SITE_DESCRIPTION =
  "Independent research by Remco Vroom into human and agent collaboration. Explore QIP, custom-model research, experiments and publications.";

// Preview builds must never become a second indexed copy of the production site.
export const INDEXING_ENABLED =
  process.env.INDEXING_ENABLED !== "false" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export const PUBLIC_ROUTES = [
  "/",
  "/qip",
  "/research",
  "/experiments",
  "/publications",
  "/about",
  "/beta",
  "/privacy",
] as const;

export type PublicationSeo = {
  slug: string;
  title: string;
  description: string;
  type: "interactive-essay" | "research-thesis";
  author: string;
  source: { title: string; url: string } | null;
  date?: string;
  updatedAt?: string;
};

// One registry powers the publication pages, metadata, sitemap and feed.
export const PUBLICATION_SEO: readonly PublicationSeo[] = publications;

const socialImage = {
  url: absoluteUrl("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: "8NTIC. Always exploring. QIP, research and experiments.",
};

const crawlMetadata: Metadata["robots"] = INDEXING_ENABLED
  ? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    }
  : { index: false, follow: false };

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | 8NTIC" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: "Remco Vroom",
  publisher: SITE_NAME,
  authors: [{ name: "Remco Vroom", url: absoluteUrl("/about") }],
  category: "Research",
  // Each real page sets its own crawl policy and canonical. Leaving these out of
  // the indexable layout avoids inheriting an index directive or home canonical
  // into Next.js error documents; notFound() can then emit an unambiguous noindex.
  ...(!INDEXING_ENABLED ? { robots: crawlMetadata } : {}),
  alternates: {
    types: { "application/rss+xml": absoluteUrl("/feed.xml") },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [socialImage.url],
  },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function pageMetadata({ title, description, path, noIndex = false }: PageMetadataOptions): Metadata {
  return {
    // The root page shares the layout segment, so a layout title template alone
    // does not append the brand there. Absolute titles keep every route consistent.
    title: { absolute: `${title} | 8NTIC` },
    description,
    alternates: {
      canonical: absoluteUrl(path),
      types: { "application/rss+xml": absoluteUrl("/feed.xml") },
    },
    robots: noIndex ? { index: false, follow: true } : crawlMetadata,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url: absoluteUrl(path),
      title: `${title} | 8NTIC`,
      description,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | 8NTIC`,
      description,
      images: [socialImage.url],
    },
  };
}

export function publicationMetadata(publication: PublicationSeo): Metadata {
  const metadata = pageMetadata({
    title: publication.title,
    description: publication.description,
    path: `/publications/${publication.slug}`,
  });
  if (publication.type === "interactive-essay") {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      authors: [publication.author === "Remco Vroom" ? absoluteUrl("/about") : publication.author],
      ...(publication.date ? { publishedTime: publication.date } : {}),
      ...(publication.updatedAt ? { modifiedTime: publication.updatedAt } : {}),
    };
  }
  return metadata;
}

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: SITE_NAME,
      url: absoluteUrl("/"),
      description: SITE_DESCRIPTION,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
      founder: { "@id": absoluteUrl("/about#remco-vroom") },
    },
    {
      "@type": "Person",
      "@id": absoluteUrl("/about#remco-vroom"),
      name: "Remco Vroom",
      url: absoluteUrl("/about"),
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: absoluteUrl("/"),
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": absoluteUrl("/#organization") },
      inLanguage: "en",
    },
  ],
};

export const qipJsonLd = {
  "@context": "https://schema.org",
  "@type": "ResearchProject",
  "@id": absoluteUrl("/qip#project"),
  name: "Quantum Intelligence Protocol",
  alternateName: "QIP",
  url: absoluteUrl("/qip"),
  description:
    "8NTIC’s flagship research project exploring governed agent autonomy, persistent memory and learning across execution cycles.",
  parentOrganization: { "@id": absoluteUrl("/#organization") },
  member: { "@id": absoluteUrl("/about#remco-vroom") },
};

export function pageJsonLd({ title, description, path }: PageMetadataOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(`${path}#webpage`),
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: "en",
    isPartOf: { "@id": absoluteUrl("/#website") },
  };
}

export function articleJsonLd(publication: PublicationSeo) {
  const path = `/publications/${publication.slug}`;
  const author = {
    "@type": "Person",
    name: publication.author,
    ...(publication.author === "Remco Vroom"
      ? { "@id": absoluteUrl("/about#remco-vroom") }
      : {}),
  };
  if (publication.type === "research-thesis") {
    return {
      ...pageJsonLd({ title: publication.title, description: publication.description, path }),
      about: {
        "@type": "CreativeWork",
        name: "Quantum Intelligence Protocol",
        url: publication.source?.url,
        author,
      },
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": absoluteUrl(`${path}#article`),
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    headline: publication.title,
    description: publication.description,
    image: socialImage.url,
    author,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en",
    articleSection: "Publications",
    isAccessibleForFree: true,
    ...(publication.date ? { datePublished: publication.date } : {}),
    ...(publication.updatedAt ? { dateModified: publication.updatedAt } : {}),
  };
}

export function breadcrumbJsonLd(items: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function jsonLdStringify(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
