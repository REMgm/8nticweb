import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import source from "@/lib/qip-thesis-content.json";
import { qipThesisMedia } from "@/lib/publications";
import { MemoryExplorer, CollaborationExplorer } from "@/components/QipExplorers";
import "@/styles/qip-thesis.css";
import "@/styles/qip-explorers.css";

type Block = { kind: string; text?: string; id?: string; headers?: string[]; rows?: string[][] };

const notes: Record<number, string> = {
  2: "The quantum mappings in this chapter are the author’s architectural interpretation. They are not evidence that software agents exhibit quantum behavior or that a formal mathematical equivalence has been established.",
  4: "The cognitive theories below inform the proposal. The thesis does not establish a consciousness test or a validated intelligence score for agent systems; Φ is not reported as a measured QIP result.",
  6: "These seven components describe the proposed protocol. The source mentions internal testing, but does not provide a reproducible evaluation method, dataset or comparison results.",
  7: "MCP provides interfaces to tools and data. Durable memory, identity, permissions and cross-session state still need application-level storage and governance; they are not automatic guarantees of MCP.",
  10: "The competitive advantages and timelines in this chapter are the author’s predictions. They are not measured outcomes, guarantees or published forecasts validated by this website.",
};

function ContentsLinks() {
  return <><a href="#qip-abstract">Abstract</a>{source.chapters.map(chapter => <a key={chapter.id} href={`#${chapter.id}`}><span>{String(chapter.number).padStart(2, "0")}</span>{chapter.title}</a>)}<a href="#qip-references">References & citation index</a></>;
}

function Artwork({ kind }: { kind: "possibilities" | "memory" }) {
  return <figure className="qip-artwork">
    <Image src={`/assets/publications/qip-thesis/${kind}.webp`} alt={kind === "possibilities" ? "Three separate amber light paths crossing a textured dark mineral surface." : "A warm amber seam running through the layers of a dark mineral cross-section."} width={1800} height={771} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 80px), 930px" />
    <figcaption><span>{kind === "possibilities" ? "ROOM FOR POSSIBILITY" : "WHAT CARRIES FORWARD"}</span>{kind === "possibilities" ? "Explore different paths before committing to one." : "Experience becomes useful when the next task can draw on it."} <small>Interpretive artwork created with Higgsfield.</small></figcaption>
  </figure>;
}

function ConvergenceTable({ block }: { block: Block }) {
  return <figure className="qip-convergence"><figcaption>The thesis’s convergence map</figcaption><p>Proposed connections across three fields, presented by the author as architectural inspiration.</p><div className="qip-table-scroll" role="region" aria-label="Convergence map, scroll horizontally to read all four columns" tabIndex={0}><table><thead><tr>{block.headers?.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{block.rows?.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div></figure>;
}

function ContentBlock({ block }: { block: Block }) {
  if (block.kind === "heading") return <h3 id={block.id} tabIndex={-1}>{block.text}</h3>;
  if (block.kind === "subheading") return <h4>{block.text}</h4>;
  if (block.kind === "quote") return <blockquote><p>{block.text}</p></blockquote>;
  if (block.kind === "table") return <ConvergenceTable block={block} />;
  return <p>{block.text}</p>;
}

export function QipThesisArticle() {
  return <>
    <div className="qip-edition"><span>FULL THESIS · 11 CHAPTERS · ABOUT 55 MIN</span><a href="#qip-abstract">Read the thesis <span aria-hidden="true">↓</span></a><a href={source.source} target="_blank" rel="noopener noreferrer">Original on Substack <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only">, opens in a new tab</span></a></div>
    <figure className="pub-film qip-thesis-hero" aria-labelledby="qip-film-caption">
      <video controls playsInline preload="none" width={2560} height={1440} poster={qipThesisMedia.poster} aria-label="Quantum Intelligence Protocol, a 60-second film" aria-describedby="qip-film-caption">
        <source src={qipThesisMedia.film} type="video/mp4" />
        Your browser does not play embedded video. <a href={qipThesisMedia.film}>Download the film</a>.
      </video>
      <figcaption id="qip-film-caption"><span>FILM · 60 SECONDS · SOUND ON</span>Quantum Intelligence Protocol, explained simply. English subtitles included.</figcaption>
      <details className="pub-film-transcript">
        <summary>Read the film transcript</summary>
        {qipThesisMedia.transcript.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </details>
    </figure>
    <section className="qip-orientation" id="qip-article-contents" tabIndex={-1} aria-labelledby="qip-orientation-title">
      <p className="pub-eyebrow">THE QUESTION BEHIND THE PROTOCOL</p>
      <h2 id="qip-orientation-title">Better agents are only<br /><em>part of the answer.</em></h2>
      <p>What lets a group of capable agents become a coherent system that learns? This thesis proposes a governance layer built around shared context, persistent memory, independent perspectives and lessons that travel between agents.</p>
      <p><strong>Quantum Intelligence</strong> is the theory. <strong>QIP</strong> is the proposed seven-part protocol. It uses ideas from physics, complex systems and cognitive science to frame a software architecture; it does not require a quantum computer.</p>
      <a className="qip-practical-link" href="#qip-chapter-6">Start with the seven principles <span aria-hidden="true">↗</span></a>
    </section>
    <aside className="qip-editor-note"><p className="pub-eyebrow">ABOUT THIS EDITION</p><p>The full thesis by Remco Vroom, first published on 7 April 2026, formatted here with chapter navigation and interactive illustrations on 27 September 2026. The argument, all eleven chapters, references and citation index are retained. Subscription prompts and the incomplete source contents list have been removed.</p><p>This is a research proposal. Its scientific mappings, performance claims and competitive forecasts should be read as the author’s argument, not as independently validated QIP results. Added reading notes and illustrative examples are distinguished from the original text.</p></aside>
    <details className="qip-mobile-contents" id="qip-mobile-contents"><summary>Find a chapter <span>11 chapters + references</span></summary><nav aria-label="Thesis chapters on mobile"><ContentsLinks /></nav></details>
    <div className="qip-reading-layout">
      <aside className="qip-contents-rail"><nav aria-label="Thesis chapters"><p className="pub-eyebrow">IN THIS THESIS</p><ContentsLinks /></nav></aside>
      <div className="qip-manuscript">
        <section className="qip-chapter" id="qip-abstract" tabIndex={-1}>
          <header className="qip-manuscript-title"><p className="pub-eyebrow">{source.frontMatter[0]}</p><h2>{source.frontMatter[1]}</h2><p className="qip-manuscript-subtitle">{source.frontMatter[2]}<br />{source.frontMatter[3]}</p><p>{source.frontMatter[4]}<br />{source.frontMatter[5]}</p><p>{source.frontMatter[6]}</p></header>
          <h2>Abstract</h2><div className="qip-body">{source.abstract.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div><p className="qip-keywords">{source.keywords}</p>
        </section>
        {source.chapters.map(chapter => <div key={chapter.id}>
          {chapter.number === 2 && <Artwork kind="possibilities" />}
          {chapter.number === 8 && <Artwork kind="memory" />}
          <section className="qip-chapter" id={chapter.id} tabIndex={-1}>
            {source.parts.filter(part => part.chapter === chapter.number).map(part => <div className="qip-part" key={part.label}><p className="pub-eyebrow">{part.label} / {part.title}</p><p>{part.subtitle}</p></div>)}
            <header className="qip-chapter-heading"><p className="pub-eyebrow">CHAPTER {String(chapter.number).padStart(2, "0")}</p><h2>{chapter.title}</h2></header>
            {notes[chapter.number] && <aside className="qip-context-note"><strong>Reading context</strong><p>{notes[chapter.number]}</p></aside>}
            <div className="qip-body">{(chapter.blocks as Block[]).map((block, index) => <div className="qip-source-block" key={block.id || index}>
              {block.id === "qip-6-3" && <MemoryExplorer />}
              {block.id === "qip-6-4" && <CollaborationExplorer />}
              <ContentBlock block={block} />
            </div>)}</div>
            <a className="qip-chapter-return" href="#qip-article-contents">Back to the reading guide ↑</a>
          </section>
        </div>)}
        <section className="qip-chapter qip-references" id="qip-references" tabIndex={-1}><p className="pub-eyebrow">KEEP THE SOURCES VISIBLE</p><h2>References.</h2><p>{source.referencesIntro}</p><ol>{source.references.map((reference, i) => <li key={i} id={`qip-reference-${i + 1}`}>{reference}</li>)}</ol>
          <details className="qip-citation-index"><summary>Citation index <span>25 chapter-to-source mappings</span></summary><p>{source.citationsIntro}</p><ul>{source.citationIndex.map((citation, i) => <li key={i}>{citation}</li>)}</ul></details>
          <a className="pub-source-button" href={source.source} target="_blank" rel="noopener noreferrer">Read the original publication<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only">, opens on Substack in a new tab</span></a>
        </section>
        <aside className="pub-related"><p className="pub-eyebrow">FROM THE THESIS TO THE WORK</p><h2>What does the next<br /><em>task remember?</em></h2><Link href="/qip#architecture">Try the Compound Autonomy Loop<ArrowUpRight size={18} aria-hidden="true" /></Link><Link href="/experiments">Explore the experiments<ArrowUpRight size={18} aria-hidden="true" /></Link></aside>
      </div>
    </div>
  </>;
}
