import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useScenery } from '../../context/SceneryContext';

export default function IslandTerrain() {
  const islandGroupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Group>(null);
  const antennaLightRef = useRef<THREE.PointLight>(null);
  const villaInteriorLightRef = useRef<THREE.PointLight>(null);
  const pierLightRef = useRef<THREE.PointLight>(null);
  const { timeOfDay } = useScenery();

  // Interactive states
  const [hoveredZone, setHoveredZone] = useState<'villa' | 'sanctuary' | 'pier' | null>(null);
  const [beaconBoost, setBeaconBoost] = useState(1.0);

  const isNight = timeOfDay === 'night';

  useFrame((state) => {
    // 1. Gentle Parallax Tilt from Pointer
    if (islandGroupRef.current) {
      const targetRotX = (state.pointer.y * Math.PI) / 35;
      const targetRotY = (state.pointer.x * Math.PI) / 30;

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

    // 2. Kinetic Sanctuary Orbit
    if (beaconRef.current) {
      const speed = (hoveredZone === 'sanctuary' ? 0.035 : 0.015) * beaconBoost;
      beaconRef.current.rotation.y += speed;
      beaconRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.12;

      // Decay speed boost
      if (beaconBoost > 1.0) {
        setBeaconBoost((prev) => Math.max(1.0, prev - 0.015));
      }
    }

    // 3. Delicate Mast Beacon Blink
    if (antennaLightRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;
      antennaLightRef.current.intensity = isNight ? pulse * 1.5 : 0.3;
    }

    // 4. Warm Interior Light
    if (villaInteriorLightRef.current) {
      villaInteriorLightRef.current.intensity = isNight ? 1.6 : 0.2;
    }

    // 5. Pier Dock Light
    if (pierLightRef.current) {
      pierLightRef.current.intensity = isNight ? 1.2 : 0.1;
    }
  });

  return (
    <group ref={islandGroupRef} position={[1.2, -0.25, 0]}>
      
      {/* ===================================================
          1. ARCHITECTURAL CONTOURED STONE LANDMASS
          =================================================== */}
      
      {/* Submerged Reef Base (Visible through clear water) */}
      <mesh position={[0, -1.1, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 1.8, 1.0, 32]} />
        <meshStandardMaterial
          color={isNight ? '#0b1118' : '#b8afa2'}
          roughness={0.9}
        />
      </mesh>

      {/* Main Terraced Bedrock (Beveled, smooth architectural stone) */}
      <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.55, 2.7, 0.7, 32]} />
        <meshStandardMaterial
          color={isNight ? '#161c26' : '#ded9cf'}
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Mid Terrace (Living Plateau) */}
      <mesh position={[-0.1, 0.0, 0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[2.1, 2.45, 0.45, 32]} />
        <meshStandardMaterial
          color={isNight ? '#1b222e' : '#eae5dc'}
          roughness={0.6}
        />
      </mesh>

      {/* Elevated Ridge (Foundational plinth for modernist pavilion) */}
      <mesh position={[0.7, 0.35, -0.35]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 1.4]} />
        <meshStandardMaterial
          color={isNight ? '#1e2634' : '#dfd9ce'}
          roughness={0.55}
        />
      </mesh>

      {/* ===================================================
          2. MODERNIST ARCHITECTURAL PAVILION (Tech Outpost)
          =================================================== */}
      <group 
        position={[0.75, 0.85, -0.35]} 
        rotation={[0, -0.15, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredZone('villa'); }}
        onPointerOut={() => setHoveredZone(null)}
      >
        {/* Cantilevered Living Pavilion (Crisp Architectural Form) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.42, 0.85]} />
          <meshStandardMaterial
            color={isNight ? (hoveredZone === 'villa' ? '#262f3f' : '#1e2430') : '#F7F5F0'}
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>

        {/* Panoramic Recessed Glass Facade (Front) */}
        <mesh position={[0, 0.01, 0.43]}>
          <planeGeometry args={[1.05, 0.24]} />
          <meshStandardMaterial
            color={isNight ? '#fde68a' : '#111827'}
            emissive={isNight ? '#fde68a' : '#000000'}
            emissiveIntensity={isNight ? 1.8 : 0}
            roughness={0.1}
            metalness={0.3}
          />
        </mesh>

        {/* Rear Courtyard Glass (Subtle Cyan Data Glow) */}
        <mesh position={[0, 0.01, -0.43]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.85, 0.2]} />
          <meshStandardMaterial
            color={isNight ? '#38bdf8' : '#111827'}
            emissive={isNight ? '#38bdf8' : '#000000'}
            emissiveIntensity={isNight ? 1.4 : 0}
          />
        </mesh>

        {/* Architectural Roof Slab */}
        <mesh position={[0, 0.24, 0]} castShadow>
          <boxGeometry args={[1.35, 0.05, 0.95]} />
          <meshStandardMaterial
            color={isNight ? '#0F1115' : '#2A2D35'}
            roughness={0.3}
          />
        </mesh>

        {/* Soft Interior Warm Light */}
        <pointLight
          ref={villaInteriorLightRef}
          position={[0, 0.05, 0.3]}
          color="#ffedd5"
          distance={2.8}
          intensity={0.2}
        />

        {/* Minimalist Roof Communications Mast */}
        <mesh position={[0.42, 0.52, -0.2]}>
          <cylinderGeometry args={[0.012, 0.02, 0.55, 8]} />
          <meshStandardMaterial color="#8E929E" metalness={0.8} />
        </mesh>

        {/* Delicate Amber Status Pin-Light at Top */}
        <mesh position={[0.42, 0.82, -0.2]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={isNight ? '#f59e0b' : '#C6B8A8'} />
        </mesh>
        <pointLight
          ref={antennaLightRef}
          position={[0.42, 0.88, -0.2]}
          color="#f59e0b"
          distance={3}
          intensity={0.4}
        />
      </group>

      {/* ===================================================
          3. THE KINETIC SANCTUARY (Floating Museum Sculpture)
          =================================================== */}
      <group 
        position={[-0.8, 0.75, 0.35]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredZone('sanctuary'); }}
        onPointerOut={() => setHoveredZone(null)}
        onClick={() => setBeaconBoost(2.8)}
      >
        {/* Sculpted Stone Pedestal */}
        <mesh position={[0, -0.45, 0]} receiveShadow>
          <cylinderGeometry args={[0.42, 0.52, 0.18, 24]} />
          <meshStandardMaterial
            color={isNight ? '#1e2532' : '#e4dfd6'}
            roughness={0.4}
          />
        </mesh>

        {/* Floating Kinetic Sculpture */}
        <Float speed={2} rotationIntensity={0.25} floatIntensity={0.35}>
          <group ref={beaconRef}>
            {/* Outer Gimbal Ring in Champagne Gold */}
            <mesh castShadow>
              <torusGeometry args={[0.32, 0.022, 16, 32]} />
              <meshStandardMaterial
                color={isNight ? '#e9d8a6' : '#C6B8A8'}
                emissive={isNight ? '#e9d8a6' : '#000000'}
                emissiveIntensity={isNight ? 0.8 : 0}
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>

            {/* Inner Floating Prismatic Diamond */}
            <mesh castShadow>
              <octahedronGeometry args={[0.16, 0]} />
              <meshStandardMaterial
                color={isNight ? '#38bdf8' : '#0F1115'}
                emissive={isNight ? '#38bdf8' : '#C6B8A8'}
                emissiveIntensity={isNight ? (hoveredZone === 'sanctuary' ? 2.2 : 1.2) : 0.2}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
          </group>
        </Float>
      </group>

      {/* ===================================================
          4. THE HARBOR PIER & TIMBER BOARDWALK
          =================================================== */}
      <group 
        position={[-0.35, -0.22, 1.85]} 
        rotation={[0, 0.28, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredZone('pier'); }}
        onPointerOut={() => setHoveredZone(null)}
      >
        {/* Wooden Boardwalk extending gracefully into water */}
        <mesh position={[0, 0, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.06, 1.15]} />
          <meshStandardMaterial
            color={isNight ? '#241e18' : '#b3a598'}
            roughness={0.75}
          />
        </mesh>

        {/* Teak Pilings */}
        <mesh position={[-0.16, -0.25, 0.7]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
          <meshStandardMaterial color="#3a322a" />
        </mesh>
        <mesh position={[0.16, -0.25, 0.7]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
          <meshStandardMaterial color="#3a322a" />
        </mesh>

        {/* Mooring Bollard with Warm Lantern */}
        <mesh position={[0.15, 0.08, 0.85]}>
          <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
          <meshStandardMaterial color="#0F1115" />
        </mesh>
        <mesh position={[0.15, 0.15, 0.85]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color={isNight ? '#fde68a' : '#e9d8a6'} />
        </mesh>
        <pointLight
          ref={pierLightRef}
          position={[0.15, 0.2, 0.85]}
          color="#fde68a"
          distance={2.2}
          intensity={0.1}
        />
      </group>

      {/* ===================================================
          5. SUBTLE ARCHITECTURAL PATHWAY LEDS (Night Mode)
          =================================================== */}
      {isNight && (
        <group>
          {[
            [-0.25, 0.06, 1.25],
            [-0.18, 0.14, 0.85],
            [-0.1, 0.24, 0.45],
            [0.15, 0.28, 0.25],
            [0.35, 0.42, 0.05],
            [0.55, 0.58, -0.15],
          ].map((pos, idx) => (
            <mesh key={`path-pin-${idx}`} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#e9d8a6" />
            </mesh>
          ))}
        </group>
      )}

      {/* ===================================================
          6. SLENDER ARCHITECTURAL CYPRESS TREES
          =================================================== */}
      {[
        { pos: [-0.85, 0.45, -0.3], scale: 1.0 },
        { pos: [-1.15, 0.35, -0.05], scale: 0.8 },
        { pos: [-0.55, 0.38, -0.75], scale: 0.9 },
        { pos: [0.12, 0.32, 0.75], scale: 0.7 },
        { pos: [1.35, 0.55, 0.25], scale: 0.8 },
      ].map((tree, i) => (
        <group key={`cypress-${i}`} position={tree.pos as [number, number, number]} scale={tree.scale}>
          {/* Slender Minimalist Foliage Cone */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <coneGeometry args={[0.16, 0.68, 8]} />
            <meshStandardMaterial
              color={isNight ? '#0b1b13' : '#6f7a6e'}
              roughness={0.75}
            />
          </mesh>
          {/* Trunk */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.025, 0.035, 0.12, 6]} />
            <meshStandardMaterial color="#443c35" />
          </mesh>
        </group>
      ))}

      {/* Stepping Stones to the Villa */}
      {[
        [-0.1, 0.24, 0.4],
        [0.12, 0.27, 0.25],
        [0.32, 0.38, 0.05],
        [0.52, 0.52, -0.12],
      ].map((p, i) => (
        <mesh key={`step-${i}`} position={p as [number, number, number]} receiveShadow>
          <boxGeometry args={[0.15, 0.03, 0.15]} />
          <meshStandardMaterial
            color={isNight ? '#1e2430' : '#d5cfc5'}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
