"use client";

import { useId, useState, type CSSProperties } from "react";
import { ArrowRightIcon, ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { useExperience } from "./Experience";

const memorySteps = [
  {
    short: "Experience",
    name: "Experience Buffer",
    horizon: "Short-term",
    title: "Keep the immediate context.",
    description: "The current task begins with its raw material: the request, the draft and the review. An experience is available to examine before anything becomes a lasting lesson.",
    example: "A launch brief comes back from review: “Put the source beside each claim. I need to see what supports it.”",
    annotation: "One review, held in the context of this task.",
    question: "What happened?",
  },
  {
    short: "Pattern",
    name: "Pattern Layer",
    horizon: "Mid-term",
    title: "Look for a lesson worth keeping.",
    description: "A relevant experience can become a transferable pattern. Repeated validation strengthens it; a pattern that stops being useful can fade. The specific review is not a universal rule.",
    example: "A reviewed lesson for future launch briefs: attach supporting sources while drafting, so the reviewer can check the claims in context.",
    annotation: "A reusable pattern, with a clear scope.",
    question: "What could help again?",
  },
  {
    short: "Identity",
    name: "Identity Core",
    horizon: "Long-term",
    title: "Let experience refine the lens.",
    description: "Over time, useful patterns can refine the values that shape attention and judgment. This core guides what the system notices next; it is more than a larger archive of old briefs.",
    example: "An enduring value takes shape: make reasoning traceable. The next brief begins by noticing where a claim needs evidence.",
    annotation: "A durable value that guides the next task.",
    question: "What should guide us?",
  },
] as const;

const perspectives = ["Commercial", "Operations", "Risk"] as const;

const collaborationPhases = [
  {
    name: "Superposition",
    plain: "Explore independently",
    description: "Three perspectives examine the same launch-brief problem. Each follows its own question before seeing anyone else’s conclusion.",
    kind: "Independent question",
    cards: [
      "Which part of preparing a launch brief would be most useful to improve for the team?",
      "Which steps are repeatable, and where does a person still need to make a judgment?",
      "What information and decisions need a clear boundary before this work begins?",
    ],
    takeaway: "Keep room for different answers.",
  },
  {
    name: "Reflection",
    plain: "Share observations",
    description: "Observations travel between perspectives. Conclusions stay separate, so new evidence can enrich the work without forcing early agreement.",
    kind: "Shared observation",
    cards: [
      "The team wants launch briefs sooner, but reviewers still ask where each claim came from.",
      "Drafting follows a repeatable structure. Checking the claims and tone still needs human review.",
      "Some briefs contain customer information. Not everyone has permission to share that material.",
    ],
    takeaway: "Share what you noticed before what you recommend.",
  },
  {
    name: "Collapse",
    plain: "Form distinct conclusions",
    description: "Each perspective now reaches its own conclusion, informed by the shared observations. Differences remain visible instead of disappearing into a vote.",
    kind: "Independent conclusion",
    cards: [
      "Begin with a team that prepares launch briefs regularly, so the pilot addresses a recurring need.",
      "Keep a consistent brief template, source links and a named human reviewer for each draft.",
      "Use approved internal material. Keep customer contact and external publication outside the pilot.",
    ],
    takeaway: "A useful difference is something to examine.",
  },
  {
    name: "Synthesis",
    plain: "Commit to a bounded pilot",
    description: "The final proposal brings the useful parts together: a small internal pilot for recurring launch briefs, using approved material, linked evidence and a named human reviewer. No external publication is included.",
    kind: "Contribution to the decision",
    cards: [
      "A recurring team need gives the pilot a useful purpose.",
      "A repeatable draft and review process makes the work assessable.",
      "Approved inputs and a clear publication boundary keep the scope defined.",
    ],
    takeaway: "One course of action, shaped by all three perspectives.",
  },
] as const;

export function MemoryExplorer() {
  const [active, setActive] = useState(0);
  const { cue, motion } = useExperience();
  const id = useId();
  const stage = memorySteps[active];

  function choose(index: number) {
    if (index === active) return;
    setActive(index);
    cue();
  }

  return (
    <figure className="qip-explorer qip-memory-explorer" data-motion={motion ? "on" : "off"} aria-labelledby={`${id}-title`}>
      <header className="qip-x-heading">
        <p className="qip-x-eyebrow">Explore the idea · §6.2</p>
        <h4 id={`${id}-title`}>What carries forward?</h4>
        <p>Follow one launch brief through the three memory tiers.</p>
      </header>

      <div className="qip-x-memory-track" style={{ "--qip-progress": active / 2 } as CSSProperties}>
        <div className="qip-x-memory-line" aria-hidden="true"><i /></div>
        <div className="qip-x-memory-steps" role="group" aria-label="Choose a memory tier">
          {memorySteps.map((step, index) => (
            <button key={step.name} type="button" aria-pressed={active === index} aria-controls={`${id}-detail`} onClick={() => choose(index)}>
              <span className="qip-x-step-number" aria-hidden="true">0{index + 1}</span>
              <span>{step.short}<small>Tier {index + 1} · {step.horizon}</small></span>
            </button>
          ))}
        </div>
      </div>

      <div className="qip-x-memory-detail" id={`${id}-detail`}>
        <div className="qip-x-memory-copy qip-x-enter" key={`copy-${active}`}>
          <p className="qip-x-label">{stage.name}</p>
          <p className="qip-x-detail-title">{stage.title}</p>
          <p>{stage.description}</p>
        </div>
        <div className="qip-x-specimen qip-x-enter" key={`example-${active}`}>
          <span className="qip-x-label">{stage.question}</span>
          <p>{stage.example}</p>
          <small>{stage.annotation}</small>
        </div>
      </div>

      <div className="qip-x-controls">
        <button type="button" className="qip-x-next" onClick={() => choose(active === 2 ? 0 : active + 1)}>
          {active === 2 ? "Return to the experience" : "Follow the next tier"}
          {active === 2 ? <ArrowsClockwiseIcon size={18} aria-hidden="true" /> : <ArrowRightIcon size={18} aria-hidden="true" />}
        </button>
        <span className="qip-x-position" aria-hidden="true">{active + 1} / 3</span>
      </div>
      <p className="sr-only" role="status" aria-atomic="true">Tier {active + 1} of 3: {stage.name}. {stage.title}</p>
      <figcaption>Illustrative example of the proposed architecture. Selecting a tier explains the idea; it does not store information or run a model.</figcaption>
      <noscript><p className="qip-x-nojs">The first tier is shown here. The complete explanation of all three tiers is in the thesis above.</p></noscript>
    </figure>
  );
}

export function CollaborationExplorer() {
  const [active, setActive] = useState(0);
  const { cue, motion } = useExperience();
  const id = useId();
  const phase = collaborationPhases[active];

  function choose(index: number) {
    if (index === active) return;
    setActive(index);
    cue();
  }

  return (
    <figure className="qip-explorer qip-collaboration-explorer" data-motion={motion ? "on" : "off"} data-phase={active} aria-labelledby={`${id}-title`}>
      <header className="qip-x-heading">
        <p className="qip-x-eyebrow">Explore the idea · §6.3</p>
        <h4 id={`${id}-title`}>Different paths. A considered decision.</h4>
        <p>Move through the four phases of Wave Function Collaboration.</p>
      </header>

      <div className="qip-x-phases" role="group" aria-label="Choose a collaboration phase">
        {collaborationPhases.map((step, index) => (
          <button key={step.name} type="button" aria-pressed={active === index} aria-controls={`${id}-detail`} onClick={() => choose(index)}>
            <span aria-hidden="true">0{index + 1}</span>{step.name}
          </button>
        ))}
      </div>

      <div id={`${id}-detail`}>
        <div className="qip-x-phase-intro qip-x-enter" key={`intro-${active}`}>
          <p className="qip-x-detail-title">{phase.plain}</p>
          <p>{phase.description}</p>
        </div>
        <div className="qip-x-perspectives">
          {perspectives.map((perspective, index) => (
            <div className="qip-x-perspective" key={perspective}>
              <div className="qip-x-perspective-head"><span className="qip-x-node" aria-hidden="true" /><span>{perspective}</span></div>
              <div className="qip-x-enter" key={`${perspective}-${active}`}>
                <p className="qip-x-label">{phase.kind}</p>
                <p>{phase.cards[index]}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="qip-x-paths" aria-hidden="true">
          <span /><span /><span />
          <i />
        </div>
        <p className="qip-x-takeaway">{phase.takeaway}</p>
      </div>

      <div className="qip-x-controls">
        <button type="button" className="qip-x-next" onClick={() => choose(active + 1)} disabled={active === 3}>
          {active === 3 ? "All phases explored" : "Next phase"}<ArrowRightIcon size={18} aria-hidden="true" />
        </button>
        <button type="button" className="qip-x-reset" onClick={() => choose(0)} disabled={active === 0} aria-label="Reset collaboration to the first phase"><ArrowsClockwiseIcon size={17} aria-hidden="true" />Reset</button>
        <span className="qip-x-position" aria-hidden="true">{active + 1} / 4</span>
      </div>
      <p className="sr-only" role="status" aria-atomic="true">Phase {active + 1} of 4: {phase.name}. {phase.plain}.</p>
      <figcaption>An illustrative launch-brief scenario, not a live agent session. “Superposition” names parallel exploration in this proposed architecture, not quantum computation.</figcaption>
      <noscript><p className="qip-x-nojs">The first phase is shown here. The complete four-phase method is in the thesis above.</p></noscript>
    </figure>
  );
}
