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
  { id: 1, x: 6, y: 22, size: 16 },
  { id: 2, x: 94, y: 26, size: 20 },
  { id: 3, x: 4, y: 64, size: 14 },
  { id: 4, x: 96, y: 70, size: 18 },
  { id: 5, x: 12, y: 86, size: 12 },
  { id: 6, x: 90, y: 88, size: 16 },
  { id: 7, x: 50, y: 6, size: 14 },
  { id: 8, x: 24, y: 10, size: 18 },
  { id: 9, x: 80, y: 14, size: 12 },
  { id: 10, x: 50, y: 94, size: 20 },
];

export default function Architecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const ring1Ref = useRef<SVGEllipseElement>(null);
  const ring2Ref = useRef<SVGEllipseElement>(null);
  const arrow1Ref = useRef<SVGPathElement>(null);
  const arrow2Ref = useRef<SVGPathElement>(null);
  const arrow3Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const headline = headlineRef.current;
    const diagram = diagramRef.current;
    const body = bodyRef.current;
    const cta = ctaRef.current;
    const image = imageRef.current;
    const ring1 = ring1Ref.current;
    const ring2 = ring2Ref.current;
    const arrow1 = arrow1Ref.current;
    const arrow2 = arrow2Ref.current;
    const arrow3 = arrow3Ref.current;

    if (!section || !panel || !headline || !diagram || !body || !cta || !image) return;

    const diagramNodes = diagram.querySelectorAll('.diagram-node');

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        panel,
        { y: '60vh', opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headline,
        { y: '-10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        diagramNodes,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none', stagger: 0.05 },
        0.1
      );

      // Arrow draw-on
      [arrow1, arrow2, arrow3].forEach((arrow, i) => {
        if (arrow) {
          const length = arrow.getTotalLength();
          scrollTl.fromTo(
            arrow,
            { strokeDasharray: length, strokeDashoffset: length },
            { strokeDashoffset: 0, ease: 'none' },
            0.15 + i * 0.03
          );
        }
      });

      scrollTl.fromTo(
        body,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
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
        0.1
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
        { y: '-18vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        diagram,
        { scale: 1, opacity: 1 },
        { scale: 0.96, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        image,
        { y: 0, opacity: 1 },
        { y: '4vh', opacity: 0, ease: 'power2.in' },
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
      id="architecture"
      className="relative w-full h-screen overflow-hidden bg-[#0B0E1A]"
      style={{ zIndex: 40 }}
    >
      {/* Background radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(79, 109, 255, 0.08) 0%, transparent 60%)',
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
          rx="43"
          ry="20"
          className="orbit-ring"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(10deg)',
          }}
        />
        <ellipse
          ref={ring2Ref}
          cx="50"
          cy="50"
          rx="35"
          ry="16"
          className="orbit-ring"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(-6deg)',
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
            animationDelay: `${index * 0.2}s`,
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
          width: 'min(1080px, 90vw)',
          height: 'min(560px, 66vh)',
        }}
      >
        <div className="relative h-full flex flex-col lg:flex-row">
          {/* Left content */}
          <div className="flex-1 flex flex-col justify-center p-8 lg:p-12 lg:max-w-[54%]">
            {/* Headline */}
            <h2
              ref={headlineRef}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-tight mb-8"
            >
              How It Works
            </h2>

            {/* Diagram */}
            <div ref={diagramRef} className="relative mb-8">
              <svg
                viewBox="0 0 280 200"
                className="w-full max-w-[280px] h-auto"
              >
                <defs>
                  <linearGradient
                    id="arrowGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="rgba(79, 109, 255, 0.8)" />
                    <stop offset="100%" stopColor="rgba(79, 109, 255, 0.2)" />
                  </linearGradient>
                </defs>

                {/* Arrow paths */}
                <path
                  ref={arrow1Ref}
                  d="M 140 40 Q 200 70 200 120"
                  fill="none"
                  stroke="url(#arrowGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  ref={arrow2Ref}
                  d="M 180 150 Q 100 170 60 130"
                  fill="none"
                  stroke="url(#arrowGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  ref={arrow3Ref}
                  d="M 60 100 Q 80 50 120 40"
                  fill="none"
                  stroke="url(#arrowGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                />

                {/* Nodes */}
                <g className="diagram-node">
                  <circle cx="140" cy="35" r="28" fill="rgba(79, 109, 255, 0.15)" stroke="rgba(79, 109, 255, 0.4)" strokeWidth="1.5" />
                  <text x="140" y="40" textAnchor="middle" fill="#F4F6FF" fontSize="12" fontFamily="Space Grotesk" fontWeight="500">
                    Sensors
                  </text>
                </g>

                <g className="diagram-node">
                  <circle cx="200" cy="145" r="28" fill="rgba(79, 109, 255, 0.15)" stroke="rgba(79, 109, 255, 0.4)" strokeWidth="1.5" />
                  <text x="200" y="150" textAnchor="middle" fill="#F4F6FF" fontSize="12" fontFamily="Space Grotesk" fontWeight="500">
                    Action
                  </text>
                </g>

                <g className="diagram-node">
                  <circle cx="50" cy="110" r="28" fill="rgba(79, 109, 255, 0.15)" stroke="rgba(79, 109, 255, 0.4)" strokeWidth="1.5" />
                  <text x="50" y="115" textAnchor="middle" fill="#F4F6FF" fontSize="12" fontFamily="Space Grotesk" fontWeight="500">
                    Memory
                  </text>
                </g>
              </svg>
            </div>

            {/* Body copy */}
            <div ref={bodyRef} className="space-y-3 mb-6">
              <p className="font-mono text-sm uppercase tracking-wider text-8ntic-accent">
                Observe. Encode. Decide. Execute.
              </p>
              <p className="text-sm lg:text-base text-8ntic-text-secondary leading-relaxed max-w-md">
                8NTIC turns every interaction into a learning signal so the system
                becomes more coherent, aligned, and capable over time.
              </p>
            </div>

            {/* CTA */}
            <a ref={ctaRef} href="#" className="btn-secondary w-fit">
              See the docs
            </a>
          </div>

          {/* Right image */}
          <div
            ref={imageRef}
            className="hidden lg:block absolute right-[4%] top-1/2 -translate-y-1/2"
            style={{ width: '34%', height: '80%' }}
          >
            <div className="relative w-full h-full rounded-[22px] overflow-hidden">
              <img
                src="/glass_orbs_02.jpg"
                alt="Architecture"
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
