import { ScrollControls, Scroll } from '@react-three/drei';
import * as THREE from 'three';
import KineticLoom from './KineticLoom';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { fuzzBackgroundVertex, fuzzBackgroundFragment } from './shaders/LoomShaders';

function FuzzBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -20]} scale={[100, 100, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={fuzzBackgroundVertex}
        fragmentShader={fuzzBackgroundFragment}
        uniforms={{
          uTime: { value: 0 }
        }}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Scene() {
  return (
    <>
      <color attach="background" args={['#08080a']} />
      
      {/* 
        ScrollControls manages the HTML overlay and scroll progress. 
        pages={4} creates a 400vh tall scroll container.
      */}
      <ScrollControls pages={4} damping={0.2} distance={1.5}>
        {/* Background fuzz behind everything */}
        <FuzzBackground />
        
        {/* The dynamic thread instanced mesh */}
        <KineticLoom />

        {/* 
          HTML Overlay stitched over the 3D canvas 
          This replaces the traditional App.tsx routes for the immersive experience.
        */}
        <Scroll html style={{ width: '100%', height: '100%' }}>
          <div className="w-screen h-screen flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-white text-5xl md:text-8xl font-sans tracking-tight opacity-90 mix-blend-difference drop-shadow-2xl">
              SHAURYA
            </h1>
            <p className="text-white/60 font-mono text-sm tracking-[0.3em] mt-4 uppercase">
              Scroll to Weave
            </p>
          </div>
          
          <div className="w-screen h-screen flex flex-col items-start justify-center px-12 md:px-32 pointer-events-none">
            <h2 className="text-[#5eead4] text-sm font-mono tracking-widest mb-4">CASE STUDY [01]</h2>
            <h3 className="text-white text-4xl md:text-6xl font-sans font-bold">Editify Studios</h3>
            <p className="text-white/70 max-w-md mt-6 text-lg">
              A high-performance video editing agency interface. The digital fabric of modern content creation.
            </p>
          </div>

          <div className="w-screen h-screen flex flex-col items-end justify-center px-12 md:px-32 pointer-events-none text-right">
            <h2 className="text-[#5eead4] text-sm font-mono tracking-widest mb-4">CASE STUDY [02]</h2>
            <h3 className="text-white text-4xl md:text-6xl font-sans font-bold">ThumbPilot</h3>
            <p className="text-white/70 max-w-md mt-6 text-lg text-right ml-auto">
              A/B testing architecture woven into a scalable product.
            </p>
          </div>
          
          <div className="w-screen h-screen flex flex-col items-center justify-center pointer-events-none">
            <h3 className="text-white text-3xl font-sans font-bold">Ready to craft?</h3>
            <button className="mt-8 px-8 py-3 border border-white/20 text-white font-mono text-sm tracking-widest hover:bg-white hover:text-black transition-colors pointer-events-auto cursor-pointer">
              INITIALIZE_CONTACT
            </button>
          </div>
        </Scroll>
      </ScrollControls>
    </>
  );
}
