"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRightIcon, PlusIcon, MinusIcon, WaveformIcon, PlugsConnectedIcon } from "@phosphor-icons/react";
import { MascotMark } from "./Brand";
import { useExperience } from "./Experience";

const experiments = [
  { name: "Recorder", slug: "recorder", kind: "Capture & reflection", question: "What deserves to be kept?", description: "An experiment in recording conversations and making room to return to what matters.", href: "https://recorder.8ntic.com", icon: WaveformIcon },
  { name: "QIP Adapter", slug: "qip-adapter", kind: "Context & connection", question: "How can context travel?", description: "Exploring the connective layer between QIP and the tools people and agents already use.", href: "https://qipadapter.8ntic.com", icon: PlugsConnectedIcon },
];

export function Experiments() {
  const [open, setOpen] = useState<string | null>(null);
  const [picked, setPicked] = useState("");
  const { cue, motion } = useExperience();
  function explore() {
    const next = experiments.find(experiment => experiment.slug !== open)!;
    setOpen(next.slug);
    setPicked(`NTIC chose ${next.name}. ${next.question}`);
    cue();
    requestAnimationFrame(() => {
      const button = document.getElementById(`exp-toggle-${next.slug}`);
      button?.focus({ preventScroll: true });
      button?.scrollIntoView({ block: "nearest", behavior: motion ? "smooth" : "instant" });
    });
  }
  return <div className="experiment-list">
    {experiments.map(experiment => <article className={`experiment ${open === experiment.slug ? "is-open" : ""}`} key={experiment.slug}>
      <button id={`exp-toggle-${experiment.slug}`} className="experiment-toggle" aria-expanded={open === experiment.slug} aria-controls={`exp-${experiment.slug}`}
        onClick={() => { setOpen(open === experiment.slug ? null : experiment.slug); setPicked(""); cue(); }}>
        <span className={`experiment-art ${experiment.slug}`} aria-hidden="true"><experiment.icon size={50} weight="thin"/></span>
        <span className="experiment-heading"><small>{experiment.kind}</small><span>{experiment.name}</span></span>
        <span className="experiment-question">{experiment.question}</span>
        <span className="expand-icon" aria-hidden="true">{open === experiment.slug ? <MinusIcon size={22}/> : <PlusIcon size={22}/>}</span>
      </button>
      <div className="experiment-detail" id={`exp-${experiment.slug}`} hidden={open !== experiment.slug}>
        <p>{experiment.description}</p>
        <a className="text-link" href={experiment.href} target="_blank" rel="noopener noreferrer">Open {experiment.name}<ArrowUpRightIcon size={19} aria-hidden="true"/><span className="sr-only">, opens a new tab</span></a>
        <span className="caption">External experiment. Access requirements may apply.</span>
      </div>
    </article>)}
    <div className="explorer-pick">
      <button className="text-link explorer-pick-button" type="button" onClick={explore}><MascotMark/><span>Let NTIC choose</span><ArrowUpRightIcon size={17} aria-hidden="true"/></button>
      <p aria-live="polite">{picked || "Follow a little curiosity."}</p>
    </div>
    <noscript><div className="experiment-nojs">{experiments.map(experiment => <a key={experiment.slug} className="text-link" href={experiment.href} target="_blank" rel="noopener noreferrer">Open {experiment.name}<span className="sr-only">, opens a new tab</span></a>)}</div></noscript>
    <p className="experiment-publication">Prefer an idea you can read? <Link href="/publications/the-token-gap">Explore The Token Gap <ArrowUpRightIcon size={16}/></Link></p>
  </div>;
}
