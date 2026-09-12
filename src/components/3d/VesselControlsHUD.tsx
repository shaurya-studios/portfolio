import { useRef, useCallback, useEffect } from 'react';
import { Compass, Anchor, Navigation, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useScenery, useBoatSpeedTelemetry } from '../../context/SceneryContext';

interface VesselControlsHUDProps {
  isCruising?: boolean;
  speed?: number;
  onToggleCruise?: (active: boolean) => void;
  isNight?: boolean;
}

export default function VesselControlsHUD(props: VesselControlsHUDProps = {}) {
  const scenery = useScenery();
  const isCruising = props.isCruising ?? scenery.isCruising;
  const isNight = props.isNight ?? (scenery.timeOfDay === 'night');
  const { dockZone, triggerDock, isDocking } = scenery;

  const knotsRef = useRef<HTMLSpanElement>(null);

  // Subscribe to 60fps speed telemetry without triggering ANY React re-renders!
  const handleSpeedTelemetry = useCallback((spd: number) => {
    if (knotsRef.current) {
      knotsRef.current.textContent = (spd * 5.2).toFixed(1);
    }
  }, []);

  useBoatSpeedTelemetry(handleSpeedTelemetry);

  // Enter key shortcut when in docking range
  useEffect(() => {
    if (!isCruising || !dockZone) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        e.preventDefault();
        triggerDock(dockZone);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCruising, dockZone, triggerDock]);

  // Helper to trigger keyboard events for mobile on-screen buttons
  const triggerKey = (code: string, isDown: boolean) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    window.dispatchEvent(new KeyboardEvent(eventType, { code }));
  };

  const handleDockAction = () => {
    if (isCruising) {
      triggerDock();
    } else {
      scenery.setIsCruising(true);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex flex-col items-center justify-end px-4 sm:bottom-8">
      {/* =========================================================
          0. ISLAND ARRIVAL CARD (When Vessel is in Range)
          ========================================================= */}
      {isCruising && dockZone && (
        <div className="pointer-events-auto mb-4 w-full max-w-md px-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`rounded-2xl border p-4 sm:p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
              dockZone === 'works'
                ? 'border-cyan-500/40 bg-[#0F1115]/90 text-white shadow-[0_0_40px_rgba(6,182,212,0.25)]'
                : dockZone === 'pricing'
                ? 'border-amber-500/40 bg-[#0F1115]/90 text-white shadow-[0_0_40px_rgba(245,158,11,0.25)]'
                : 'border-emerald-500/40 bg-[#0F1115]/90 text-white shadow-[0_0_40px_rgba(16,185,129,0.25)]'
            }`}
          >
            {/* Header: Sector Badge + Live Ping */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full animate-ping ${
                    dockZone === 'works'
                      ? 'bg-cyan-400'
                      : dockZone === 'pricing'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase ${
                    dockZone === 'works'
                      ? 'text-cyan-400'
                      : dockZone === 'pricing'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {dockZone === 'works'
                    ? 'SECTOR 02 // BEACON ATOLL'
                    : dockZone === 'pricing'
                    ? 'SECTOR 03 // EAST ATOLL'
                    : 'SECTOR 01 // MAIN VILLA'}
                </span>
              </div>
              <span className="font-mono text-[10px] text-neutral-400 tracking-wider">
                IN DOCKING RANGE
              </span>
            </div>

            {/* Destination Title & Overview */}
            <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-white mb-1 uppercase">
              {dockZone === 'works'
                ? 'Selected Works & Case Studies'
                : dockZone === 'pricing'
                ? 'Transparent Pricing & Reviews'
                : 'Studio Headquarters & Overview'}
            </h3>
            <p className="text-xs text-neutral-300 mb-3.5 font-sans leading-relaxed">
              {dockZone === 'works'
                ? 'Live production projects: Editify Studios, ThumbPilot SaaS & web applications.'
                : dockZone === 'pricing'
                ? 'Clear scope packages, verified 5-star client reviews, and direct deliverables.'
                : 'Full-stack engineering manifesto, 100/100 speed benchmarks, and project kickoff.'}
            </p>

            {/* High-Visibility Dock Button */}
            <button
              onClick={() => triggerDock(dockZone)}
              className={`w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-lg active:scale-[0.98] ${
                dockZone === 'works'
                  ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : dockZone === 'pricing'
                  ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
              }`}
            >
              <Anchor size={14} className="stroke-[2.5]" />
              <span>DOCK VESSEL & OPEN SECTION</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono">
                ENTER ↵
              </kbd>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          1. BOAT STATUS & DRIVE BAR
          ========================================================= */}
      <div className={`pointer-events-auto flex items-center gap-3 rounded-full border bg-[#F7F5F0]/85 px-5 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 dark:bg-[#0F1115]/85 ${
        isNight ? 'border-cyan-500/20 shadow-[0_0_25px_rgba(6,182,212,0.12)]' : 'border-black/10'
      }`}>
        
        {/* Boat Status Icon */}
        <div className="flex items-center gap-2">
          <Navigation
            size={15}
            className={`transition-transform duration-300 ${
              isCruising ? 'text-cyan-500 animate-pulse' : 'text-neutral-500'
            }`}
          />
          <span className="font-mono text-xs tracking-wider uppercase text-neutral-800 dark:text-neutral-200">
            {isDocking ? 'DOCKING BOAT...' : isCruising ? 'DRIVING' : 'BOAT DOCKED'}
          </span>
        </div>

        <div className="h-3.5 w-[1px] bg-neutral-300 dark:bg-neutral-700" />

        {/* Speed / Control Indicators */}
        {isCruising ? (
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-900 dark:text-neutral-100">
            <div className="flex items-center gap-1">
              <span ref={knotsRef} className="text-cyan-500 font-semibold">0.0</span>
              <span className="text-[10px] text-neutral-500">KTS</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500">
              <span className="mx-1 text-neutral-300 dark:text-neutral-700">•</span>
              <span className="rounded border border-neutral-300 px-1 py-0.5 text-[9px] dark:border-neutral-700">R-CLICK</span>
              <span>LOOK AROUND</span>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">W</span>
            <span className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">A</span>
            <span className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">S</span>
            <span className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">D</span>
            <span className="ml-0.5">TO DRIVE</span>
            <span className="mx-1 text-neutral-300 dark:text-neutral-700">•</span>
            <span className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">RIGHT-CLICK</span>
            <span className="ml-0.5">LOOK AROUND</span>
          </div>
        )}

        <div className="h-3.5 w-[1px] bg-neutral-300 dark:bg-neutral-700" />

        {/* Action Toggle Button */}
        <button
          onClick={handleDockAction}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-medium transition-all ${
            isCruising
              ? 'bg-neutral-900 text-[#F7F5F0] hover:bg-neutral-800 dark:bg-[#F7F5F0] dark:text-[#0F1115] dark:hover:bg-neutral-200'
              : 'bg-black/5 text-neutral-800 hover:bg-black/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10'
          }`}
        >
          {isCruising ? (
            <>
              <Anchor size={13} />
              <span>DOCK BOAT</span>
            </>
          ) : (
            <>
              <Compass size={13} />
              <span>DRIVE BOAT</span>
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
