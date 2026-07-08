import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import Navigation from './components/Navigation';
import Cursor from './components/Cursor';
import LiquidBackground from './components/LiquidBackground';
import SmoothScroll from './components/SmoothScroll';
import Preloader from './components/Preloader';

// Pages
import Home from './pages/Home';
import Video from './pages/Video';
import Dev from './pages/Dev';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/video" element={<Video />} />
        <Route path="/dev" element={<Dev />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <SmoothScroll>
        <Cursor />
        {loading && <Preloader onComplete={() => setLoading(false)} />}
        
        {/* Render main content but keep it invisible until loading is done */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className={loading ? 'pointer-events-none' : ''}
        >
          <LiquidBackground />
          <Navigation />
          <AnimatedRoutes />
        </motion.div>
      </SmoothScroll>
    </Router>
  );
}

export default App;
