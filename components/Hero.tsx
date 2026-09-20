import Image from "next/image";
import Link from "next/link";
import { ArrowDownRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { CuriosityPrompt } from "./CuriosityPrompt";

export function Hero(){return <section className="hero" aria-labelledby="hero-heading">
  <div className="hero-art"><Image src="/assets/hero.webp" alt="NTIC, a stone and circuitry explorer with a camera eye, discovering a small green shoot." fill sizes="100vw" preload fetchPriority="high" quality={85}/><div className="hero-light" aria-hidden="true"/></div>
  <div className="hero-content shell"><p className="eyebrow">QIP, the flagship exploration</p><h1 id="hero-heading">Intelligence,<br/><em>with a memory.</em></h1><p className="hero-description">People and agents, learning together. QIP explores how each action can inform what happens next.</p><div className="hero-actions"><Link className="button button-primary" href="/qip">Explore QIP <ArrowUpRight/></Link><a className="text-link" href="#the-loop">Try the memory loop <ArrowDownRightIcon size={19}/></a></div></div>
  <CuriosityPrompt/>
  <div className="hero-caption shell"><span>Quantum Intelligence Protocol</span><span>Human curiosity. Shared intelligence.</span></div>
</section>}
function ArrowUpRight(){return <ArrowUpRightIcon size={19} aria-hidden="true"/>}
