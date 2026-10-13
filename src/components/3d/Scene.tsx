import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { fabricVertexShader, fabricFragmentShader } from './shaders/MacroFabricShader';
import { useContact } from '../../context/ContactContext';
import { ArrowUpRight, Sparkles, Layers, Cpu } from 'lucide-react';
import { playTactileClick } from '../../utils/audioHaptics';

// --- MACRO FABRIC BACKGROUND ---
function MacroFabric() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollData = useScroll();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uScroll.value = scrollData.offset;
    }
  });

  return (
    <mesh position={[0, 0, -10]} scale={[40, 40, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={fabricVertexShader}
        fragmentShader={fabricFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uResolution: { value: new THREE.Vector2(typeof window !== 'undefined' ? window.innerWidth : 1920, typeof window !== 'undefined' ? window.innerHeight : 1080) }
        }}
        depthWrite={false}
      />
    </mesh>
  );
}

// --- ULTRA-FINE SILK FILAMENTS (Thinner, cleaner, graceful Indian silk strands) ---
function LooseThreads() {
  const scrollData = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  
  // Silk colors directly referenced from traditional Indian dyed silk skeins:
  // Crimson Red, Raw Saffron Gold, Peacock Blue, Emerald Green, Warm Copper Zari, Pure Silver Zari
  const threads = useMemo(() => {
    const threadData: Array<{
      curve: THREE.CatmullRomCurve3;
      color: string;
      radius: number;
      speed: number;
      phase: number;
    }> = [];

    const palette = [
      '#dc2626', // Vibrant Crimson Silk
      '#f59e0b', // Raw Saffron Gold
      '#2563eb', // Peacock / Royal Cobalt Blue
      '#059669', // Emerald Rani Green
      '#d97706', // Copper Zari
      '#f8fafc', // Glistening Silver Filament
    ];

    // Generate 48 ultra-fine, smooth sweeping filament curves
    for (let i = 0; i < 48; i++) {
      const color = palette[i % palette.length];
      
      // Much thinner radius: 0.0035 to 0.006 (down from previous 0.03)
      const radius = 0.0038 + (i % 4) * 0.0008;

      // Group into 3 flowing ribbons across the scene depth
      const streamIndex = i % 3;
      const baseDepth = -1.5 - streamIndex * 1.5;
      
      // Spread across the perimeter and sides so the central reading zone stays clean
      const side = (i % 2 === 0 ? 1 : -1);
      const startX = side * (4.0 + Math.random() * 6.5);
      const startY = 10.0 - (i * 0.45);

      const points: THREE.Vector3[] = [];
      const numPoints = 7;
      
      // Create clean, graceful sinusoidal catenary curves (no erratic jagged angles)
      const waveFreq = 0.45 + Math.random() * 0.35;
      const waveAmp = 1.2 + Math.random() * 1.5;
      const arcSweep = (Math.random() - 0.5) * 2.5;

      for (let j = 0; j < numPoints; j++) {
        const progress = j / (numPoints - 1);
        const y = startY - progress * 16.0;
        const x = startX + Math.sin(progress * Math.PI * waveFreq + i * 0.5) * waveAmp + (progress * arcSweep);
        const z = baseDepth + Math.cos(progress * Math.PI * 1.2 + i) * 0.8;
        
        points.push(new THREE.Vector3(x, y, z));
      }

      // Smooth chordal Catmull-Rom spline for continuous, uninterrupted silk drape
      const curve = new THREE.CatmullRomCurve3(points, false, 'chordal');
      threadData.push({
        curve,
        color,
        radius,
        speed: 0.25 + Math.random() * 0.35,
        phase: i * 0.4
      });
    }

    return threadData;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      // Gentle, organic floating sway
      groupRef.current.position.y = Math.sin(t * 0.35) * 0.25;
      groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.015;
      // Smooth scroll parallax
      groupRef.current.position.y += scrollData.offset * 12.0;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {threads.map((t, idx) => (
        <mesh key={idx}>
          {/* Smooth 96 tubular segments, 6 radial faces for crisp, hair-like render */}
          <tubeGeometry args={[t.curve, 96, t.radius, 6, false]} />
          <meshPhysicalMaterial 
            color={t.color}
            roughness={0.14}
            metalness={0.42}
            clearcoat={1.0}
            clearcoatRoughness={0.06}
            reflectivity={0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene() {
  const { openContact } = useContact();

  return (
    <>
      <color attach="background" args={['#050102']} />
      
      {/* Studio Lighting to illuminate the silk sheen and metallic luster */}
      <ambientLight intensity={1.8} />
      <directionalLight position={[6, 12, 6]} intensity={3.5} color="#fff1e6" />
      <directionalLight position={[-8, -6, 4]} intensity={2.2} color="#f59e0b" />
      <pointLight position={[0, 0, 5]} intensity={1.5} color="#ffd8a8" />

      <ScrollControls pages={4} damping={0.2} distance={1.5}>
        
        {/* Macro Indian Fabric Background */}
        <MacroFabric />
        
        {/* Delicate, Clean Floating Silk Filaments */}
        <LooseThreads />

        {/* High-Legibility Editorial Interface */}
        <Scroll html style={{ width: '100%', height: '100%' }}>
          
          {/* ===================================================
              SECTION 01 // HERO LANDING
              =================================================== */}
          <div className="w-screen h-screen flex flex-col items-center justify-center px-6 pointer-events-none relative">
            <div className="flex flex-col items-center text-center max-w-4xl">
              
              {/* Luxury Silk Woven Label Tag */}
              <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-black/75 border border-amber-500/40 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] mb-6 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
                <span className="font-mono text-xs sm:text-sm font-semibold tracking-[0.25em] text-amber-200 uppercase">
                  Raw Silk &bull; Creative Technologist
                </span>
              </div>

              {/* Crisp, High-Contrast Typography */}
              <h1 className="text-white text-6xl sm:text-7xl md:text-9xl font-sans tracking-tighter font-extrabold select-none drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)] leading-[0.95]">
                SHAURYA
              </h1>

              <p className="text-neutral-100 font-mono text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase mt-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] max-w-xl font-medium">
                Engineering Digital Experiences Through Craft & Precision
              </p>

              {/* Scroll Indicator Cue */}
              <div className="mt-12 flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-white/80 font-mono text-[11px] tracking-[0.25em] uppercase shadow-lg">
                <span className="inline-block animate-bounce">↓</span>
                <span>Scroll To Explore Weave</span>
              </div>
            </div>
          </div>
          
          {/* ===================================================
              SECTION 02 // CASE STUDY 01: EDITIFY STUDIOS
              =================================================== */}
          <div className="w-screen h-screen flex flex-col items-start justify-center px-6 sm:px-12 md:px-28 lg:px-36 pointer-events-none">
            <div className="pointer-events-auto max-w-xl bg-black/85 backdrop-blur-2xl border border-white/20 p-8 sm:p-10 md:p-12 rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
              
              {/* Top Zari Accent Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/15 via-red-500/5 to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-2.5 mb-4">
                <Layers size={14} className="text-amber-400" />
                <span className="text-amber-400 font-mono text-xs tracking-[0.25em] uppercase font-bold">
                  CASE STUDY [01] &bull; PRODUCTION
                </span>
              </div>
              
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4 drop-shadow-md">
                Editify Studios
              </h2>
              
              <p className="text-neutral-200 text-sm sm:text-base md:text-lg leading-relaxed mb-6 font-sans">
                A high-performance video editing agency interface. Built with custom interactive preview canvases, client revision workflows, and real-time media showcase pipelines.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">Next.js</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">Three.js</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">Tailwind CSS</span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">Live Client</span>
              </div>
              
              <div className="flex items-center gap-4">
                <a
                  href="/video-editing"
                  onClick={() => playTactileClick()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold tracking-wider uppercase hover:bg-amber-400 transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Explore Case Study</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* ===================================================
              SECTION 03 // CASE STUDY 02: THUMBPILOT
              =================================================== */}
          <div className="w-screen h-screen flex flex-col items-end justify-center px-6 sm:px-12 md:px-28 lg:px-36 pointer-events-none">
            <div className="pointer-events-auto max-w-xl text-left bg-black/85 backdrop-blur-2xl border border-white/20 p-8 sm:p-10 md:p-12 rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 ml-auto">
              
              {/* Top Zari Accent Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/15 via-blue-500/5 to-transparent pointer-events-none" />

              <div className="flex items-center gap-2.5 mb-4">
                <Cpu size={14} className="text-amber-400" />
                <span className="text-amber-400 font-mono text-xs tracking-[0.25em] uppercase font-bold">
                  CASE STUDY [02] &bull; PRODUCT ARCHITECTURE
                </span>
              </div>
              
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4 drop-shadow-md">
                ThumbPilot
              </h2>
              
              <p className="text-neutral-200 text-sm sm:text-base md:text-lg leading-relaxed mb-6 font-sans">
                Predictive YouTube thumbnail A/B testing engine and visual analytics platform. Empowering digital creators with data-driven click-through rate optimization.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">React 19</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">TypeScript</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15">Framer Motion</span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">SaaS Platform</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    playTactileClick();
                    openContact();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold tracking-wider uppercase hover:bg-amber-400 transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Inquire Architecture</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
          
          {/* ===================================================
              SECTION 04 // FINAL OUTRO: CONTACT & COLLABORATE
              =================================================== */}
          <div className="w-screen h-screen flex flex-col items-center justify-center px-6 pointer-events-none">
            <div className="pointer-events-auto max-w-xl text-center bg-black/90 backdrop-blur-2xl border border-white/20 p-10 sm:p-12 md:p-14 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.95)] relative overflow-hidden">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 font-mono text-xs uppercase tracking-widest mb-6 font-semibold">
                <Sparkles size={13} className="text-amber-400" />
                Available for New Work
              </div>

              <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight mb-4 drop-shadow-md">
                Let's Weave Something Memorable.
              </h2>
              
              <p className="text-neutral-200 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
                Whether you need high-impact web development, 3D interactive experiences, or full-stack software architecture, let's talk.
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
