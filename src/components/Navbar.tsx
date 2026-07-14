import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-mono ${
        scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[var(--color-border)] py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#home" className="text-white font-bold text-xl tracking-tighter">
          SHAURYA<span className="text-[var(--color-accent)]">.DEV</span>
        </a>
        
        <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest">
          <a href="#work" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">Works</a>
          <a href="#services" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">Services</a>
          <a href="#pricing" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">Pricing</a>
          <a href="#contact" className="px-4 py-2 border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
