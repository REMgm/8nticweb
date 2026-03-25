import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Linkedin, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const content = contentRef.current;
    const stats = statsRef.current;

    if (!section || !heading || !content || !stats) return;

    const paragraphs = content.querySelectorAll('p');
    const statItems = stats.querySelectorAll('.stat-item');

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

      // Paragraphs animation
      gsap.fromTo(
        paragraphs,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Stats animation
      gsap.fromTo(
        statItems,
        { y: 30, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stats,
            start: 'top 85%',
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
      id="about"
      className="relative w-full min-h-screen py-20 lg:py-32 bg-[#0B0E1A]"
      style={{ zIndex: 75 }}
    >
      {/* Background radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(79, 109, 255, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-8ntic-accent mb-4 block">
            About the Researcher
          </span>
          <h2
            ref={headingRef}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-tight"
          >
            Remco Vroom
          </h2>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left column - Bio */}
          <div ref={contentRef} className="lg:col-span-2 space-y-6">
            <p className="text-base lg:text-lg text-white/90 leading-relaxed">
              Remco Vroom is a senior technology executive and transformation architect with
              <strong className="text-8ntic-accent"> more than thirty years of experience</strong> designing and deploying
              large-scale digital ecosystems across global enterprises.
            </p>
            <p className="text-base lg:text-lg text-8ntic-text-secondary leading-relaxed">
              His career has spanned the full arc of the internet era from early digital marketing
              infrastructure through API-first platform engineering, real-time data orchestration,
              and most recently, autonomous AI agent systems operating at enterprise scale.
            </p>
            <p className="text-base lg:text-lg text-8ntic-text-secondary leading-relaxed">
              Throughout this trajectory, Vroom has led cross-disciplinary teams through complex
              system integrations involving composable architectures, customer data platforms, and
              multi-cloud environments. His work has consistently focused on a single throughline:
              <strong className="text-white"> how intelligent systems compound capability over time rather than merely aggregate it.</strong>
            </p>
            <p className="text-base lg:text-lg text-8ntic-text-secondary leading-relaxed">
              <em>Quantum Intelligence</em> emerged not from theoretical speculation but from sustained
              operational exposure to the limitations of current multi-agent AI frameworks. Having designed,
              deployed, and governed autonomous agent ecosystems in high-complexity enterprise environments,
              Vroom observed a recurring structural failure: orchestration frameworks solve for coordination
              mechanics while leaving the deeper challenge of intelligence governance entirely unaddressed.
            </p>
            <p className="text-base lg:text-lg text-8ntic-text-secondary leading-relaxed">
              He describes himself as an <strong className="text-white">Aspiring Quantum Intelligence Engineer</strong>, a
              deliberate provocation that names a discipline before it exists, on the conviction that
              <em> architecture precedes emergence</em>.
            </p>

            {/* Contact info */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-8ntic-text-secondary">
                <MapPin className="w-4 h-4 text-8ntic-accent" />
                Amsterdam, Netherlands
              </div>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-8ntic-text-secondary hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4 text-8ntic-accent" />
                LinkedIn
              </a>
              <a
                href="mailto:rem@8ntic.com"
                className="flex items-center gap-2 text-sm text-8ntic-text-secondary hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-8ntic-accent" />
                rem@8ntic.com
              </a>
            </div>
          </div>

          {/* Right column - Stats */}
          <div ref={statsRef} className="space-y-4">
            <div className="stat-item glass-panel p-6 text-center">
              <div className="font-heading text-4xl lg:text-5xl font-semibold text-8ntic-accent mb-2">
                30+
              </div>
              <div className="text-sm text-8ntic-text-secondary">
                Years in Technology
              </div>
            </div>
            <div className="stat-item glass-panel p-6 text-center">
              <div className="font-heading text-4xl lg:text-5xl font-semibold text-8ntic-accent mb-2">
                3
              </div>
              <div className="text-sm text-8ntic-text-secondary">
                Scientific Disciplines
              </div>
            </div>
            <div className="stat-item glass-panel p-6 text-center">
              <div className="font-heading text-4xl lg:text-5xl font-semibold text-8ntic-accent mb-2">
                7
              </div>
              <div className="text-sm text-8ntic-text-secondary">
                QIP Principles
              </div>
            </div>
            <div className="stat-item glass-panel p-6 text-center">
              <div className="font-heading text-4xl lg:text-5xl font-semibold text-8ntic-accent mb-2">
                1
              </div>
              <div className="text-sm text-8ntic-text-secondary">
                Research Mission
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
