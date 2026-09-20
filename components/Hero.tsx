"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon, SparkleIcon } from "@phosphor-icons/react";
import { useExperience } from "./Experience";

const discoveries=["A good question is a place to begin.","What could this connect to?","Keep the lesson. Follow the next question."];
export function Hero(){const [discovery,setDiscovery]=useState(-1);const {cue}=useExperience();return <section className="hero" aria-labelledby="hero-heading">
  <div className="hero-art"><Image src="/assets/hero.webp" alt="NTIC, a stone and circuitry explorer with a camera eye, discovering a small green shoot." fill sizes="100vw" preload fetchPriority="high" quality={85}/><div className="hero-light" aria-hidden="true"/></div>
  <div className="hero-content shell"><p className="eyebrow">QIP, the flagship exploration</p><h1 id="hero-heading">Intelligence,<br/><em>with a memory.</em></h1><p className="hero-description">People and agents, learning together. QIP explores how each action can inform what happens next.</p><div className="hero-actions"><Link className="button button-primary" href="/qip">Explore QIP <ArrowUpRight/></Link><a className="text-link" href="#the-loop">Try the memory loop <ArrowDownRightIcon size={19}/></a></div></div>
  <div className="hero-companion"><p role="status" className={discovery>=0?"companion-note active":"companion-note"}>{discovery>=0?discoveries[discovery]:""}</p><button onClick={()=>{setDiscovery((discovery+1)%discoveries.length);cue();}} className="companion-button"><SparkleIcon size={17}/><span>Always exploring</span><ArrowRightIcon size={16}/></button></div>
  <div className="hero-caption shell"><span>Quantum Intelligence Protocol</span><span>Human curiosity. Shared intelligence.</span></div>
</section>}
function ArrowUpRight(){return <ArrowUpRightIcon size={19} aria-hidden="true"/>}
