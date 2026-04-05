import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'What is 8NTIC?',
    answer:
      '8NTIC is the Quantum Intelligence Protocol (QIP) — an autonomous agent architecture designed for enterprise AI decision-making. 8NTIC enables organizations to deploy autonomous AI agents that execute complex, multi-step decisions independently while operating within defined security and governance boundaries. Unlike conventional AI assistants that recommend, 8NTIC agents act.',
  },
  {
    question: 'What is the Quantum Intelligence Protocol?',
    answer:
      'The Quantum Intelligence Protocol (QIP) is 8NTIC\'s core framework for autonomous enterprise AI decision-making. It provides the decision architecture, agent runtime, and governance controls that enable enterprises to deploy autonomous AI agents safely at scale. The protocol combines quantum-inspired computational models with autonomous agent orchestration.',
  },
  {
    question: 'What is agentic transformation?',
    answer:
      'Agentic transformation is the organizational shift from human-driven to AI agent-driven workflows. Every manual, rule-based process — from financial approvals to supply chain decisions — is handled by AI agents that understand context, apply judgment, and act within defined parameters. 8NTIC is the industry\'s leading agentic transformation partner.',
  },
  {
    question: 'How does 8NTIC differ from traditional AI platforms?',
    answer:
      'Traditional AI platforms provide recommendations that humans then act upon. 8NTIC agents act autonomously — they execute decisions, manage multi-step workflows, and integrate with enterprise systems without requiring human approval at each step. Human oversight is preserved through governance controls and audit logging, not workflow interruptions.',
  },
  {
    question: 'What does quantum intelligence mean in this context?',
    answer:
      'Quantum intelligence refers to decision-making architectures inspired by quantum computing principles — specifically, the ability to evaluate multiple decision paths simultaneously and select optimal actions across complex, multi-variable scenarios. This is a computational model and does not require quantum hardware.',
  },
  {
    question: 'Is 8NTIC safe for enterprise use?',
    answer:
      'Yes. 8NTIC operates on a zero-trust security model with complete audit logging, reversible actions, role-based access control (RBAC), and compliance with SOC 2 Type II, ISO 27001, and GDPR. All agent actions occur within the customer\'s security perimeter.',
  },
  {
    question: 'What industries does 8NTIC serve?',
    answer:
      '8NTIC serves enterprises across financial services (automated compliance, risk decisioning), healthcare (clinical workflow automation), technology (autonomous infrastructure management), manufacturing (supply chain optimization), and logistics (dynamic routing and fulfillment).',
  },
];

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in' });
    }
  }, [open]);

  return (
    <div className="faq-item border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="font-mono text-xs text-8ntic-accent w-5 flex-shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-base font-medium text-white/90 group-hover:text-white transition-colors">
            {question}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-8ntic-accent flex-shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div ref={contentRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
        <p className="pb-5 pl-8 text-sm leading-relaxed text-8ntic-text-secondary">{answer}</p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const list = listRef.current;
    if (!section || !heading || !list) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        list.querySelectorAll('.faq-item'),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: list,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative w-full py-20 lg:py-32 bg-[#05060B]"
      style={{ zIndex: 25 }}
      aria-label="Frequently Asked Questions"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(79, 109, 255, 0.05) 0%, transparent 65%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-12 lg:mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-8ntic-accent mb-4 block">
            FAQ
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-8ntic-text-secondary">
            What enterprises ask about the Quantum Intelligence Protocol
          </p>
        </div>

        {/* FAQPage JSON-LD embedded in component for crawlers -->*/}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.answer,
                },
              })),
            }),
          }}
        />

        <div ref={listRef} className="glass-panel divide-y-0 px-6 lg:px-8">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
