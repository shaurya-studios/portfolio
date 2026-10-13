import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createWovenFabricTexture } from '../../utils/fabricTextures';

interface WoolFabricSculptureProps {
  scrollProgress: number;
}

export default function WoolFabricSculpture({ scrollProgress }: WoolFabricSculptureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const clothMeshRef = useRef<THREE.Mesh>(null);
  const potliRef = useRef<THREE.Group>(null);

  // Generate procedural woven bump texture
  const bumpTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createWovenFabricTexture();
  }, []);

  // Construct a clean, sculpted 3D folded cloth mesh with organic drapery folds
  const { clothGeometry, borderGeometry } = useMemo(() => {
    const width = 7.5;
    const height = 5.2;
    const segmentsX = 96;
    const segmentsY = 72;

    const geo = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
    const pos = geo.attributes.position;

    // Displace vertices to create elegant, sculpted cloth drapery & natural folds
    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) / width) + 0.5;
      const v = (pos.getY(i) / height) + 0.5;

      // Primary gentle billow / fold
      const fold1 = Math.sin(u * Math.PI * 1.5) * 0.95;
      // Secondary diagonal soft crease
      const fold2 = Math.cos(v * Math.PI * 2.0 + u * 1.2) * 0.45;
      // Edge curl / drapery lift
      const edgeCurl = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.35;
      // Subtle micro-wrinkles
      const wrinkle = Math.sin(u * 14.0 + v * 8.0) * 0.04;

      const z = fold1 + fold2 + edgeCurl + wrinkle;
      pos.setZ(i, z);
    }

    geo.computeVertexNormals();

    // Stitched perimeter border line
    const borderPoints: THREE.Vector3[] = [];
    const step = 4;
    // Top edge
    for (let x = 0; x <= segmentsX; x += step) {
      const idx = x;
      borderPoints.push(new THREE.Vector3(pos.getX(idx), pos.getY(idx), pos.getZ(idx) + 0.02));
    }
    // Right edge
    for (let y = 0; y <= segmentsY; y += step) {
      const idx = y * (segmentsX + 1) + segmentsX;
      borderPoints.push(new THREE.Vector3(pos.getX(idx), pos.getY(idx), pos.getZ(idx) + 0.02));
    }
    // Bottom edge
    for (let x = segmentsX; x >= 0; x -= step) {
      const idx = segmentsY * (segmentsX + 1) + x;
      borderPoints.push(new THREE.Vector3(pos.getX(idx), pos.getY(idx), pos.getZ(idx) + 0.02));
    }
    // Left edge
    for (let y = segmentsY; y >= 0; y -= step) {
      const idx = y * (segmentsX + 1);
      borderPoints.push(new THREE.Vector3(pos.getX(idx), pos.getY(idx), pos.getZ(idx) + 0.02));
    }

    const borderCurve = new THREE.CatmullRomCurve3(borderPoints, true);
    const borderTube = new THREE.TubeGeometry(borderCurve, 128, 0.025, 6, true);

    return { clothGeometry: geo, borderGeometry: borderTube };
  }, []);

  // Traditional Indian Potli Button (cloth-wrapped spherical knot with gold zari coils & tassel)
  const potliGeometry = useMemo(() => {
    // Spherical cloth ball
    const ball = new THREE.SphereGeometry(0.32, 24, 24);
    // Gold zari neck ring
    const neck = new THREE.TorusGeometry(0.18, 0.04, 12, 24);
    // Tassel strands
    const tasselCurves: THREE.CatmullRomCurve3[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const pts = [
        new THREE.Vector3(Math.cos(angle) * 0.08, -0.28, Math.sin(angle) * 0.08),
        new THREE.Vector3(Math.cos(angle) * 0.15, -0.65, Math.sin(angle) * 0.15),
        new THREE.Vector3(Math.cos(angle) * 0.22, -1.05, Math.sin(angle) * 0.22),
      ];
      tasselCurves.push(new THREE.CatmullRomCurve3(pts));
    }
    return { ball, neck, tasselCurves };
  }, []);

  // Parallax target rotation
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    // 1. Damped cursor tracking for tangible, weighted 3D presence
    targetRotation.current.x = (state.pointer.y * Math.PI) * 0.12;
    targetRotation.current.y = (state.pointer.x * Math.PI) * 0.15;

    if (groupRef.current) {
      const lambda = 4.5;
      // 2. Continuous organic breathing motion + scroll unfolding
      const t = state.clock.elapsedTime;
      const scrollRotY = scrollProgress * Math.PI * 0.8;
      const scrollPosZ = -scrollProgress * 2.5;

      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * (1 - Math.exp(-lambda * delta));
      groupRef.current.rotation.y += ((targetRotation.current.y + scrollRotY) - groupRef.current.rotation.y) * (1 - Math.exp(-lambda * delta));
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.15;
      groupRef.current.position.z = scrollPosZ;
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.03 + (scrollProgress * 0.2);

      // Subtle dynamic fold wave
      if (clothMeshRef.current) {
        clothMeshRef.current.rotation.x = Math.sin(t * 0.8) * 0.02;
      }

      // Potli button gentle dangling reaction
      if (potliRef.current) {
        potliRef.current.rotation.z = Math.sin(t * 1.2) * 0.06;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 
        MAIN 3D SCULPTED CLOTH MESH 
        Rich Indian Royal Crimson Wool & Raw Silk with velvet microfiber sheen
      */}
      <mesh ref={clothMeshRef} geometry={clothGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#881337" // Royal Sindoor Crimson
          roughness={0.72} // Soft tactile wool texture
          metalness={0.08}
          sheen={1.0} // Physical fabric sheen model
          sheenColor={new THREE.Color('#fde68a')} // Warm golden microfiber peach-fuzz
          sheenRoughness={0.4}
          clearcoat={0.15}
          bumpMap={bumpTexture || undefined}
          bumpScale={0.035}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* STITCHED GOLD ZARI BORDER LINE */}
      <mesh geometry={borderGeometry}>
        <meshPhysicalMaterial 
          color="#f59e0b" // Antique Zari Gold
          metalness={0.65}
          roughness={0.25}
          clearcoat={0.8}
        />
      </mesh>

      {/* TRADITIONAL INDIAN POTLI BUTTON (PINNED ON FABRIC CREASE) */}
      <group ref={potliRef} position={[1.4, 0.6, 0.95]} rotation={[0.2, 0.3, 0]}>
        {/* Cloth Button Knot */}
        <mesh geometry={potliGeometry.ball} castShadow>
          <meshPhysicalMaterial 
            color="#991b1b"
            roughness={0.65}
            sheen={1.0}
            sheenColor={new THREE.Color('#fcd34d')}
            bumpMap={bumpTexture || undefined}
            bumpScale={0.03}
          />
        </mesh>
        
        {/* Coiled Gold Zari Neck */}
        <mesh geometry={potliGeometry.neck} position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial 
            color="#fbbf24"
            metalness={0.85}
            roughness={0.18}
            clearcoat={1.0}
          />
        </mesh>

        {/* Loose Hanging Silk Tassel Strands */}
        {potliGeometry.tasselCurves.map((curve, idx) => (
          <mesh key={idx}>
            <tubeGeometry args={[curve, 24, 0.012, 6, false]} />
            <meshPhysicalMaterial 
              color={idx % 2 === 0 ? '#f59e0b' : '#b91c1c'}
              roughness={0.3}
              metalness={0.4}
              clearcoat={0.9}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
