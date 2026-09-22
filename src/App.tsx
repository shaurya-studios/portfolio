import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Scene from './components/3d/Scene';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import VideoEditing from './pages/VideoEditing';
import { ContactProvider } from './context/ContactContext';
import { SceneryProvider, useScenery } from './context/SceneryContext';
import ContactModal from './components/ContactModal';
import Preloader from './components/Preloader';

function AppContent() {
  const [appReady, setAppReady] = useState(false);
  const { viewMode, isConstructionMode } = useScenery();
  const lenisRef = useRef<Lenis | null>(null);

  // P0: Render Loop Pausing & On-Demand Rendering
  const [frameloop, setFrameloop] = useState<'always' | 'demand' | 'never'>('always');
  
  useEffect(() => {
    const updateFrameloop = () => {
      if (document.hidden) {
        setFrameloop('never');
      } else {
        setFrameloop('always'); // With cursor tracking and interactive objects, we usually want always
      }
    };

    updateFrameloop();
    document.addEventListener('visibilitychange', updateFrameloop);
    return () => document.removeEventListener('visibilitychange', updateFrameloop);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let animId: number;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }
    animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Preloader onComplete={() => setAppReady(true)} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: appReady ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`relative min-h-screen bg-[var(--color-bg)] transition-colors duration-700 overflow-x-hidden ${isConstructionMode ? 'construction-mode' : ''}`}
        id="main-scroll-container"
      >
        <Router>
          <Cursor />

          {/* Layer 0: Global 3D WebGL Canvas */}
          {viewMode === '3d' && (
            <div className="fixed inset-0 z-0 pointer-events-auto">
              <Canvas
                frameloop={frameloop}
                eventSource={document.getElementById('main-scroll-container') || undefined}
                camera={{ position: [0, 0, 15], fov: 45 }}
                dpr={[1, 1.5]}
                shadows
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: 'high-performance',
                  stencil: false,
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.2,
                }}
                className="w-full h-full"
              >
                <Scene />
              </Canvas>
            </div>
          )}

          {/* Persistent Header: Always interactive and accessible */}
          <Navbar />
          
          {/* Layer 2: Editorial HTML Content */}
          <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video-editing" element={<VideoEditing />} />
              </Routes>
            </main>
          </div>

          <ContactModal />
        </Router>
      </motion.div>
    </>
  );
}


export default function App() {
  return (
    <SceneryProvider>
      <ContactProvider>
        <AppContent />
      </ContactProvider>
    </SceneryProvider>
  );
}
