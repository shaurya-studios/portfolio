import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const { progress } = useProgress();

  // We consider it loaded when progress hits 100
  const isLoaded = progress === 100;

  if (isLoaded) {
    // Notify parent to fade in the main app
    // Using a short timeout to ensure the state updates cleanly
    setTimeout(onComplete, 100);
  }

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="font-display text-xs tracking-[0.3em] text-[var(--color-text-muted)]">
              INITIALIZING
            </div>
            
            <div className="font-mono text-5xl md:text-7xl font-bold tabular-nums text-white">
              {Math.floor(progress)}%
            </div>
            
            <div className="w-48 h-[1px] bg-[var(--color-border)] relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full gold-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
