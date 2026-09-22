import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useContact } from '../context/ContactContext';
import { useScenery } from '../context/SceneryContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { openContact } = useContact();
  const { isConstructionMode, toggleConstructionMode } = useScenery();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 w-full z-50 px-6 md:px-12 pointer-events-none"
    >
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 px-6 py-3.5 pointer-events-auto ${
        scrolled 
          ? 'bg-[#050505]/90 backdrop-blur-md border border-white/10 shadow-2xl' 
          : 'bg-transparent border border-transparent'
      }`}>
        <Link 
          to="/" 
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="text-white font-mono font-bold tracking-[0.2em] text-sm md:text-base hover:opacity-70 transition-opacity"
        >
          SHAURYA
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleConstructionMode}
            className={`flex items-center gap-2 px-3 py-1.5 border ${isConstructionMode ? 'border-[#5eead4] text-[#5eead4]' : 'border-white/20 text-white/60 hover:text-white'} text-xs font-mono tracking-widest uppercase transition-all`}
            title="Toggle Construction Mode"
          >
            <span className="hidden sm:inline text-[10px]">CONSTRUCT_MODE</span>
            <span className="w-2 h-2 rounded-full border border-current" style={{ backgroundColor: isConstructionMode ? '#5eead4' : 'transparent' }} />
          </button>

          <button 
            onClick={openContact}
            className="px-4 py-1.5 border border-white text-white text-xs font-mono tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all"
          >
            Connect
          </button>
        </div>
      </div>
    </motion.header>
  );
}
