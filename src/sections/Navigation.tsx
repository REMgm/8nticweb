import { useEffect, useState } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Thesis', href: '#thesis' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Security', href: '#security' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[#05060B]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center gap-2">
            <span className="font-heading text-xl lg:text-2xl font-semibold text-white tracking-tight">8NTIC</span>
          </a>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <a key={item.label} href={item.href}
                className="text-sm text-8ntic-text-secondary hover:text-white transition-colors duration-300">{item.label}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="#contact" className="btn-primary text-sm">Get in Touch</a>
          </div>
          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#05060B]/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-6 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <a key={item.label} href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-8ntic-text-secondary hover:text-white transition-colors py-2">{item.label}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center mt-2">Get in Touch</a>
          </div>
        </div>
      )}
    </nav>
  );
}
