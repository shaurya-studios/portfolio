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
      setScrolled(window.scrollY > 40);
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

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[92%] max-w-4xl ${
        scrolled 
          ? 'glass-panel py-3.5 px-8 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/10' 
          : 'bg-transparent py-4 px-6 border border-transparent'
      }`}
    >
      <div className="flex items-center justify-between">
        <Link to="/" className="font-mono text-sm tracking-[0.2em] uppercase text-white hover:text-yellow-400 transition-colors flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
          SHAURYA STUDIOS
        </Link>
        
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.16em] font-medium font-mono">
          <MagneticWrapper strength={0.2}>
            <a href="#work" onClick={(e) => handleNav(e, '#work')} className="text-zinc-400 hover:text-white transition-colors duration-300 py-1">Works</a>
          </MagneticWrapper>
          <MagneticWrapper strength={0.2}>
            <a href="#services" onClick={(e) => handleNav(e, '#services')} className="text-zinc-400 hover:text-white transition-colors duration-300 py-1">Capabilities</a>
          </MagneticWrapper>
          <MagneticWrapper strength={0.2}>
            <a href="#pricing" onClick={(e) => handleNav(e, '#pricing')} className="text-zinc-400 hover:text-white transition-colors duration-300 py-1">Investment</a>
          </MagneticWrapper>
          <MagneticWrapper strength={0.2}>
            <Link to="/video-editing" className="text-yellow-500 hover:text-yellow-300 transition-colors duration-300 py-1">Video Editing</Link>
          </MagneticWrapper>
          <div className="ml-2">
            <MagneticButton primary onClick={openContact} className="!px-5 !py-2 !text-xs !tracking-widest !rounded-full">
              LET'S TALK
            </MagneticButton>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
