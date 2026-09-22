import React, { createContext, useContext, useState } from 'react';
import { playResonance } from '../utils/audioHaptics';

export type ViewMode = '3d' | 'lite';

interface SceneryContextType {
  isConstructionMode: boolean;
  setIsConstructionMode: (val: boolean) => void;
  toggleConstructionMode: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  firstFrameRendered: boolean;
  setFirstFrameRendered: (val: boolean) => void;
}

const SceneryContext = createContext<SceneryContextType | undefined>(undefined);

export function SceneryProvider({ children }: { children: React.ReactNode }) {
  const [isConstructionMode, setIsConstructionMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [firstFrameRendered, setFirstFrameRendered] = useState(false);

  const toggleConstructionMode = () => {
    playResonance();
    setIsConstructionMode(prev => !prev);
  };

  const toggleViewMode = () => {
    playResonance();
    setViewMode(prev => prev === '3d' ? 'lite' : '3d');
  };

  return (
    <SceneryContext.Provider
      value={{
        isConstructionMode,
        setIsConstructionMode,
        toggleConstructionMode,
        viewMode,
        setViewMode,
        toggleViewMode,
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


