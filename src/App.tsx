import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import { SceneryProvider } from './context/SceneryContext';
import ContactModal from './components/ContactModal';
import Preloader from './components/Preloader';

function AppContent() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
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
        className="relative min-h-screen bg-[var(--color-bg)] transition-colors duration-700"
        id="main-scroll-container"
      >
        <Router>
          <Cursor />

          {/* Layer 0: Global 3D WebGL Island Canvas */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
              eventSource={document.getElementById('main-scroll-container') || undefined}
              camera={{ position: [0, 18, 22], fov: 40 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              className="w-full h-full"
            >
              <Scene />
            </Canvas>
          </div>
          
          {/* Layer 1: HTML Content */}
          <div className="relative z-10 min-h-screen flex flex-col text-[var(--color-text)]">
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
