import { absoluteUrl, PUBLICATION_SEO, SITE_DESCRIPTION, SITE_NAME } from "../../lib/seo.ts";

export const dynamic = "force-static";

function xml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
  })[character]!);
}

export function GET() {
  const items = PUBLICATION_SEO.map((publication) => {
    const url = absoluteUrl(`/publications/${publication.slug}`);
    return `<item><title>${xml(publication.title)}</title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><description>${xml(publication.description)}</description>${publication.date ? `<pubDate>${new Date(publication.date).toUTCString()}</pubDate>` : ""}</item>`;
  }).join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(SITE_NAME)} publications</title><link>${xml(absoluteUrl("/publications"))}</link><description>${xml(SITE_DESCRIPTION)}</description><language>en</language><atom:link href="${xml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } },
  );
}
