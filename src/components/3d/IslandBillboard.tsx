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

    // 1. Transparent Digital Glass Background
    ctx.clearRect(0, 0, 1200, 600);
    
    // Slight dark tint for readability
    ctx.fillStyle = 'rgba(5, 8, 15, 0.55)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 1180, 580, 32);
    ctx.fill();

    // 2. High-tech HUD Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 60; x < 1200; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x, 590);
      ctx.stroke();
    }
    for (let y = 60; y < 600; y += 60) {
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(1190, y);
      ctx.stroke();
    }

    // 3. Glowing LED Border & Corner Accents
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 540);

    // Tech corners
    ctx.lineWidth = 12;
    const bracket = 50;
    const offset = 30;
    
    // Top-left
    ctx.beginPath(); ctx.moveTo(offset, offset + bracket); ctx.lineTo(offset, offset); ctx.lineTo(offset + bracket, offset); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(1200 - offset - bracket, offset); ctx.lineTo(1200 - offset, offset); ctx.lineTo(1200 - offset, offset + bracket); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(offset, 600 - offset - bracket); ctx.lineTo(offset, 600 - offset); ctx.lineTo(offset + bracket, 600 - offset); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(1200 - offset - bracket, 600 - offset); ctx.lineTo(1200 - offset, 600 - offset); ctx.lineTo(1200 - offset, 600 - offset - bracket); ctx.stroke();

    // 4. Header Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(80, 70, 1040, 60);
    ctx.fillStyle = accentColor;
    ctx.fillRect(80, 70, 8, 60);

    // Active Pulse Dot
    ctx.beginPath();
    ctx.arc(120, 100, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();

    ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.fillStyle = accentColor;
    ctx.fillText(tag.toUpperCase(), 150, 110);

    // 5. Main Typography - Crisp & Bold
    ctx.font = '900 76px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText(title.toUpperCase(), 80, 240);
    ctx.shadowBlur = 0; // reset

    // 6. Subtitle
    ctx.font = '500 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(subtitle.toUpperCase(), 80, 310);

    // 7. Precision Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 360);
    ctx.lineTo(1120, 360);
    ctx.stroke();

    // 8. Call to Action Action Bar
    const btnX = 80;
    const btnY = 410;
    const btnW = 1040;
    const btnH = 120;

    // Button Glow/Backing
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 20);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Button Text
    ctx.font = '800 44px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#05070a'; // ultra dark text for contrast
    ctx.textAlign = 'center';
    ctx.fillText(`\u2192 ${actionText.toUpperCase()}  [ PRESS ENTER \u23CE ]`, btnX + btnW / 2, btnY + 76);
    ctx.textAlign = 'left';

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
