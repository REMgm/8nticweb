import Link from "next/link";
import { ArrowUpRight, Plus } from "@phosphor-icons/react/dist/ssr";
import { publications, publicationTypeLabel } from "@/lib/publications";

type PublicationsProps = { showHeading?: boolean };

export function Publications({ showHeading = true }: PublicationsProps) {
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
        {publications.map((publication) => (
          <article className={`pub-card pub-card-${publication.slug}`} key={publication.slug}>
            <div className="pub-card-art" aria-hidden="true">
              {publication.slug === "the-token-gap" ? (
                <>
                  <span className="pub-art-index">A DIFFERENCE OF PACE</span>
                  <span className="pub-art-word">tokens</span>
                  <span className="pub-art-word pub-art-word-human">thought.</span>
                  <div className="pub-art-trails"><i /><i /><i /><i /><i /></div>
                </>
              ) : (
                <>
                  <span className="pub-art-index">LEARNING THAT CARRIES FORWARD</span>
                  <span className="pub-art-qip">QIP<span>intelligence,<br />in continuity.</span></span>
                  <div className="pub-art-grain" />
                </>
              )}
            </div>
            <div className="pub-card-content">
              <p className="pub-card-meta"><span>{publicationTypeLabel(publication)}</span><span>{publication.author}</span></p>
              <h3><Link href={`/publications/${publication.slug}`}>{publication.title}</Link></h3>
              <p className="pub-card-description">{publication.description}</p>
              <details className="pub-preview">
                <summary><span>{publication.type === "interactive-essay" ? "A few words to begin" : "Inside the idea"}</span><Plus size={18} aria-hidden="true" /></summary>
                <div className="pub-preview-copy">
                  {publication.preview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {publication.type === "interactive-essay" && <small>Author’s historical illustration. The full essay includes assumptions and source context.</small>}
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
