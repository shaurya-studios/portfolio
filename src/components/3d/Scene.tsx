import { View, Environment, Preload } from '@react-three/drei';
import HeroMonolith from './HeroMonolith';

export default function Scene() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 12, 35]} />
      
      <Environment preset="city" />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.8} />
      <directionalLight position={[-10, -20, -10]} intensity={0.6} color="#ca8a04" />

      {/* Interactive Golden Monolith Scene */}
      <HeroMonolith />

      {/* Renders all <View> components tracked in DOM */}
      <View.Port />

      <Preload all />
    </>
  );
}
