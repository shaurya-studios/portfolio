import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useScenery } from '../../context/SceneryContext';

export default function IslandTerrain() {
  const islandGroupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Group>(null);
  const antennaLightRef = useRef<THREE.PointLight>(null);
  const { timeOfDay } = useScenery();

  useFrame((state) => {
    // 1. Subtle Island Tilt / Floating Physics based on Mouse
    if (islandGroupRef.current) {
      const targetRotX = (state.pointer.y * Math.PI) / 30;
      const targetRotY = (state.pointer.x * Math.PI) / 25;

      islandGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        islandGroupRef.current.rotation.x,
        targetRotX,
        0.04
      );
      islandGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        islandGroupRef.current.rotation.y,
        targetRotY,
        0.04
      );
    }

    // 2. Kinetic Beacon Sculpture Rotation
    if (beaconRef.current) {
      beaconRef.current.rotation.y += 0.015;
      beaconRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }

    // 3. Blinking Tech Outpost Beacon Light
    if (antennaLightRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;
      antennaLightRef.current.intensity = timeOfDay === 'night' ? pulse * 2.5 : 0.5;
    }
  });

  const isNight = timeOfDay === 'night';

  return (
    <group ref={islandGroupRef} position={[0, -0.2, 0]}>
      {/* ===================================================
          1. ISLAND LANDMASS (Stepped Architectural Cliffs)
          =================================================== */}
      
      {/* Main Base Island Tier (Lower Plateau) */}
      <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 2.3, 1.2, 7]} />
        <meshStandardMaterial
          color={isNight ? '#141820' : '#dcd6cc'}
          roughness={0.7}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Sub-shore Reef Tiers */}
      <mesh position={[0, -1.3, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 1.2, 1.0, 6]} />
        <meshStandardMaterial
          color={isNight ? '#0b0f14' : '#c8c1b4'}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* Mid Terrace (Plateau for Sanctuary & Paths) */}
      <mesh position={[-0.2, 0.0, 0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.4, 0.6, 6]} />
        <meshStandardMaterial
          color={isNight ? '#1a1f28' : '#e6e1d8'}
          roughness={0.6}
          flatShading
        />
      </mesh>

      {/* High Cliff Outcrop (Elevated Ridge for Tech Outpost) */}
      <mesh position={[0.7, 0.5, -0.4]} rotation={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.9, 1.6]} />
        <meshStandardMaterial
          color={isNight ? '#171c24' : '#d5cfc5'}
          roughness={0.65}
          flatShading
        />
      </mesh>

      {/* ===================================================
          2. THE TECH OUTPOST (Modernist Cantilevered Lab)
          =================================================== */}
      <group position={[0.75, 1.15, -0.4]} rotation={[0, -0.2, 0]}>
        {/* Cantilevered Building Foundation */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.45, 0.8]} />
          <meshStandardMaterial
            color={isNight ? '#222834' : '#F7F5F0'}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* Panoramic Window Slot */}
        <mesh position={[0, 0.02, 0.41]}>
          <planeGeometry args={[1.0, 0.18]} />
          <meshStandardMaterial
            color={isNight ? '#e9d8a6' : '#0F1115'}
            emissive={isNight ? '#e9d8a6' : '#000000'}
            emissiveIntensity={isNight ? 1.8 : 0}
            roughness={0.1}
          />
        </mesh>

        {/* Back Tech Bay Glow */}
        <mesh position={[0, 0.02, -0.41]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.8, 0.15]} />
          <meshStandardMaterial
            color={isNight ? '#5eead4' : '#0F1115'}
            emissive={isNight ? '#5eead4' : '#000000'}
            emissiveIntensity={isNight ? 1.5 : 0}
          />
        </mesh>

        {/* Roof Architectural Deck */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[1.3, 0.05, 0.9]} />
          <meshStandardMaterial
            color={isNight ? '#0F1115' : '#2A2D35'}
            roughness={0.3}
          />
        </mesh>

        {/* Communications Mast / Antenna */}
        <mesh position={[0.4, 0.55, -0.2]}>
          <cylinderGeometry args={[0.015, 0.025, 0.6, 8]} />
          <meshStandardMaterial color="#8E929E" metalness={0.8} />
        </mesh>

        {/* Blinking Beacon Light Bulb */}
        <mesh position={[0.4, 0.88, -0.2]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={isNight ? '#e9d8a6' : '#C6B8A8'} />
        </mesh>
        <pointLight
          ref={antennaLightRef}
          position={[0.4, 0.95, -0.2]}
          color="#e9d8a6"
          distance={3}
          intensity={0.8}
        />
      </group>

      {/* ===================================================
          3. THE KINETIC BEACON / ARTIFACT SANCTUARY
          =================================================== */}
      <group position={[-0.8, 0.9, 0.4]}>
        {/* Stepped Pedestal Base */}
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <cylinderGeometry args={[0.45, 0.55, 0.2, 8]} />
          <meshStandardMaterial
            color={isNight ? '#1e242f' : '#e2ddd3'}
            roughness={0.4}
          />
        </mesh>

        {/* Floating Kinetic Sculpture */}
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
          <group ref={beaconRef}>
            {/* Outer Architectural Ring */}
            <mesh castShadow>
              <torusGeometry args={[0.32, 0.03, 16, 32]} />
              <meshStandardMaterial
                color={isNight ? '#e9d8a6' : '#C6B8A8'}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>

            {/* Inner Floating Monolith Core */}
            <mesh castShadow>
              <octahedronGeometry args={[0.18, 0]} />
              <meshStandardMaterial
                color={isNight ? '#e9d8a6' : '#0F1115'}
                emissive={isNight ? '#e9d8a6' : '#C6B8A8'}
                emissiveIntensity={isNight ? 1.6 : 0.3}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
          </group>
        </Float>
      </group>

      {/* ===================================================
          4. THE COASTAL HARBOR / PIER
          =================================================== */}
      <group position={[-0.4, -0.22, 1.8]} rotation={[0, 0.35, 0]}>
        {/* Pier Walkway extending into water */}
        <mesh position={[0, 0, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.08, 1.1]} />
          <meshStandardMaterial
            color={isNight ? '#25201b' : '#b8aba0'}
            roughness={0.8}
          />
        </mesh>

        {/* Pier Pilings / Wooden Supports */}
        <mesh position={[-0.18, -0.3, 0.7]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
          <meshStandardMaterial color="#3a342e" />
        </mesh>
        <mesh position={[0.18, -0.3, 0.7]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
          <meshStandardMaterial color="#3a342e" />
        </mesh>

        {/* Docking Light Bollard */}
        <mesh position={[0.18, 0.1, 0.85]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#0F1115" />
        </mesh>
        <mesh position={[0.18, 0.18, 0.85]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color={isNight ? '#5eead4' : '#e9d8a6'} />
        </mesh>
      </group>

      {/* ===================================================
          5. ARCHITECTURAL CYPRESS TREES & SCATTER
          =================================================== */}
      {[
        { pos: [-0.9, 0.45, -0.3], scale: 1.0 },
        { pos: [-1.2, 0.35, -0.1], scale: 0.8 },
        { pos: [-0.6, 0.38, -0.8], scale: 0.9 },
        { pos: [0.1, 0.35, 0.8], scale: 0.7 },
        { pos: [1.3, 0.7, 0.3], scale: 0.85 },
      ].map((tree, i) => (
        <group key={i} position={tree.pos as [number, number, number]} scale={tree.scale}>
          {/* Slender Minimalist Architectural Foliage Cone */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <coneGeometry args={[0.18, 0.7, 6]} />
            <meshStandardMaterial
              color={isNight ? '#0f221a' : '#7b8779'}
              roughness={0.8}
              flatShading
            />
          </mesh>
          {/* Trunk */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.15, 6]} />
            <meshStandardMaterial color="#4a443e" />
          </mesh>
        </group>
      ))}

      {/* Geometric Stepping Stones across the island plateau */}
      {[
        [-0.1, 0.32, 0.4],
        [0.15, 0.35, 0.3],
        [0.35, 0.45, 0.1],
        [0.55, 0.65, -0.1],
      ].map((p, i) => (
        <mesh key={`step-${i}`} position={p as [number, number, number]} receiveShadow>
          <boxGeometry args={[0.16, 0.04, 0.16]} />
          <meshStandardMaterial
            color={isNight ? '#2a313d' : '#d8d3c8'}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
