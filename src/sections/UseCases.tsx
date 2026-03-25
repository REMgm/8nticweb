import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Settings, BookOpen, Headphones, ClipboardCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const useCases = [
  {
    icon: Settings,
    title: 'Operations',
    description: 'Autonomous monitoring, alerting, and remediation.',
  },
  {
    icon: BookOpen,
    title: 'Research',
    description: 'Multi-agent literature synthesis with source tracing.',
  },
  {
    icon: Headphones,
    title: 'Support',
    description: 'Context-aware responses that escalate gracefully.',
  },
  {
    icon: ClipboardCheck,
    title: 'Compliance',
    description: 'Policy checks that improve with every review.',
  },
];

export default function UseCases() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const image = imageRef.current;
    const cta = ctaRef.current;

    if (!section || !heading) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        heading,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0, scale: 0.98 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              delay: i * 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });

      // Image animation
      if (image) {
        gsap.fromTo(
          image,
          { x: 60, opacity: 0, scale: 1.03 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: image,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // CTA animation
      if (cta) {
        gsap.fromTo(
          cta,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cta,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen py-20 lg:py-32 bg-[#05060B]"
      style={{ zIndex: 70 }}
    >
      {/* Background radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(79, 109, 255, 0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-tight mb-12 lg:mb-16"
        >
          Use Cases
        </h2>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Cards */}
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={useCase.title}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="glass-panel p-6 hover:bg-white/[0.08] transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-8ntic-accent/10 flex items-center justify-center mb-4">
                  <useCase.icon className="w-6 h-6 text-8ntic-accent" />
                </div>
                <h3 className="font-heading text-lg font-medium text-white mb-2">
                  {useCase.title}
                </h3>
                <p className="text-sm text-8ntic-text-secondary leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>

          {/* Image */}
          <div
            ref={imageRef}
            className="relative h-[400px] lg:h-auto rounded-[28px] overflow-hidden"
          >
            <img
              src="/usecase_image_01.jpg"
              alt="Use Cases"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 40px rgba(79, 109, 255, 0.15)',
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 lg:mt-16 text-center">
          <a ref={ctaRef} href="#contact" className="btn-primary inline-flex">
            Request a demo
          </a>
        </div>
      </div>
    </section>
  );
}
