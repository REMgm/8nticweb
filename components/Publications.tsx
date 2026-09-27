import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "@phosphor-icons/react/dist/ssr";
import { publications, publicationTypeLabel } from "@/lib/publications";

const coverImages: Record<string, string> = {
  "the-one-idea": "/assets/publications/the-one-idea/attention.webp",
  "the-token-gap": "/assets/publication-token-gap.webp",
  "qip-thesis": "/assets/publication-qip.webp",
};

type PublicationsProps = { showHeading?: boolean; eagerCovers?: boolean };

export function Publications({ showHeading = true, eagerCovers = false }: PublicationsProps) {
  return (
    <section className={`pub-section${showHeading ? "" : " pub-section-embedded"}`} aria-label="Publications">
      {showHeading && (
        <div className="pub-section-heading">
          <div>
            <p className="pub-eyebrow">PUBLICATIONS</p>
            <h2>Ideas worth staying with.</h2>
          </div>
          <p>Essays and research on the possibilities ahead, and the human judgment that shapes them.</p>
        </div>
      )}
      <div className="pub-grid">
        {publications.map((publication, index) => (
          <article className={`pub-card pub-card-${publication.slug}`} key={publication.slug}>
            <div className="pub-card-art" aria-hidden="true">
              <Image
                className="pub-cover-image"
                src={coverImages[publication.slug] ?? "/assets/publication-qip.webp"}
                alt=""
                fill
                sizes="(max-width: 660px) calc(100vw - 40px), (max-width: 767px) calc(50vw - 34px), (max-width: 1150px) calc(50vw - 54px), (max-width: 1392px) calc(50vw - 70px), 626px"
                loading={eagerCovers && index < 2 ? "eager" : "lazy"}
              />
              {publication.slug === "the-one-idea" ? (
                <>
                  <span className="pub-art-index">UNCOVERING HOW AI WORKS · 01</span>
                  <span className="pub-art-word pub-art-word-one">one idea.</span>
                </>
              ) : publication.slug === "the-token-gap" ? (
                <>
                  <span className="pub-art-index">A DIFFERENCE OF PACE</span>
                  <span className="pub-art-word">tokens</span>
                  <span className="pub-art-word pub-art-word-human">thought.</span>
                </>
              ) : (
                <>
                  <span className="pub-art-index">LEARNING THAT CARRIES FORWARD</span>
                  <span className="pub-art-qip">QIP<span>intelligence,<br />in continuity.</span></span>
                </>
              )}
            </div>
            <div className="pub-card-content">
              <p className="pub-card-meta"><span>{publicationTypeLabel(publication)}</span><span>{publication.author}</span></p>
              <h3><Link href={`/publications/${publication.slug}`}>{publication.title}</Link></h3>
              <p className="pub-card-description">{publication.description}</p>
              <details className="pub-preview">
                <summary><span className="pub-preview-closed">Read a preview</span><span className="pub-preview-open">Close preview</span><Plus size={18} aria-hidden="true" /></summary>
                <div className="pub-preview-copy">
                  {publication.preview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {publication.previewNote && <small>{publication.previewNote}</small>}
                </div>
              </details>
              <Link href={`/publications/${publication.slug}`} className="pub-read-link">
                {publication.type === "interactive-essay" ? "Read the full essay" : "Explore the thesis"}<ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
