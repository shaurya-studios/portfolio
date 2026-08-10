import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { Canvas } from '@react-three/fiber';
import Scene from './components/3d/Scene';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import VideoEditing from './pages/VideoEditing';
import { ContactProvider } from './context/ContactContext';
import ContactModal from './components/ContactModal';
import Preloader from './components/Preloader';

function App() {
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
    <ContactProvider>
      <Preloader onComplete={() => setAppReady(true)} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: appReady ? 1 : 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
        id="main-scroll-container"
      >
        <Router>
          {/* Layer 0: Global 3D WebGL Canvas */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
              eventSource={document.getElementById('main-scroll-container') || undefined}
              camera={{ position: [0, 0, 10], fov: 35 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: false }}
              className="w-full h-full"
            >
              <Scene />
            </Canvas>
          </div>
          
          {/* Layer 1: HTML Overlay - Pointer events none on container, auto on children */}
          <div className="relative z-10 min-h-screen flex flex-col text-[var(--color-text)] pointer-events-none">
            <div className="pointer-events-auto">
              <Navbar />
            </div>
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video-editing" element={<VideoEditing />} />
              </Routes>
            </main>

            <div className="pointer-events-auto">
              <ContactModal />
              <Chatbot />
            </div>
          </div>
        </Router>
      </motion.div>
    </ContactProvider>
  );
}

export default App;
