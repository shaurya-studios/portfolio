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
  const anemometerRef = useRef<THREE.Group>(null);
  const lighthouseBeaconRef = useRef<THREE.Group>(null);

  // Lighting Refs
  const mastLightRef = useRef<THREE.PointLight>(null);
  const villaInteriorLightRef = useRef<THREE.PointLight>(null);
  const pierLightRef = useRef<THREE.PointLight>(null);
  const poolLightRef = useRef<THREE.PointLight>(null);
  const lighthouseLightRef = useRef<THREE.PointLight>(null);
  const underReefLight1Ref = useRef<THREE.PointLight>(null);
  const underReefLight2Ref = useRef<THREE.PointLight>(null);

  const { timeOfDay } = useScenery();
  const isNight = timeOfDay === 'night';

  const [hoveredZone, setHoveredZone] = useState<'villa' | 'sanctuary' | 'pier' | null>(null);
  const [sanctuarySpinBoost, setSanctuarySpinBoost] = useState(1.0);

  useFrame((state) => {
    // 1. Subtle Parallax Tilt from Pointer
    if (islandGroupRef.current) {
      const targetRotX = (state.pointer.y * Math.PI) / 50;
      const targetRotY = (state.pointer.x * Math.PI) / 45;

      islandGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        islandGroupRef.current.rotation.x,
        targetRotX,
        0.03
      );
      islandGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        islandGroupRef.current.rotation.y,
        targetRotY,
        0.03
      );
    }

    // 2. Proximity boost from hydrofoil boat
    if (boatPosition) {
      const distToBeaconAtoll = Math.hypot(boatPosition.x - (-4.5), boatPosition.y - (-2.5));
      if (distToBeaconAtoll < 3.2 && sanctuarySpinBoost < 2.5) {
        setSanctuarySpinBoost(2.8);
      }
    }

    // 3. Kinetic Sanctuary Dual-Gimbal Mechanism (on Beacon Atoll)
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

    if (sanctuarySpinBoost > 1.0) {
      setSanctuarySpinBoost((prev) => Math.max(1.0, prev - 0.012));
    }

    // 4. Coastal Lighthouse Revolving Light Beam
    if (lighthouseBeaconRef.current) {
      lighthouseBeaconRef.current.rotation.y += 0.025;
    }

    // 5. Rooftop Wind Anemometer Spin
    if (anemometerRef.current) {
      anemometerRef.current.rotation.y += 0.08;
    }

    // 6. Lights
    if (mastLightRef.current) {
      const strobe = Math.sin(state.clock.elapsedTime * 4.0) > 0.4 ? 2.0 : 0.2;
      mastLightRef.current.intensity = isNight ? strobe : 0.2;
    }

    if (villaInteriorLightRef.current) {
      villaInteriorLightRef.current.intensity = isNight ? 2.4 : 0.4;
    }

    if (pierLightRef.current) {
      pierLightRef.current.intensity = isNight ? 1.8 : 0.2;
    }

    if (poolLightRef.current) {
      poolLightRef.current.intensity = isNight ? 1.4 : 0.3;
    }

    if (lighthouseLightRef.current) {
      lighthouseLightRef.current.intensity = isNight ? 2.5 : 0.2;
    }

    if (underReefLight1Ref.current && underReefLight2Ref.current) {
      const reefTarget = isNight ? 2.2 : 0.0;
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
    <group ref={islandGroupRef}>
      
      {/* ===================================================================
          1. MAIN STUDIO VILLA ISLAND (Located at x = 2.2, z = 0.0)
          =================================================================== */}
      <group position={[2.2, -0.25, 0]}>
        
        {/* Submerged Reef Outer Base */}
        <mesh position={[0, -1.15, 0]} receiveShadow>
          <cylinderGeometry args={[2.95, 2.2, 0.9, 36]} />
          <meshStandardMaterial color={isNight ? '#0a1017' : '#9ca3af'} roughness={0.9} />
        </mesh>

        {/* Submerged Benthic Uplights */}
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

        {/* Main Island Foundation (Warm Alabaster Stone / Onyx Night) */}
        <mesh position={[0, -0.38, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.55, 2.75, 0.55, 36]} />
          <meshStandardMaterial
            color={isNight ? '#151b24' : '#dfd9ce'}
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>

        {/* Living Terrace Plateau */}
        <mesh position={[-0.08, 0.04, 0.08]} castShadow receiveShadow>
          <cylinderGeometry args={[2.15, 2.45, 0.42, 36]} />
          <meshStandardMaterial color={isNight ? '#1c2330' : '#ece7de'} roughness={0.6} />
        </mesh>

        {/* Natural Multi-Faceted Coastal Boulders along Waterline */}
        {[
          { pos: [-2.1, -0.15, 1.2], scale: [0.35, 0.25, 0.32], rot: [0.2, 0.5, 0.1] },
          { pos: [-2.3, -0.18, 0.4], scale: [0.28, 0.22, 0.3], rot: [-0.1, 0.8, 0.2] },
          { pos: [-1.8, -0.16, -1.6], scale: [0.42, 0.3, 0.38], rot: [0.3, -0.4, 0.1] },
          { pos: [0.4, -0.18, -2.4], scale: [0.38, 0.26, 0.34], rot: [-0.2, 0.3, -0.1] },
          { pos: [1.8, -0.15, -1.8], scale: [0.45, 0.32, 0.4], rot: [0.1, 0.7, -0.2] },
          { pos: [2.3, -0.17, -0.2], scale: [0.35, 0.24, 0.32], rot: [-0.3, 0.2, 0.4] },
          { pos: [2.1, -0.16, 1.1], scale: [0.32, 0.22, 0.3], rot: [0.2, -0.5, 0.1] },
        ].map((boulder, i) => (
          <mesh
            key={`boulder-${i}`}
            position={boulder.pos as [number, number, number]}
            scale={boulder.scale as [number, number, number]}
            rotation={boulder.rot as [number, number, number]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={isNight ? '#141a24' : '#b3aba0'} roughness={0.85} />
          </mesh>
        ))}

        {/* Villa Foundation Plinth */}
        <mesh position={[0.75, 0.38, -0.32]} castShadow receiveShadow>
          <boxGeometry args={[1.65, 0.52, 1.55]} />
          <meshStandardMaterial color={isNight ? '#1e2634' : '#ded8cc'} roughness={0.5} />
        </mesh>

        {/* --- MODERNIST CREATIVE STUDIO VILLA --- */}
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
          {/* Main Floor Slab */}
          <mesh position={[0, -0.18, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.42, 0.08, 0.98]} />
            <meshStandardMaterial
              color={isNight ? '#161c26' : '#F7F5F0'}
              roughness={0.25}
              metalness={0.2}
            />
          </mesh>

          {/* Cantilever Roof Slab */}
          <mesh position={[0, 0.26, 0]} castShadow>
            <boxGeometry args={[1.52, 0.06, 1.08]} />
            <meshStandardMaterial
              color={isNight ? '#0F1115' : '#2A2D35'}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>

          {/* Slatted Cedar Roof Pergola Louvers */}
          {[-0.45, -0.25, -0.05, 0.15, 0.35].map((lx, i) => (
            <mesh key={`pergola-${i}`} position={[lx, 0.3, 0.35]}>
              <boxGeometry args={[0.03, 0.02, 0.45]} />
              <meshStandardMaterial color={isNight ? '#3a2b1d' : '#8d6d4c'} roughness={0.7} />
            </mesh>
          ))}

          {/* Recessed Linear Under-Roof LED Strips (Night Mode) */}
          {isNight && (
            <mesh position={[0, 0.22, 0.5]}>
              <boxGeometry args={[1.46, 0.015, 0.02]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          )}

          {/* Panoramic Glass Walls */}
          <mesh position={[0, 0.04, 0.45]}>
            <planeGeometry args={[1.24, 0.36]} />
            <meshPhysicalMaterial
              color={isNight ? '#fef08a' : '#38bdf8'}
              transmission={0.88}
              opacity={0.9}
              transparent
              roughness={0.05}
              emissive={isNight ? '#fef08a' : '#000000'}
              emissiveIntensity={isNight ? 1.6 : 0}
            />
          </mesh>

          {/* Glass Mullions */}
          {[-0.6, -0.2, 0.2, 0.6].map((mx, i) => (
            <mesh key={`mullion-${i}`} position={[mx, 0.04, 0.46]}>
              <boxGeometry args={[0.018, 0.36, 0.015]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
          ))}

          {/* Rear Courtyard Glass */}
          <mesh position={[0, 0.04, -0.45]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.15, 0.36]} />
            <meshPhysicalMaterial
              color={isNight ? '#38bdf8' : '#e5e7eb'}
              transmission={0.85}
              opacity={0.85}
              transparent
              roughness={0.08}
              emissive={isNight ? '#38bdf8' : '#000000'}
              emissiveIntensity={isNight ? 1.2 : 0}
            />
          </mesh>

          {/* --- INTERIOR STUDIO --- */}
          {/* Executive Walnut Desk */}
          <mesh position={[0.05, -0.06, 0.1]}>
            <boxGeometry args={[0.5, 0.025, 0.22]} />
            <meshStandardMaterial color="#4a3b32" roughness={0.6} />
          </mesh>
          <mesh position={[-0.18, -0.12, 0.1]}>
            <boxGeometry args={[0.02, 0.1, 0.18]} />
            <meshStandardMaterial color="#1f242e" metalness={0.9} />
          </mesh>
          <mesh position={[0.28, -0.12, 0.1]}>
            <boxGeometry args={[0.02, 0.1, 0.18]} />
            <meshStandardMaterial color="#1f242e" metalness={0.9} />
          </mesh>

          {/* Curved Studio Display Monitor */}
          <mesh position={[0.05, 0.02, 0.12]} rotation={[0, -0.05, 0]}>
            <boxGeometry args={[0.26, 0.11, 0.012]} />
            <meshStandardMaterial color="#1a1e24" metalness={0.8} />
          </mesh>
          <mesh position={[0.05, 0.02, 0.128]} rotation={[0, -0.05, 0]}>
            <planeGeometry args={[0.24, 0.095]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0.05, -0.04, 0.11]}>
            <cylinderGeometry args={[0.008, 0.008, 0.04, 6]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.95} />
          </mesh>

          {/* Designer Task Chair */}
          <mesh position={[0.05, -0.06, -0.05]}>
            <boxGeometry args={[0.12, 0.02, 0.12]} />
            <meshStandardMaterial color="#1f242e" />
          </mesh>
          <mesh position={[0.05, 0.01, -0.1]}>
            <boxGeometry args={[0.12, 0.12, 0.02]} />
            <meshStandardMaterial color="#1f242e" />
          </mesh>

          {/* Indoor Potted Monstera Plant */}
          <group position={[-0.45, -0.08, 0.15]}>
            <mesh>
              <cylinderGeometry args={[0.07, 0.05, 0.12, 12]} />
              <meshStandardMaterial color="#f3f4f6" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#15803d" roughness={0.7} />
            </mesh>
            <mesh position={[0.04, 0.16, 0.02]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#22c55e" roughness={0.7} />
            </mesh>
          </group>

          {/* Interior Warm Spotlight */}
          <pointLight
            ref={villaInteriorLightRef}
            position={[0, 0.12, 0.15]}
            color="#fef3c7"
            distance={3.2}
            intensity={0.4}
          />

          {/* --- OUTDOOR LIVING TERRACE & INFINITY SPLASH POOL --- */}
          <group position={[-0.6, -0.22, 0.42]}>
            <mesh position={[0, 0, 0]} receiveShadow>
              <boxGeometry args={[0.42, 0.04, 0.32]} />
              <meshStandardMaterial color={isNight ? '#161e2b' : '#ded9cf'} />
            </mesh>
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.36, 0.26]} />
              <meshPhysicalMaterial
                color="#06b6d4"
                transmission={0.8}
                opacity={0.9}
                transparent
                roughness={0.1}
              />
            </mesh>
            <pointLight
              ref={poolLightRef}
              position={[0, 0.01, 0]}
              color="#38bdf8"
              distance={1.5}
              intensity={0.3}
            />
          </group>

          {/* Minimalist Teak Sun Loungers */}
          <group position={[0.42, -0.16, 0.58]} rotation={[0, -0.1, 0]}>
            <mesh position={[-0.1, 0, 0]} castShadow>
              <boxGeometry args={[0.14, 0.02, 0.28]} />
              <meshStandardMaterial color="#8d6d4c" />
            </mesh>
            <mesh position={[-0.1, 0.015, 0]}>
              <boxGeometry args={[0.13, 0.015, 0.26]} />
              <meshStandardMaterial color="#fafaf9" />
            </mesh>
            <mesh position={[0.1, 0, 0]} castShadow>
              <boxGeometry args={[0.14, 0.02, 0.28]} />
              <meshStandardMaterial color="#8d6d4c" />
            </mesh>
            <mesh position={[0.1, 0.015, 0]}>
              <boxGeometry args={[0.13, 0.015, 0.26]} />
              <meshStandardMaterial color="#fafaf9" />
            </mesh>
          </group>

          {/* Solar Panels & Weather Station */}
          <group position={[-0.25, 0.32, -0.15]} rotation={[-0.35, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.38, 0.012, 0.24]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.36, 0.22]} />
              <meshBasicMaterial color="#1e3a8a" />
            </mesh>
          </group>

          <mesh position={[0.5, 0.58, -0.22]}>
            <cylinderGeometry args={[0.014, 0.022, 0.65, 8]} />
            <meshStandardMaterial color="#8E929E" metalness={0.9} roughness={0.15} />
          </mesh>

          <group ref={anemometerRef} position={[0.5, 0.9, -0.22]}>
            <mesh>
              <cylinderGeometry args={[0.008, 0.008, 0.04, 6]} />
              <meshStandardMaterial color="#d1d5db" metalness={0.9} />
            </mesh>
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
              <group key={`cup-${i}`} rotation={[0, angle, 0]}>
                <mesh position={[0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.002, 0.002, 0.07, 4]} />
                  <meshStandardMaterial color="#d1d5db" metalness={0.9} />
                </mesh>
                <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <coneGeometry args={[0.012, 0.018, 6]} />
                  <meshStandardMaterial color="#E9D8A6" metalness={0.9} />
                </mesh>
              </group>
            ))}
          </group>

          <mesh position={[0.5, 0.94, -0.22]}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color={isNight ? '#f59e0b' : '#C6B8A8'} />
          </mesh>
          <pointLight
            ref={mastLightRef}
            position={[0.5, 0.98, -0.22]}
            color="#f59e0b"
            distance={3.5}
            intensity={0.4}
          />
        </group>

        {/* --- AUTHENTIC TIMBER HARBOR PIER & MARINA --- */}
        <group
          position={[-0.8, -0.22, 2.6]}
          rotation={[0, 0.12, 0]}
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
          <mesh position={[0, 0, 0.5]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.07, 1.8]} />
            <meshStandardMaterial color={isNight ? '#251e18' : '#b2a394'} roughness={0.75} />
          </mesh>

          {isNight && (
            <>
              <mesh position={[-0.27, 0.04, 0.5]}>
                <boxGeometry args={[0.012, 0.012, 1.8]} />
                <meshBasicMaterial color="#e9d8a6" />
              </mesh>
              <mesh position={[0.27, 0.04, 0.5]}>
                <boxGeometry args={[0.012, 0.012, 1.8]} />
                <meshBasicMaterial color="#e9d8a6" />
              </mesh>
            </>
          )}

          {[
            [-0.22, -0.3, -0.2],
            [0.22, -0.3, -0.2],
            [-0.22, -0.3, 0.5],
            [0.22, -0.3, 0.5],
            [-0.22, -0.3, 1.2],
            [0.22, -0.3, 1.2],
          ].map((pos, idx) => (
            <group key={`piling-${idx}`} position={pos as [number, number, number]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.035, 0.04, 0.65, 8]} />
                <meshStandardMaterial color="#362d25" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.15, 0]}>
                <cylinderGeometry args={[0.038, 0.038, 0.04, 8]} />
                <meshStandardMaterial color="#856a4b" roughness={0.9} />
              </mesh>
            </group>
          ))}

          {[-0.22, 0.22].map((cx, i) => (
            <mesh key={`cleat-${i}`} position={[cx, 0.045, 1.1]}>
              <boxGeometry args={[0.04, 0.015, 0.08]} />
              <meshStandardMaterial color="#0F1115" metalness={0.9} />
            </mesh>
          ))}

          <group position={[-0.25, 0.22, 0.9]}>
            <mesh>
              <cylinderGeometry args={[0.012, 0.012, 0.4, 6]} />
              <meshStandardMaterial color="#362d25" />
            </mesh>
            <mesh position={[0, 0.08, 0.02]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.08, 0.022, 12, 24]} />
              <meshStandardMaterial color="#ef4444" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.08, 0.02]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.082, 0.024, 12, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>
          </group>

          <group position={[0.22, 0.15, 1.35]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.025, 0.24, 8]} />
              <meshStandardMaterial color="#0F1115" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.035, 0.025, 0.06, 8]} />
              <meshBasicMaterial color={isNight ? '#fde68a' : '#e9d8a6'} />
            </mesh>
            <pointLight
              ref={pierLightRef}
              position={[0, 0.2, 0]}
              color="#fde68a"
              distance={2.8}
              intensity={0.2}
            />
          </group>
        </group>

        {/* --- ARCHITECTURAL CYPRESS & PINES --- */}
        {[
          { pos: [-0.9, 0.48, -0.32], scale: 1.05 },
          { pos: [-1.2, 0.38, -0.05], scale: 0.85 },
          { pos: [-0.58, 0.4, -0.8], scale: 0.95 },
          { pos: [0.14, 0.34, 0.78], scale: 0.75 },
          { pos: [1.4, 0.58, 0.28], scale: 0.85 },
        ].map((tree, i) => (
          <group key={`cypress-tree-${i}`} position={tree.pos as [number, number, number]} scale={tree.scale}>
            <mesh position={[0, 0.25, 0]} castShadow>
              <coneGeometry args={[0.18, 0.35, 8]} />
              <meshStandardMaterial color={isNight ? '#0a1a12' : '#586b57'} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow>
              <coneGeometry args={[0.14, 0.32, 8]} />
              <meshStandardMaterial color={isNight ? '#0b1d14' : '#687e67'} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.62, 0]} castShadow>
              <coneGeometry args={[0.09, 0.26, 8]} />
              <meshStandardMaterial color={isNight ? '#0d2218' : '#799178'} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.026, 0.038, 0.14, 6]} />
              <meshStandardMaterial color="#3e362f" />
            </mesh>
          </group>
        ))}

        {/* --- MONOLITHIC MEDIA DISPLAY (Shaurya Studios Telemetry) --- */}
        <group position={[-0.2, 0.38, -0.45]} rotation={[0, 0.35, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.65, 0.06]} />
            <meshStandardMaterial color="#0B0D11" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.02, 0.032]}>
            <planeGeometry args={[0.36, 0.55]} />
            <meshBasicMaterial color={isNight ? '#38bdf8' : '#0284c7'} />
          </mesh>
          <mesh position={[0.15, 0.28, 0.035]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* --- SLATE STEPPING STONES --- */}
        {[
          [-0.1, 0.25, 0.42],
          [0.14, 0.29, 0.27],
          [0.34, 0.4, 0.07],
          [0.54, 0.54, -0.1],
        ].map((p, i) => (
          <group key={`step-group-${i}`} position={p as [number, number, number]}>
            <mesh receiveShadow>
              <boxGeometry args={[0.16, 0.035, 0.16]} />
              <meshStandardMaterial color={isNight ? '#1e2430' : '#d5cfc5'} roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ===================================================================
          2. BEACON ATOLL // SATELLITE SANCTUARY (Located across open sea at [-4.5, -0.25, -2.5])
          =================================================================== */}
      <group position={[-4.5, -0.25, -2.5]}>
        {/* Atoll Bedrock Plinth */}
        <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.65, 1.95, 0.6, 28]} />
          <meshStandardMaterial color={isNight ? '#131822' : '#d6cfc4'} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.35, 1.55, 0.4, 28]} />
          <meshStandardMaterial color={isNight ? '#1a2230' : '#e6e1d8'} roughness={0.6} />
        </mesh>

        {/* Surrounding Waterline Rock Clustered Reef */}
        {[
          { pos: [-1.4, -0.15, 0.6], scale: [0.3, 0.2, 0.28] },
          { pos: [1.2, -0.16, -0.8], scale: [0.35, 0.24, 0.32] },
          { pos: [0.3, -0.18, 1.4], scale: [0.28, 0.2, 0.26] },
        ].map((b, i) => (
          <mesh key={`beacon-boulder-${i}`} position={b.pos as [number, number, number]} scale={b.scale as [number, number, number]} castShadow>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={isNight ? '#10151f' : '#aba398'} roughness={0.85} />
          </mesh>
        ))}

        {/* --- COASTAL LIGHTHOUSE TOWER --- */}
        <group position={[-0.6, 0.3, -0.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.32, 1.4, 16]} />
            <meshStandardMaterial color={isNight ? '#1e2634' : '#F7F5F0'} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.72, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.06, 16]} />
            <meshStandardMaterial color="#0F1115" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.88, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.26, 12]} />
            <meshPhysicalMaterial color="#fef08a" transmission={0.9} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <coneGeometry args={[0.24, 0.16, 16]} />
            <meshStandardMaterial color="#0F1115" />
          </mesh>
          
          {/* Revolving Lighthouse Searchlight Beam */}
          <group ref={lighthouseBeaconRef} position={[0, 0.88, 0]}>
            <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.45, 2.4, 16]} />
              <meshBasicMaterial color={isNight ? '#fef08a' : '#fff'} transparent opacity={isNight ? 0.35 : 0.08} />
            </mesh>
          </group>

          <pointLight
            ref={lighthouseLightRef}
            position={[0, 0.9, 0]}
            color="#fef08a"
            distance={10.0}
            intensity={0.4}
          />
        </group>

        {/* --- THE KINETIC SANCTUARY (Champagne Gold Monument) --- */}
        <group
          position={[0.45, 0.45, 0.35]}
          onClick={(e) => {
            e.stopPropagation();
            setSanctuarySpinBoost(3.4);
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
          <mesh position={[0, -0.15, 0]} receiveShadow>
            <cylinderGeometry args={[0.42, 0.52, 0.2, 28]} />
            <meshStandardMaterial color={isNight ? '#1f2735' : '#ded8cc'} roughness={0.4} />
          </mesh>

          <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.3}>
            <group>
              <group ref={outerGimbalRef}>
                <mesh castShadow>
                  <torusGeometry args={[0.38, 0.024, 16, 36]} />
                  <meshStandardMaterial
                    color={isNight ? '#e9d8a6' : '#C6B8A8'}
                    emissive={isNight ? '#e9d8a6' : '#000000'}
                    emissiveIntensity={isNight ? 0.9 : 0}
                    metalness={0.95}
                    roughness={0.15}
                  />
                </mesh>
              </group>

              <group ref={innerGimbalRef}>
                <mesh castShadow>
                  <torusGeometry args={[0.28, 0.018, 16, 32]} />
                  <meshStandardMaterial
                    color={isNight ? '#38bdf8' : '#2A2D35'}
                    emissive={isNight ? '#38bdf8' : '#000000'}
                    emissiveIntensity={isNight ? 0.8 : 0}
                    metalness={0.9}
                    roughness={0.2}
                  />
                </mesh>
              </group>

              <mesh ref={crystalCoreRef} castShadow>
                <octahedronGeometry args={[0.16, 0]} />
                <meshStandardMaterial
                  color={isNight ? '#38bdf8' : '#0F1115'}
                  emissive={isNight ? '#38bdf8' : '#C6B8A8'}
                  emissiveIntensity={isNight ? (hoveredZone === 'sanctuary' ? 2.6 : 1.4) : 0.25}
                  roughness={0.1}
                  metalness={0.85}
                />
              </mesh>
            </group>
          </Float>
        </group>
      </group>

      {/* ===================================================================
          3. WEST SEA-STACK REEF // EDITIFY MONOLITH (Located at [-6.0, -0.3, 4.8])
          =================================================================== */}
      <group position={[-6.0, -0.3, 4.8]}>
        {/* Towering Natural Sea-Stack Rock Pillar */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.95, 2.6, 12]} />
          <meshStandardMaterial color={isNight ? '#0e141d' : '#887f74'} roughness={0.9} />
        </mesh>
        <mesh position={[0.2, 0.4, -0.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.7, 1.8, 10]} />
          <meshStandardMaterial color={isNight ? '#121924' : '#9c9489'} roughness={0.9} />
        </mesh>

        {/* Sea-Stack Active Telemetry Buoy */}
        <group position={[1.0, 0.1, 0.8]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 0.3, 12]} />
            <meshStandardMaterial color={isNight ? '#111827' : '#e5e7eb'} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      </group>

      {/* ===================================================================
          4. EAST HORIZON REEF // THUMBPILOT STATION (Located at [7.0, -0.3, -4.5])
          =================================================================== */}
      <group position={[7.0, -0.3, -4.5]}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 1.1, 1.8, 12]} />
          <meshStandardMaterial color={isNight ? '#0e141d' : '#8c8378'} roughness={0.9} />
        </mesh>
        {/* Weather Telemetry Array */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.015, 0.025, 0.9, 6]} />
          <meshStandardMaterial color="#8E929E" metalness={0.9} />
        </mesh>
        <mesh position={[0, 1.95, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* ===================================================================
          5. DISTANT HORIZON MOUNTAIN SILHOUETTES (Radius 40 - 60)
          =================================================================== */}
      {[
        { pos: [-42, 2.5, -28], scale: [14, 7, 9], rot: [0, 0.4, 0] },
        { pos: [38, 3.2, -35], scale: [18, 9, 12], rot: [0, -0.6, 0] },
        { pos: [-28, 2.0, 42], scale: [12, 6, 8], rot: [0, 0.8, 0] },
        { pos: [45, 2.8, 25], scale: [16, 8, 10], rot: [0, -0.3, 0] },
      ].map((mt, i) => (
        <mesh
          key={`horizon-mountain-${i}`}
          position={mt.pos as [number, number, number]}
          scale={mt.scale as [number, number, number]}
          rotation={mt.rot as [number, number, number]}
        >
          <coneGeometry args={[1.5, 1.0, 6]} />
          <meshStandardMaterial
            color={isNight ? '#0b111a' : '#b8c6cd'}
            roughness={1.0}
          />
        </mesh>
      ))}

    </group>
  );
}
