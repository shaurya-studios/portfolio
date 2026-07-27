import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[90%] max-w-4xl ${
        scrolled ? 'bg-[var(--color-bg-elevated)]/70 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] py-3 px-8 rounded-full' : 'bg-transparent py-4 px-4'
      }`}
    >
      <div className="flex items-center justify-between">
        <a href="#home" className="text-white font-bold text-lg tracking-tight flex items-center gap-2 group">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] group-hover:scale-125 transition-transform duration-300 shadow-[0_0_12px_var(--color-accent-glow)]"></div>
          SHAURYA<span className="text-[var(--color-accent)]">.DEV</span>
        </a>
        
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold">
          <Link to="/#work" className="text-gray-400 hover:text-white transition-colors duration-300">Showcase</Link>
          <Link to="/#services" className="text-gray-400 hover:text-white transition-colors duration-300">Services</Link>
          <Link to="/#pricing" className="text-gray-400 hover:text-white transition-colors duration-300">Pricing</Link>
          <Link to="/video-editing" className="text-[var(--color-accent)] hover:text-white transition-colors duration-300">Video Editing</Link>
          <Link to="/#contact" className="px-5 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 backdrop-blur-md">
            CONNECT
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
