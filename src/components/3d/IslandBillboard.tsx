import { useMemo } from 'react';
import * as THREE from 'three';
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

  // Generate razor-sharp 1024x512 procedural billboard texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    // 1. Sleek Deep Onyx Carbon Background
    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, 1024, 512);

    // 2. Subtle architectural telemetry grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 40; x < 1024; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 40; y < 512; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // 3. Glowing Outer Neon Border & Corner Accents
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, 1000, 488);

    // Corner brackets
    ctx.lineWidth = 14;
    const bracket = 36;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(12, 12 + bracket);
    ctx.lineTo(12, 12);
    ctx.lineTo(12 + bracket, 12);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(1012 - bracket, 12);
    ctx.lineTo(1012, 12);
    ctx.lineTo(1012, 12 + bracket);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(12, 500 - bracket);
    ctx.lineTo(12, 500);
    ctx.lineTo(12 + bracket, 500);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(1012 - bracket, 500);
    ctx.lineTo(1012, 500);
    ctx.lineTo(1012, 500 - bracket);
    ctx.stroke();

    // 4. Sector Tag Header Strip
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(48, 48, 928, 54);
    ctx.fillStyle = accentColor;
    ctx.fillRect(48, 48, 6, 54);

    // Active status dot
    ctx.beginPath();
    ctx.arc(80, 75, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();

    ctx.font = '600 24px "JetBrains Mono", monospace';
    ctx.fillStyle = accentColor;
    ctx.fillText(tag.toUpperCase(), 105, 83);

    // 5. High-Impact Big Display Title
    ctx.font = '900 64px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(title.toUpperCase(), 48, 195);

    // 6. Descriptive Subtitle
    ctx.font = '500 28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(subtitle.toUpperCase(), 48, 250);

    // 7. Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, 290);
    ctx.lineTo(976, 290);
    ctx.stroke();

    // 8. Large, Highly Visible Call-To-Action Pill Button
    const btnX = 48;
    const btnY = 330;
    const btnW = 928;
    const btnH = 120;

    // Button Background
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 24);
    ctx.fill();

    // Button Text
    ctx.font = '900 40px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#080a0f';
    ctx.textAlign = 'center';
    ctx.fillText(`⚓ ${actionText.toUpperCase()}  [ PRESS ENTER ↵ ]`, btnX + btnW / 2, btnY + 74);
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
      {/* 1. Brushed Titanium Monolith Outer Frame */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.08, 1.16, 0.1]} />
        <meshStandardMaterial color="#0b0e14" metalness={0.9} roughness={0.18} />
      </mesh>

      {/* 2. Beveled Backplate Panel */}
      <mesh position={[0, 0.72, -0.055]} receiveShadow>
        <boxGeometry args={[2.04, 1.12, 0.02]} />
        <meshStandardMaterial color="#121620" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* 3. Glowing Digital Display Screen (Front) */}
      <mesh position={[0, 0.72, 0.052]}>
        <planeGeometry args={[1.96, 1.04]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={isNight ? 0.85 : 0.42}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>

      {/* 4. Display Screen (Back) for 360 Open Sea Visibility */}
      <mesh position={[0, 0.72, -0.067]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.96, 1.04]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={isNight ? 0.85 : 0.42}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>

      {/* 5. Overhead Hooded Architectural Luminaire Bar */}
      <mesh position={[0, 1.34, 0.04]} castShadow>
        <boxGeometry args={[2.08, 0.06, 0.16]} />
        <meshStandardMaterial color="#0b0e14" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Hood Underside Emissive Strip */}
      <mesh position={[0, 1.305, 0.07]}>
        <boxGeometry args={[1.96, 0.015, 0.05]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* 6. Heavy Industrial Pylons Anchored in Island Bedrock */}
      {[-0.78, 0.78].map((px, i) => (
        <group key={`pylon-${i}`} position={[px, 0, 0]}>
          {/* Main Steel Column */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.042, 0.055, 0.72, 16]} />
            <meshStandardMaterial color="#1a202c" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Hydraulic Collar */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
            <meshStandardMaterial color="#2d3748" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Ground Footing Foundation Stone */}
          <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.08, 0.22]} />
            <meshStandardMaterial color="#222834" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
