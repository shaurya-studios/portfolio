import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import HeroMonolith from './HeroMonolith';
import VideoPlane from './VideoPlane';

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full bg-[var(--color-bg)]"
      >
        <color attach="background" args={['#06090f']} />
        <fog attach="fog" args={['#06090f', 10, 30]} />
        
        <Environment preset="city" />
        
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#e8b634" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#5a6a82" />

        <HeroMonolith />
        <VideoPlane />

        <Preload all />
      </Canvas>
    </div>
  );
}
