import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { Canvas } from '@react-three/fiber';
import Scene from './components/3d/Scene';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import VideoEditing from './pages/VideoEditing';
import { ContactProvider } from './context/ContactContext';
import { SceneryProvider, useScenery } from './context/SceneryContext';
import ContactModal from './components/ContactModal';
import Preloader from './components/Preloader';
import VesselControlsHUD from './components/3d/VesselControlsHUD';
import { AtelierBar } from './components/AtelierBar';

function AppContent() {
  const [appReady, setAppReady] = useState(false);
  const { isCruising, setIsCruising } = useScenery();
  const lenisRef = useRef<Lenis | null>(null);

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

  // Press ESC to instantly dock the vessel and return to editorial portfolio view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCruising) {
        setIsCruising(false);
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
        className="relative min-h-screen bg-[var(--color-bg)] transition-colors duration-700"
        id="main-scroll-container"
      >
        <Router>
          <Cursor />

          {/* Layer 0: Global 3D WebGL Island & Ocean Canvas (Optimized high-performance pipeline) */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
              eventSource={document.getElementById('main-scroll-container') || undefined}
              camera={{ position: [0, 18, 22], fov: 40 }}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                stencil: false,
              }}
              className="w-full h-full pointer-events-auto"
            >
              <Scene />
            </Canvas>
          </div>

          {/* Layer 1: Luxury Telemetry Vessel HUD & Atelier Lab Controls */}
          <VesselControlsHUD />
          <AtelierBar />
          
          {/* Layer 2: Editorial HTML Content (Fades completely during Cruise Mode for full-screen open-world driving) */}
          <div
            className={`relative z-10 min-h-screen flex flex-col text-[var(--color-text)] transition-opacity duration-700 ${
              isCruising ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video-editing" element={<VideoEditing />} />
              </Routes>
            </main>

            <ContactModal />
            <Chatbot />
          </div>
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
