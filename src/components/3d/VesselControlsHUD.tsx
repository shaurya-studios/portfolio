import { Compass, Anchor, Navigation, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useScenery } from '../../context/SceneryContext';

interface VesselControlsHUDProps {
  isCruising?: boolean;
  speed?: number;
  onToggleCruise?: (active: boolean) => void;
  isNight?: boolean;
}

export default function VesselControlsHUD(props: VesselControlsHUDProps = {}) {
  const scenery = useScenery();
  const isCruising = props.isCruising ?? scenery.isCruising;
  const speed = props.speed ?? scenery.boatSpeed;
  const onToggleCruise = props.onToggleCruise ?? scenery.setIsCruising;
  const isNight = props.isNight ?? (scenery.timeOfDay === 'night');

  // Convert Three.js units/s to realistic maritime Knots
  const knots = (speed * 5.2).toFixed(1);

  // Helper to trigger keyboard events for mobile on-screen buttons
  const triggerKey = (code: string, isDown: boolean) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    window.dispatchEvent(new KeyboardEvent(eventType, { code }));
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex flex-col items-center justify-end px-4 sm:bottom-8">
      {/* =========================================================
          1. TELEMETRY & CRUISE BAR
          ========================================================= */}
      <div className={`pointer-events-auto flex items-center gap-3 rounded-full border bg-[#F7F5F0]/85 px-5 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 dark:bg-[#0F1115]/85 ${
        isNight ? 'border-cyan-500/20 shadow-[0_0_25px_rgba(6,182,212,0.12)]' : 'border-black/10'
      }`}>
        
        {/* Vessel Status Icon */}
        <div className="flex items-center gap-2">
          <Navigation
            size={15}
            className={`transition-transform duration-300 ${
              isCruising ? 'text-cyan-500 animate-pulse' : 'text-neutral-500'
            }`}
          />
          <span className="font-mono text-xs tracking-wider uppercase text-neutral-800 dark:text-neutral-200">
            {isCruising ? 'PILOT ACTIVE' : 'TENDER MOORED'}
          </span>
        </div>

        <div className="h-3.5 w-[1px] bg-neutral-300 dark:bg-neutral-700" />

        {/* Speed / Control Indicators */}
        {isCruising ? (
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-900 dark:text-neutral-100">
            <div className="flex items-center gap-1">
              <span className="text-cyan-500 font-semibold">{knots}</span>
              <span className="text-[10px] text-neutral-500">KTS</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500">
              <span className="mx-1 text-neutral-300 dark:text-neutral-700">•</span>
              <span className="rounded border border-neutral-300 px-1 py-0.5 text-[9px] dark:border-neutral-700">R-CLICK</span>
              <span>ORBIT</span>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">W</span>
            <span className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">A</span>
            <span className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">S</span>
            <span className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">D</span>
            <span className="ml-0.5">TO PILOT</span>
            <span className="mx-1 text-neutral-300 dark:text-neutral-700">•</span>
            <span className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">R-CLICK HOLD</span>
            <span className="ml-0.5">3D VIEWPORT</span>
          </div>
        )}

        <div className="h-3.5 w-[1px] bg-neutral-300 dark:bg-neutral-700" />

        {/* Action Toggle Button */}
        <button
          onClick={() => onToggleCruise(!isCruising)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-medium transition-all ${
            isCruising
              ? 'bg-neutral-900 text-[#F7F5F0] hover:bg-neutral-800 dark:bg-[#F7F5F0] dark:text-[#0F1115] dark:hover:bg-neutral-200'
              : 'bg-black/5 text-neutral-800 hover:bg-black/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10'
          }`}
        >
          {isCruising ? (
            <>
              <Anchor size={13} />
              <span>DOCK VESSEL</span>
            </>
          ) : (
            <>
              <Compass size={13} />
              <span>CRUISE OCEAN</span>
            </>
          )}
        </button>
      </div>

      {/* =========================================================
          2. MOBILE ON-SCREEN TOUCH CONTROLS (Only when Cruising)
          ========================================================= */}
      {isCruising && (
        <div className="pointer-events-auto mt-4 flex items-center justify-center gap-2 sm:hidden">
          {/* Steer Left */}
          <button
            onPointerDown={() => triggerKey('KeyA', true)}
            onPointerUp={() => triggerKey('KeyA', false)}
            onPointerLeave={() => triggerKey('KeyA', false)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 active:bg-neutral-200 dark:border-white/15 dark:bg-black/80 dark:active:bg-neutral-800"
          >
            <ArrowLeft size={18} className="text-neutral-800 dark:text-neutral-200" />
          </button>

          {/* Forward / Reverse Column */}
          <div className="flex flex-col gap-2">
            <button
              onPointerDown={() => triggerKey('KeyW', true)}
              onPointerUp={() => triggerKey('KeyW', false)}
              onPointerLeave={() => triggerKey('KeyW', false)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 active:bg-neutral-200 dark:border-white/15 dark:bg-black/80 dark:active:bg-neutral-800"
            >
              <ArrowUp size={18} className="text-neutral-800 dark:text-neutral-200" />
            </button>
            <button
              onPointerDown={() => triggerKey('KeyS', true)}
              onPointerUp={() => triggerKey('KeyS', false)}
              onPointerLeave={() => triggerKey('KeyS', false)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 active:bg-neutral-200 dark:border-white/15 dark:bg-black/80 dark:active:bg-neutral-800"
            >
              <ArrowDown size={18} className="text-neutral-800 dark:text-neutral-200" />
            </button>
          </div>

          {/* Steer Right */}
          <button
            onPointerDown={() => triggerKey('KeyD', true)}
            onPointerUp={() => triggerKey('KeyD', false)}
            onPointerLeave={() => triggerKey('KeyD', false)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 active:bg-neutral-200 dark:border-white/15 dark:bg-black/80 dark:active:bg-neutral-800"
          >
            <ArrowRight size={18} className="text-neutral-800 dark:text-neutral-200" />
          </button>
        </div>
      )}
    </div>
  );
}
