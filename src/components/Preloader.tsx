import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@react-three/drei';
import { useScenery } from '../context/SceneryContext';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [percent, setPercent] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const { firstFrameRendered, viewMode } = useScenery();
  const { progress } = useProgress();
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    let isMounted = true;
    let fallbackTimer: any;

    async function trackLoading() {
      // 1. Wait for fonts
      let fontsLoaded = false;
      try {
        await document.fonts.ready;
        fontsLoaded = true;
      } catch (e) {
        fontsLoaded = true; // Fallback
      }

      // We poll to see if criteria are met
      const checkInterval = setInterval(() => {
        if (!isMounted) return;
        
        const is3D = viewMode === '3d';
        const frameRendered = is3D ? firstFrameRendered : true;
        const elapsed = performance.now() - startTime.current;

        // Calculate a target percentage based on real completion
        let targetPercent = 15;
        if (fontsLoaded) targetPercent += 20;
        if (is3D) {
          targetPercent += (progress * 0.4); // up to 40%
          if (frameRendered) targetPercent += 25; // final 25%
        } else {
          targetPercent = 100; // Lite mode immediately ready after fonts
        }

        // Smooth increment towards target
        setPercent(prev => {
          // Never allow target to decrease if resources unload/reload
          const safeTarget = Math.max(targetPercent, prev);
          const diff = safeTarget - prev;
          
          let next = prev;
          if (diff > 0.5) {
             next = prev + (diff * 0.15) + (Math.random() * 1.5);
          } else if (safeTarget === 100) {
             next = 100;
          }
          
          // Never go backwards
          next = Math.max(next, prev);
          
          if (safeTarget >= 100 && next >= 98) {
            next = 100;
          }
          
          return Math.min(next, 100);
        });

        // Done condition
        if (targetPercent >= 100 && percent > 98) {
          // Minimum perceptual floor: 600ms
          if (elapsed > 600) {
            finishLoading();
          }
        }
      }, 50);

      // Timeout fallback (max 3 seconds)
      fallbackTimer = setTimeout(() => {
        if (isMounted && !isDone) {
          finishLoading();
        }
      }, 3000);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(fallbackTimer);
      };
    }

    trackLoading();

    function finishLoading() {
      setPercent(100);
      setTimeout(() => {
        if (!isMounted) return;
        setIsDone(true);
        document.body.style.overflow = 'unset';
        onComplete();
      }, 300);
    }

    return () => {
      isMounted = false;
      document.body.style.overflow = 'unset';
    };
  }, [firstFrameRendered, progress, viewMode, onComplete, percent, isDone]);

  const getTelemetryStage = (p: number) => {
    if (viewMode === 'lite') {
      return p < 50 ? 'Loading core assets...' : 'System initialized.';
    }
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
                {Math.floor(Math.min(percent, 100))}%
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
