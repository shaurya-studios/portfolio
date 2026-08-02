import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContact } from '../context/ContactContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { openContact } = useContact();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle cross-page hash routing smoothly
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-4xl ${
        scrolled ? 'glass-panel py-3 px-8 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.5)]' : 'bg-transparent py-4 px-4 border border-transparent'
      }`}
    >
      <div className="flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-lg tracking-tight flex items-center gap-2 group text-white">
          <div className="w-2.5 h-2.5 bg-[var(--color-gold)] group-hover:scale-125 transition-transform duration-300 shadow-[0_0_12px_var(--color-gold-glow)] corner-brackets"></div>
          SHAURYA<span className="gold-text">.DEV</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold font-mono">
          <a href="#work" onClick={(e) => handleNav(e, '#work')} className="text-[var(--color-text-muted)] hover:text-white transition-colors duration-300">Showcase</a>
          <a href="#services" onClick={(e) => handleNav(e, '#services')} className="text-[var(--color-text-muted)] hover:text-white transition-colors duration-300">Capabilities</a>
          <a href="#pricing" onClick={(e) => handleNav(e, '#pricing')} className="text-[var(--color-text-muted)] hover:text-white transition-colors duration-300">Investment</a>
          <Link to="/video-editing" className="text-[var(--color-gold)] hover:text-white transition-colors duration-300 drop-shadow-[0_0_8px_var(--color-gold-glow)]">Video Editing</Link>
          <button 
            onClick={openContact}
            className="px-6 py-2.5 rounded-[4px] gold-fill gold-shine text-black transition-all duration-300 shadow-[0_4px_12px_rgba(232,182,52,0.2)] hover:shadow-[0_8px_20px_rgba(232,182,52,0.4)] cursor-pointer"
          >
            CONNECT
          </button>
        </nav>
      </div>
    </motion.header>
  );
}
