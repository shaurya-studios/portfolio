import { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import Scene from './components/3d/Scene';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import { ContactProvider } from './context/ContactContext';
import { SceneryProvider } from './context/SceneryContext';
import ContactModal from './components/ContactModal';
import Preloader from './components/Preloader';
import { BrowserRouter as Router } from 'react-router-dom';

function AppContent() {
  const [appReady, setAppReady] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setAppReady(true)} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: appReady ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-screen bg-[#050505] transition-colors duration-700 overflow-hidden"
      >
        <Router>
          <Cursor />
          <Navbar />

          <div className="fixed inset-0 z-0 pointer-events-auto">
            <Canvas
              camera={{ position: [0, 0, 15], fov: 45 }}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                stencil: false,
              }}
              className="w-full h-full"
            >
              <Scene />
            </Canvas>
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
