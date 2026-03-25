import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const nodes: Node[] = [
  { id: 1, x: 8, y: 20, size: 16, delay: 0 },
  { id: 2, x: 92, y: 25, size: 20, delay: 0.1 },
  { id: 3, x: 5, y: 65, size: 14, delay: 0.2 },
  { id: 4, x: 95, y: 70, size: 18, delay: 0.3 },
  { id: 5, x: 15, y: 85, size: 12, delay: 0.4 },
  { id: 6, x: 88, y: 85, size: 16, delay: 0.5 },
  { id: 7, x: 50, y: 8, size: 14, delay: 0.6 },
  { id: 8, x: 25, y: 12, size: 18, delay: 0.7 },
  { id: 9, x: 78, y: 15, size: 12, delay: 0.8 },
  { id: 10, x: 50, y: 92, size: 20, delay: 0.9 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const ring1Ref = useRef<SVGEllipseElement>(null);
  const ring2Ref = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const author = authorRef.current;
    const cta = ctaRef.current;
    const image = imageRef.current;
    const ring1 = ring1Ref.current;
    const ring2 = ring2Ref.current;

    if (!section || !panel || !headline || !subheadline || !author || !cta || !image) return;

    const ctx = gsap.context(() => {
      // Initial load animation
      const loadTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Background fade
      loadTl.fromTo(
        section,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 }
      );

      // Orbit rings draw-on
      if (ring1 && ring2) {
        loadTl.fromTo(
          [ring1, ring2],
          { strokeDashoffset: 2000, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, duration: 1 },
          0.2
        );
      }

      // Glass panel entrance
      loadTl.fromTo(
        panel,
        { opacity: 0, scale: 0.96, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9 },
        0.3
      );

      // Headline word reveal
      const words = headline.querySelectorAll('.word');
      loadTl.fromTo(
        words,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 },
        0.5
      );

      // Subheadline + author + CTA
      loadTl.fromTo(
        [subheadline, author, cta],
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        0.8
      );

      // Hero image
      loadTl.fromTo(
        image,
        { scale: 1.04, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9 },
        0.5
      );

      // Nodes pop in
      nodesRef.current.forEach((node, i) => {
        if (node) {
          loadTl.fromTo(
            node,
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
            0.4 + i * 0.04
          );
        }
      });

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements when scrolling back to top
            gsap.set(panel, { x: 0, opacity: 1, scale: 1 });
            gsap.set(image, { x: 0, scale: 1, opacity: 1 });
            gsap.set([headline, subheadline, author, cta], { y: 0, opacity: 1 });
            nodesRef.current.forEach((node) => {
              if (node) gsap.set(node, { x: 0, y: 0, opacity: 1 });
            });
          },
        },
      });

      // EXIT phase (70% - 100%)
      scrollTl.fromTo(
        panel,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        image,
        { x: 0, scale: 1, opacity: 1 },
        { x: '10vw', scale: 1.06, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        [headline, subheadline, author, cta],
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in', stagger: 0.02 },
        0.7
      );

      nodesRef.current.forEach((node, i) => {
        if (node) {
          const directionX = i % 2 === 0 ? 6 : -6;
          const directionY = i % 3 === 0 ? 10 : -10;
          scrollTl.fromTo(
            node,
            { x: 0, y: 0, opacity: 1 },
            { x: `${directionX}vw`, y: `${directionY}vh`, opacity: 0, ease: 'power2.in' },
            0.7 + i * 0.01
          );
        }
      });

      if (ring1 && ring2) {
        scrollTl.fromTo(
          [ring1, ring2],
          { opacity: 0.14, rotation: 0 },
          { opacity: 0.08, rotation: 6, ease: 'power2.in' },
          0.7
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#05060B]"
      style={{ zIndex: 10 }}
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
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(79, 109, 255, 0.6)" />
            <stop offset="100%" stopColor="rgba(79, 109, 255, 0)" />
          </linearGradient>
        </defs>
        <ellipse
          ref={ring1Ref}
          cx="50"
          cy="50"
          rx="39"
          ry="17"
          className="orbit-ring"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(-12deg)',
            strokeDasharray: 2000,
          }}
        />
        <ellipse
          ref={ring2Ref}
          cx="50"
          cy="50"
          rx="31"
          ry="14"
          className="orbit-ring"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(8deg)',
            strokeDasharray: 2000,
          }}
        />
      </svg>

      {/* Orbiting Nodes */}
      {nodes.map((node, index) => (
        <div
          key={node.id}
          ref={(el) => { nodesRef.current[index] = el; }}
          className="absolute glow-node rounded-full animation-float"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
            animationDelay: `${node.delay * 2}s`,
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
        className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 glass-panel"
        style={{
          width: 'min(920px, 86vw)',
          height: 'min(460px, 56vh)',
        }}
      >
        {/* Content inside panel */}
        <div className="relative h-full flex">
          {/* Left content */}
          <div className="flex-1 flex flex-col justify-center p-8 lg:p-12 lg:max-w-[58%]">
            {/* Micro label */}
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-8ntic-text-secondary mb-4">
              Research by Remco Vroom
            </span>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white leading-[1.05] tracking-tight mb-6"
            >
              <span className="word inline-block">Quantum</span>{' '}
              <span className="word inline-block">Intelligence</span>
            </h1>

            {/* Subheadline */}
            <p
              ref={subheadlineRef}
              className="text-base lg:text-lg text-8ntic-text-secondary max-w-md leading-relaxed mb-4"
            >
              A unified theory for autonomous agent governance. From quantum mechanics to cognitive architecture, the missing intelligence layer in AI infrastructure.
            </p>

            {/* Author */}
            <div ref={authorRef} className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-8ntic-accent/20 flex items-center justify-center">
                <span className="font-heading text-sm font-semibold text-8ntic-accent">RV</span>
              </div>
              <div>
                <p className="text-sm text-white font-medium">Remco Vroom</p>
                <p className="text-xs text-8ntic-text-secondary">Aspiring Quantum Intelligence Engineer</p>
              </div>
            </div>

            {/* CTA */}
            <a ref={ctaRef} href="#thesis" className="btn-primary w-fit">
              Read the thesis
            </a>
          </div>

          {/* Right image */}
          <div
            ref={imageRef}
            className="hidden lg:block absolute right-[4%] top-1/2 -translate-y-1/2"
            style={{ width: '34%', height: '86%' }}
          >
            <div className="relative w-full h-full rounded-[22px] overflow-hidden">
              <img
                src="/hero_visor_01.jpg"
                alt="Quantum Intelligence"
                className="w-full h-full object-cover"
              />
              {/* Edge glow */}
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
