import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, Float } from '@react-three/drei';
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
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh ref={mesh} scale={scale}>
        {/* Icosahedron gives a very high-end crystal/gem look */}
        <icosahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={3}
          chromaticAberration={0.025}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.0}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#0284c7"
          color="#0ea5e9"
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function IglooBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#ffffff]">
      {/* Subtle radial gradient to give the stark white some depth */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #e4e4e7 100%)'
        }}
      />
      
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <spotLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />
        
        <GlassGeometry position={[-4, 2, 0]} scale={1.5} rotationSpeed={0.2} />
        <GlassGeometry position={[5, -3, -2]} scale={2} rotationSpeed={0.15} />
        <GlassGeometry position={[0, -5, -4]} scale={1} rotationSpeed={0.3} />
        <GlassGeometry position={[4, 4, -5]} scale={1.2} rotationSpeed={0.25} />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
