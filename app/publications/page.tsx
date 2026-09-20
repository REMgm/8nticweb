import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Publications } from "@/components/Publications";
import { breadcrumbJsonLd, jsonLdStringify, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Publications",
  description: "Essays and research by Remco Vroom on shared intelligence, agent coordination and the value of human judgment. Read The Token Gap and explore the QIP thesis.",
  path: "/publications",
});

export default function PublicationsPage() {
  return (
    <div className="page-shell shell content-page pub-index-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdStringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Publications", path: "/publications" }])) }} />
      <div className="pub-page-intro">
        <Link className="pub-back-link" href="/"><ArrowLeft size={16} aria-hidden="true" />Back to the Observatory</Link>
        <p className="pub-eyebrow">PUBLICATIONS / REMCO VROOM</p>
        <h1>Ideas worth<br /><em>staying with.</em></h1>
        <p>Essays and research on the possibilities ahead, and the human judgment that shapes them. Open a preview, follow a question, take your time.</p>
      </div>
      <Publications showHeading={false} />
    </div>
  );
}
