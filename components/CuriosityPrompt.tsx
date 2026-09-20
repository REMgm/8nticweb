"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRightIcon, ArrowsClockwiseIcon, XIcon } from "@phosphor-icons/react";
import { MascotMark } from "./Brand";
import { useExperience } from "./Experience";

const discoveries = [
  { question: "What if the next task remembered the last?", label: "Try the memory loop", href: "#the-loop" },
  { question: "What happens when you follow a small idea?", label: "Meet the experiments", href: "/experiments" },
  { question: "Can we think as fast as we can generate?", label: "Explore The Token Gap", href: "/publications/the-token-gap" },
];

export function CuriosityPrompt() {
  const [open, setOpen] = useState(false);
  const [discovery, setDiscovery] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const { cue } = useExperience();
  const current = discoveries[discovery];

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return <div className="hero-companion curiosity" ref={container} onBlur={event => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
  }}>
    <button ref={trigger} type="button" className="companion-button" aria-expanded={open} aria-controls={id}
      onClick={() => { setOpen(value => !value); cue(); }}>
      <MascotMark/><span>Always exploring</span><ArrowRightIcon size={16} aria-hidden="true"/>
    </button>
    <div id={id} className="curiosity-panel" hidden={!open}>
      <div className="curiosity-panel-top"><span className="caption">A question from NTIC</span><button className="icon-button" type="button" aria-label="Close NTIC’s suggestion" onClick={() => { setOpen(false); trigger.current?.focus(); }}><XIcon size={18} aria-hidden="true"/></button></div>
      <p className="curiosity-question" aria-live="polite">{current.question}</p>
      <Link className="text-link curiosity-destination" href={current.href} onClick={() => setOpen(false)}>{current.label}<ArrowRightIcon size={18} aria-hidden="true"/></Link>
      <button className="text-link curiosity-next" type="button" onClick={() => { setDiscovery(value => (value + 1) % discoveries.length); cue(); }}><ArrowsClockwiseIcon size={16} aria-hidden="true"/>Another idea</button>
    </div>
  </div>;
}
