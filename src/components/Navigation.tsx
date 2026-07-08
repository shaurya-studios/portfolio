import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none mix-blend-difference">
        <Link 
          to="/" 
          className="text-2xl font-black tracking-tighter text-white pointer-events-auto"
        >
          SA.
        </Link>

        <div className="pointer-events-auto relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="glass-pill px-6 py-2 text-sm font-semibold tracking-widest uppercase hover:bg-white/10 transition-colors"
          >
            {menuOpen ? 'CLOSE' : 'HIRE ME'}
          </button>
          
          <AnimatePresence>
            {menuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                className="absolute top-14 right-0 flex flex-col gap-2 min-w-[200px]"
              >
                <a 
                  href="mailto:shaurya.studios.dev@gmail.com"
                  className="glass-pill px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors text-right"
                >
                  Email
                </a>
                <a 
                  href="https://www.fiverr.com/yourprofile" 
                  target="_blank" rel="noreferrer"
                  className="glass-pill px-6 py-3 text-sm font-medium hover:bg-[#1dbf73]/20 transition-colors text-right text-[#1dbf73]"
                >
                  Fiverr
                </a>
                <a 
                  href="https://discordapp.com/users/YOUR_DISCORD_ID" 
                  target="_blank" rel="noreferrer"
                  className="glass-pill px-6 py-3 text-sm font-medium hover:bg-[#5865F2]/20 transition-colors text-right text-[#5865F2]"
                >
                  Discord
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
