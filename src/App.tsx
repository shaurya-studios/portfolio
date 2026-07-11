import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navigation from './components/Navigation';
import IglooBackground from './components/IglooBackground';
import Preloader from './components/Preloader';
import SmoothScroll from './components/SmoothScroll';

// Pages
import Home from './pages/Home';
import Video from './pages/Video';
import Dev from './pages/Dev';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <SmoothScroll>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
        
        <IglooBackground />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 min-h-screen flex flex-col"
        >
          <Navigation />
          <main className="flex-grow pt-24">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video" element={<Video />} />
                <Route path="/dev" element={<Dev />} />
              </Routes>
            </AnimatePresence>
          </main>
        </motion.div>
      </SmoothScroll>
    </Router>
  );
}

export default App;
