import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import WoolFabricSculpture from './WoolFabricSculpture';
import RealisticThreadSkein from './RealisticThreadSkein';
import { useContact } from '../../context/ContactContext';
import { ArrowUpRight, Sparkles, Layers, Cpu } from 'lucide-react';
import { playTactileClick } from '../../utils/audioHaptics';

// Controller to synchronize camera and lighting with scroll
function SceneRig() {
  const scrollData = useScroll();
  const scrollRef = useRef(0);

  useFrame((state, delta) => {
    const target = scrollData.offset;
    // Smooth scroll interpolation
    scrollRef.current += (target - scrollRef.current) * Math.min(1, delta * 6);

    // Dynamic camera glide: subtly glides closer and orbits as user scrolls through sections
    state.camera.position.z = 15 - (scrollRef.current * 4.5);
    state.camera.position.x = Math.sin(scrollRef.current * Math.PI) * 1.5;
    state.camera.position.y = -(scrollRef.current * 2.0);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* 1. Center 3D Model: Sculpted Wool & Raw Silk Fabric with Potli Button */}
      <WoolFabricSculpture scrollProgress={scrollRef.current} />

      {/* 2. Realistic Spun Yarn Cords & Dense Silk Filament Skeins */}
      <RealisticThreadSkein />
    </>
  );
}

export default function Scene() {
  const { openContact } = useContact();

  return (
    <>
      <color attach="background" args={['#080709']} />
      
      {/* 
        High-End Studio Lighting Rig 
        Highlights micro-sheen on wool cloth, specular gleam on plied cords, and clearcoat on silk
      */}
      <ambientLight intensity={1.4} />
      <directionalLight position={[6, 14, 8]} intensity={3.8} color="#fff6ed" castShadow />
      <directionalLight position={[-8, -5, 4]} intensity={2.2} color="#f59e0b" />
      <directionalLight position={[0, -10, -5]} intensity={1.5} color="#991b1b" />
      <pointLight position={[0, 2, 7]} intensity={2.0} color="#fef3c7" distance={25} />

      <ScrollControls pages={4} damping={0.25} distance={1.5}>
        <SceneRig />

        {/* High-Legibility Editorial HTML Interface */}
        <Scroll html style={{ width: '100%', height: '100%' }}>
          
          {/* ===================================================
              SECTION 01 // HERO LANDING
              =================================================== */}
          <div className="w-screen h-screen flex flex-col items-center justify-center px-6 pointer-events-none relative">
            <div className="flex flex-col items-center text-center max-w-4xl">
              
              {/* Luxury Silk Woven Label Tag */}
              <div className="inline-flex items-center gap-2.5 px-4 sm:px-6 py-2 rounded-full bg-black/80 border border-amber-500/50 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.9)] mb-6 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b]" />
                <span className="font-mono text-xs sm:text-sm font-semibold tracking-[0.25em] text-amber-200 uppercase">
                  Indian Handloom &bull; Creative Technologist
                </span>
              </div>

              {/* Crisp, High-Contrast Master Typography */}
              <h1 className="text-white text-6xl sm:text-7xl md:text-9xl font-sans tracking-tighter font-extrabold select-none drop-shadow-[0_14px_45px_rgba(0,0,0,0.95)] leading-[0.95]">
                SHAURYA
              </h1>

              <p className="text-neutral-200 font-mono text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase mt-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] max-w-xl font-medium">
                Engineering Digital Experiences Through Craft & Precision
              </p>

              {/* Scroll Cue Pill */}
              <div className="mt-12 flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md text-white/85 font-mono text-[11px] tracking-[0.25em] uppercase shadow-xl">
                <span className="inline-block animate-bounce text-amber-400">↓</span>
                <span>Scroll To Explore Fabric & Projects</span>
              </div>
            </div>
          </div>
          
          {/* ===================================================
              SECTION 02 // CASE STUDY 01: EDITIFY STUDIOS
              =================================================== */}
          <div className="w-screen h-screen flex flex-col items-start justify-center px-6 sm:px-12 md:px-28 lg:px-36 pointer-events-none">
            <div className="pointer-events-auto max-w-xl bg-black/90 backdrop-blur-2xl border border-amber-500/30 p-8 sm:p-10 md:p-12 rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.95)] relative overflow-hidden group hover:border-amber-500/60 transition-all duration-300">
              
              {/* Crimson & Gold Zari Accent Corner */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-red-600/20 via-amber-500/10 to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-2.5 mb-4">
                <Layers size={14} className="text-amber-400" />
                <span className="text-amber-400 font-mono text-xs tracking-[0.25em] uppercase font-bold">
                  SWATCH [01] &bull; VIDEO PRODUCTION
                </span>
              </div>
              
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4 drop-shadow-md">
                <a
                  href="https://editify-studios.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playTactileClick()}
                  className="hover:text-amber-400 transition-colors"
                >
                  Editify Studios
                </a>
              </h2>
              
              <p className="text-neutral-200 text-sm sm:text-base md:text-lg leading-relaxed mb-6 font-sans">
                A high-performance video editing agency interface. Built with custom interactive preview canvases, client revision workflows, and real-time media showcase pipelines.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">Next.js</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">Three.js</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">Tailwind CSS</span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">Live Production</span>
              </div>
              
              <div className="flex items-center gap-4">
                <a
                  href="https://editify-studios.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playTactileClick()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold tracking-wider uppercase hover:bg-amber-400 transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Visit Editify Studios</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* ===================================================
              SECTION 03 // CASE STUDY 02: THUMBPILOT
              =================================================== */}
          <div className="w-screen h-screen flex flex-col items-end justify-center px-6 sm:px-12 md:px-28 lg:px-36 pointer-events-none">
            <div className="pointer-events-auto max-w-xl text-left bg-black/90 backdrop-blur-2xl border border-blue-500/30 p-8 sm:p-10 md:p-12 rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.95)] relative overflow-hidden group hover:border-blue-400/60 transition-all duration-300 ml-auto">
              
              {/* Peacock Blue & Silver Accent Corner */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-blue-600/20 via-cyan-500/10 to-transparent pointer-events-none" />

              <div className="flex items-center gap-2.5 mb-4">
                <Cpu size={14} className="text-blue-400" />
                <span className="text-blue-400 font-mono text-xs tracking-[0.25em] uppercase font-bold">
                  SWATCH [02] &bull; PRODUCT ARCHITECTURE
                </span>
              </div>
              
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4 drop-shadow-md">
                <a
                  href="https://thumbpilot-main.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playTactileClick()}
                  className="hover:text-blue-400 transition-colors"
                >
                  ThumbPilot
                </a>
              </h2>
              
              <p className="text-neutral-200 text-sm sm:text-base md:text-lg leading-relaxed mb-6 font-sans">
                Predictive YouTube thumbnail A/B testing engine and visual analytics platform. Empowering digital creators with data-driven click-through rate optimization.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">React 19</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">TypeScript</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">Framer Motion</span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold">SaaS Platform</span>
              </div>
              
              <div className="flex items-center gap-4">
                <a
                  href="https://thumbpilot-main.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playTactileClick()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold tracking-wider uppercase hover:bg-blue-400 transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Launch ThumbPilot</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
          
          {/* ===================================================
              SECTION 04 // FINAL OUTRO: CONTACT & COLLABORATE
              =================================================== */}
          <div className="w-screen h-screen flex flex-col items-center justify-center px-6 pointer-events-none">
            <div className="pointer-events-auto max-w-xl text-center bg-black/95 backdrop-blur-2xl border border-amber-500/40 p-10 sm:p-12 md:p-14 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.95)] relative overflow-hidden">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase tracking-widest mb-6 font-semibold">
                <Sparkles size={13} className="text-amber-400" />
                Available for Select Work
              </div>

              <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight mb-4 drop-shadow-md">
                Let's Craft Together.
              </h2>
              
              <p className="text-neutral-200 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
                Whether you need high-impact web development, 3D interactive experiences, or full-stack software architecture, let's connect.
              </p>
              
              <button 
                onClick={() => {
                  playTactileClick();
                  openContact();
                }}
                className="px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-mono text-xs sm:text-sm font-bold tracking-[0.2em] uppercase hover:opacity-90 active:scale-95 transition-all shadow-[0_12px_35px_rgba(245,158,11,0.35)] cursor-pointer"
              >
                Initialize Contact
              </button>
            </div>
          </div>
        </Scroll>
      </ScrollControls>
    </>
  );
}
