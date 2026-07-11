import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

function GlassGeometry({ position, scale, rotationSpeed }: { position: [number, number, number], scale: number, rotationSpeed: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * rotationSpeed;
      mesh.current.rotation.y += delta * rotationSpeed * 1.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position} scale={scale}>
        {/* Icosahedron geometry gives a great icy block/crystal look */}
        <icosahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          anisotropicBlur={0.2}
          ior={1.5}
          chromaticAberration={0.04}
          distortion={0.5}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
          color="#e0f2fe"
          roughness={0.05}
        />
      </mesh>
    </Float>
  );
}

export default function IglooBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none" style={{ background: '#f8fafc' }}>
      <Canvas>
        <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={80} />
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
        <spotLight position={[-10, -10, -10]} intensity={2} color="#bae6fd" />
        
        {/* Abstract Ice Blocks */}
        <GlassGeometry position={[-4, 2, 0]} scale={2.5} rotationSpeed={0.1} />
        <GlassGeometry position={[5, -3, -2]} scale={3} rotationSpeed={0.08} />
        <GlassGeometry position={[-2, -4, -4]} scale={1.5} rotationSpeed={0.15} />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
