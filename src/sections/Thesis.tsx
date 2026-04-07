import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Thesis() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const abstractRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const abstract = abstractRef.current;
    const principles = principlesRef.current;
    const cta = ctaRef.current;

    if (!section || !heading || !abstract || !principles || !cta) return;

    const principleCards = principles.querySelectorAll('.principle-card');

    const ctx = gsap.context(() => {
      // Heading animation
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

      // Abstract animation
      gsap.fromTo(
        abstract,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: abstract,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Principle cards animation
      gsap.fromTo(
        principleCards,
        { y: 50, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: principles,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // CTA animation
      gsap.fromTo(
        cta,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cta,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);



  const principles = [
    {
      name: 'Einstein Gateway',
      description: 'Hypothesis-first processing. Generate bold conjectures before converging on solutions.',
    },
    {
      name: 'Three-Tier Memory',
      description: 'Identity engine through Experience Buffer, Pattern Layer, and Identity Core.',
    },
    {
      name: 'Wave Function Collaboration',
      description: 'Parallel decision-making with superposition, reflection, collapse, and synthesis phases.',
    },
    {
      name: "Indra's Mesh",
      description: "Reflective intelligence compounding - each agent's learning amplifies every other agent.",
    },
    {
      name: 'Active Participation',
      description: 'Reality construction mode - agents as participants, not passive observers.',
    },
    {
      name: 'Inversion Detection',
      description: 'Adversarial validation through systematic skepticism and flip-thinking.',
    },
    {
      name: 'Frequency Orchestration',
      description: 'Multi-speed agent ecosystems from high-frequency scouts to ultra-low-frequency guardians.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="thesis"
      className="relative w-full min-h-screen py-20 lg:py-32 bg-[#05060B]"
      style={{ zIndex: 25 }}
    >
      {/* Background radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(79, 109, 255, 0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-8ntic-accent mb-4 block">
            The Thesis
          </span>
          <h2
            ref={headingRef}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-tight mb-4"
          >
            Quantum Intelligence
          </h2>
          <p className="text-lg text-8ntic-text-secondary">
            A Unified Theory for Autonomous Agent Governance
          </p>
        </div>

        {/* Abstract */}
        <div ref={abstractRef} className="glass-panel p-8 lg:p-10 mb-12 lg:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Quote className="w-5 h-5 text-8ntic-accent" />
            <span className="font-mono text-sm uppercase tracking-wider text-8ntic-text-secondary">
              Abstract
            </span>
          </div>
          <p className="text-base lg:text-lg text-white/90 leading-relaxed mb-6">
            The proliferation of autonomous AI agents has created an intelligence governance vacuum.
            Current frameworks - LangGraph, CrewAI, AutoGen, and others - solve for orchestration mechanics
            but fail to address the deeper challenge: how do you govern systems that are designed to think,
            learn, and act independently? How do you create infrastructure where intelligence compounds
            rather than merely aggregates?
          </p>
          <p className="text-base lg:text-lg text-white/90 leading-relaxed mb-6">
            This thesis introduces <strong className="text-8ntic-accent">Quantum Intelligence (QI)</strong> as both a theoretical framework
            and a practical architectural protocol for governing autonomous agent systems at scale. Drawing on
            three converging scientific traditions - quantum mechanics, complex systems theory, and cognitive
            science - QI establishes a new discipline that transcends conventional AI orchestration by treating
            agent systems as living cognitive ecosystems rather than deterministic pipelines.
          </p>
          <p className="text-base lg:text-lg text-white/90 leading-relaxed">
            The <strong className="text-8ntic-accent">Quantum Intelligence Protocol (QIP)</strong> defines seven architectural principles
            that provide the missing governance layer between individual AI agents and enterprise-scale
            autonomous operations.
          </p>
        </div>

        {/* Seven Principles */}
        <div className="mb-12 lg:mb-16">
          <h3 className="font-heading text-xl lg:text-2xl font-semibold text-white text-center mb-8">
            The Seven Principles of QIP
          </h3>
          <div ref={principlesRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {principles.map((principle, index) => (
              <div
                key={principle.name}
                className="principle-card glass-panel p-6 hover:bg-white/[0.08] transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-6 rounded-full bg-8ntic-accent/20 flex items-center justify-center text-xs font-mono text-8ntic-accent">
                    {index + 1}
                  </span>
                  <h4 className="font-heading text-base font-medium text-white">
                    {principle.name}
                  </h4>
                </div>
                <p className="text-sm text-8ntic-text-secondary leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Substack CTA */}
        <div ref={ctaRef} className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-8ntic-accent/15 via-transparent to-purple-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(100,80,255,0.12),transparent_60%)]" />
          
          <div className="relative px-8 py-10 lg:px-12 lg:py-14 flex flex-col items-center text-center">
            {/* Decorative ring */}
            <div className="w-16 h-16 rounded-full border border-8ntic-accent/30 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-8ntic-accent/10 animate-ping" style={{ animationDuration: '3s' }} />
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-8ntic-accent">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            
            <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-white mb-3 tracking-tight">
              The thesis is live
            </h3>
            <p className="text-8ntic-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
              Quantum Intelligence Protocol: the complete framework for autonomous agent governance. Read it now on Substack.
            </p>
            
            <a
              href="https://open.substack.com/pub/rem8ntic/p/quantum-intelligence-protocol?utm_campaign=post-expanded-share&utm_medium=web"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-8ntic-accent text-white font-semibold text-lg transition-all duration-300 hover:bg-8ntic-accent/90 hover:shadow-[0_0_30px_rgba(100,80,255,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Read the thesis on Substack
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

