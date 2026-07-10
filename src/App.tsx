import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navigation from './components/Navigation';

// Pages
import Home from './pages/Home';
import Video from './pages/Video';
import Dev from './pages/Dev';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video" element={<Video />} />
            <Route path="/dev" element={<Dev />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
