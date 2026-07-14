import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebGLBackground from './components/WebGLBackground';
import Navigation from './components/Navigation';

// Pages
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <WebGLBackground />
      <div className="relative z-10 min-h-screen flex flex-col text-[var(--color-text-primary)]">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
