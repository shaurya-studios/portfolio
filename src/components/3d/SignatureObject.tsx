import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScenery } from '../../context/SceneryContext';

interface SignatureObjectProps {
  scrollProgress: number;
}

export default function SignatureObject({ scrollProgress }: SignatureObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const fragmentsRef = useRef<THREE.Group>(null);
  
  const { isConstructionMode } = useScenery();

  // Pointer tracking for parallax
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    // 1. Damped pointer tracking (subtle tilt)
    targetRotation.current.x = (state.pointer.y * Math.PI) * 0.1;
    targetRotation.current.y = (state.pointer.x * Math.PI) * 0.1;

    if (groupRef.current) {
      // Exponential damping for smooth, physical feeling rotation
      const lambda = 4.0;
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * (1 - Math.exp(-lambda * delta));
      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * (1 - Math.exp(-lambda * delta));
    }

    // 2. Continuous rotation & Scroll-based breaking apart
    if (coreRef.current && ring1Ref.current && ring2Ref.current && fragmentsRef.current) {
      const t = state.clock.elapsedTime;
      
      // Base rotation
      coreRef.current.rotation.y = t * 0.2;
      coreRef.current.rotation.x = t * 0.1;
      
      ring1Ref.current.rotation.z = t * 0.15;
      ring1Ref.current.rotation.x = Math.PI / 4;
      
      ring2Ref.current.rotation.y = -t * 0.1;
      ring2Ref.current.rotation.z = Math.PI / 3;

      // Scroll physics (Breaking apart)
      // When scrollProgress goes from 0 to 1, the fragments expand outward
      const expansion = 1 + (scrollProgress * 4);
      fragmentsRef.current.scale.setScalar(expansion);
      
      // Core gets slightly larger and changes orientation based on scroll
      coreRef.current.scale.setScalar(1 + scrollProgress * 0.5);
    }
  });

  const wireframe = isConstructionMode;
  const accentColor = "#5eead4";

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* CORE OBJECT: An engineered crystal/octahedron */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[2, 0]} />
        <meshPhysicalMaterial 
          color="#111111"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
          wireframe={wireframe}
          envMapIntensity={2.0}
          clearcoat={1.0}
        />
        {isConstructionMode && (
          <boxHelper args={[new THREE.Mesh(new THREE.OctahedronGeometry(2, 0))]} />
        )}
      </mesh>

      {/* INNER RING: Technical structure */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.2, 0.02, 16, 100]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} wireframe={wireframe} />
      </mesh>

      {/* OUTER RING */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[4.5, 0.01, 16, 100]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} wireframe={wireframe} />
      </mesh>

      {/* ORBITING FRAGMENTS: UIs, geometry, code panels */}
      <group ref={fragmentsRef}>
        {/* Project Node 1 */}
        <mesh position={[2.5, 1.5, 2]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#222" wireframe={wireframe} />
        </mesh>
        
        {/* Project Node 2 */}
        <mesh position={[-3, -1, 1]}>
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial color="#333" side={THREE.DoubleSide} wireframe={wireframe} />
        </mesh>
        
        {/* Floating tech lines */}
        <mesh position={[0, -3, 0]} rotation={[Math.PI/2, 0, 0]}>
          <ringGeometry args={[1.5, 1.55, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}
