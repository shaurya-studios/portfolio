import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebGLBackground from './components/WebGLBackground';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import VideoEditing from './pages/VideoEditing';

function App() {
  return (
    <Router>
      <WebGLBackground />
      <Navbar />
      <Chatbot />
      <div className="relative z-10 min-h-screen flex flex-col text-[var(--color-text-primary)]">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video-editing" element={<VideoEditing />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
