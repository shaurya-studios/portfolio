import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [percent, setPercent] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock scroll during preloader
    document.body.style.overflow = 'hidden';

    // High-performance smooth counter
    const timer = setInterval(() => {
      setPercent((prev) => {
        // Fast, smooth increments that reach 100% in ~1.2s
        const step = Math.floor(Math.random() * 12) + 8;
        const next = prev + step;

        if (next >= 100) {
          clearInterval(timer);
          
          setTimeout(() => {
            setIsDone(true);
            document.body.style.overflow = 'unset';
            onComplete();
          }, 300);

          return 100;
        }
        return next;
      });
    }, 55);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = 'unset';
    };
  }, [onComplete]);

  const getTelemetryStage = (p: number) => {
    if (p < 25) return 'Generating spatial island geometry...';
    if (p < 55) return 'Calibrating liquid depth & shoreline foam...';
    if (p < 85) return 'Compiling WebGL light shaders...';
    if (p < 100) return 'Synchronizing drone telemetry...';
    return 'System initialized.';
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0.95 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]"
        >
          <div className="flex flex-col items-center gap-8 px-6 text-center">
            
            {/* Architectural Title */}
            <div className="relative overflow-hidden select-none">
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.25em] uppercase text-[var(--color-text)]/15">
                SHAURYA
              </h1>
              <div 
                className="absolute top-0 left-0 font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.25em] uppercase text-[var(--color-text)] overflow-hidden whitespace-nowrap transition-[width] duration-75 ease-linear"
                style={{ width: `${percent}%` }}
              >
                SHAURYA
              </div>
            </div>

            {/* Percentage Readout */}
            <div className="flex flex-col items-center gap-2.5 font-mono">
              <div className="text-4xl sm:text-6xl font-bold tracking-tight text-[var(--color-text)] tabular-nums">
                {Math.min(percent, 100)}%
              </div>
              
              <div className="text-[11px] uppercase tracking-widest text-[var(--color-text-muted)] h-4">
                {getTelemetryStage(percent)}
              </div>
            </div>

            {/* Hairline Progress Track */}
            <div className="w-56 sm:w-72 h-[1.5px] bg-[var(--color-border)] relative overflow-hidden rounded-full mt-2">
              <div 
                className="absolute top-0 left-0 h-full bg-[var(--color-text)] transition-[width] duration-75 ease-linear"
                style={{ width: `${percent}%` }}
              />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
