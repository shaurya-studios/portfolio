import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { fabricVertexShader, fabricFragmentShader } from './shaders/MacroFabricShader';

// --- MACRO FABRIC BACKGROUND ---
function MacroFabric() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollData = useScroll();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Scroll offsets the fabric slightly for a tactile panning feel
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
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        }}
        depthWrite={false}
      />
    </mesh>
  );
}

// --- LOOSE SILK THREADS (Foreground 3D) ---
function LooseThreads() {
  const scrollData = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate 40 curved 3D tubes to look like loose silk threads
  const threads = useMemo(() => {
    const threadData = [];
    const colors = ['#a01a2c', '#d69e2e', '#1d4ed8']; // Crimson, Gold, Indigo
    
    for (let i = 0; i < 40; i++) {
      // Create a random curved path
      const points = [];
      const startX = (Math.random() - 0.5) * 20;
      const startY = (Math.random() - 0.5) * 20;
      
      for (let j = 0; j < 6; j++) {
        points.push(new THREE.Vector3(
          startX + (Math.random() - 0.5) * 5 + j * (Math.random() > 0.5 ? 2 : -2),
          startY - j * 4,
          (Math.random() - 0.5) * 4
        ));
      }
      
      const curve = new THREE.CatmullRomCurve3(points);
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      threadData.push({ curve, color, speed: Math.random() * 0.5 + 0.1 });
    }
    return threadData;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
      // Parallax effect on scroll
      groupRef.current.position.y += scrollData.offset * 15.0;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {threads.map((t, idx) => (
        <mesh key={idx}>
          <tubeGeometry args={[t.curve, 64, 0.03, 8, false]} />
          <meshPhysicalMaterial 
            color={t.color}
            roughness={0.2}
            metalness={0.4}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene() {
  return (
    <>
      <color attach="background" args={['#050102']} />
      
      {/* Lighting for the loose 3D threads */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={3.0} color="#ffedd5" />
      <directionalLight position={[-5, -10, 2]} intensity={1.5} color="#e11d48" />

      <ScrollControls pages={4} damping={0.2} distance={1.5}>
        
        {/* The Macro Woven Fabric Background */}
        <MacroFabric />
        
        {/* Floating Loose Silk Threads in the Foreground */}
        <LooseThreads />

        {/* HTML UI stitched over the fabric */}
        <Scroll html style={{ width: '100%', height: '100%' }}>
          <div className="w-screen h-screen flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-white text-6xl md:text-9xl font-sans tracking-tight drop-shadow-2xl font-bold mix-blend-overlay opacity-80">
              SHAURYA
            </h1>
            <p className="text-white/80 font-mono text-sm tracking-[0.4em] mt-6 uppercase drop-shadow-md">
              Creative Engineer
            </p>
          </div>
          
          <div className="w-screen h-screen flex flex-col items-start justify-center px-12 md:px-32 pointer-events-none">
            <h2 className="text-[#fbbf24] text-xs font-mono tracking-widest mb-4">CASE STUDY [01]</h2>
            <h3 className="text-white text-5xl md:text-7xl font-sans font-bold drop-shadow-lg">Editify Studios</h3>
            <p className="text-white/90 max-w-md mt-6 text-xl drop-shadow-md leading-relaxed">
              A high-performance video editing interface. The digital fabric of modern content creation.
            </p>
          </div>

          <div className="w-screen h-screen flex flex-col items-end justify-center px-12 md:px-32 pointer-events-none text-right">
            <h2 className="text-[#fbbf24] text-xs font-mono tracking-widest mb-4">CASE STUDY [02]</h2>
            <h3 className="text-white text-5xl md:text-7xl font-sans font-bold drop-shadow-lg">ThumbPilot</h3>
            <p className="text-white/90 max-w-md mt-6 text-xl text-right ml-auto drop-shadow-md leading-relaxed">
              Scalable product architecture woven with precision.
            </p>
          </div>
          
          <div className="w-screen h-screen flex flex-col items-center justify-center pointer-events-none">
            <h3 className="text-white text-4xl font-sans font-bold drop-shadow-lg">Ready to weave?</h3>
            <button className="mt-10 px-10 py-4 border border-white/40 bg-black/20 backdrop-blur-md text-white font-mono text-sm tracking-widest hover:bg-white hover:text-black transition-all pointer-events-auto cursor-pointer">
              INITIALIZE_CONTACT
            </button>
          </div>
        </Scroll>
      </ScrollControls>
    </>
  );
}
