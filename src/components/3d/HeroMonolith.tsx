import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

export default function HeroMonolith() {
  const tiltGroupRef = useRef<THREE.Group>(null);
  const spinGroupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const currentSpeed = useRef(0.005);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (!tiltGroupRef.current || !spinGroupRef.current) return;

    // 1. Interactive Mouse Tilt (Lerped)
    const targetTiltX = (mouse.current.x * Math.PI) / 10;
    const targetTiltY = (mouse.current.y * Math.PI) / 10;

    tiltGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      tiltGroupRef.current.rotation.y,
      targetTiltX,
      0.05
    );
    tiltGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      tiltGroupRef.current.rotation.x,
      -targetTiltY,
      0.05
    );

    // 2. Continuous Spin with Proximity Slowdown
    const distFromCenter = Math.sqrt(mouse.current.x ** 2 + mouse.current.y ** 2);
    const targetSpeed = distFromCenter < 0.4 ? 0.0006 : 0.0045;
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, 0.05);
    spinGroupRef.current.rotation.y += currentSpeed.current;

    // 3. Scroll reaction: sinks and rotates gracefully down the page
    const scroll = scrollYProgress.get();
    tiltGroupRef.current.position.y = THREE.MathUtils.lerp(
      tiltGroupRef.current.position.y,
      -scroll * 12,
      0.08
    );
    tiltGroupRef.current.position.z = THREE.MathUtils.lerp(
      tiltGroupRef.current.position.z,
      -scroll * 5,
      0.08
    );
  });

  return (
    <group ref={tiltGroupRef} position={[0, 0, 0]}>
      <group ref={spinGroupRef}>
        <Float speed={2} rotationIntensity={0.25} floatIntensity={0.9}>
          <RoundedBox args={[2.5, 4.4, 1.4]} radius={0.16} smoothness={4}>
            <meshStandardMaterial
              color="#eab308"
              roughness={0.14}
              metalness={0.95}
              envMapIntensity={2.2}
            />
          </RoundedBox>
        </Float>
      </group>
    </group>
  );
}
