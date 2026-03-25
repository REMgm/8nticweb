import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
}

const nodes: Node[] = [
  { id: 1, x: 6, y: 18, size: 16 },
  { id: 2, x: 94, y: 22, size: 20 },
  { id: 3, x: 4, y: 60, size: 14 },
  { id: 4, x: 96, y: 68, size: 18 },
  { id: 5, x: 12, y: 88, size: 12 },
  { id: 6, x: 90, y: 85, size: 16 },
  { id: 7, x: 52, y: 6, size: 14 },
  { id: 8, x: 22, y: 10, size: 18 },
  { id: 9, x: 82, y: 12, size: 12 },
  { id: 10, x: 48, y: 94, size: 20 },
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
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
    const cta = ctaRef.current;
    const image = imageRef.current;
    const ring1 = ring1Ref.current;
    const ring2 = ring2Ref.current;

    if (!section || !panel || !headline || !body || !cta || !image) return;

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
        { x: '60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headline,
        { x: '-18vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        body,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        cta,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      );

      scrollTl.fromTo(
        image,
        { x: '40vw', opacity: 0, scale: 1.05 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
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

      // SETTLE (30% - 70%) - no animation, just hold

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        panel,
        { x: 0, opacity: 1 },
        { x: '-22vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        image,
        { x: 0, opacity: 1 },
        { x: '12vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        [headline, body, cta],
        { y: 0, opacity: 1 },
        { y: '-8vh', opacity: 0, ease: 'power2.in', stagger: 0.02 },
        0.7
      );

      nodesRef.current.forEach((node, i) => {
        if (node) {
          const directionX = i % 2 === 0 ? 8 : -8;
          const directionY = i % 3 === 0 ? 12 : -12;
          scrollTl.fromTo(
            node,
            { x: 0, y: 0, opacity: 1 },
            { x: `${directionX}vw`, y: `${directionY}vh`, opacity: 0, ease: 'power2.in' },
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
      id="manifesto"
      className="relative w-full h-screen overflow-hidden bg-[#05060B]"
      style={{ zIndex: 20 }}
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
          rx="42"
          ry="19"
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
          rx="34"
          ry="15"
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
            animationDelay: `${index * 0.3}s`,
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
          width: 'min(980px, 88vw)',
          height: 'min(480px, 58vh)',
        }}
      >
        <div className="relative h-full flex">
          {/* Left content */}
          <div className="flex-1 flex flex-col justify-center p-8 lg:p-12 lg:max-w-[56%]">
            {/* Headline */}
            <h2
              ref={headlineRef}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-tight mb-8"
            >
              The Intelligence Governance Vacuum
            </h2>

            {/* Body copy */}
            <div ref={bodyRef} className="space-y-4 mb-8">
              <p className="text-base lg:text-lg text-8ntic-text-secondary leading-relaxed max-w-lg">
                We have built the neurons. We have built the synapses. 
                <strong className="text-white"> We have not built the brain.</strong>
              </p>
              <p className="text-base lg:text-lg text-8ntic-text-secondary leading-relaxed max-w-lg">
                Current frameworks—LangGraph, CrewAI, AutoGen—solve for orchestration mechanics 
                but fail to address the deeper challenge: how do you govern systems designed to 
                think, learn, and act independently?
              </p>
              <p className="text-base lg:text-lg text-8ntic-text-secondary leading-relaxed max-w-lg">
                Quantum Intelligence is not another orchestration framework. 
                It is the <strong className="text-8ntic-accent">intelligence substrate</strong> upon which all orchestration 
                frameworks operate.
              </p>
            </div>

            {/* CTA */}
            <a ref={ctaRef} href="#thesis" className="btn-secondary w-fit">
              Read the thesis
            </a>
          </div>

          {/* Right image */}
          <div
            ref={imageRef}
            className="hidden lg:block absolute right-[4%] top-1/2 -translate-y-1/2"
            style={{ width: '38%', height: '84%' }}
          >
            <div className="relative w-full h-full rounded-[22px] overflow-hidden">
              <img
                src="/glass_orbs_01.jpg"
                alt="Quantum Intelligence"
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
    </section>
  );
}
