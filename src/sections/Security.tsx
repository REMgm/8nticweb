import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Zap, FileCheck, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

gsap.registerPlugin(ScrollTrigger);

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
}

const nodes: Node[] = [
  { id: 1, x: 6, y: 20, size: 16 },
  { id: 2, x: 94, y: 26, size: 20 },
  { id: 3, x: 5, y: 62, size: 14 },
  { id: 4, x: 95, y: 70, size: 18 },
  { id: 5, x: 14, y: 86, size: 12 },
  { id: 6, x: 90, y: 88, size: 16 },
  { id: 7, x: 50, y: 7, size: 14 },
  { id: 8, x: 24, y: 11, size: 18 },
  { id: 9, x: 80, y: 14, size: 12 },
  { id: 10, x: 50, y: 93, size: 20 },
];

const safeguards = [
  {
    icon: Shield,
    title: 'Inversion Detection',
    description: 'Catch adversarial prompts before they propagate.',
  },
  {
    icon: Zap,
    title: 'Frequency Orchestration',
    description: 'Separate high-speed actions from high-stakes decisions.',
  },
  {
    icon: FileCheck,
    title: 'Audit Trails',
    description: 'Every decision is traceable, replayable, and improvable.',
  },
];

export default function Security() {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const safeguardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const ring1Ref = useRef<SVGEllipseElement>(null);
  const ring2Ref = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const headline = headlineRef.current;
    const body = bodyRef.current;
    const safeguardsEl = safeguardsRef.current;
    const cta = ctaRef.current;
    const image = imageRef.current;
    const ring1 = ring1Ref.current;
    const ring2 = ring2Ref.current;

    if (!section || !panel || !headline || !body || !safeguardsEl || !cta || !image) return;

    const safeguardItems = safeguardsEl.querySelectorAll('.safeguard-item');

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        panel,
        { y: '10vh', opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headline,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        body,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        safeguardItems,
        { y: '12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none', stagger: 0.04 },
        0.12
      );

      scrollTl.fromTo(
        cta,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.2
      );

      scrollTl.fromTo(
        image,
        { y: '8vh', opacity: 0, scale: 1.05 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0.05
      );

      if (ring1 && ring2) {
        scrollTl.fromTo(
          [ring1, ring2],
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 0.14, ease: 'none' },
          0
        );
      }

      nodesRef.current.forEach((node, i) => {
        if (node) {
          scrollTl.fromTo(
            node,
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, ease: 'none' },
            0.05 + i * 0.015
          );
        }
      });

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        panel,
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        image,
        { y: 0, opacity: 1 },
        { y: '4vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        [headline, body, safeguardItems, cta],
        { y: 0, opacity: 1 },
        { y: '-8vh', opacity: 0, ease: 'power2.in', stagger: 0.02 },
        0.7
      );

      nodesRef.current.forEach((node, i) => {
        if (node) {
          const directionX = i % 2 === 0 ? -8 : 8;
          const directionY = i % 3 === 0 ? 12 : -12;
          scrollTl.fromTo(
            node,
            { y: 0, opacity: 1 },
            { y: `${directionY}vh`, opacity: 0, ease: 'power2.in' },
            0.7 + i * 0.01
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="security"
      className="relative w-full h-screen overflow-hidden bg-[#05060B]"
      style={{ zIndex: 60 }}
    >
      {/* Background radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(79, 109, 255, 0.06) 0%, transparent 60%)',
        }}
      />

      {/* Orbit Rings SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <ellipse
          ref={ring1Ref}
          cx="50"
          cy="50"
          rx="40"
          ry="18"
          className="orbit-ring"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(6deg)',
          }}
        />
        <ellipse
          ref={ring2Ref}
          cx="50"
          cy="50"
          rx="32"
          ry="14"
          className="orbit-ring"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(-10deg)',
          }}
        />
      </svg>

      {/* Orbiting Nodes */}
      {nodes.map((node, index) => (
        <div
          key={node.id}
          ref={(el) => { nodesRef.current[index] = el; }}
          className="absolute glow-node rounded-full animation-float-slow"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
            animationDelay: `${index * 0.28}s`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="rounded-full bg-white/80"
              style={{ width: node.size * 0.3, height: node.size * 0.3 }}
            />
          </div>
        </div>
      ))}

      {/* Glass Panel */}
      <div
        ref={panelRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 glass-panel"
        style={{
          width: 'min(1020px, 88vw)',
          height: 'min(520px, 62vh)',
        }}
      >
        <div className="relative h-full flex">
          {/* Left content */}
          <div className="flex-1 flex flex-col justify-center p-8 lg:p-12 lg:max-w-[54%]">
            {/* Headline */}
            <h2
              ref={headlineRef}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-tight mb-6"
            >
              Security & Trust
            </h2>

            {/* Body */}
            <p
              ref={bodyRef}
              className="text-base lg:text-lg text-8ntic-text-secondary leading-relaxed max-w-lg mb-8"
            >
              Autonomy without governance is risk. The Quantum Intelligence Protocol builds trust and speed into the architecture of agentic systems.
            </p>

            {/* Safeguards */}
            <div ref={safeguardsRef} className="space-y-5 mb-8">
              {safeguards.map((item) => (
                <div
                  key={item.title}
                  className="safeguard-item flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-8ntic-accent/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-8ntic-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-medium text-white mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-8ntic-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a ref={ctaRef} href="#contact" className="btn-secondary w-fit">
              Get in touch
            </a>
          </div>

          {/* Right image */}
          <div
            ref={imageRef}
            className="hidden lg:block absolute right-[4%] top-1/2 -translate-y-1/2"
            style={{ width: '40%', height: '86%' }}
          >
            <div className="relative w-full h-full rounded-[22px] overflow-hidden">
              <img
                src="/glass_orbs_03.jpg"
                alt="Security"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 30px rgba(79, 109, 255, 0.2)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Auth gate overlay — renders inside section so ScrollTrigger pin is unaffected */}
      {!user && (
        <>
          <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[#05060B]/60">
            <div className="glass-panel p-6 text-center max-w-sm mx-4">
              <div className="w-10 h-10 rounded-full bg-8ntic-accent/20 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5 text-8ntic-accent" />
              </div>
              <p className="text-sm text-8ntic-text-secondary mb-4">
                Sign in to access the security & governance framework
              </p>
              <button
                onClick={() => setShowAuth(true)}
                className="btn-primary text-sm"
              >
                Unlock content
              </button>
            </div>
          </div>
          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultMode="signup" />
        </>
      )}
    </section>
  );
}
