import React, { createContext, useContext, useState, useEffect } from 'react';

type TimeOfDay = 'day' | 'night';

interface SceneryContextType {
  timeOfDay: TimeOfDay;
  toggleTimeOfDay: () => void;
  activeBiome: string;
  setActiveBiome: (biome: string) => void;
  flyInComplete: boolean;
  setFlyInComplete: (val: boolean) => void;
}

const SceneryContext = createContext<SceneryContextType | undefined>(undefined);

export function SceneryProvider({ children }: { children: React.ReactNode }) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [activeBiome, setActiveBiome] = useState<string>('hero');
  const [flyInComplete, setFlyInComplete] = useState<boolean>(false);

  const toggleTimeOfDay = () => {
    setTimeOfDay(prev => (prev === 'day' ? 'night' : 'day'));
  };

  useEffect(() => {
    if (timeOfDay === 'night') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [timeOfDay]);

  return (
    <SceneryContext.Provider 
      value={{ 
        timeOfDay, 
        toggleTimeOfDay, 
        activeBiome, 
        setActiveBiome,
        flyInComplete,
        setFlyInComplete
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
