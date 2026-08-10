import { View } from '@react-three/drei';
import { Environment, Preload } from '@react-three/drei';
import HeroMonolith from './HeroMonolith';

// A shared global background if needed, but primarily we use View.Port
export default function Scene() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 10, 30]} />
      
      <Environment preset="city" />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#e8b634" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#5a6a82" />

      {/* Global Hero Monolith, tracked globally via scroll */}
      <HeroMonolith />

      {/* Renders all <View> components tracked in DOM */}
      <View.Port />

      <Preload all />
    </>
  );
}
