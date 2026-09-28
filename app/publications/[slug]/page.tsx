import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { TokenRace } from "@/components/TokenRace";
import { AttentionExplorer } from "@/components/AttentionExplorer";
import { QipThesisArticle } from "@/components/QipThesisArticle";
import { getPublicationBySlug, oneIdeaClosing, oneIdeaMedia, oneIdeaSections, oneIdeaSources, publications, publicationTypeLabel, tokenGapClosing, tokenGapMedia, tokenGapSections, tokenGapSources, type OneIdeaFigure } from "@/lib/publications";
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
      <figure className="pub-film" aria-labelledby="token-film-caption">
        <video controls playsInline preload="none" width={2560} height={1440} poster={tokenGapMedia.poster} aria-label="The Token Gap, a 30-second film" aria-describedby="token-film-caption">
          <source src={tokenGapMedia.film} type="video/mp4" />
          Your browser does not play embedded video. <a href={tokenGapMedia.film}>Download the film</a>.
        </video>
        <figcaption id="token-film-caption"><span>FILM · 30 SECONDS · SOUND ON</span>The Token Gap, brought to life. English captions included.</figcaption>
        <details className="pub-film-transcript">
          <summary>Read the film transcript</summary>
          {tokenGapMedia.transcript.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </details>
      </figure>
      <aside className="pub-editorial-note" aria-label="About the figures in this essay"><span>READING NOTE</span><p>This essay preserves the author’s historical model comparisons and argument. Numerical figures are illustrative inputs from the supplied draft, whose sources were retrieved on 15 September 2026, not current benchmark results. Human token equivalents are not a measured ceiling on thought, and hardware trends are not measurements of intelligence.</p></aside>
      <nav className="pub-article-nav" id="pub-contents" tabIndex={-1} aria-label="In this essay"><span>IN THIS ESSAY</span><a href="#the-speed">The speed</a><a href="#token-race-title">The comparison</a><a href="#tokens-per-insight">Tokens per insight</a><a href="#compounding-curves">Compounding curves</a><a href="#token-sources">Sources</a></nav>
      <div className="pub-prose" id={tokenGapSections[0].id} tabIndex={-1}>{tokenGapSections[0].paragraphs.map((paragraph, index) => <p className={index === 0 ? "pub-lede" : undefined} key={paragraph}>{paragraph}</p>)}</div>
      <TokenRace />
      {tokenGapSections.slice(1).map((section) => (
        <section className="pub-prose" id={section.id} tabIndex={-1} key={section.id}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph} className={paragraph.startsWith("Which means") ? "pub-pull-line" : undefined}>{paragraph}</p>)}
        </section>
      ))}
      <GrowthFigure />
      <div className="pub-prose pub-closing"><p>{tokenGapClosing}</p></div>
      <section className="pub-sources" id="token-sources" tabIndex={-1} aria-labelledby="token-source-heading">
        <div><p className="pub-eyebrow">KEEP THE CONTEXT VISIBLE</p><h2 id="token-source-heading">Sources & assumptions.</h2><p>The supplied draft names these sources and records a retrieval date of 15 September 2026. Links below provide attribution and context; they do not independently validate every historical input in the essay.</p><a className="pub-return-link" href="#pub-contents"><ArrowLeft size={15} aria-hidden="true" />Back to the essay contents</a></div>
        <ol>{tokenGapSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ArrowUpRight size={16} aria-hidden="true" /><span className="token-sr-only">, opens in a new tab</span></a><p>{source.description}</p></li>)}</ol>
      </section>
    </>
  );
}

function OneIdeaFigureBlock({ figure, priority = false }: { figure: OneIdeaFigure; priority?: boolean }) {
  return (
    <figure className="pub-image-figure">
      <Image src={figure.src} alt={figure.alt} width={2200} height={1228} sizes="(max-width: 1100px) 100vw, 1100px" priority={priority} />
      <figcaption>{figure.caption}</figcaption>
    </figure>
  );
}

function OneIdeaArticle() {
  const [opening, ...sections] = oneIdeaSections;
  return (
    <>
      <figure className="pub-film" aria-labelledby="pub-film-caption">
        <video controls playsInline preload="metadata" poster={oneIdeaMedia.poster} aria-describedby="pub-film-caption">
          <source src={oneIdeaMedia.film} type="video/mp4" />
          <track kind="captions" src={oneIdeaMedia.captions} srcLang="en" label="English" default />
          Your browser does not play embedded video. <a href={oneIdeaMedia.film}>Download the film</a>.
        </video>
        <figcaption id="pub-film-caption"><span>FILM · 30 SECONDS · SOUND ON</span>Uncovering How AI Works, episode one: the Transformer. Made for 8NTIC with Higgsfield.</figcaption>
      </figure>
      <aside className="pub-editorial-note" aria-label="About this essay"><span>READING NOTE</span><p>A plain-language explanation of the 2017 Transformer paper. The attention explorer uses hand-set weights to illustrate the idea; it is not the output of a trained model. Film and illustrations were generated for 8NTIC with Higgsfield.</p></aside>
      <nav className="pub-article-nav" id="pub-contents" tabIndex={-1} aria-label="In this essay"><span>IN THIS ESSAY</span><a href="#the-paper">The paper</a><a href="#word-by-word">Before</a><a href="#attention">The one idea</a><a href="#attn-title">Try it</a><a href="#parallel">The real breakthrough</a><a href="#everyday">Everyday AI</a><a href="#trade-off">The trade-off</a><a href="#one-idea-sources">Sources</a></nav>
      <div className="pub-prose" id={opening.id} tabIndex={-1}>{opening.paragraphs.map((paragraph, index) => <p className={index === 0 ? "pub-lede" : undefined} key={paragraph}>{paragraph}</p>)}</div>
      {sections.map((section) => (
        <div key={section.id}>
          <section className="pub-prose" id={section.id} tabIndex={-1}>
            {section.title && <h2>{section.title}</h2>}
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.pullLine && <p className="pub-pull-line">{section.pullLine}</p>}
          </section>
          {section.id === "attention" && <AttentionExplorer />}
          {section.figure && <OneIdeaFigureBlock figure={section.figure} />}
        </div>
      ))}
      <div className="pub-prose pub-closing">{oneIdeaClosing.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <section className="pub-sources" id="one-idea-sources" tabIndex={-1} aria-labelledby="one-idea-source-heading">
        <div><p className="pub-eyebrow">KEEP THE CONTEXT VISIBLE</p><h2 id="one-idea-source-heading">Sources.</h2><p>Primary papers first, then the announcements and accounts behind the history in this essay.</p><a className="pub-return-link" href="#pub-contents"><ArrowLeft size={15} aria-hidden="true" />Back to the essay contents</a></div>
        <ol>{oneIdeaSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ArrowUpRight size={16} aria-hidden="true" /><span className="token-sr-only">, opens in a new tab</span></a><p>{source.description}</p></li>)}</ol>
      </section>
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
        <header className="pub-article-header" id="pub-article-top" tabIndex={-1}>
          <p className="pub-eyebrow">{publicationTypeLabel(publication).toUpperCase()} / BY {publication.author.toUpperCase()}</p>
          <h1>{publication.title}</h1>
          <p className="pub-standfirst">{publication.slug === "the-token-gap" ? "You read this sentence at about four tokens per second. Gemini would have finished the whole article before you reached the comma." : publication.slug === "the-one-idea" ? "Transformer: the one idea that now powers the AI you use every day. Eight authors, one paper, and a single design decision. Let every word look at every other word, all at once." : publication.description}</p>
          {publication.date && <time dateTime={publication.date}>{publication.slug === "qip-thesis" ? "First published 7 April 2026" : publication.date}</time>}
          {publication.updatedAt && <span className="pub-edition-date">Web edition updated <time dateTime={publication.updatedAt}>27 September 2026</time></span>}
        </header>
        {publication.slug === "the-token-gap" ? <TokenGapArticle /> : publication.slug === "the-one-idea" ? <OneIdeaArticle /> : <QipThesisArticle />}
        <footer className="pub-article-footer"><span>Words by {publication.author}</span><nav aria-label="Continue reading"><a href="#pub-article-top">Back to top</a><Link href="/publications">All publications<ArrowUpRight size={17} aria-hidden="true" /></Link></nav></footer>
      </article>
    </div>
  );
}
