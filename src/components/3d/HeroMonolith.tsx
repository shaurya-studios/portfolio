import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, useTransform } from 'framer-motion';

export default function HeroMonolith() {
  const meshRef = useRef<any>(null);
  const { scrollYProgress } = useScroll();
  
  // Tie rotation and position to scroll
  // The monolith will sink and rotate as the user scrolls down
  const yPos = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const rotX = useTransform(scrollYProgress, [0, 1], [0, Math.PI / 2]);
  const rotY = useTransform(scrollYProgress, [0, 1], [0, Math.PI]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smoothly interpolate the scroll transforms to the mesh
    meshRef.current.position.y += (yPos.get() - meshRef.current.position.y) * 0.1;
    meshRef.current.rotation.x += (rotX.get() - meshRef.current.rotation.x) * 0.1;
    meshRef.current.rotation.y += (rotY.get() - meshRef.current.rotation.y + state.clock.elapsedTime * 0.05) * 0.1;
    
    // Add a slight floating effect
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.005;
  });

  return (
    <mesh ref={meshRef} position={[2, 0, 0]} scale={2.5}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial 
        color="#080b12"
        metalness={0.1}
        roughness={0.2}
        transmission={1}
        ior={1.5}
        thickness={2}
        clearcoat={1}
        clearcoatRoughness={0.1}
        emissive="#06090f"
        emissiveIntensity={0.2}
        wireframe={false}
      />
    </mesh>
  );
}
