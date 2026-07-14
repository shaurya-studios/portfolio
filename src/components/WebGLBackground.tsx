import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
  const count = 3000;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { mouse, viewport } = useThree();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Generate random positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10 - 5;
      const speed = Math.random() * 0.02 + 0.01;
      const factor = Math.random() * 100;
      temp.push({ x, y, z, speed, factor });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    // Smooth mouse position for physics
    const targetX = (mouse.x * viewport.width) / 2;
    const targetY = (mouse.y * viewport.height) / 2;
    
    particles.forEach((particle, i) => {
      let { x, y, z, speed, factor } = particle;

      // Subtle ambient motion
      const t = factor + state.clock.elapsedTime * speed;
      x += Math.cos(t) * 0.01;
      y += Math.sin(t) * 0.01;

      // Cursor interaction (repulsion)
      const dx = x - targetX;
      const dy = y - targetY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 2) {
        const force = (2 - dist) * 0.02;
        x += (dx / dist) * force;
        y += (dy / dist) * force;
      }

      // Update particle state
      particle.x = x;
      particle.y = y;

      // Set matrix
      dummy.position.set(x, y, z);
      const scale = Math.max(0.1, Math.sin(t) * 0.5 + 0.5);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current!.instanceMatrix.needsUpdate = true;
    
    // Slowly rotate the entire field
    mesh.current!.rotation.y = state.clock.elapsedTime * 0.02;
    mesh.current!.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.015, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
    </instancedMesh>
  );
}

export default function WebGLBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#05050a] z-0" />
      <div className="absolute inset-0 bg-grid z-0 opacity-30" />
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} className="z-10">
        <fog attach="fog" args={['#000000', 3, 10]} />
        <Particles />
      </Canvas>
      {/* Vignette overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, #000000 100%)' }} />
    </div>
  );
}
