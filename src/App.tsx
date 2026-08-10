import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Scene from './components/3d/Scene';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import VideoEditing from './pages/VideoEditing';
import { ContactProvider } from './context/ContactContext';
import ContactModal from './components/ContactModal';

function App() {
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
      <Router>
        {/* Layer 0: Global 3D WebGL Canvas */}
        <Scene />
        
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
    </ContactProvider>
  );
}

export default App;
