import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import WebGLBackground from './components/WebGLBackground';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import VideoEditing from './pages/VideoEditing';
import { ContactProvider } from './context/ContactContext';
import ContactModal from './components/ContactModal';
import Cursor from './components/Cursor';

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
        <WebGLBackground />
        <Cursor />
        <Navbar />
        <ContactModal />
        <Chatbot />
        <div className="relative z-10 min-h-screen flex flex-col text-[var(--color-text)]">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/video-editing" element={<VideoEditing />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ContactProvider>
  );
}

export default App;
