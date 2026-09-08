import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContact } from '../context/ContactContext';
import { useScenery } from '../context/SceneryContext';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { openContact } = useContact();
  const { timeOfDay, toggleTimeOfDay } = useScenery();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isNight = timeOfDay === 'night';

  return (
    <motion.header 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 w-full z-50 px-6 md:px-12 pointer-events-none"
    >
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 rounded-full px-6 py-3.5 pointer-events-auto ${
        scrolled 
          ? 'luxury-glass shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)]' 
          : 'bg-transparent border border-transparent'
      }`}>
        {/* Brand Name */}
        <Link 
          to="/" 
          className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase font-semibold flex items-center gap-2.5 transition-opacity hover:opacity-75"
        >
          <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${isNight ? 'bg-[#5eead4] shadow-[0_0_8px_#5eead4]' : 'bg-[#0F1115]'}`} />
          SHAURYA STUDIOS
        </Link>
        
        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-mono">
          <a 
            href="#work" 
            onClick={(e) => handleNav(e, '#work')} 
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors py-1"
          >
            Works
          </a>
          <a 
            href="#services" 
            onClick={(e) => handleNav(e, '#services')} 
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors py-1"
          >
            Capabilities
          </a>
          <a 
            href="#pricing" 
            onClick={(e) => handleNav(e, '#pricing')} 
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors py-1"
          >
            Investment
          </a>
          <Link 
            to="/video-editing" 
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors py-1"
          >
            Video
          </Link>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3">
          {/* Day / Midnight Scenery Switch */}
          <button
            onClick={toggleTimeOfDay}
            aria-label="Toggle Island Atmosphere"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-text)] bg-[var(--color-card-bg)] text-xs font-mono tracking-widest uppercase transition-all"
            title={isNight ? "Switch to Golden Hour" : "Switch to Midnight"}
          >
            {isNight ? (
              <>
                <Moon size={13} className="text-[#5eead4]" />
                <span className="hidden sm:inline text-[10px]">MIDNIGHT</span>
              </>
            ) : (
              <>
                <Sun size={13} className="text-[#C6B8A8]" />
                <span className="hidden sm:inline text-[10px]">GOLDEN HR</span>
              </>
            )}
          </button>

          {/* Initiate Button */}
          <button 
            onClick={openContact}
            className="px-5 py-2 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] text-xs font-mono font-semibold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
          >
            Initiate
          </button>
        </div>
      </div>
    </motion.header>
  );
}
