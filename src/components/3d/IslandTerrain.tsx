import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useScenery } from '../../context/SceneryContext';

interface IslandTerrainProps {
  boatPosition?: THREE.Vector2;
}

export default function IslandTerrain({ boatPosition }: IslandTerrainProps) {
  const islandGroupRef = useRef<THREE.Group>(null);
  const outerGimbalRef = useRef<THREE.Group>(null);
  const innerGimbalRef = useRef<THREE.Group>(null);
  const crystalCoreRef = useRef<THREE.Mesh>(null);

  // Architectural Lighting Refs
  const mastLightRef = useRef<THREE.PointLight>(null);
  const villaInteriorLightRef = useRef<THREE.PointLight>(null);
  const pierLightRef = useRef<THREE.PointLight>(null);
  const underReefLight1Ref = useRef<THREE.PointLight>(null);
  const underReefLight2Ref = useRef<THREE.PointLight>(null);

  const { timeOfDay } = useScenery();
  const isNight = timeOfDay === 'night';

  // Interactive states
  const [hoveredZone, setHoveredZone] = useState<'villa' | 'sanctuary' | 'pier' | null>(null);
  const [sanctuarySpinBoost, setSanctuarySpinBoost] = useState(1.0);

  useFrame((state) => {
    // 1. Subtle Parallax Tilt from Pointer
    if (islandGroupRef.current) {
      const targetRotX = (state.pointer.y * Math.PI) / 40;
      const targetRotY = (state.pointer.x * Math.PI) / 35;

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

    // 2. Proximity boost from hydrofoil boat
    if (boatPosition) {
      const distToSanctuary = Math.hypot(boatPosition.x - (1.2 - 0.85), boatPosition.y - 0.35);
      if (distToSanctuary < 2.0 && sanctuarySpinBoost < 2.2) {
        setSanctuarySpinBoost(2.5);
      }
    }

    // 3. Kinetic Sanctuary Dual-Gimbal Mechanism
    const baseSpeed = hoveredZone === 'sanctuary' ? 0.04 : 0.018;
    const activeSpeed = baseSpeed * sanctuarySpinBoost;

    if (outerGimbalRef.current) {
      outerGimbalRef.current.rotation.y += activeSpeed;
      outerGimbalRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
    if (innerGimbalRef.current) {
      innerGimbalRef.current.rotation.x += activeSpeed * 1.4;
      innerGimbalRef.current.rotation.z += activeSpeed * 0.7;
    }
    if (crystalCoreRef.current) {
      crystalCoreRef.current.rotation.y -= activeSpeed * 2.0;
      const floatOffset = Math.sin(state.clock.elapsedTime * 2.0) * 0.03;
      crystalCoreRef.current.position.y = floatOffset;
    }

    // Decay spin boost smoothly back to 1.0
    if (sanctuarySpinBoost > 1.0) {
      setSanctuarySpinBoost((prev) => Math.max(1.0, prev - 0.012));
    }

    // 4. Roof Antenna Navigational Strobe
    if (mastLightRef.current) {
      const strobe = Math.sin(state.clock.elapsedTime * 4.0) > 0.4 ? 1.8 : 0.2;
      mastLightRef.current.intensity = isNight ? strobe : 0.2;
    }

    // 5. Villa Interior Studio Glow
    if (villaInteriorLightRef.current) {
      villaInteriorLightRef.current.intensity = isNight ? 2.2 : 0.3;
    }

    // 6. Harbor Pier Dock Light
    if (pierLightRef.current) {
      pierLightRef.current.intensity = isNight ? 1.6 : 0.15;
    }

    // 7. Submerged Benthic Reef Lights
    if (underReefLight1Ref.current && underReefLight2Ref.current) {
      const reefTarget = isNight ? 2.4 : 0.0;
      underReefLight1Ref.current.intensity = THREE.MathUtils.lerp(
        underReefLight1Ref.current.intensity,
        reefTarget,
        0.05
      );
      underReefLight2Ref.current.intensity = THREE.MathUtils.lerp(
        underReefLight2Ref.current.intensity,
        reefTarget,
        0.05
      );
    }
  });

  return (
    <group ref={islandGroupRef} position={[1.2, -0.25, 0]}>
      
      {/* ===================================================
          1. SUBMERGED REEF & BENTHIC UNDERWATER LIGHTING
          =================================================== */}
      {/* Sunken Reef Bottom Plinth */}
      <mesh position={[0, -1.15, 0]} receiveShadow>
        <cylinderGeometry args={[2.9, 2.1, 0.9, 36]} />
        <meshStandardMaterial
          color={isNight ? '#0a1017' : '#9ca3af'}
          roughness={0.9}
        />
      </mesh>

      {/* Intermediate Submerged Terraces */}
      <mesh position={[0.2, -0.75, -0.1]} receiveShadow>
        <cylinderGeometry args={[2.7, 2.85, 0.45, 36]} />
        <meshStandardMaterial
          color={isNight ? '#101722' : '#b7b1a5'}
          roughness={0.8}
        />
      </mesh>

      {/* Underwater Benthic Uplights (Illuminates water from underneath at night) */}
      <pointLight
        ref={underReefLight1Ref}
        position={[-1.2, -0.6, 0.8]}
        color="#06b6d4"
        distance={4.5}
        intensity={0}
      />
      <pointLight
        ref={underReefLight2Ref}
        position={[1.1, -0.6, -0.6]}
        color="#0284c7"
        distance={4.5}
        intensity={0}
      />

      {/* ===================================================
          2. MAIN ARCHITECTURAL BEDROCK (The Quiet Luxury Plinth)
          =================================================== */}
      {/* Primary Island Base */}
      <mesh position={[0, -0.38, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.45, 2.65, 0.55, 36]} />
        <meshStandardMaterial
          color={isNight ? '#151b24' : '#dfd9ce'}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Living Terrace Plateau */}
      <mesh position={[-0.08, 0.04, 0.08]} castShadow receiveShadow>
        <cylinderGeometry args={[2.05, 2.35, 0.42, 36]} />
        <meshStandardMaterial
          color={isNight ? '#1c2330' : '#ece7de'}
          roughness={0.55}
        />
      </mesh>

      {/* Villa Foundation Ridge */}
      <mesh position={[0.72, 0.38, -0.32]} castShadow receiveShadow>
        <boxGeometry args={[1.55, 0.52, 1.45]} />
        <meshStandardMaterial
          color={isNight ? '#1e2634' : '#ded8cc'}
          roughness={0.5}
        />
      </mesh>

      {/* ===================================================
          3. MODERNIST CANTILEVER VILLA (Creative Outpost)
          =================================================== */}
      <group
        position={[0.75, 0.88, -0.32]}
        rotation={[0, -0.16, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredZone('villa');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredZone(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Main Floating Concrete Slab */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.32, 0.44, 0.88]} />
          <meshStandardMaterial
            color={isNight ? (hoveredZone === 'villa' ? '#252e3e' : '#1a202c') : '#F7F5F0'}
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>

        {/* Smoked Architectural Panoramic Glass (Front Ocean View) */}
        <mesh position={[0, 0.02, 0.45]}>
          <planeGeometry args={[1.12, 0.26]} />
          <meshStandardMaterial
            color={isNight ? '#fef08a' : '#111827'}
            emissive={isNight ? '#fef08a' : '#000000'}
            emissiveIntensity={isNight ? 2.0 : 0}
            roughness={0.1}
            metalness={0.4}
          />
        </mesh>

        {/* Courtyard Window (Subtle Data Cyan Glow) */}
        <mesh position={[0, 0.02, -0.45]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.92, 0.22]} />
          <meshStandardMaterial
            color={isNight ? '#38bdf8' : '#111827'}
            emissive={isNight ? '#38bdf8' : '#000000'}
            emissiveIntensity={isNight ? 1.6 : 0}
          />
        </mesh>

        {/* Architectural Cantilever Roof Slab */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[1.44, 0.06, 1.02]} />
          <meshStandardMaterial
            color={isNight ? '#0F1115' : '#2A2D35'}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Recessed Linear Under-Roof LED Strips (Night Mode) */}
        {isNight && (
          <mesh position={[0, 0.21, 0.48]}>
            <boxGeometry args={[1.38, 0.015, 0.02]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        )}

        {/* Warm Studio Interior Spotlight */}
        <pointLight
          ref={villaInteriorLightRef}
          position={[0, 0.08, 0.32]}
          color="#fef3c7"
          distance={3.2}
          intensity={0.3}
        />

        {/* Rooftop Telecommunications Mast */}
        <mesh position={[0.45, 0.54, -0.22]}>
          <cylinderGeometry args={[0.014, 0.022, 0.6, 8]} />
          <meshStandardMaterial color="#8E929E" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Navigational Amber Strobe Beacon */}
        <mesh position={[0.45, 0.86, -0.22]}>
          <sphereGeometry args={[0.038, 16, 16]} />
          <meshBasicMaterial color={isNight ? '#f59e0b' : '#C6B8A8'} />
        </mesh>
        <pointLight
          ref={mastLightRef}
          position={[0.45, 0.92, -0.22]}
          color="#f59e0b"
          distance={3.5}
          intensity={0.4}
        />
      </group>

      {/* ===================================================
          4. THE KINETIC SANCTUARY (Floating Monument)
          =================================================== */}
      <group
        position={[-0.85, 0.78, 0.35]}
        onClick={(e) => {
          e.stopPropagation();
          setSanctuarySpinBoost(3.2);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredZone('sanctuary');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredZone(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Sculpted Stone Plinth */}
        <mesh position={[0, -0.46, 0]} receiveShadow>
          <cylinderGeometry args={[0.46, 0.56, 0.22, 28]} />
          <meshStandardMaterial
            color={isNight ? '#1f2735' : '#e6e1d8'}
            roughness={0.4}
          />
        </mesh>

        {/* Dual Concentric Gimbal Mechanism */}
        <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.3}>
          <group>
            {/* Outer Gimbal Ring (Champagne Gold) */}
            <group ref={outerGimbalRef}>
              <mesh castShadow>
                <torusGeometry args={[0.36, 0.024, 16, 36]} />
                <meshStandardMaterial
                  color={isNight ? '#e9d8a6' : '#C6B8A8'}
                  emissive={isNight ? '#e9d8a6' : '#000000'}
                  emissiveIntensity={isNight ? 0.9 : 0}
                  metalness={0.95}
                  roughness={0.15}
                />
              </mesh>
            </group>

            {/* Inner Gimbal Ring (Dark Titanium) */}
            <group ref={innerGimbalRef}>
              <mesh castShadow>
                <torusGeometry args={[0.26, 0.018, 16, 32]} />
                <meshStandardMaterial
                  color={isNight ? '#38bdf8' : '#2A2D35'}
                  emissive={isNight ? '#38bdf8' : '#000000'}
                  emissiveIntensity={isNight ? 0.8 : 0}
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            </group>

            {/* Central Levitating Prismatic Crystal Core */}
            <mesh ref={crystalCoreRef} castShadow>
              <octahedronGeometry args={[0.16, 0]} />
              <meshStandardMaterial
                color={isNight ? '#38bdf8' : '#0F1115'}
                emissive={isNight ? '#38bdf8' : '#C6B8A8'}
                emissiveIntensity={
                  isNight ? (hoveredZone === 'sanctuary' ? 2.6 : 1.4) : 0.25
                }
                roughness={0.1}
                metalness={0.85}
              />
            </mesh>
          </group>
        </Float>
      </group>

      {/* ===================================================
          5. THE HARBOR PIER & TIMBER BOARDWALK
          =================================================== */}
      <group
        position={[-0.32, -0.22, 1.82]}
        rotation={[0, 0.28, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredZone('pier');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredZone(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Main Teak Boardwalk Deck */}
        <mesh position={[0, 0, 0.45]} castShadow receiveShadow>
          <boxGeometry args={[0.46, 0.065, 1.25]} />
          <meshStandardMaterial
            color={isNight ? '#251e18' : '#b2a394'}
            roughness={0.75}
          />
        </mesh>

        {/* Pier Edge Running LED Strip (Night Mode) */}
        {isNight && (
          <>
            <mesh position={[-0.23, 0.035, 0.45]}>
              <boxGeometry args={[0.012, 0.012, 1.25]} />
              <meshBasicMaterial color="#e9d8a6" />
            </mesh>
            <mesh position={[0.23, 0.035, 0.45]}>
              <boxGeometry args={[0.012, 0.012, 1.25]} />
              <meshBasicMaterial color="#e9d8a6" />
            </mesh>
          </>
        )}

        {/* Teak Pilings anchored into the seabed */}
        <mesh position={[-0.18, -0.26, 0.8]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.5, 8]} />
          <meshStandardMaterial color="#362d25" />
        </mesh>
        <mesh position={[0.18, -0.26, 0.8]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.5, 8]} />
          <meshStandardMaterial color="#362d25" />
        </mesh>

        {/* Brass Mooring Bollard & Lantern Post */}
        <mesh position={[0.18, 0.09, 0.98]}>
          <cylinderGeometry args={[0.022, 0.022, 0.14, 8]} />
          <meshStandardMaterial color="#0F1115" metalness={0.8} />
        </mesh>
        <mesh position={[0.18, 0.17, 0.98]}>
          <sphereGeometry args={[0.032, 14, 14]} />
          <meshBasicMaterial color={isNight ? '#fde68a' : '#e9d8a6'} />
        </mesh>
        <pointLight
          ref={pierLightRef}
          position={[0.18, 0.22, 0.98]}
          color="#fde68a"
          distance={2.5}
          intensity={0.15}
        />
      </group>

      {/* ===================================================
          6. ARCHITECTURAL PATHWAY LEDS (Night Mode)
          =================================================== */}
      {isNight && (
        <group>
          {[
            [-0.26, 0.08, 1.3],
            [-0.18, 0.16, 0.9],
            [-0.1, 0.26, 0.5],
            [0.16, 0.3, 0.3],
            [0.36, 0.44, 0.1],
            [0.56, 0.6, -0.1],
            [0.2, 0.42, -0.6],
            [-0.4, 0.38, -0.4],
          ].map((pos, idx) => (
            <mesh key={`path-led-${idx}`} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshBasicMaterial color="#fde68a" />
            </mesh>
          ))}
        </group>
      )}

      {/* ===================================================
          7. SLENDER ARCHITECTURAL CYPRESS & FLORA
          =================================================== */}
      {[
        { pos: [-0.9, 0.48, -0.32], scale: 1.05 },
        { pos: [-1.2, 0.38, -0.05], scale: 0.85 },
        { pos: [-0.58, 0.4, -0.8], scale: 0.95 },
        { pos: [0.14, 0.34, 0.78], scale: 0.75 },
        { pos: [1.4, 0.58, 0.28], scale: 0.85 },
      ].map((tree, i) => (
        <group key={`cypress-tree-${i}`} position={tree.pos as [number, number, number]} scale={tree.scale}>
          {/* Slender Minimalist Canopy */}
          <mesh position={[0, 0.38, 0]} castShadow>
            <coneGeometry args={[0.17, 0.74, 8]} />
            <meshStandardMaterial
              color={isNight ? '#0a1a12' : '#687467'}
              roughness={0.8}
            />
          </mesh>
          {/* Trunk */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.026, 0.038, 0.14, 6]} />
            <meshStandardMaterial color="#3e362f" />
          </mesh>
        </group>
      ))}

      {/* ===================================================
          8. SLATE STEPPING STONES
          =================================================== */}
      {[
        [-0.1, 0.25, 0.42],
        [0.14, 0.29, 0.27],
        [0.34, 0.4, 0.07],
        [0.54, 0.54, -0.1],
      ].map((p, i) => (
        <mesh key={`stepping-stone-${i}`} position={p as [number, number, number]} receiveShadow>
          <boxGeometry args={[0.16, 0.035, 0.16]} />
          <meshStandardMaterial
            color={isNight ? '#1e2430' : '#d5cfc5'}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* ===================================================
          9. MOORED NAVIGATIONAL BUOYS (In the Surrounding Sea)
          =================================================== */}
      {/* Buoy Alpha (Editify Studios Sector) */}
      <group position={[-2.8, -0.22, 1.8]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.26, 12]} />
          <meshStandardMaterial color={isNight ? '#111827' : '#e5e7eb'} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Buoy Beta (ThumbPilot Sector) */}
      <group position={[3.2, -0.22, -1.6]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.26, 12]} />
          <meshStandardMaterial color={isNight ? '#111827' : '#e5e7eb'} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>
    </group>
  );
}
