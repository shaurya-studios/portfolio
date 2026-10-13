import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useContact } from '../context/ContactContext';
import { useScenery } from '../context/SceneryContext';
import { playTactileClick } from '../utils/audioHaptics';

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
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 px-6 py-3.5 pointer-events-auto rounded-full ${
        scrolled 
          ? 'bg-[#100b08]/90 backdrop-blur-md border border-amber-500/25 shadow-2xl' 
          : 'bg-transparent border border-transparent'
      }`}>
        <Link 
          to="/" 
          onClick={(e) => {
            playTactileClick();
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="text-white font-mono font-bold tracking-[0.22em] text-xs sm:text-sm md:text-base hover:text-amber-400 transition-colors flex items-center gap-2.5"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
          SHAURYA STUDIOS
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              playTactileClick();
              toggleConstructionMode();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-full ${isConstructionMode ? 'border-amber-400 text-amber-300 bg-amber-500/15' : 'border-amber-500/20 text-amber-100/60 hover:text-amber-200 hover:border-amber-500/40'} text-xs font-mono tracking-widest uppercase transition-all cursor-pointer`}
            title="Toggle Wireframe Architecture"
          >
            <span className="hidden sm:inline text-[10px]">WIREFRAME</span>
            <span className="w-1.5 h-1.5 rounded-full border border-current" style={{ backgroundColor: isConstructionMode ? '#f59e0b' : 'transparent' }} />
          </button>

          <button 
            onClick={() => {
              playTactileClick();
              openContact();
            }}
            className="px-4 sm:px-5 py-1.5 rounded-full border border-amber-400/80 bg-amber-500/10 text-amber-200 text-xs font-mono tracking-[0.15em] uppercase hover:bg-amber-400 hover:text-black transition-all cursor-pointer font-semibold shadow-md active:scale-95"
          >
            Connect
          </button>
        </div>
      </div>
    </motion.header>
  );
}
