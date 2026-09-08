import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useScenery } from '../../context/SceneryContext';

export default function IslandTerrain() {
  const islandGroupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Group>(null);
  const antennaLightRef = useRef<THREE.PointLight>(null);
  const pierLightRef = useRef<THREE.PointLight>(null);
  const cliffLightRef = useRef<THREE.PointLight>(null);
  const { timeOfDay } = useScenery();

  // Interactive states
  const [hoveredZone, setHoveredZone] = useState<'outpost' | 'beacon' | 'pier' | null>(null);
  const [beaconSpeed, setBeaconSpeed] = useState(1.0);

  const isNight = timeOfDay === 'night';

  useFrame((state) => {
    // 1. Subtle Island Parallax Physics based on Pointer
    if (islandGroupRef.current) {
      const targetRotX = (state.pointer.y * Math.PI) / 28;
      const targetRotY = (state.pointer.x * Math.PI) / 24;

      islandGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        islandGroupRef.current.rotation.x,
        targetRotX,
        0.045
      );
      islandGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        islandGroupRef.current.rotation.y,
        targetRotY,
        0.045
      );
    }

    // 2. Kinetic Beacon Sculpture Dynamic Spin
    if (beaconRef.current) {
      const activeSpeed = hoveredZone === 'beacon' ? 0.05 * beaconSpeed : 0.016 * beaconSpeed;
      beaconRef.current.rotation.y += activeSpeed;
      beaconRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.9) * 0.18;
      
      // Decay beacon speed boost back to normal
      if (beaconSpeed > 1.0) {
        setBeaconSpeed((prev) => Math.max(1.0, prev - 0.02));
      }
    }

    // 3. Tech Outpost Blinking LED Beacon
    if (antennaLightRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.5 + 0.5;
      antennaLightRef.current.intensity = isNight ? pulse * 3.5 : 0.4;
    }

    // 4. Pier Docking Lights Pulse
    if (pierLightRef.current) {
      const pierPulse = Math.sin(state.clock.elapsedTime * 2.5 + 1.0) * 0.3 + 0.7;
      pierLightRef.current.intensity = isNight ? pierPulse * 2.8 : 0.2;
    }

    // 5. Cliff Grazing Uplight Pulse
    if (cliffLightRef.current) {
      cliffLightRef.current.intensity = isNight ? 2.0 : 0.1;
    }
  });

  return (
    <group ref={islandGroupRef} position={[0, -0.2, 0]}>
      
      {/* ===================================================
          1. ISLAND LANDMASS (Stepped Architectural Cliffs)
          =================================================== */}
      
      {/* Main Base Island Tier (Lower Plateau) */}
      <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 2.3, 1.2, 7]} />
        <meshStandardMaterial
          color={isNight ? '#12161f' : '#dcd6cc'}
          roughness={0.7}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Sub-shore Reef Tiers (visible through translucent water) */}
      <mesh position={[0, -1.3, 0]} receiveShadow>
        <cylinderGeometry args={[2.3, 1.2, 1.0, 6]} />
        <meshStandardMaterial
          color={isNight ? '#080d12' : '#c8c1b4'}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* Mid Terrace (Plateau for Sanctuary & Paths) */}
      <mesh position={[-0.2, 0.0, 0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.4, 0.6, 6]} />
        <meshStandardMaterial
          color={isNight ? '#181d26' : '#e6e1d8'}
          roughness={0.6}
          flatShading
        />
      </mesh>

      {/* High Cliff Outcrop (Elevated Ridge for Tech Outpost) */}
      <mesh position={[0.7, 0.5, -0.4]} rotation={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.9, 1.6]} />
        <meshStandardMaterial
          color={isNight ? '#151922' : '#d5cfc5'}
          roughness={0.65}
          flatShading
        />
      </mesh>

      {/* ===================================================
          2. THE TECH OUTPOST (Modernist Cantilevered Lab)
          =================================================== */}
      <group 
        position={[0.75, 1.15, -0.4]} 
        rotation={[0, -0.2, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredZone('outpost'); }}
        onPointerOut={() => setHoveredZone(null)}
      >
        {/* Cantilevered Building Foundation */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.45, 0.8]} />
          <meshStandardMaterial
            color={isNight ? (hoveredZone === 'outpost' ? '#2c3445' : '#1f2532') : '#F7F5F0'}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* Panoramic Window Slot (Front - Warm Amber Glow) */}
        <mesh position={[0, 0.02, 0.41]}>
          <planeGeometry args={[1.0, 0.18]} />
          <meshStandardMaterial
            color={isNight ? '#e9d8a6' : '#0F1115'}
            emissive={isNight ? '#e9d8a6' : '#000000'}
            emissiveIntensity={isNight ? 2.5 : 0}
            roughness={0.1}
          />
        </mesh>

        {/* Back Tech Bay Window (Cyan Neon Glow) */}
        <mesh position={[0, 0.02, -0.41]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.8, 0.15]} />
          <meshStandardMaterial
            color={isNight ? '#00f0ff' : '#0F1115'}
            emissive={isNight ? '#00f0ff' : '#000000'}
            emissiveIntensity={isNight ? 2.2 : 0}
          />
        </mesh>

        {/* Under-Cantilever Architectural LED Strip (Washes cliff in cyan) */}
        {isNight && (
          <mesh position={[0, -0.23, 0]}>
            <boxGeometry args={[1.15, 0.02, 0.75]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        )}
        <pointLight
          position={[0, -0.4, 0]}
          color="#00f0ff"
          distance={2.5}
          intensity={isNight ? 2.0 : 0}
        />

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

        {/* Dual Flashing Mast Warning LEDs */}
        <mesh position={[0.4, 0.88, -0.2]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={isNight ? '#ff3366' : '#C6B8A8'} />
        </mesh>
        <mesh position={[0.4, 0.70, -0.2]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={isNight ? '#00f0ff' : '#9A9EAB'} />
        </mesh>
        <pointLight
          ref={antennaLightRef}
          position={[0.4, 0.95, -0.2]}
          color="#ff3366"
          distance={4}
          intensity={0.8}
        />
      </group>

      {/* ===================================================
          3. THE KINETIC BEACON / ARTIFACT SANCTUARY
          =================================================== */}
      <group 
        position={[-0.8, 0.9, 0.4]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredZone('beacon'); }}
        onPointerOut={() => setHoveredZone(null)}
        onClick={() => setBeaconSpeed(3.5)}
      >
        {/* Stepped Pedestal Base */}
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <cylinderGeometry args={[0.45, 0.55, 0.2, 8]} />
          <meshStandardMaterial
            color={isNight ? '#1b202a' : '#e2ddd3'}
            roughness={0.4}
          />
        </mesh>

        {/* 4 Sanctuary Pedestal Uplight LEDs */}
        {isNight && (
          <>
            {[
              [0.32, -0.38, 0],
              [-0.32, -0.38, 0],
              [0, -0.38, 0.32],
              [0, -0.38, -0.32],
            ].map((p, idx) => (
              <group key={`sanctuary-led-${idx}`} position={p as [number, number, number]}>
                <mesh>
                  <sphereGeometry args={[0.035, 8, 8]} />
                  <meshBasicMaterial color="#e9d8a6" />
                </mesh>
              </group>
            ))}
            <pointLight position={[0, -0.2, 0]} color="#e9d8a6" distance={2.5} intensity={2.2} />
          </>
        )}

        {/* Floating Kinetic Sculpture */}
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
          <group ref={beaconRef}>
            {/* Outer Architectural Ring */}
            <mesh castShadow>
              <torusGeometry args={[0.34, 0.03, 16, 32]} />
              <meshStandardMaterial
                color={isNight ? '#e9d8a6' : '#C6B8A8'}
                emissive={isNight ? '#e9d8a6' : '#000000'}
                emissiveIntensity={isNight ? (hoveredZone === 'beacon' ? 1.5 : 0.6) : 0}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>

            {/* Inner Floating Monolith Core */}
            <mesh castShadow>
              <octahedronGeometry args={[0.2, 0]} />
              <meshStandardMaterial
                color={isNight ? '#00f0ff' : '#0F1115'}
                emissive={isNight ? '#00f0ff' : '#C6B8A8'}
                emissiveIntensity={isNight ? (hoveredZone === 'beacon' ? 3.0 : 1.8) : 0.3}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
          </group>
        </Float>
      </group>

      {/* ===================================================
          4. THE COASTAL HARBOR / PIER & RUNWAY LEDS
          =================================================== */}
      <group 
        position={[-0.4, -0.22, 1.8]} 
        rotation={[0, 0.35, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredZone('pier'); }}
        onPointerOut={() => setHoveredZone(null)}
      >
        {/* Pier Walkway extending into water */}
        <mesh position={[0, 0, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.08, 1.15]} />
          <meshStandardMaterial
            color={isNight ? '#221d18' : '#b8aba0'}
            roughness={0.8}
          />
        </mesh>

        {/* Pier Pilings */}
        <mesh position={[-0.19, -0.3, 0.7]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
          <meshStandardMaterial color="#3a342e" />
        </mesh>
        <mesh position={[0.19, -0.3, 0.7]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
          <meshStandardMaterial color="#3a342e" />
        </mesh>

        {/* Pier Edge Marine Runway LEDs (Left & Right Edge) */}
        {isNight && (
          <>
            {[0.0, 0.3, 0.6, 0.9].map((z, idx) => (
              <group key={`pier-led-${idx}`}>
                {/* Left LED */}
                <mesh position={[-0.22, 0.05, z]}>
                  <sphereGeometry args={[0.02, 8, 8]} />
                  <meshBasicMaterial color="#00f0ff" />
                </mesh>
                {/* Right LED */}
                <mesh position={[0.22, 0.05, z]}>
                  <sphereGeometry args={[0.02, 8, 8]} />
                  <meshBasicMaterial color="#00f0ff" />
                </mesh>
              </group>
            ))}
            <pointLight
              ref={pierLightRef}
              position={[0, 0.1, 0.8]}
              color="#00f0ff"
              distance={3.2}
              intensity={2.5}
            />
          </>
        )}

        {/* Docking Light Bollard */}
        <mesh position={[0.18, 0.1, 0.9]}>
          <cylinderGeometry args={[0.025, 0.025, 0.16, 8]} />
          <meshStandardMaterial color="#0F1115" />
        </mesh>
        <mesh position={[0.18, 0.20, 0.9]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color={isNight ? '#38ef7d' : '#e9d8a6'} />
        </mesh>
      </group>

      {/* ===================================================
          5. RUNWAY / PATHWAY LED STUDS ACROSS THE ISLAND
          =================================================== */}
      {isNight && (
        <group>
          {[
            // Path leading from pier to central terrace
            [-0.3, 0.05, 1.2, '#00f0ff'],
            [-0.2, 0.15, 0.8, '#00f0ff'],
            [-0.1, 0.28, 0.45, '#e9d8a6'],
            // Path around the kinetic sanctuary
            [-0.45, 0.32, 0.3, '#e9d8a6'],
            [-0.9, 0.32, 0.0, '#e9d8a6'],
            // Steps climbing up the cliff toward tech outpost
            [0.15, 0.35, 0.2, '#00f0ff'],
            [0.35, 0.50, 0.0, '#00f0ff'],
            [0.55, 0.70, -0.2, '#00f0ff'],
            [0.75, 0.95, -0.3, '#e9d8a6'],
          ].map((item, idx) => (
            <mesh key={`path-stud-${idx}`} position={[item[0] as number, item[1] as number, item[2] as number]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <meshBasicMaterial color={item[3] as string} />
            </mesh>
          ))}
        </group>
      )}

      {/* ===================================================
          6. CLIFF FACET GRAZING UPLIGHTS
          =================================================== */}
      {isNight && (
        <>
          <pointLight
            ref={cliffLightRef}
            position={[0.7, 0.1, -0.8]}
            color="#ffaa00"
            distance={3.5}
            intensity={2.2}
          />
          <pointLight
            position={[-1.2, -0.1, -0.5]}
            color="#00f0ff"
            distance={3.0}
            intensity={1.8}
          />
        </>
      )}

      {/* ===================================================
          7. UNDERWATER BIOLUMINESCENT REEF LEDS
          =================================================== */}
      {isNight && (
        <>
          <pointLight
            position={[-0.4, -0.6, 2.0]}
            color="#00f0ff"
            distance={4.0}
            intensity={3.0}
          />
          <pointLight
            position={[1.5, -0.6, 0.5]}
            color="#38ef7d"
            distance={3.5}
            intensity={2.0}
          />
        </>
      )}

      {/* ===================================================
          8. ARCHITECTURAL CYPRESS TREES & SCATTER
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
              color={isNight ? '#0a1d15' : '#7b8779'}
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

      {/* Geometric Stepping Stones */}
      {[
        [-0.1, 0.32, 0.4],
        [0.15, 0.35, 0.3],
        [0.35, 0.45, 0.1],
        [0.55, 0.65, -0.1],
      ].map((p, i) => (
        <mesh key={`step-${i}`} position={p as [number, number, number]} receiveShadow>
          <boxGeometry args={[0.16, 0.04, 0.16]} />
          <meshStandardMaterial
            color={isNight ? '#1e2531' : '#d8d3c8'}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
