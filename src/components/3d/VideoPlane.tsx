import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

export default function VideoPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // We don't actually have a video, so we will use a highly stylized material
  // But if the user provides one, `useVideoTexture` is ready.
  // For now, we simulate the "digital artifact" look with a wireframe plane.
  
  const { scrollYProgress } = useScroll();
  
  // Tie rotation and position to scroll
  const yPos = useTransform(scrollYProgress, [0.3, 0.7], [-10, 10]);
  const rotX = useTransform(scrollYProgress, [0.3, 0.7], [-Math.PI / 4, Math.PI / 4]);
  const rotZ = useTransform(scrollYProgress, [0.3, 0.7], [-0.2, 0.2]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smoothly interpolate the scroll transforms to the mesh
    meshRef.current.position.y += (yPos.get() - meshRef.current.position.y) * 0.1;
    meshRef.current.rotation.x += (rotX.get() - meshRef.current.rotation.x) * 0.1;
    meshRef.current.rotation.z += (rotZ.get() - meshRef.current.rotation.z) * 0.1;
    
    // Add a slight floating effect
    meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={[0, -5, -5]} scale={[8, 5, 1]}>
      <planeGeometry args={[1, 1, 16, 16]} />
      <meshPhysicalMaterial 
        color="#e8b634"
        metalness={0.8}
        roughness={0.2}
        wireframe={true}
        emissive="#e8b634"
        emissiveIntensity={0.5}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}
