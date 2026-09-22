import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Grid } from '@react-three/drei';
import { useScenery } from '../../context/SceneryContext';
import SignatureObject from './SignatureObject';

export default function Scene() {
  const { isConstructionMode } = useScenery();
  const scrollProgress = useRef(0);
  const targetProgress = useRef(0);

  // Sync scroll progress smoothly
  useFrame((state, delta) => {
    // Calculate max scroll
    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    targetProgress.current = window.scrollY / maxScroll;

    // Smoothly interpolate scroll progress for physics
    const lambda = 5.0;
    scrollProgress.current += (targetProgress.current - scrollProgress.current) * (1 - Math.exp(-lambda * delta));
    
    // Move the camera slightly based on scroll to "fly into" the space
    state.camera.position.z = 15 - (scrollProgress.current * 10);
    state.camera.position.y = scrollProgress.current * 2;
  });

  return (
    <>
      <color attach="background" args={['#050505']} />
      
      {/* Stark directional lighting for dramatic physical shadows */}
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#5eead4" />
      <ambientLight intensity={0.1} />

      {/* The Central Interactive Sculpture */}
      <SignatureObject scrollProgress={scrollProgress.current} />

      {/* The Digital Workspace Floor / Grid */}
      <Grid 
        position={[0, -5, 0]} 
        args={[100, 100]} 
        cellSize={1} 
        cellThickness={isConstructionMode ? 1.5 : 0.5} 
        cellColor={isConstructionMode ? '#5eead4' : '#222222'} 
        sectionSize={5} 
        sectionThickness={1} 
        sectionColor={isConstructionMode ? '#5eead4' : '#333333'} 
        fadeDistance={30}
        fadeStrength={1}
      />
      
      {/* Minimal environment map for reflections on metal/glass */}
      <Environment preset="studio" environmentIntensity={0.2} />
    </>
  );
}
