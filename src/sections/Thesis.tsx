import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Mail, Check, Bell } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Email storage for thesis registration
const thesisRegistrations: Array<{ email: string; timestamp: string; type: string }> = [];

export default function Thesis() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const abstractRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);

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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    // Store the registration
    const registration = {
      email: email,
      timestamp: new Date().toISOString(),
      type: 'thesis_registration',
    };

    thesisRegistrations.push(registration);

    // Log to console (in production, this would go to a database)
    console.log('Thesis registration stored:', registration);
    console.log('All thesis registrations:', thesisRegistrations);

    setRegistered(true);
  };

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

        {/* Registration CTA */}
        <div ref={ctaRef} className="glass-panel p-8 lg:p-10">
          <div className="text-center mb-6">
            <Bell className="w-8 h-8 text-8ntic-accent mx-auto mb-4" />
            <h3 className="font-heading text-xl lg:text-2xl font-semibold text-white mb-2">
              Register for Public Release
            </h3>
            <p className="text-8ntic-text-secondary max-w-lg mx-auto">
              Be the first to receive the complete thesis when it becomes publicly available.
            </p>
          </div>

          {!registered ? (
            <form onSubmit={handleRegister} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-8ntic-text-secondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-8ntic-accent/50 focus:ring-1 focus:ring-8ntic-accent/50 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Register
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-8ntic-accent/20 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-8ntic-accent" />
              </div>
              <p className="text-white font-medium mb-1">You're registered!</p>
              <p className="text-sm text-8ntic-text-secondary">
                You'll receive the thesis when it's released.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Export function to get thesis registrations (for admin access)
export function getThesisRegistrations() {
  return thesisRegistrations;
}
