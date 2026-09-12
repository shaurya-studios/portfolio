import React, { createContext, useContext, useState, useEffect } from 'react';
import { playDockChime } from '../utils/audioHaptics';

export type TimeOfDay = 'day' | 'sunset' | 'night';
export type ViewMode = '3d' | 'lite';
export type DockZone = 'works' | 'pricing' | 'hero' | null;

interface SceneryContextType {
  timeOfDay: TimeOfDay;
  setTimeOfDay: (val: TimeOfDay) => void;
  toggleTimeOfDay: () => void;
  activeBiome: string;
  setActiveBiome: (biome: string) => void;
  flyInComplete: boolean;
  setFlyInComplete: (val: boolean) => void;
  isCruising: boolean;
  setIsCruising: (val: boolean) => void;
  boatSpeed: number;
  setBoatSpeed: (val: number) => void;
  focusedTarget: string | null;
  setFocusedTarget: (val: string | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  dockZone: DockZone;
  setDockZone: (zone: DockZone) => void;
  isDocking: boolean;
  setIsDocking: (val: boolean) => void;
  triggerDock: (zone?: 'works' | 'pricing' | 'hero') => void;
  firstFrameRendered: boolean;
  setFirstFrameRendered: (val: boolean) => void;
}

const SceneryContext = createContext<SceneryContextType | undefined>(undefined);

// High-frequency boat telemetry listener to prevent full-tree React re-renders
type SpeedListener = (speed: number) => void;
const speedListeners = new Set<SpeedListener>();

export function emitBoatSpeed(speed: number) {
  speedListeners.forEach((listener) => listener(speed));
}

export function useBoatSpeedTelemetry(listener: SpeedListener) {
  useEffect(() => {
    speedListeners.add(listener);
    return () => {
      speedListeners.delete(listener);
    };
  }, [listener]);
}

export function SceneryProvider({ children }: { children: React.ReactNode }) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [activeBiome, setActiveBiome] = useState<string>('hero');
  const [flyInComplete, setFlyInComplete] = useState<boolean>(false);
  const [isCruising, setIsCruising] = useState<boolean>(false);
  const boatSpeed = 0;
  const [focusedTarget, setFocusedTarget] = useState<string | null>(null);

  const setBoatSpeed = (val: number) => {
    emitBoatSpeed(val);
  };

  // View Mode: '3d' (Full open world PC) or 'lite' (clean lightweight mobile)
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shaurya_portfolio_viewmode');
      if (saved === 'lite' || saved === '3d') return saved;

      // P0: DEVICE CAPABILITY CHECK
      // Fallback to Lite mode for phones, touch devices with low core count, or explicitly low memory
      const isMobile = window.innerWidth < 768;
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const cores = navigator.hardwareConcurrency || 4;
      // @ts-ignore
      const memory = navigator.deviceMemory || 8; 

      if (isMobile || (isCoarse && cores <= 4) || memory < 4) {
        return 'lite';
      }
    }
    return '3d';
  });

  // Docking Zone & Transition State
  const [dockZone, setDockZone] = useState<DockZone>(null);
  const [isDocking, setIsDocking] = useState<boolean>(false);
  
  // Real Preloader Tracking
  const [firstFrameRendered, setFirstFrameRendered] = useState(false);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shaurya_portfolio_viewmode', mode);
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === '3d' ? 'lite' : '3d');
  };

  const triggerDock = (zone?: 'works' | 'pricing' | 'hero') => {
    const target = zone || dockZone || 'hero';
    setIsDocking(true);
    setIsCruising(false);
    playDockChime();

    // Smooth navigation to the docked sector
    setTimeout(() => {
      if (target === 'works') {
        const el = document.getElementById('work');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (target === 'pricing') {
        const el = document.getElementById('pricing');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 180);

    // Conclude cinematic docking sequence
    setTimeout(() => {
      setIsDocking(false);
    }, 1300);
  };

  const toggleTimeOfDay = () => {
    setTimeOfDay((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  useEffect(() => {
    if (timeOfDay === 'night' || timeOfDay === 'sunset') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [timeOfDay]);

  return (
    <SceneryContext.Provider
      value={{
        timeOfDay,
        setTimeOfDay,
        toggleTimeOfDay,
        activeBiome,
        setActiveBiome,
        flyInComplete,
        setFlyInComplete,
        isCruising,
        setIsCruising,
        boatSpeed,
        setBoatSpeed,
        focusedTarget,
        setFocusedTarget,
        viewMode,
        setViewMode,
        toggleViewMode,
        dockZone,
        setDockZone,
        isDocking,
        setIsDocking,
        triggerDock,
        firstFrameRendered,
        setFirstFrameRendered,
      }}
    >
      {children}
    </SceneryContext.Provider>
  );
}

export function useScenery() {
  const context = useContext(SceneryContext);
  if (!context) {
    throw new Error('useScenery must be used within a SceneryProvider');
  }
  return context;
}


