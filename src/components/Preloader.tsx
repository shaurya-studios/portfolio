import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Non-linear easing for the counter to make it feel cinematic
      const increment = Math.random() * 5 + (100 - currentProgress) * 0.1; 
      currentProgress += increment;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(Math.floor(currentProgress));
        clearInterval(interval);
        setTimeout(onComplete, 500); // Wait a beat at 100% before sliding out
      } else {
        setProgress(Math.floor(currentProgress));
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        initial={{ y: 0 }}
        exit={{ 
          y: '-100%', 
          transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
        }}
        className="fixed inset-0 z-[100] bg-[#050505] flex flex-col justify-end p-8 md:p-12 overflow-hidden"
      >
        <div className="flex justify-between items-end w-full">
          <div className="overflow-hidden">
            <motion.span 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block font-mono text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-4"
            >
              Loading Experience
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-[clamp(6rem,20vw,20rem)] font-black leading-[0.8] tracking-tighter"
            >
              {progress}%
            </motion.h1>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
