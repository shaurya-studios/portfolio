import { useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTransform, useSpring, MotionValue } from 'framer-motion';
import { useTexture, useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';

interface ProjectPlaneProps {
  videoSrc?: string;
  imageSrc?: string;
  scrollProgress: MotionValue<number>;
}

function TextureMaterial({ videoSrc, imageSrc }: { videoSrc?: string; imageSrc?: string }) {
  // If we have a video, load it (must be muted, playsInline, loop)
  const videoTex = videoSrc ? useVideoTexture(videoSrc, { muted: true, loop: true, playsInline: true }) : null;
  const imgTex = imageSrc && !videoSrc ? useTexture(imageSrc) : null;
  
  const map = videoTex || imgTex;

  return (
    <meshPhysicalMaterial 
      map={map}
      color={map ? '#ffffff' : '#0a0a0a'}
      metalness={0.4}
      roughness={0.2}
      clearcoat={1}
      emissive={map ? '#ffffff' : '#000000'}
      emissiveIntensity={0.2}
      wireframe={!map} // fallback to wireframe if no texture provided
    />
  );
}

export default function ProjectPlane({ videoSrc, imageSrc, scrollProgress }: ProjectPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Tie rotation to scroll progress from parent (0 = entering, 0.5 = center, 1 = leaving)
  const rotXRaw = useTransform(scrollProgress, [0, 0.5, 1], [Math.PI / 4, 0, -Math.PI / 4]);
  const rotYRaw = useTransform(scrollProgress, [0, 0.5, 1], [-Math.PI / 8, 0, Math.PI / 8]);
  const zPosRaw = useTransform(scrollProgress, [0, 0.5, 1], [-5, 2, -5]);

  // Use springs to add physics and snap
  const springConfig = { damping: 20, stiffness: 100, mass: 1 };
  const rotX = useSpring(rotXRaw, springConfig);
  const rotY = useSpring(rotYRaw, springConfig);
  const zPos = useSpring(zPosRaw, springConfig);

  // Pre-allocate vector to prevent memory leaks in the render loop
  const targetScaleVec = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!meshRef.current) return;
    
    // Base animation
    meshRef.current.rotation.x = rotX.get();
    meshRef.current.rotation.y = rotY.get();
    meshRef.current.position.z = zPos.get();
    
    // Hover scale effect
    const targetScale = hovered ? 1.05 : 1.0;
    targetScaleVec.current.setScalar(targetScale);
    meshRef.current.scale.lerp(targetScaleVec.current, 0.1);
  });

  return (
    <mesh 
      ref={meshRef} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[16, 9, 32, 32]} />
      <Suspense fallback={
        <meshPhysicalMaterial color="#050505" wireframe />
      }>
        <TextureMaterial videoSrc={videoSrc} imageSrc={imageSrc} />
      </Suspense>
    </mesh>
  );
}
