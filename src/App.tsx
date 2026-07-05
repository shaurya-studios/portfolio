import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import Navigation from './components/Navigation';
import Cursor from './components/Cursor';
import ThreeBackground from './components/ThreeBackground';
import SmoothScroll from './components/SmoothScroll';

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
  return (
    <Router>
      <SmoothScroll>
        <Cursor />
        <ThreeBackground />
        <Navigation />
        <AnimatedRoutes />
      </SmoothScroll>
    </Router>
  );
}

export default App;
