import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useScenery } from '../../context/SceneryContext';
import { playTactileClick } from '../../utils/audioHaptics';

interface IslandBillboardProps {
  title: string;
  subtitle: string;
  tag: string;
  actionText: string;
  accentColor: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
}

export default function IslandBillboard({
  title,
  subtitle,
  tag,
  actionText,
  accentColor,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
}: IslandBillboardProps) {
  const { timeOfDay } = useScenery();
  const isNight = timeOfDay === 'night';
  const groupRef = useRef<THREE.Group>(null);

  // Floating bob animation for the hologram
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  // Generate ultra-crisp transparent digital HUD canvas
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    // 1. Fully Transparent Background
    ctx.clearRect(0, 0, 1200, 600);

    // 2. Main Typography - Crisp & Bold
    ctx.font = '900 95px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    // Hard shadow for readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.textAlign = 'center';
    ctx.fillText(title.toUpperCase(), 600, 220);

    // 3. Subtitle
    ctx.font = '500 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(subtitle.toUpperCase(), 600, 290);
    
    // Reset shadow for button
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // 4. Elegant Pill Button
    const btnW = 800;
    const btnH = 100;
    const btnX = 600 - (btnW / 2);
    const btnY = 380;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 50);
    ctx.fill();

    // Button Text
    ctx.font = '700 34px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#000000'; 
    ctx.textAlign = 'center';
    ctx.fillText(`${actionText.toUpperCase()}  \u2192`, 600, btnY + 62);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, [title, subtitle, tag, actionText, accentColor]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        playTactileClick();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 
        Ultra-sleek double-sided floating holographic screen.
        Completely transparent background, glowing emissive mapping, no bulky metal frame blocking the view.
      */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[3.0, 1.5]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={isNight ? 1.6 : 0.7}
          transparent={true}
          opacity={0.95}
          side={THREE.DoubleSide}
          roughness={0.1}
          metalness={0.5}
          depthWrite={false}
        />
      </mesh>

      {/* Futuristic Hologram Projector Bases (No big pillars blocking view) */}
      {[-1.2, 1.2].map((px, i) => (
        <group key={`projector-${i}`} position={[px, -0.75, 0]}>
          {/* Base Plate */}
          <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.2, 0.04, 16]} />
            <meshStandardMaterial color="#0b0e14" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Emissive Up-light lens */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
            <meshBasicMaterial color={accentColor} />
            <pointLight color={accentColor} intensity={isNight ? 0.4 : 0.1} distance={2} />
          </mesh>
          {/* Laser beam connecting projector to screen */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.7, 8]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
