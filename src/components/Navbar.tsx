import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContact } from '../context/ContactContext';
import { MagneticWrapper, MagneticButton } from './MagneticUI';

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
        <Link to="/" className="font-mono text-sm tracking-[0.2em] uppercase text-white hover:text-[var(--color-text-muted)] transition-colors">
          SHAURYA AGARWAL
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.15em] font-semibold font-mono">
          <MagneticWrapper strength={0.2}>
            <a href="#work" onClick={(e) => handleNav(e, '#work')} className="text-[var(--color-text-muted)] hover:text-white transition-colors duration-300 py-2 px-2">Showcase</a>
          </MagneticWrapper>
          <MagneticWrapper strength={0.2}>
            <a href="#services" onClick={(e) => handleNav(e, '#services')} className="text-[var(--color-text-muted)] hover:text-white transition-colors duration-300 py-2 px-2">Capabilities</a>
          </MagneticWrapper>
          <MagneticWrapper strength={0.2}>
            <a href="#pricing" onClick={(e) => handleNav(e, '#pricing')} className="text-[var(--color-text-muted)] hover:text-white transition-colors duration-300 py-2 px-2">Investment</a>
          </MagneticWrapper>
          <MagneticWrapper strength={0.2}>
            <Link to="/video-editing" className="text-[var(--color-gold)] hover:text-white transition-colors duration-300 drop-shadow-[0_0_8px_var(--color-gold-glow)] py-2 px-2">Video Editing</Link>
          </MagneticWrapper>
          <div className="ml-4">
            <MagneticButton primary onClick={openContact}>CONNECT</MagneticButton>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
