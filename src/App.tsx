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
        className="relative min-h-screen bg-[#050505]"
        id="main-scroll-container"
      >
        <Router>
          <Cursor />

          {/* Background Texture & Ambient Glow from Editify */}
          <div 
            className="fixed inset-0 opacity-[0.035] pointer-events-none z-[1] mix-blend-overlay" 
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
          />
          <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-yellow-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
          <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-yellow-500/10 rounded-full blur-[160px] pointer-events-none z-0" />

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
    </ContactProvider>
  );
}

export default App;
