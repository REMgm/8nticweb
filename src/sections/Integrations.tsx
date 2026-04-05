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
  { id: 1, x: 7, y: 18, size: 16 },
  { id: 2, x: 93, y: 24, size: 20 },
  { id: 3, x: 5, y: 60, size: 14 },
  { id: 4, x: 95, y: 68, size: 18 },
  { id: 5, x: 14, y: 86, size: 12 },
  { id: 6, x: 90, y: 88, size: 16 },
  { id: 7, x: 50, y: 7, size: 14 },
  { id: 8, x: 24, y: 11, size: 18 },
  { id: 9, x: 80, y: 14, size: 12 },
  { id: 10, x: 50, y: 93, size: 20 },
];

const frameworks = [
  'LangGraph',
  'CrewAI',
  'AutoGen',
  'n8n',
  'OpenAI Agents',
  'Custom APIs',
];

export default function Integrations() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const frameworksRef = useRef<HTMLDivElement>(null);
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
    const frameworksEl = frameworksRef.current;
    const cta = ctaRef.current;
    const image = imageRef.current;
    const ring1 = ring1Ref.current;
    const ring2 = ring2Ref.current;

    if (!section || !panel || !headline || !body || !frameworksEl || !cta || !image) return;

    const frameworkItems = frameworksEl.querySelectorAll('.framework-item');

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=80%',
          pin: false,
          scrub: 0.3,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        panel,
        { y: '2vh', opacity: 0, scale: 1 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headline,
        { y: '1.5vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        body,
        { y: '2vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        frameworkItems,
        { y: '2vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none', stagger: 0.03 },
        0.12
      );

      scrollTl.fromTo(
        cta,
        { y: '1.5vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.2
      );

      scrollTl.fromTo(
        image,
        { y: '2vh', opacity: 0, scale: 1 },
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
        { y: '1.5vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        image,
        { y: 0, opacity: 1 },
        { y: '1vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        [headline, body, frameworkItems, cta],
        { y: 0, opacity: 1 },
        { y: '-1vh', opacity: 0, ease: 'power2.in', stagger: 0.02 },
        0.7
      );

      nodesRef.current.forEach((node, i) => {
        if (node) {
          // removed directionX
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
      id="integrations"
      className="relative w-full h-screen overflow-hidden bg-[#05060B]"
      style={{ zIndex: 50 }}
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
          rx="41"
          ry="18"
          className="orbit-ring"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(-4deg)',
          }}
        />
        <ellipse
          ref={ring2Ref}
          cx="50"
          cy="50"
          rx="33"
          ry="14"
          className="orbit-ring"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(8deg)',
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
            animationDelay: `${index * 0.22}s`,
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
              Integrations
            </h2>

            {/* Body */}
            <p
              ref={bodyRef}
              className="text-base lg:text-lg text-8ntic-text-secondary leading-relaxed max-w-lg mb-6"
            >
              Drop 8NTIC into your existing stack. It composes with the
              frameworks you already use.
            </p>

            {/* Frameworks */}
            <div ref={frameworksRef} className="flex flex-wrap gap-2 mb-8">
              {frameworks.map((fw) => (
                <span
                  key={fw}
                  className="framework-item font-mono text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-8ntic-text-secondary"
                >
                  {fw}
                </span>
              ))}
            </div>

            {/* CTA */}
            <a ref={ctaRef} href="#" className="btn-secondary w-fit">
              View integration guides
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
                src="/hero_visor_03.jpg"
                alt="Integrations"
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
