import Link from "next/link";
import { ArrowUpRightIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { Hero } from "@/components/Hero";
import { QipLoop } from "@/components/QipLoop";
import { Reveal } from "@/components/Reveal";
import { Experiments } from "@/components/Experiments";
import { Publications } from "@/components/Publications";
import { BetaForm } from "@/components/BetaForm";
import { MascotMark } from "@/components/Brand";
import { pageMetadata } from "@/lib/seo";
export const metadata=pageMetadata({title:"QIP, human curiosity and shared intelligence",description:"Explore QIP, the Quantum Intelligence Protocol, at 8NTIC. Research into agent memory, custom models and human collaboration, with interactive publications and experiments.",path:"/"});
export default function Home(){return <>
  <Hero/>
  <section id="qip" className="section shell qip-intro">
    <Reveal>
      <div className="section-heading">
        <h2>Quantum Intelligence Protocol.</h2>
        <p>Every new task. A little less starting over. QIP is our central research project: a way for people and agents to work with shared context, clear boundaries and lessons that last.</p>
        <p>QIP has been in active development for six months, with continuous improvements. We’re working towards open-sourcing the protocol within the next six months.</p>
      </div>
      <div className="intro-bottom"><span className="caption">Quantum Intelligence Protocol</span><a className="text-link" href="https://rem8ntic.substack.com/p/quantum-intelligence-protocol" target="_blank" rel="noopener noreferrer">Read the thesis <ArrowUpRightIcon size={20}/><span className="sr-only">, opens a new tab</span></a></div>
    </Reveal>
    <div id="the-loop"><QipLoop/></div>
  </section>
  <section id="research" className="research-feature"><div className="shell"><Reveal><p className="eyebrow">Research in progress</p><h2>What if a model learned<br/><em>your way of working?</em></h2><p>We’re researching custom models trained on a business’s knowledge, language and decisions, then testing how well they handle real work.</p><Link className="text-link" href="/research">Explore the research <ArrowUpRightIcon size={20}/></Link></Reveal></div><div className="research-light" aria-hidden="true"/></section>
  <section id="experiments" className="section shell"><Reveal><div className="section-heading"><h2>Follow the question.</h2><p>Small experiments with something to teach us. Open one, try it, and see where it takes you.</p></div><Experiments/></Reveal></section>
  <section id="publications" className="section publication-home shell"><div className="section-heading"><p className="eyebrow">Publications</p><h2>Ideas worth staying with.</h2><p>Essays, research and interactive explanations. Open a publication and take your time.</p></div><Publications showHeading={false}/><Link className="text-link all-publications" href="/publications">All publications <ArrowRightIcon size={19}/></Link></section>
  <section id="contact" className="section shell signup-section"><div className="signup-copy"><MascotMark/><h2>Be here for<br/><em>what comes next.</em></h2><p>Leave your name and email. We’ll let you know when we’re ready to share beta news and research updates.</p></div><BetaForm/></section>
</>}
