import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';
import { useScenery } from '../context/SceneryContext';
import { playTactileClick } from '../utils/audioHaptics';

export const ViewModeSwitch: React.FC = () => {
  const { viewMode, toggleViewMode, timeOfDay } = useScenery();
  const isNight = timeOfDay === 'night';
  const is3D = viewMode === '3d';

  const handleClick = () => {
    playTactileClick();
    toggleViewMode();
  };

  return (
    <div className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 pointer-events-auto">
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={is3D ? "Switch to Lite Mobile View" : "Switch to Full 3D PC View"}
        title={
          is3D
            ? "Switch to Lite Mode (faster performance, lower battery usage)"
            : "Switch to 3D Mode (interactive 3D world)"
        }
        className={`group flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full backdrop-blur-xl border shadow-2xl transition-all duration-300 font-mono text-[11px] ${
          is3D
            ? isNight
              ? 'bg-[#0F1115]/85 border-cyan-500/30 text-stone-200 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
              : 'bg-[#F7F5F0]/85 border-black/15 text-stone-800'
            : isNight
            ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
            : 'bg-amber-100/90 border-amber-500 text-amber-900 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
        }`}
      >
        {/* Visual Icon */}
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
            is3D
              ? 'bg-cyan-500/15 text-cyan-400'
              : 'bg-amber-500/20 text-amber-500'
          }`}
        >
          {is3D ? <Monitor size={14} /> : <Smartphone size={14} />}
        </div>

        {/* Text Mode Label */}
        <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
          <span className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1">
            {is3D ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                3D VIEW
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                LITE VIEW
              </>
            )}
          </span>
          <span className="font-semibold tracking-tight text-[11px]">
            {is3D ? 'SWITCH TO LITE' : 'SWITCH TO 3D'}
          </span>
        </div>

        {/* Action sparkle */}
        <Sparkles
          size={12}
          className={`opacity-0 group-hover:opacity-100 transition-opacity ${
            is3D ? 'text-cyan-400' : 'text-amber-500'
          }`}
        />
      </motion.button>
    </div>
  );
};

export default ViewModeSwitch;
