import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { TokenRace } from "@/components/TokenRace";
import { getPublicationBySlug, publications, publicationTypeLabel, tokenGapClosing, tokenGapSections, tokenGapSources } from "@/lib/publications";
import { articleJsonLd, breadcrumbJsonLd, jsonLdStringify, publicationMetadata } from "@/lib/seo";

type PublicationPageProps = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return publications.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PublicationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const publication = getPublicationBySlug(slug);
  if (!publication) return { title: "Publication not found" };
  return publicationMetadata(publication);
}

function GrowthFigure() {
  return (
    <figure className="pub-growth-figure" aria-labelledby="pub-growth-title">
      <div className="pub-growth-head"><p className="pub-eyebrow">THE AUTHOR’S SECOND ILLUSTRATION</p><h2 id="pub-growth-title">Two curves bending.<br />One line refusing to.</h2><p>Historical claims and extrapolated trends, indexed to 1× in 2013. The human baseline is a rhetorical illustration, not a measurement of cognition.</p></div>
      <svg className="pub-growth-chart" viewBox="0 0 1000 440" role="img" aria-labelledby="pub-growth-svg-title pub-growth-svg-description">
        <title id="pub-growth-svg-title">The author’s comparison of hardware trends</title>
        <desc id="pub-growth-svg-description">A linear-scale illustration from 2013 to 2030. The Huang trend reaches approximately 1,000 times at 2023, then leaves the scale. The Moore trend is about 90 times in 2026 and 360 times in 2030. Values after 2026 are projections. The author holds the illustrative human baseline at one. These measures are not directly equivalent.</desc>
        {[52, 134, 216, 298, 380].map((y) => <line key={y} x1="150" y1={y} x2="960" y2={y} className="pub-chart-grid" />)}
        {["1,000×", "750×", "500×", "250×", "1×"].map((value, index) => <text key={value} x="132" y={57 + index * 82} textAnchor="end" className="pub-chart-axis">{value}</text>)}
        <text x="150" y="411" className="pub-chart-axis">2013</text><text x="484" y="411" textAnchor="middle" className="pub-chart-axis">2020</text><text x="769" y="411" textAnchor="middle" className="pub-chart-axis">2026</text><text x="960" y="411" textAnchor="end" className="pub-chart-axis">2030</text>
        <line x1="769" y1="112" x2="769" y2="388" stroke="#787166" strokeDasharray="3 6" /><text x="784" y="113" className="pub-chart-axis">projection →</text>
        <path d="M150 380H769" stroke="#e3b777" strokeWidth="4" /><path d="M769 380H960" stroke="#e3b777" strokeWidth="4" strokeDasharray="2 8" />
        <text x="150" y="365" className="pub-chart-label" fill="#e3b777">The author’s human baseline</text>
        <polyline fill="none" stroke="#9ba397" strokeWidth="4" points="150,380 245,379 341,379 436,377 531,375 627,370 722,359 769,350" />
        <polyline fill="none" stroke="#9ba397" strokeWidth="4" strokeDasharray="3 8" points="769,350 817,338 865,321 912,296 960,261" />
        <text x="950" y="241" textAnchor="end" className="pub-chart-label" fill="#c0c8ba">Moore’s trend: ~360×</text>
        <polyline fill="none" stroke="#c6b4dc" strokeWidth="4" points="150,380 245,379 341,375 388,370 436,359 484,338 531,296 579,212 627,44" />
        <path d="M627 44L645 15M631 19L645 15L644 31" stroke="#c6b4dc" strokeWidth="4" fill="none" />
        <text x="660" y="42" className="pub-chart-label" fill="#d7c3ed">Huang trend: ~1,000× in 2023</text>
        <text x="660" y="66" className="pub-chart-axis">The author extrapolates ~130,000×</text><text x="660" y="88" className="pub-chart-axis">by 2030, beyond this chart’s scale.</text>
      </svg>
      <div className="pub-growth-data" aria-label="Illustrated trends in text">
        <div><span>Huang trend</span><strong>~1,000×</strong><p>2023 claim · ~130,000× projected in 2030</p></div>
        <div><span>Moore trend</span><strong>~90×</strong><p>2026 illustration · ~360× projected in 2030</p></div>
        <div><span>Human baseline</span><strong>1×</strong><p>Held constant by the author for this comparison</p></div>
      </div>
      <figcaption><strong>Two curves bending, one line refusing to</strong>Both indexed to 1x in 2013, the year Nvidia measures from. Everything right of the 2026 marker is dotted, because it is projection, not record. Linear scale, because a log scale is what makes exponential growth look like a polite diagonal. Huang coined his law at GTC in 2018, pointing at a 25x gain over the prior five years; Nvidia&apos;s chief scientist later put the decade to 2023 at a thousandfold. Moore&apos;s Law over the same period reaches roughly 90x, which is why it looks almost stationary in this company. The flat amber line is the entire history of human cognitive throughput, and its projection to 2030 required no arithmetic.<span>Author’s caption and assumptions. Huang&apos;s Law figures from Nvidia&apos;s own claims (GTC 2018; Bill Dally, Hot Chips 2023). Disputed: Epoch finds GPU price-performance doubling nearer every 2.5 years. Post-2026 values assume both historic doubling rates simply continue, which is the weakest assumption on this page. Sources retrieved 15 September 2026. <a href="#token-sources">Source context and links</a>.</span></figcaption>
    </figure>
  );
}

function TokenGapArticle() {
  return (
    <>
      <aside className="pub-editorial-note" aria-label="About the figures in this essay"><span>READING NOTE</span><p>This essay preserves the author’s historical model comparisons and argument. Numerical figures are illustrative inputs from the supplied draft, whose sources were retrieved on 15 September 2026, not current benchmark results. Human token equivalents are not a measured ceiling on thought, and hardware trends are not measurements of intelligence.</p></aside>
      <nav className="pub-article-nav" aria-label="In this essay"><span>IN THIS ESSAY</span><a href="#the-speed">The speed</a><a href="#token-race-title">The comparison</a><a href="#tokens-per-insight">Tokens per insight</a><a href="#compounding-curves">Compounding curves</a><a href="#token-sources">Sources</a></nav>
      <div className="pub-prose" id={tokenGapSections[0].id}>{tokenGapSections[0].paragraphs.map((paragraph, index) => <p className={index === 0 ? "pub-lede" : undefined} key={paragraph}>{paragraph}</p>)}</div>
      <TokenRace />
      {tokenGapSections.slice(1).map((section) => (
        <section className="pub-prose" id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph} className={paragraph.startsWith("Which means") ? "pub-pull-line" : undefined}>{paragraph}</p>)}
        </section>
      ))}
      <GrowthFigure />
      <div className="pub-prose pub-closing"><p>{tokenGapClosing}</p></div>
      <section className="pub-sources" id="token-sources" aria-labelledby="token-source-heading">
        <div><p className="pub-eyebrow">KEEP THE CONTEXT VISIBLE</p><h2 id="token-source-heading">Sources & assumptions.</h2><p>The supplied draft names these sources and records a retrieval date of 15 September 2026. Links below provide attribution and context; they do not independently validate every historical input in the essay.</p></div>
        <ol>{tokenGapSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ArrowUpRight size={16} aria-hidden="true" /><span className="token-sr-only">, opens in a new tab</span></a><p>{source.description}</p></li>)}</ol>
      </section>
    </>
  );
}

function QipThesisOverview() {
  const publication = getPublicationBySlug("qip-thesis")!;
  return (
    <>
      <div className="pub-thesis-feature"><span aria-hidden="true">QIP</span><p>Intelligence,<br /><em>in continuity.</em></p></div>
      <div className="pub-prose">
        <p className="pub-lede">What if each interaction could leave the next one better informed?</p>
        <p>QIP explores how people and agents can work with shared context, clear boundaries and lessons that carry forward. It is a research direction concerned with the relationship between individual contributions and collective capability.</p>
        <h2>Follow the question.</h2>
        <p>This page introduces the QIP initiative. The original Quantum Intelligence Protocol thesis is published on Remco Vroom’s Substack, where you can read the author’s argument in its original context.</p>
        <p>The wider 8NTIC work makes these questions tangible through research and experiments. Here, the emphasis is on what can be learned, what remains uncertain, and which decisions should stay visible to people.</p>
        <a className="pub-source-button" href={publication.source!.url} target="_blank" rel="noopener noreferrer">Read the original thesis<ArrowUpRight size={18} aria-hidden="true" /><span className="token-sr-only">, opens on Substack in a new tab</span></a>
        <p className="pub-small-note">An introduction, not a reproduction of the full thesis. Original publication: Remco Vroom on Substack.</p>
      </div>
      <aside className="pub-related"><p className="pub-eyebrow">CONTINUE EXPLORING</p><h2>When output accelerates,<br /><em>what deserves our attention?</em></h2><Link href="/publications/the-token-gap">Read The Token Gap<ArrowUpRight size={18} aria-hidden="true" /></Link></aside>
    </>
  );
}

export default async function PublicationPage({ params }: PublicationPageProps) {
  const { slug } = await params;
  const publication = getPublicationBySlug(slug);
  if (!publication) notFound();
  return (
    <div className="page-shell shell content-page pub-article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdStringify(articleJsonLd(publication)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdStringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Publications", path: "/publications" }, { name: publication.title, path: `/publications/${publication.slug}` }])) }} />
      <Link href="/publications" className="pub-back-link"><ArrowLeft size={16} aria-hidden="true" />All publications</Link>
      <article>
        <header className="pub-article-header">
          <p className="pub-eyebrow">{publicationTypeLabel(publication).toUpperCase()} / BY {publication.author.toUpperCase()}</p>
          <h1>{publication.title}</h1>
          <p className="pub-standfirst">{publication.slug === "the-token-gap" ? "You read this sentence at about four tokens per second. Gemini would have finished the whole article before you reached the comma." : publication.description}</p>
          {publication.date && <time dateTime={publication.date}>{publication.date}</time>}
        </header>
        {publication.slug === "the-token-gap" ? <TokenGapArticle /> : <QipThesisOverview />}
        <footer className="pub-article-footer"><span>Words by {publication.author}</span><Link href="/publications">More from the Observatory<ArrowUpRight size={17} aria-hidden="true" /></Link></footer>
      </article>
    </div>
  );
}
