import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trackFormSubmit } from '../lib/analytics';

gsap.registerPlugin(ScrollTrigger);

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
}

const nodes: Node[] = [
  { id: 1, x: 8, y: 15, size: 14 },
  { id: 2, x: 92, y: 20, size: 18 },
  { id: 3, x: 5, y: 50, size: 12 },
  { id: 4, x: 95, y: 60, size: 16 },
  { id: 5, x: 12, y: 80, size: 14 },
  { id: 6, x: 88, y: 85, size: 12 },
  { id: 7, x: 50, y: 8, size: 16 },
  { id: 8, x: 50, y: 92, size: 18 },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const form = formRef.current;

    if (!section || !panel || !headline || !subheadline || !form) return;

    const formFields = form.querySelectorAll('.form-field');

    const ctx = gsap.context(() => {
      // Panel animation
      gsap.fromTo(
        panel,
        { y: 60, opacity: 0, scale: 1 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Headline animation
      gsap.fromTo(
        headline,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headline,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Subheadline animation
      gsap.fromTo(
        subheadline,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: subheadline,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Form fields animation
      gsap.fromTo(
        formFields,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          delay: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: form,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Nodes animation
      nodesRef.current.forEach((node, i) => {
        if (node) {
          gsap.fromTo(
            node,
            { scale: 0.6, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              delay: 0.1 + i * 0.05,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      if (!supabase) throw new Error('Backend not available');
      const { error } = await supabase.from('contacts').insert({
        name: formData.name,
        email: formData.email,
        message: formData.message || null,
      });

      if (error) throw error;

      // Fire-and-forget email notification
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      }).catch(() => {}); // Non-blocking - don't affect UX if notification fails

      trackFormSubmit('contact', { has_message: !!formData.message });
      setSubmitted(true);
    } catch (err: unknown) {
      console.error('Contact form error:', err);
      setSubmitError('Something went wrong. Please try again or email directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full min-h-screen py-20 lg:py-32 bg-[#05060B]"
      style={{ zIndex: 60 }}
    >
      {/* Background radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(79, 109, 255, 0.1) 0%, transparent 60%)',
        }}
      />

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
            animationDelay: `${index * 0.4}s`,
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

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        {/* Glass Panel */}
        <div ref={panelRef} className="glass-panel p-8 lg:p-12">
          {/* Headline */}
          <h2
            ref={headlineRef}
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight tracking-tight text-center mb-4"
          >
            Let's Discuss Quantum Intelligence
          </h2>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="text-base lg:text-lg text-8ntic-text-secondary text-center mb-10"
          >
            Interested in the research? Have questions about the thesis?
            I'd love to hear from you.
          </p>

          {/* Form */}
          {!submitted ? (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="form-field">
                  <label
                    htmlFor="name"
                    className="block text-sm text-8ntic-text-secondary mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-8ntic-accent/50 focus:ring-1 focus:ring-8ntic-accent/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div className="form-field">
                  <label
                    htmlFor="email"
                    className="block text-sm text-8ntic-text-secondary mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-8ntic-accent/50 focus:ring-1 focus:ring-8ntic-accent/50 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="form-field">
                <label
                  htmlFor="message"
                  className="block text-sm text-8ntic-text-secondary mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-8ntic-accent/50 focus:ring-1 focus:ring-8ntic-accent/50 transition-colors resize-none"
                  placeholder="Tell me what you're thinking..."
                />
              </div>

              {submitError && (
                <div className="text-sm text-red-400 bg-red-400/10 px-4 py-2 rounded-lg">
                  {submitError}
                </div>
              )}

              <div className="form-field pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitting ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-8ntic-accent/20 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-8ntic-accent" />
              </div>
              <h3 className="font-heading text-xl font-medium text-white mb-2">
                Message sent!
              </h3>
              <p className="text-8ntic-text-secondary">
                Thanks for reaching out. I'll get back to you soon.
              </p>
            </div>
          )}

          {/* Alternative contact */}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="font-heading text-lg font-semibold text-white mb-2">
            8NTIC
          </p>
          <p className="font-mono text-xs text-8ntic-text-secondary/60 mb-4">
            Quantum Intelligence Research
          </p>
          <p className="text-xs text-8ntic-text-secondary/40">
            2026 Remco Vroom - Amsterdam, Netherlands
          </p>
        </footer>
      </div>
    </section>
  );
}


