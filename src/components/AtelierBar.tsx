import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sunset, Volume2, VolumeX, Activity, Compass } from 'lucide-react';
import { useScenery, type TimeOfDay } from '../context/SceneryContext';
import { playTactileClick, getHapticsMuted, setHapticsMuted } from '../utils/audioHaptics';

export const AtelierBar: React.FC = () => {
  const { timeOfDay, setTimeOfDay, isCruising, setIsCruising, viewMode } = useScenery();
  const [isAudioMuted, setIsAudioMuted] = useState(getHapticsMuted());
  const [fps, setFps] = useState(60);
  const [isExpanded, setIsExpanded] = useState(false);

  // When user is in Lite Mobile Mode, 3D controls are omitted
  if (viewMode === 'lite') return null;

  // Lightweight FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.min(Math.round((frameCount * 1000) / (now - lastTime)), 60));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleTimeChange = (mode: TimeOfDay) => {
    playTactileClick();
    setTimeOfDay(mode);
  };

  const handleAudioToggle = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    setHapticsMuted(nextState);
    if (!nextState) {
      playTactileClick();
    }
  };

  const handleCruiseToggle = () => {
    playTactileClick();
    setIsCruising(!isCruising);
  };

  return (
    <aside aria-label="Atelier Environment Controls" className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2 pointer-events-auto">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 220 }}

            className="flex items-center gap-1.5 p-1.5 rounded-full backdrop-blur-xl bg-stone-900/80 border border-white/10 shadow-2xl text-xs font-mono text-stone-300"
          >
            {/* Atmosphere Presets */}
            <div className="flex items-center bg-white/5 rounded-full p-0.5 border border-white/5">
              <button
                onClick={() => handleTimeChange('day')}
                title="Daytime Mode"
                className={`p-1.5 rounded-full transition-all ${
                  timeOfDay === 'day'
                    ? 'bg-amber-400/20 text-amber-300 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Sun size={13} />
              </button>
              <button
                onClick={() => handleTimeChange('sunset')}
                title="Sunset Mode"
                className={`p-1.5 rounded-full transition-all ${
                  timeOfDay === 'sunset'
                    ? 'bg-amber-500/20 text-amber-400 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Sunset size={13} />
              </button>
              <button
                onClick={() => handleTimeChange('night')}
                title="Night Mode"
                className={`p-1.5 rounded-full transition-all ${
                  timeOfDay === 'night'
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Moon size={13} />
              </button>
            </div>

            {/* Sound FX Toggle */}
            <button
              onClick={handleAudioToggle}
              title={isAudioMuted ? 'Enable Sound Effects' : 'Mute Sound Effects'}
              className={`p-1.5 rounded-full transition-colors ${
                !isAudioMuted
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {!isAudioMuted ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>

            {/* Boat Drive Mode Toggle */}
            <button
              onClick={handleCruiseToggle}
              title={isCruising ? 'Exit Boat Mode' : 'Drive Boat'}
              className={`px-2 py-1 rounded-full flex items-center gap-1 transition-colors ${
                isCruising
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-white/5 text-stone-300 hover:text-white'
              }`}
            >
              <Compass size={12} className={isCruising ? 'animate-spin' : ''} />
              <span>{isCruising ? 'DRIVING' : 'DRIVE'}</span>
            </button>

            {/* Live WebGL FPS */}
            <div className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-stone-400 border-l border-white/10">
              <Activity size={10} className="text-emerald-400 animate-pulse" />
              <span>{fps} FPS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Toggle Button */}
      <button
        onClick={() => {
          playTactileClick();
          setIsExpanded(!isExpanded);
        }}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-stone-900/80 hover:bg-stone-900 border border-white/10 hover:border-amber-500/40 shadow-xl text-stone-300 hover:text-white transition-all text-xs font-mono"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span className="tracking-wider uppercase text-[11px] font-semibold">Environment</span>
        <span className="text-stone-400 group-hover:text-amber-400 text-[10px]">
          {isExpanded ? '✕' : '⚙'}
        </span>
      </button>
    </aside>
  );
};
