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
import VesselControlsHUD from './components/3d/VesselControlsHUD';

function AppContent() {
  const [appReady, setAppReady] = useState(false);
  const { isCruising, setIsCruising, viewMode, isDocking } = useScenery();
  const lenisRef = useRef<Lenis | null>(null);

  // P0: Render Loop Pausing & On-Demand Rendering
  const [frameloop, setFrameloop] = useState<'always' | 'demand' | 'never'>('always');
  
  useEffect(() => {
    const updateFrameloop = () => {
      if (document.hidden) {
        setFrameloop('never');
      } else {
        // Run constantly if driving or transitioning. Freeze background if just reading HTML.
        setFrameloop(isCruising || isDocking ? 'always' : 'demand');
      }
    };

    updateFrameloop();
    document.addEventListener('visibilitychange', updateFrameloop);
    return () => document.removeEventListener('visibilitychange', updateFrameloop);
  }, [isCruising, isDocking]);

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

    // Invalidate R3F frameloop on scroll so the background moves
    lenis.on('scroll', () => {
      if (frameloop === 'demand') {
        window.dispatchEvent(new Event('invalidate-frame'));
      }
    });

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, [frameloop]);

  // Freeze smooth scrolling while the user is actively piloting the hydrofoil
  useEffect(() => {
    if (lenisRef.current) {
      if (isCruising) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [isCruising]);

  // Global keyboard shortcuts (ESC to dock, WASD to auto-cruise)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user happens to be focused on an input/textarea
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'Escape' && isCruising) {
        setIsCruising(false);
        return;
      }

      if (!isCruising) {
        const k = e.key.toLowerCase();
        // We omit arrow keys here because users often use arrow keys to scroll the website. 
        // Jumping to 3D when they just wanted to scroll down would be annoying.
        if (['w', 'a', 's', 'd'].includes(k)) {
          // They tried to drive the boat while in the 2D view! Jump into 3D.
          setIsCruising(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCruising, setIsCruising]);

  return (
    <>
      <Preloader onComplete={() => setAppReady(true)} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: appReady ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-screen bg-[var(--color-bg)] transition-colors duration-700 overflow-x-hidden"
        id="main-scroll-container"
      >
        <Router>
          <Cursor />

          {/* Layer 0: Global 3D WebGL Canvas (Only mounted in Full 3D PC Mode - 0 GPU overhead in Lite Mode) */}
          {viewMode === '3d' ? (
            <div className="fixed inset-0 z-0 pointer-events-none">
              <Canvas
                frameloop={frameloop}
                eventSource={document.getElementById('main-scroll-container') || undefined}
                camera={{ position: [0, 18, 22], fov: 40 }}
                dpr={[1, 1.5]}
                shadows
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: 'high-performance',
                  stencil: false,
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.02,
                }}
                className="w-full h-full pointer-events-auto"
              >
                <Scene />
              </Canvas>
            </div>
          ) : (
            /* Lite Mobile Mode Clean Studio Ambient Backdrop */
            <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-[var(--color-card-bg)]/30 to-transparent" />
          )}

          {/* Layer 0.5: Editorial Contrast Overlay (Dims 3D to ensure text readability) */}
          {viewMode === '3d' && (
            <div
              className={`fixed inset-0 z-0 pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                !isCruising ? 'bg-[var(--color-bg)]/90 backdrop-blur-[2px]' : 'bg-transparent backdrop-blur-none'
              }`}
            />
          )}

          {/* Layer 1: Luxury Telemetry Vessel HUD (Only in 3D Mode) */}
          {viewMode === '3d' && <VesselControlsHUD />}

          {/* Persistent Header: Always interactive and accessible */}
          <Navbar />
          
          {/* Layer 2: Editorial HTML Content with Cinematic Docking Focus Transition */}
          <div
            className={`relative z-10 min-h-screen flex flex-col text-[var(--color-text)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isCruising
                ? 'opacity-0 pointer-events-none scale-95 blur-sm'
                : isDocking
                ? 'opacity-85 scale-[0.985] blur-[2px]'
                : 'opacity-100 scale-100 blur-0'
            }`}
          >
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video-editing" element={<VideoEditing />} />
              </Routes>
            </main>
          </div>

          {/* Root-Level Contact Modal: Guaranteed global overlay, completely immune to parent transforms */}
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
