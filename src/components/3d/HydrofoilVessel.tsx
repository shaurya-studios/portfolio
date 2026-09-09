import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScenery } from '../../context/SceneryContext';

interface HydrofoilVesselProps {
  isControllable?: boolean;
  onPositionUpdate?: (pos: THREE.Vector2, speed: number, heading: number) => void;
  onCruiseToggle?: (active: boolean) => void;
}

// Key state tracker
const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  brake: false,
};

export default function HydrofoilVessel({
  isControllable = true,
  onPositionUpdate,
  onCruiseToggle,
}: HydrofoilVesselProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftHeadlightRef = useRef<THREE.SpotLight>(null);
  const rightHeadlightRef = useRef<THREE.SpotLight>(null);
  const underwaterLightLeftRef = useRef<THREE.PointLight>(null);
  const underwaterLightRightRef = useRef<THREE.PointLight>(null);
  const cockpitAmbientLightRef = useRef<THREE.PointLight>(null);

  const steeringWheelRef = useRef<THREE.Group>(null);
  const throttleLeverRef = useRef<THREE.Group>(null);
  const propellerRef = useRef<THREE.Group>(null);
  const sternSprayRef = useRef<THREE.Group>(null);
  const flagRef = useRef<THREE.Group>(null);
  const radarSweepRef = useRef<THREE.Mesh>(null);

  const targetLeftRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const targetRightRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const { timeOfDay } = useScenery();

  const isNight = timeOfDay === 'night';

  // Physical State of the Hydrofoil Tender
  const state = useRef({
    x: 1.4,
    z: 4.0,
    heading: 0.0, // Moored at pier end facing open sea
    speed: 0,
    angularVel: 0,
    roll: 0,
    pitch: 0,
    isCruising: false,
  });

  // Listen to keyboard controls
  useEffect(() => {
    if (!isControllable) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      let moved = false;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        keys.forward = true;
        moved = true;
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        keys.backward = true;
        moved = true;
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        keys.left = true;
        moved = true;
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        keys.right = true;
        moved = true;
      }
      if (e.code === 'Space') {
        keys.brake = true;
      }

      if (moved && !state.current.isCruising) {
        state.current.isCruising = true;
        onCruiseToggle?.(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.backward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;
      if (e.code === 'Space') keys.brake = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isControllable, onCruiseToggle]);

  // Frame update: hydrofoil physics, wave elevation, banking & lighting
  useFrame((sceneState, delta) => {
    if (!groupRef.current) return;

    const dt = Math.min(delta, 0.1);
    const s = state.current;

    // 1. ENGINE ACCELERATION & BRAKING (Responsive, snappy throttle)
    const maxForwardSpeed = 4.6;
    const maxReverseSpeed = -1.5;
    const accel = 4.2;
    const drag = keys.brake ? 5.5 : 1.4;

    if (keys.forward) {
      s.speed += accel * dt;
      if (s.speed > maxForwardSpeed) s.speed = maxForwardSpeed;
    } else if (keys.backward) {
      s.speed -= accel * dt;
      if (s.speed < maxReverseSpeed) s.speed = maxReverseSpeed;
    } else {
      // Natural water hydrodynamic friction drag
      if (s.speed > 0) {
        s.speed = Math.max(0, s.speed - drag * dt);
      } else if (s.speed < 0) {
        s.speed = Math.min(0, s.speed + drag * dt);
      }
    }

    // 2. RESPONSIVE STEERING WITH STATIONARY ROTATION
    const turnRate = 3.4;
    const steerAuthority = Math.max(0.75, Math.min(Math.abs(s.speed) * 0.7 + 0.6, 1.25));

    if (keys.left) {
      s.angularVel = THREE.MathUtils.lerp(s.angularVel, turnRate * steerAuthority, dt * 8.0);
    } else if (keys.right) {
      s.angularVel = THREE.MathUtils.lerp(s.angularVel, -turnRate * steerAuthority, dt * 8.0);
    } else {
      s.angularVel = THREE.MathUtils.lerp(s.angularVel, 0, dt * 7.0);
    }

    // Allow in-place turning when stationary or slow (bow thruster maneuvering)
    if (Math.abs(s.speed) < 0.25 && (keys.left || keys.right)) {
      s.heading += (keys.left ? 2.4 : -2.4) * dt;
    } else {
      s.heading += s.angularVel * dt;
    }

    // 3. VELOCITY VECTOR UPDATE
    const vx = -Math.sin(s.heading) * s.speed;
    const vz = -Math.cos(s.heading) * s.speed;

    s.x += vx * dt;
    s.z += vz * dt;

    // Boundaries: expansive open-world ocean perimeter
    const distFromOrigin = Math.hypot(s.x, s.z);
    if (distFromOrigin > 38.0) {
      const angle = Math.atan2(s.z, s.x);
      s.x = Math.cos(angle) * 38.0;
      s.z = Math.sin(angle) * 38.0;
      s.speed *= 0.85;
    }

    // 4. MULTI-ATOLL SHORELINE COLLISION & TANGENTIAL SLIP
    const islands = [
      { x: 2.2, z: 0.0, r: 3.35 },    // Main Studio Island
      { x: -4.5, z: -2.5, r: 1.85 },  // Beacon Atoll
      { x: -6.0, z: 4.8, r: 1.25 },   // West Sea-Stack Outpost
      { x: 7.0, z: -4.5, r: 1.25 },   // East Horizon Reef
    ];

    for (const isl of islands) {
      const dx = s.x - isl.x;
      const dz = s.z - isl.z;
      const dist = Math.hypot(dx, dz);

      if (dist < isl.r) {
        const nx = dx / (dist || 1);
        const nz = dz / (dist || 1);

        // Keep boat cleanly on the outer shoreline water
        s.x = isl.x + nx * isl.r;
        s.z = isl.z + nz * isl.r;

        // Tangential deflection along coastline (butter-smooth gliding with zero sticking)
        const normalVel = vx * nx + vz * nz;
        if (normalVel < 0) {
          // Remove the inward velocity component so it glides along the tangent
          const tangentX = -nz;
          const tangentZ = nx;
          const dotTangent = vx * tangentX + vz * tangentZ;
          
          s.speed = Math.max(0, s.speed * 0.92);
          if (Math.abs(dotTangent) > 0.05) {
            s.heading += (dotTangent > 0 ? 0.8 : -0.8) * dt;
          }
        }
        break;
      }
    }

    // 4. HYDROFOIL WAVE BUOYANCY & KINETIC BANKING
    const t = sceneState.clock.elapsedTime;
    const waveElev =
      Math.sin(s.x * 0.75 + s.z * 0.5 + t * 1.2) * 0.04 +
      Math.sin(s.x * 1.35 - s.z * 0.85 + t * 1.6) * 0.025;

    // Foil dynamic lift: rises out of the water at high planing speeds
    const hydrofoilLift = Math.abs(s.speed) * 0.04;
    const targetY = -0.27 + waveElev + hydrofoilLift;

    // Banking roll (tilts into turns like a high-speed racing tender)
    const targetRoll = -s.angularVel * 0.18;
    // Pitch (bow rises under acceleration, digs down under braking)
    const targetPitch = (keys.forward ? 0.07 : 0) - (keys.backward ? 0.05 : 0);

    s.roll = THREE.MathUtils.lerp(s.roll, targetRoll, dt * 6.0);
    s.pitch = THREE.MathUtils.lerp(s.pitch, targetPitch, dt * 5.0);

    // Apply transformation
    groupRef.current.position.set(s.x, targetY, s.z);
    groupRef.current.rotation.y = s.heading;
    groupRef.current.rotation.z = s.roll;
    groupRef.current.rotation.x = s.pitch;

    // 5. ANIMATED COCKPIT CONTROLS & MECHANICAL ELEMENTS
    // Steering wheel turns with steering input
    if (steeringWheelRef.current) {
      const targetWheelAngle = keys.left ? 0.8 : keys.right ? -0.8 : 0;
      steeringWheelRef.current.rotation.z = THREE.MathUtils.lerp(
        steeringWheelRef.current.rotation.z,
        targetWheelAngle,
        dt * 8.0
      );
    }

    // Throttle lever pitches with forward/backward thrust
    if (throttleLeverRef.current) {
      const targetLeverPitch = keys.forward ? -0.45 : keys.backward ? 0.35 : 0;
      throttleLeverRef.current.rotation.x = THREE.MathUtils.lerp(
        throttleLeverRef.current.rotation.x,
        targetLeverPitch,
        dt * 8.0
      );
    }

    // High-speed underwater propeller spin
    if (propellerRef.current) {
      propellerRef.current.rotation.z += (s.speed * 25.0 + 1.0) * dt;
    }

    // Stern spray visibility at planing speeds
    if (sternSprayRef.current) {
      const sprayScale = Math.max(0, (Math.abs(s.speed) - 1.0) / 3.0);
      sternSprayRef.current.scale.set(sprayScale, sprayScale, sprayScale);
      sternSprayRef.current.visible = sprayScale > 0.05;
    }

    // Burgee pennant fluttering in wind (speed-reactive)
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(t * 14.0) * (0.25 + Math.min(Math.abs(s.speed) * 0.35, 0.6));
      flagRef.current.rotation.z = Math.cos(t * 9.0) * 0.12;
    }

    // Marine radar scan sweep on MFD helm display
    if (radarSweepRef.current) {
      radarSweepRef.current.rotation.z -= dt * 3.5;
    }

    // Inform parent scene for water wake & camera tracking
    onPositionUpdate?.(new THREE.Vector2(s.x, s.z), Math.abs(s.speed), s.heading);

    // 6. HEADLIGHT VOLUMETRIC TARGETS & NIGHT ILLUMINATION
    if (leftHeadlightRef.current && rightHeadlightRef.current) {
      const targetDist = 5.0;
      const targetX = s.x - Math.sin(s.heading) * targetDist;
      const targetZ = s.z - Math.cos(s.heading) * targetDist;

      targetLeftRef.current.position.set(targetX - 0.25, targetY - 0.25, targetZ);
      targetRightRef.current.position.set(targetX + 0.25, targetY - 0.25, targetZ);

      const isSunset = timeOfDay === 'sunset';
      const targetIntensity = isNight ? 2.6 : isSunset ? 1.4 : 0.0;
      leftHeadlightRef.current.intensity = THREE.MathUtils.lerp(
        leftHeadlightRef.current.intensity,
        targetIntensity,
        0.05
      );
      rightHeadlightRef.current.intensity = THREE.MathUtils.lerp(
        rightHeadlightRef.current.intensity,
        targetIntensity,
        0.05
      );
    }

    // Underwater transom lights (clean in day, luminous in sunset/night)
    if (underwaterLightLeftRef.current && underwaterLightRightRef.current) {
      const isSunset = timeOfDay === 'sunset';
      const underwaterTarget = isNight ? 2.0 : isSunset ? 1.0 : 0.0;
      underwaterLightLeftRef.current.intensity = THREE.MathUtils.lerp(
        underwaterLightLeftRef.current.intensity,
        underwaterTarget,
        0.05
      );
      underwaterLightRightRef.current.intensity = THREE.MathUtils.lerp(
        underwaterLightRightRef.current.intensity,
        underwaterTarget,
        0.05
      );
    }

    // Cockpit ambient LED
    if (cockpitAmbientLightRef.current) {
      const isSunset = timeOfDay === 'sunset';
      const cockpitTarget = isNight ? 1.2 : isSunset ? 0.7 : 0.0;
      cockpitAmbientLightRef.current.intensity = THREE.MathUtils.lerp(
        cockpitAmbientLightRef.current.intensity,
        cockpitTarget,
        0.05
      );
    }
  });

  return (
    <>
      <primitive object={targetLeftRef.current} />
      <primitive object={targetRightRef.current} />

      <group
        ref={groupRef}
        position={[1.4, -0.28, 4.0]}
        rotation={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          state.current.isCruising = true;
          onCruiseToggle?.(true);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* ===================================================================
            1. SCULPTED COMPOUND DEEP-V AXE-BOW HULL (Carbon Monocoque & Titanium)
            =================================================================== */}
        {/* Lower V-Hull Keel Spine */}
        <mesh position={[0, -0.035, -0.06]} receiveShadow>
          <boxGeometry args={[0.18, 0.08, 0.94]} />
          <meshStandardMaterial color={isNight ? '#0a0d13' : '#141820'} roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Port & Starboard Deadrise Planing V-Hull Wedges (Compound Flares) */}
        <mesh position={[-0.11, -0.015, -0.02]} rotation={[0, 0, 0.32]}>
          <boxGeometry args={[0.16, 0.06, 0.88]} />
          <meshStandardMaterial color={isNight ? '#0b0f16' : '#181d26'} roughness={0.25} metalness={0.9} />
        </mesh>
        <mesh position={[0.11, -0.015, -0.02]} rotation={[0, 0, -0.32]}>
          <boxGeometry args={[0.16, 0.06, 0.88]} />
          <meshStandardMaterial color={isNight ? '#0b0f16' : '#181d26'} roughness={0.25} metalness={0.9} />
        </mesh>

        {/* Main Monocoque Topsides & Gunwales */}
        <mesh castShadow receiveShadow position={[0, 0.065, 0.02]}>
          <boxGeometry args={[0.39, 0.13, 0.9]} />
          <meshStandardMaterial
            color={isNight ? '#0b0e14' : '#1a1f29'}
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>

        {/* Sharp Axe-Bow Knife-Edge Prow with Flared Sheer */}
        <mesh position={[0, 0.055, -0.53]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.195, 0.34, 4]} />
          <meshStandardMaterial
            color={isNight ? '#0d1017' : '#222834'}
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>

        {/* Vertical Stem Post Knife-Edge (Bow Cutwater) */}
        <mesh position={[0, 0.05, -0.69]} rotation={[0.22, 0, 0]}>
          <boxGeometry args={[0.012, 0.17, 0.04]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.98} roughness={0.08} />
        </mesh>

        {/* Polished Mirror-Finish Stainless Steel Bow Armor Plate (Scuff Plate) */}
        <mesh position={[0, 0.04, -0.66]} rotation={[0.24, 0, 0]}>
          <boxGeometry args={[0.042, 0.13, 0.024]} />
          <meshStandardMaterial color="#f3f4f6" metalness={0.98} roughness={0.05} />
        </mesh>

        {/* Starboard & Port Sharp Planing Spray Rails (Reverse Chine) */}
        <mesh position={[0.202, 0.018, -0.06]} rotation={[0, 0.035, 0]}>
          <boxGeometry args={[0.018, 0.012, 0.88]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[-0.202, 0.018, -0.06]} rotation={[0, -0.035, 0]}>
          <boxGeometry args={[0.018, 0.012, 0.88]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Upper Accent Sheerline Strake (Brushed Titanium) */}
        <mesh position={[0.198, 0.118, 0.0]}>
          <boxGeometry args={[0.01, 0.01, 0.84]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[-0.198, 0.118, 0.0]}>
          <boxGeometry args={[0.01, 0.01, 0.84]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Champagne Gold Waterline Accent Pinstripe */}
        <mesh position={[0, 0.006, 0.02]}>
          <boxGeometry args={[0.398, 0.014, 0.89]} />
          <meshStandardMaterial
            color="#E9D8A6"
            metalness={0.96}
            roughness={0.12}
            emissive="#E9D8A6"
            emissiveIntensity={isNight ? 0.35 : 0.05}
          />
        </mesh>

        {/* Aft Quarters Tumblehome with Recessed Carbon Ventilation Louvers */}
        <group position={[0.194, 0.07, 0.28]} rotation={[0, -0.05, 0]}>
          <mesh>
            <boxGeometry args={[0.008, 0.032, 0.14]} />
            <meshStandardMaterial color="#0b0d12" roughness={0.8} />
          </mesh>
          {[-0.04, -0.015, 0.015, 0.04].map((lz, idx) => (
            <mesh key={`vent-r-${idx}`} position={[0.003, 0, lz]}>
              <boxGeometry args={[0.004, 0.024, 0.014]} />
              <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>
        <group position={[-0.194, 0.07, 0.28]} rotation={[0, 0.05, 0]}>
          <mesh>
            <boxGeometry args={[0.008, 0.032, 0.14]} />
            <meshStandardMaterial color="#0b0d12" roughness={0.8} />
          </mesh>
          {[-0.04, -0.015, 0.015, 0.04].map((lz, idx) => (
            <mesh key={`vent-l-${idx}`} position={[-0.003, 0, lz]}>
              <boxGeometry args={[0.004, 0.024, 0.014]} />
              <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* ===================================================================
            2. TRANSOM & EXTENDED TEAK SWIM PLATFORM
            =================================================================== */}
        <group position={[0, 0.022, 0.54]}>
          {/* Main Swim Platform Foundation */}
          <mesh receiveShadow>
            <boxGeometry args={[0.36, 0.028, 0.16]} />
            <meshStandardMaterial color={isNight ? '#0e121a' : '#1e2430'} metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Slat-Laid Teak Swim Platform Planks with Black Caulking */}
          {[-0.15, -0.1, -0.05, 0.0, 0.05, 0.1, 0.15].map((px, i) => (
            <mesh key={`swim-slat-${i}`} position={[px, 0.015, 0]}>
              <boxGeometry args={[0.042, 0.006, 0.15]} />
              <meshStandardMaterial color={isNight ? '#3a2b1c' : '#8d6d4c'} roughness={0.65} />
            </mesh>
          ))}

          {/* Stainless Steel Wrap-Around Swim Platform Rub-Rail */}
          <mesh position={[0, 0.004, 0.082]}>
            <boxGeometry args={[0.368, 0.014, 0.01]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.08} />
          </mesh>

          {/* Recessed Starboard Folding 4-Step Swim Ladder */}
          <group position={[0.12, 0.018, 0.02]}>
            <mesh>
              <boxGeometry args={[0.055, 0.004, 0.09]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} />
            </mesh>
            {[-0.03, -0.01, 0.01, 0.03].map((stepZ, si) => (
              <mesh key={`ladder-step-${si}`} position={[0, 0.003, stepZ]}>
                <boxGeometry args={[0.048, 0.003, 0.006]} />
                <meshStandardMaterial color="#f3f4f6" metalness={0.98} roughness={0.05} />
              </mesh>
            ))}
          </group>

          {/* Dual Stainless Steel Water-Ski Towing & Mooring Eyes */}
          <mesh position={[-0.14, 0.02, 0.07]}>
            <torusGeometry args={[0.008, 0.003, 8, 16]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0.14, 0.02, 0.07]}>
            <torusGeometry args={[0.008, 0.003, 8, 16]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.05} />
          </mesh>
        </group>

        {/* ===================================================================
            3. FOREDECK WITH INDIVIDUAL TEAK PLANKS & FLUSH HATCHES
            =================================================================== */}
        {/* Foredeck Cambered Sub-Deck */}
        <mesh position={[0, 0.134, -0.34]} receiveShadow>
          <boxGeometry args={[0.33, 0.012, 0.32]} />
          <meshStandardMaterial color={isNight ? '#0d1017' : '#1a1f29'} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Individual Teak Planks on Foredeck */}
        {[-0.13, -0.09, -0.05, -0.01, 0.01, 0.05, 0.09, 0.13].map((tx, ti) => (
          <mesh key={`fore-plank-${ti}`} position={[tx, 0.142, -0.34]}>
            <boxGeometry args={[0.034, 0.004, 0.3]} />
            <meshStandardMaterial color={isNight ? '#382b1d' : '#8f6e4d'} roughness={0.65} />
          </mesh>
        ))}

        {/* Flush Anchor Locker Lid on Forward Foredeck */}
        <group position={[0, 0.145, -0.47]}>
          <mesh>
            <boxGeometry args={[0.12, 0.004, 0.09]} />
            <meshStandardMaterial color={isNight ? '#342618' : '#856444'} roughness={0.7} />
          </mesh>
          {/* Stainless Flush Lift Ring */}
          <mesh position={[0, 0.003, 0]}>
            <torusGeometry args={[0.006, 0.0015, 6, 12]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.05} />
          </mesh>
        </group>

        {/* Framed Flush Tinted Glass Skylight Hatch */}
        <group position={[0, 0.146, -0.28]}>
          {/* Polished Stainless Steel Hatch Frame */}
          <mesh>
            <boxGeometry args={[0.155, 0.006, 0.155]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.08} />
          </mesh>
          {/* Tinted Crystal Lens */}
          <mesh position={[0, 0.002, 0]}>
            <boxGeometry args={[0.135, 0.006, 0.135]} />
            <meshPhysicalMaterial
              color="#0F1115"
              metalness={0.2}
              roughness={0.05}
              transmission={0.85}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Dual Miniature Stainless Hinges */}
          <mesh position={[-0.045, 0.005, -0.076]}>
            <boxGeometry args={[0.016, 0.005, 0.008]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.98} />
          </mesh>
          <mesh position={[0.045, 0.005, -0.076]}>
            <boxGeometry args={[0.016, 0.005, 0.008]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.98} />
          </mesh>
        </group>

        {/* Miniature Stainless Plow Anchor in Recessed Bow Roller Chute */}
        <group position={[0, 0.08, -0.68]} rotation={[0.38, 0, 0]}>
          {/* Anchor Roller Bracket */}
          <mesh>
            <boxGeometry args={[0.034, 0.018, 0.065]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.08} />
          </mesh>
          {/* Polished Delta Anchor Shank & Fluke */}
          <mesh position={[0, 0.015, -0.02]} rotation={[0.4, 0, 0]}>
            <coneGeometry args={[0.022, 0.045, 3]} />
            <meshStandardMaterial color="#f3f4f6" metalness={0.98} roughness={0.05} />
          </mesh>
        </group>

        {/* Low-Profile Stainless Bow Pulpit Rail */}
        <group position={[0, 0.17, -0.52]}>
          <mesh position={[-0.08, 0, 0]} rotation={[0, 0, -0.08]}>
            <cylinderGeometry args={[0.003, 0.003, 0.06, 8]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, 0.08]}>
            <cylinderGeometry args={[0.003, 0.003, 0.06, 8]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0, 0.028, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.003, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.05} />
          </mesh>
        </group>

        {/* ===================================================================
            4. COCKPIT COAMING, TEAK SOLE & CONCEALED AMBIENT LEDS
            =================================================================== */}
        {/* Recessed Cockpit Tub Liner */}
        <mesh position={[0, 0.065, 0.12]} receiveShadow>
          <boxGeometry args={[0.32, 0.016, 0.46]} />
          <meshStandardMaterial color={isNight ? '#0d1017' : '#171b24'} roughness={0.5} />
        </mesh>

        {/* Individually Rendered Teak Sole Planking with Dark Caulking Channels */}
        {[-0.13, -0.095, -0.06, -0.025, 0.01, 0.045, 0.08, 0.115, 0.14].map((px, pi) => (
          <mesh key={`cockpit-plank-${pi}`} position={[px - 0.005, 0.075, 0.12]}>
            <boxGeometry args={[0.03, 0.005, 0.44]} />
            <meshStandardMaterial color={isNight ? '#35281a' : '#886747'} roughness={0.68} />
          </mesh>
        ))}

        {/* Carbon Fiber Cockpit Side Coaming Bulwarks */}
        <mesh position={[-0.165, 0.13, 0.12]}>
          <boxGeometry args={[0.02, 0.11, 0.46]} />
          <meshStandardMaterial color={isNight ? '#0b0e14' : '#1a1f29'} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.165, 0.13, 0.12]}>
          <boxGeometry args={[0.02, 0.11, 0.46]} />
          <meshStandardMaterial color={isNight ? '#0b0e14' : '#1a1f29'} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Solid Varnished Teak Gunwale Cap Rails */}
        <mesh position={[-0.165, 0.19, 0.12]}>
          <boxGeometry args={[0.028, 0.014, 0.47]} />
          <meshStandardMaterial color={isNight ? '#3d2e1f' : '#947250'} roughness={0.5} />
        </mesh>
        <mesh position={[0.165, 0.19, 0.12]}>
          <boxGeometry args={[0.028, 0.014, 0.47]} />
          <meshStandardMaterial color={isNight ? '#3d2e1f' : '#947250'} roughness={0.5} />
        </mesh>

        {/* Flush Stainless Steel Beverage Holders in Cap Rails */}
        <mesh position={[-0.165, 0.198, 0.22]}>
          <cylinderGeometry args={[0.009, 0.007, 0.008, 12]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.98} roughness={0.1} />
        </mesh>
        <mesh position={[0.165, 0.198, 0.22]}>
          <cylinderGeometry args={[0.009, 0.007, 0.008, 12]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.98} roughness={0.1} />
        </mesh>

        {/* Concealed Under-Gunwale Ambient LED Strips (Glows along deck at night) */}
        {isNight && (
          <>
            <mesh position={[-0.152, 0.13, 0.12]}>
              <boxGeometry args={[0.006, 0.006, 0.44]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <mesh position={[0.152, 0.13, 0.12]}>
              <boxGeometry args={[0.006, 0.006, 0.44]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          </>
        )}
        <pointLight
          ref={cockpitAmbientLightRef}
          position={[0, 0.2, 0.12]}
          color="#fef3c7"
          distance={1.8}
          intensity={0.25}
        />

        {/* ===================================================================
            5. DUAL EXECUTIVE RACING BUCKET SEATS & AFT SUNPAD LOUNGE
            =================================================================== */}
        {/* --- PORT SEAT (Driver Helm) --- */}
        <group position={[-0.08, 0.145, 0.04]}>
          {/* Polished Stainless Pedestal Base */}
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.016, 0.024, 0.06, 12]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.08} />
          </mesh>
          {/* High-Gloss Carbon Fiber Back Shell with Aerodynamic Cutouts */}
          <mesh position={[0, 0.04, -0.015]} castShadow>
            <boxGeometry args={[0.12, 0.16, 0.02]} />
            <meshStandardMaterial color="#0b0e14" metalness={0.88} roughness={0.2} />
          </mesh>
          {/* Twin Carbon Cutout Holes */}
          <mesh position={[-0.03, 0.07, -0.01]}>
            <boxGeometry args={[0.025, 0.02, 0.022]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} />
          </mesh>
          <mesh position={[0.03, 0.07, -0.01]}>
            <boxGeometry args={[0.025, 0.02, 0.022]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} />
          </mesh>
          {/* Hand-Stitched Saddle Tan Leather Cushion Base */}
          <mesh position={[0, -0.025, 0.05]} castShadow>
            <boxGeometry args={[0.115, 0.035, 0.11]} />
            <meshStandardMaterial color={isNight ? '#4e3725' : '#9c6f4b'} roughness={0.62} />
          </mesh>
          {/* Fluted Leather Backrest Cushion with Ribbed Contours */}
          <mesh position={[0, 0.035, 0.005]}>
            <boxGeometry args={[0.105, 0.13, 0.022]} />
            <meshStandardMaterial color={isNight ? '#4e3725' : '#9c6f4b'} roughness={0.62} />
          </mesh>
          {/* Side Bolster Wings */}
          <mesh position={[-0.055, 0.025, 0.035]} rotation={[0, 0.35, 0]}>
            <boxGeometry args={[0.015, 0.11, 0.06]} />
            <meshStandardMaterial color={isNight ? '#422f20' : '#885f40'} roughness={0.65} />
          </mesh>
          <mesh position={[0.055, 0.025, 0.035]} rotation={[0, -0.35, 0]}>
            <boxGeometry args={[0.015, 0.11, 0.06]} />
            <meshStandardMaterial color={isNight ? '#422f20' : '#885f40'} roughness={0.65} />
          </mesh>
        </group>

        {/* --- STARBOARD SEAT (Navigator / Co-Pilot) --- */}
        <group position={[0.08, 0.145, 0.04]}>
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.016, 0.024, 0.06, 12]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.08} />
          </mesh>
          <mesh position={[0, 0.04, -0.015]} castShadow>
            <boxGeometry args={[0.12, 0.16, 0.02]} />
            <meshStandardMaterial color="#0b0e14" metalness={0.88} roughness={0.2} />
          </mesh>
          <mesh position={[-0.03, 0.07, -0.01]}>
            <boxGeometry args={[0.025, 0.02, 0.022]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} />
          </mesh>
          <mesh position={[0.03, 0.07, -0.01]}>
            <boxGeometry args={[0.025, 0.02, 0.022]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.025, 0.05]} castShadow>
            <boxGeometry args={[0.115, 0.035, 0.11]} />
            <meshStandardMaterial color={isNight ? '#4e3725' : '#9c6f4b'} roughness={0.62} />
          </mesh>
          <mesh position={[0, 0.035, 0.005]}>
            <boxGeometry args={[0.105, 0.13, 0.022]} />
            <meshStandardMaterial color={isNight ? '#4e3725' : '#9c6f4b'} roughness={0.62} />
          </mesh>
          <mesh position={[-0.055, 0.025, 0.035]} rotation={[0, 0.35, 0]}>
            <boxGeometry args={[0.015, 0.11, 0.06]} />
            <meshStandardMaterial color={isNight ? '#422f20' : '#885f40'} roughness={0.65} />
          </mesh>
          <mesh position={[0.055, 0.025, 0.035]} rotation={[0, -0.35, 0]}>
            <boxGeometry args={[0.015, 0.11, 0.06]} />
            <meshStandardMaterial color={isNight ? '#422f20' : '#885f40'} roughness={0.65} />
          </mesh>
        </group>

        {/* --- AFT RELAXATION SUNPAD & LOUNGE WITH TEAK WALK-THROUGH --- */}
        <group position={[0, 0.12, 0.33]}>
          {/* Port Sun Lounge Cushion */}
          <mesh position={[-0.088, 0.025, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.125, 0.045, 0.22]} />
            <meshStandardMaterial color={isNight ? '#222b3a' : '#dedad2'} roughness={0.6} />
          </mesh>
          {/* Starboard Sun Lounge Cushion */}
          <mesh position={[0.088, 0.025, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.125, 0.045, 0.22]} />
            <meshStandardMaterial color={isNight ? '#222b3a' : '#dedad2'} roughness={0.6} />
          </mesh>
          {/* Center Teak Walk-Through Companionway to Swim Terrace */}
          <mesh position={[0, 0.006, 0]}>
            <boxGeometry args={[0.052, 0.012, 0.23]} />
            <meshStandardMaterial color={isNight ? '#382b1d' : '#8f6e4d'} roughness={0.65} />
          </mesh>
          {/* Dual Cylindrical Ergonomic Bolster Headrests */}
          <mesh position={[-0.088, 0.056, -0.085]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.12, 16]} />
            <meshStandardMaterial color={isNight ? '#2d384c' : '#c9c3b8'} roughness={0.5} />
          </mesh>
          <mesh position={[0.088, 0.056, -0.085]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.12, 16]} />
            <meshStandardMaterial color={isNight ? '#2d384c' : '#c9c3b8'} roughness={0.5} />
          </mesh>
        </group>

        {/* ===================================================
            4. ACTIVE HELM STATION & PRECISION CONTROLS
            =================================================== */}
        {/* Dual-Tier Ergonomic Dashboard Console */}
        <group position={[0, 0.165, -0.1]}>
          {/* Main Console Base Structure in Matte Carbon */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.31, 0.075, 0.07]} />
            <meshStandardMaterial color="#11141a" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Stitched Saddle Leather Glare-Shield Brow */}
          <mesh position={[0, 0.044, 0.005]} castShadow>
            <boxGeometry args={[0.318, 0.018, 0.085]} />
            <meshStandardMaterial color={isNight ? '#181410' : '#422f20'} roughness={0.7} />
          </mesh>
          {/* Chamfered Lower Binnacle Shelf */}
          <mesh position={[0, -0.026, 0.038]}>
            <boxGeometry args={[0.295, 0.022, 0.045]} />
            <meshStandardMaterial color="#161a22" metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Twin Stainless Cup / Flask Holders */}
          <mesh position={[-0.12, -0.016, 0.04]}>
            <cylinderGeometry args={[0.011, 0.009, 0.012, 16]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.12, -0.016, 0.04]}>
            <cylinderGeometry args={[0.011, 0.009, 0.012, 16]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Dual High-Resolution Glass Multi-Function Displays (MFDs) */}
        {/* Left Primary Display: Marine Radar & Sonar Suite */}
        <group position={[-0.074, 0.188, -0.072]} rotation={[-0.45, 0, 0]}>
          {/* CNC Anodized Titanium Bezel */}
          <mesh>
            <boxGeometry args={[0.092, 0.052, 0.006]} />
            <meshStandardMaterial color="#1f242e" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Tactical Radar Display Screen */}
          <mesh position={[0, 0, 0.004]}>
            <planeGeometry args={[0.084, 0.044]} />
            <meshBasicMaterial color="#040b17" />
          </mesh>
          {/* Concentric Sonar Range Rings */}
          <mesh position={[0, 0, 0.005]}>
            <ringGeometry args={[0.017, 0.0185, 32]} />
            <meshBasicMaterial color="#0284c7" opacity={0.65} transparent />
          </mesh>
          <mesh position={[0, 0, 0.005]}>
            <ringGeometry args={[0.008, 0.0095, 32]} />
            <meshBasicMaterial color="#0284c7" opacity={0.45} transparent />
          </mesh>
          {/* Active Rotating Radar Beam Sweep Line */}
          <mesh ref={radarSweepRef} position={[0, 0, 0.006]}>
            <planeGeometry args={[0.0016, 0.036]} />
            <meshBasicMaterial color="#38bdf8" opacity={0.85} transparent />
          </mesh>
          {/* Sonar Blip Contacts */}
          <mesh position={[0.012, 0.008, 0.006]}>
            <circleGeometry args={[0.0018, 8]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[-0.015, -0.006, 0.006]}>
            <circleGeometry args={[0.0015, 8]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </group>

        {/* Right Secondary Display: Chartplotter & Kinetic Telemetry */}
        <group position={[0.074, 0.188, -0.072]} rotation={[-0.45, 0, 0]}>
          {/* Bezel */}
          <mesh>
            <boxGeometry args={[0.092, 0.052, 0.006]} />
            <meshStandardMaterial color="#1f242e" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Screen Background */}
          <mesh position={[0, 0, 0.004]}>
            <planeGeometry args={[0.084, 0.044]} />
            <meshBasicMaterial color="#071317" />
          </mesh>
          {/* Horizontal Artificial Horizon Pitch Line */}
          <mesh position={[0, 0.002, 0.005]}>
            <planeGeometry args={[0.048, 0.0015]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {/* Telemetry Indicator Bars */}
          <mesh position={[-0.024, -0.012, 0.005]}>
            <planeGeometry args={[0.024, 0.004]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
          <mesh position={[0.024, -0.012, 0.005]}>
            <planeGeometry args={[0.024, 0.004]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0, 0.014, 0.005]}>
            <planeGeometry args={[0.055, 0.0025]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>

        {/* 3-Spoke D-Cut Racing Steering Wheel (Rotates dynamically with A/D input) */}
        <group ref={steeringWheelRef} position={[-0.075, 0.168, -0.038]} rotation={[-0.45, 0, 0]}>
          {/* Perforated Grip Outer Rim */}
          <mesh castShadow>
            <torusGeometry args={[0.035, 0.0052, 14, 28]} />
            <meshStandardMaterial color="#181c24" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* 12 O'Clock Racing Alignment Stripe */}
          <mesh position={[0, 0.035, 0]}>
            <boxGeometry args={[0.007, 0.011, 0.007]} />
            <meshStandardMaterial color="#E9D8A6" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Champagne Gold Center Hub Boss */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.014, 16]} />
            <meshStandardMaterial color="#E9D8A6" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Embossed Atelier Hub Center Badge */}
          <mesh position={[0, 0, 0.008]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.004, 12]} />
            <meshStandardMaterial color="#0F1115" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* 3 Brushed Spokes (Left, Right, and Bottom Vertical) */}
          <mesh>
            <boxGeometry args={[0.062, 0.0045, 0.004]} />
            <meshStandardMaterial color="#E9D8A6" metalness={0.95} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.018, 0]}>
            <boxGeometry args={[0.0045, 0.034, 0.004]} />
            <meshStandardMaterial color="#E9D8A6" metalness={0.95} roughness={0.2} />
          </mesh>
        </group>

        {/* Polished Dual Throttle Binnacle (Pitches dynamically with W/S thrust) */}
        <group ref={throttleLeverRef} position={[0.005, 0.156, -0.036]}>
          {/* Billet Aluminum Binnacle Housing */}
          <mesh castShadow>
            <boxGeometry args={[0.028, 0.018, 0.038]} />
            <meshStandardMaterial color="#0F1115" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Port Engine Throttle Lever */}
          <group position={[-0.006, 0.01, 0]}>
            <mesh position={[0, 0.018, 0]}>
              <cylinderGeometry args={[0.002, 0.0024, 0.036, 8]} />
              <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.1} />
            </mesh>
            {/* Ergonomic Knurled Tear-Drop Knob */}
            <mesh position={[0, 0.036, 0]}>
              <sphereGeometry args={[0.0045, 10, 10]} />
              <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.2} />
            </mesh>
          </group>
          {/* Starboard Engine Throttle Lever */}
          <group position={[0.006, 0.01, 0]}>
            <mesh position={[0, 0.018, 0]}>
              <cylinderGeometry args={[0.002, 0.0024, 0.036, 8]} />
              <meshStandardMaterial color="#e5e7eb" metalness={0.98} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.036, 0]}>
              <sphereGeometry args={[0.0045, 10, 10]} />
              <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* Gimbal-Mounted Magnetic Compass Bowl */}
        <group position={[0, 0.208, -0.092]}>
          <mesh>
            <cylinderGeometry args={[0.013, 0.009, 0.008, 16]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.004, 0]}>
            <sphereGeometry args={[0.011, 14, 14]} />
            <meshPhysicalMaterial color="#38bdf8" transmission={0.88} roughness={0.08} transparent />
          </mesh>
        </group>

        {/* Bank of Illuminated Marine Toggle Switches */}
        <group position={[0.075, 0.145, -0.036]} rotation={[-0.45, 0, 0]}>
          {[-0.018, -0.006, 0.006, 0.018].map((x, i) => (
            <mesh key={`helm-switch-${i}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.004, 0.008, 0.004]} />
              <meshBasicMaterial color={i === 0 ? '#ef4444' : i === 1 ? '#10b981' : i === 2 ? '#38bdf8' : '#f59e0b'} />
            </mesh>
          ))}
        </group>

        {/* ===================================================
            5. FRAMELESS AERODYNAMIC SPEEDSTER WINDSCREEN & WIPER
            =================================================== */}
        {/* Wrap-Around Center Aerodynamic Windscreen */}
        <mesh position={[0, 0.208, -0.165]} rotation={[0.46, 0, 0]} castShadow>
          <boxGeometry args={[0.26, 0.098, 0.014]} />
          <meshPhysicalMaterial
            color={isNight ? '#38bdf8' : '#0F1115'}
            transmission={0.92}
            opacity={0.85}
            transparent
            roughness={0.04}
            ior={1.52}
          />
        </mesh>
        {/* Port Wrap-Around Windscreen Wing */}
        <mesh position={[-0.142, 0.198, -0.142]} rotation={[0.44, 0.42, -0.18]} castShadow>
          <boxGeometry args={[0.09, 0.092, 0.014]} />
          <meshPhysicalMaterial
            color={isNight ? '#38bdf8' : '#0F1115'}
            transmission={0.92}
            opacity={0.85}
            transparent
            roughness={0.04}
            ior={1.52}
          />
        </mesh>
        {/* Starboard Wrap-Around Windscreen Wing */}
        <mesh position={[0.142, 0.198, -0.142]} rotation={[0.44, -0.42, 0.18]} castShadow>
          <boxGeometry args={[0.09, 0.092, 0.014]} />
          <meshPhysicalMaterial
            color={isNight ? '#38bdf8' : '#0F1115'}
            transmission={0.92}
            opacity={0.85}
            transparent
            roughness={0.04}
            ior={1.52}
          />
        </mesh>

        {/* Polished Titanium Windscreen Cap-Rail Trim */}
        <mesh position={[0, 0.245, -0.148]} rotation={[0.46, 0, 0]}>
          <boxGeometry args={[0.262, 0.008, 0.016]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.95} roughness={0.12} />
        </mesh>

        {/* Driver-Side Articulated Pantograph Windscreen Wiper */}
        <group position={[-0.075, 0.182, -0.155]} rotation={[0.46, 0, 0.22]}>
          {/* Wiper Motor Pivot Base */}
          <mesh>
            <cylinderGeometry args={[0.003, 0.003, 0.006, 8]} />
            <meshStandardMaterial color="#11141a" metalness={0.8} />
          </mesh>
          {/* Dual Parallel Wiper Arms */}
          <mesh position={[0, 0.024, 0.004]}>
            <boxGeometry args={[0.0018, 0.048, 0.0015]} />
            <meshStandardMaterial color="#11141a" metalness={0.85} />
          </mesh>
          {/* Wiper Blade */}
          <mesh position={[0.002, 0.045, 0.004]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[0.002, 0.052, 0.0015]} />
            <meshStandardMaterial color="#1f242e" roughness={0.8} />
          </mesh>
        </group>

        {/* ===================================================
            6. EXTERIOR DECK HARDWARE, POP-UP CLEATS & BURGEE
            =================================================== */}
        {/* Bow Delta Plow Anchor & Polished Hawse Pipe Pocket */}
        <group position={[0, 0.065, -0.66]}>
          {/* Mirror-Polished Stainless Hawse Collar Plate */}
          <mesh>
            <boxGeometry args={[0.034, 0.022, 0.065]} />
            <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.06} />
          </mesh>
          {/* Delta Plow Anchor Fluke Head */}
          <mesh position={[0, -0.022, -0.035]} rotation={[0.42, 0, 0]}>
            <coneGeometry args={[0.02, 0.048, 3]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.95} roughness={0.12} />
          </mesh>
        </group>

        {/* Dual Cast Stainless Bow Fairleads / Chocks */}
        <mesh position={[-0.11, 0.145, -0.58]}>
          <boxGeometry args={[0.016, 0.012, 0.024]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.11, 0.145, -0.58]}>
          <boxGeometry args={[0.016, 0.012, 0.024]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Foredeck Flush Anchor Locker Hatch & Stainless Ring Latches */}
        <group position={[0, 0.142, -0.44]}>
          <mesh>
            <boxGeometry args={[0.17, 0.004, 0.15]} />
            <meshStandardMaterial color={isNight ? '#382b1d' : '#856445'} roughness={0.6} />
          </mesh>
          {/* Dual Flush Ring Pull Latches */}
          <mesh position={[-0.045, 0.003, 0]}>
            <torusGeometry args={[0.004, 0.001, 8, 12]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} />
          </mesh>
          <mesh position={[0.045, 0.003, 0]}>
            <torusGeometry args={[0.004, 0.001, 8, 12]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.98} />
          </mesh>
        </group>

        {/* Luxury Pop-Up Stainless Mooring Cleats (6-Point Spread) */}
        {[
          { pos: [-0.145, 0.142, -0.42] as [number, number, number], name: 'bow-port' },
          { pos: [0.145, 0.142, -0.42] as [number, number, number], name: 'bow-starboard' },
          { pos: [-0.198, 0.138, 0.02] as [number, number, number], name: 'mid-port' },
          { pos: [0.198, 0.138, 0.02] as [number, number, number], name: 'mid-starboard' },
          { pos: [-0.175, 0.132, 0.41] as [number, number, number], name: 'stern-port' },
          { pos: [0.175, 0.132, 0.41] as [number, number, number], name: 'stern-starboard' },
        ].map(({ pos, name }) => (
          <group key={`cleat-${name}`} position={pos}>
            {/* Recessed Bezel Base Plate */}
            <mesh position={[0, 0.001, 0]}>
              <boxGeometry args={[0.016, 0.003, 0.044]} />
              <meshStandardMaterial color="#1f242e" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Pop-Up Cleat Horn Bar */}
            <mesh position={[0, 0.008, 0]}>
              <boxGeometry args={[0.01, 0.012, 0.038]} />
              <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.08} />
            </mesh>
          </group>
        ))}

        {/* Port Transom Integrated Folding 3-Step Stainless Swim Ladder */}
        <group position={[-0.13, 0.04, 0.52]}>
          {/* Ladder Stringers */}
          <mesh position={[-0.035, -0.06, 0]}>
            <cylinderGeometry args={[0.0025, 0.0025, 0.16, 8]} />
            <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.06} />
          </mesh>
          <mesh position={[0.035, -0.06, 0]}>
            <cylinderGeometry args={[0.0025, 0.0025, 0.16, 8]} />
            <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.06} />
          </mesh>
          {/* 3 Ladder Rungs */}
          {[-0.02, -0.07, -0.12].map((y, idx) => (
            <mesh key={`ladder-rung-${idx}`} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.0022, 0.0022, 0.07, 8]} />
              <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.06} />
            </mesh>
          ))}
        </group>

        {/* Slender Carbon VHF Whip Antenna with 360-Degree Masthead Light */}
        <group position={[-0.165, 0.36, 0.44]}>
          <mesh>
            <cylinderGeometry args={[0.0025, 0.005, 0.48, 8]} />
            <meshStandardMaterial color="#1f242e" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* All-Round White Anchor Light */}
          <mesh position={[0, 0.245, 0]}>
            <sphereGeometry args={[0.007, 12, 12]} />
            <meshBasicMaterial color={isNight ? '#fef08a' : '#d1d5db'} />
          </mesh>
        </group>

        {/* Stern Teak Flagstaff with Dynamic Fluttering Studio Burgee Pennant */}
        <group position={[0.165, 0.135, 0.44]}>
          {/* Flagstaff Socket Mount */}
          <mesh>
            <cylinderGeometry args={[0.006, 0.008, 0.016, 12]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Raked Varnished Teak Staff */}
          <mesh position={[0, 0.16, 0.04]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.003, 0.004, 0.34, 8]} />
            <meshStandardMaterial color="#885f40" roughness={0.5} />
          </mesh>
          {/* Polished Gold Finial Cap */}
          <mesh position={[0, 0.33, 0.09]}>
            <sphereGeometry args={[0.006, 10, 10]} />
            <meshStandardMaterial color="#E9D8A6" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Speed-Reactive Fluttering Burgee Pennant */}
          <group ref={flagRef} position={[0, 0.28, 0.07]}>
            {/* Triangular Atelier Burgee Pennant (Gold & Cyan Chevron) */}
            <mesh position={[0, -0.02, 0.06]} rotation={[0, Math.PI / 2, 0]}>
              <coneGeometry args={[0.042, 0.12, 3]} />
              <meshStandardMaterial
                color={isNight ? '#0284c7' : '#d97706'}
                roughness={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>

        {/* ===================================================
            7. AERODYNAMIC HYDROFOIL ASSEMBLY & TORPEDO POD
            =================================================== */}
        {/* Forward Main Dihedral Hydrofoil Assembly */}
        <group position={[0, -0.16, -0.12]}>
          {/* Twin Carbon-Fiber Vertical Foil Struts with Aerodynamic NACA Profile */}
          {[-0.14, 0.14].map((x, idx) => (
            <group key={`foil-strut-${idx}`} position={[x, 0.04, 0]}>
              {/* Hull Keel Titanium Trunnion Mount */}
              <mesh position={[0, 0.08, 0]}>
                <boxGeometry args={[0.026, 0.022, 0.058]} />
                <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.12} />
              </mesh>
              {/* Strut Main Carbon Blade */}
              <mesh castShadow>
                <boxGeometry args={[0.012, 0.18, 0.046]} />
                <meshStandardMaterial color="#11141a" metalness={0.85} roughness={0.25} />
              </mesh>
              {/* Streamlined Rounded Leading Edge */}
              <mesh position={[0, 0, -0.023]}>
                <cylinderGeometry args={[0.006, 0.006, 0.18, 12]} />
                <meshStandardMaterial color="#11141a" metalness={0.85} roughness={0.25} />
              </mesh>
            </group>
          ))}

          {/* Swept Dihedral Main Foil Wing (Self-stabilizing dynamic lift) */}
          {/* Port Swept Foil Wing */}
          <mesh position={[-0.13, -0.05, 0]} rotation={[0, 0, 0.05]}>
            <boxGeometry args={[0.26, 0.013, 0.076]} />
            <meshStandardMaterial color="#C6B8A8" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Starboard Swept Foil Wing */}
          <mesh position={[0.13, -0.05, 0]} rotation={[0, 0, -0.05]}>
            <boxGeometry args={[0.26, 0.013, 0.076]} />
            <meshStandardMaterial color="#C6B8A8" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Precision Upturned Racing Winglets with Champagne Gold Tips */}
          {/* Port Winglet */}
          <group position={[-0.26, -0.02, 0]} rotation={[0, 0, -0.42]}>
            <mesh>
              <boxGeometry args={[0.012, 0.075, 0.065]} />
              <meshStandardMaterial color="#11141a" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Gold Tip Fin */}
            <mesh position={[0, 0.038, 0]}>
              <boxGeometry args={[0.014, 0.016, 0.065]} />
              <meshStandardMaterial color="#E9D8A6" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
          {/* Starboard Winglet */}
          <group position={[0.26, -0.02, 0]} rotation={[0, 0, 0.42]}>
            <mesh>
              <boxGeometry args={[0.012, 0.075, 0.065]} />
              <meshStandardMaterial color="#11141a" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Gold Tip Fin */}
            <mesh position={[0, 0.038, 0]}>
              <boxGeometry args={[0.014, 0.016, 0.065]} />
              <meshStandardMaterial color="#E9D8A6" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        </group>

        {/* Aft Carbon Rudder Strut & Torpedo Propulsion Pod */}
        <group position={[0, -0.11, 0.36]}>
          {/* Carbon Rudder Foil Strut */}
          <mesh>
            <boxGeometry args={[0.015, 0.22, 0.068]} />
            <meshStandardMaterial color="#11141a" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* Hydrodynamic Torpedo Motor Pod */}
          <group position={[0, -0.1, 0]}>
            {/* Main Motor Cylindrical Nacelle in Obsidian Aluminum */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.033, 0.033, 0.17, 20]} />
              <meshStandardMaterial color="#0F1115" metalness={0.92} roughness={0.15} />
            </mesh>
            {/* Elliptical Bullet Nosecone */}
            <mesh position={[0, 0, -0.085]} rotation={[Math.PI / 2, 0, 0]}>
              <sphereGeometry args={[0.033, 16, 16]} />
              <meshStandardMaterial color="#1a1e26" metalness={0.95} roughness={0.12} />
            </mesh>
            {/* Tapered Aft Shaft Bearing Hub */}
            <mesh position={[0, 0, 0.095]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.033, 0.018, 0.03, 16]} />
              <meshStandardMaterial color="#C6B8A8" metalness={0.95} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* 4-Blade High-Pitch Manganese Bronze Spinning Propeller */}
        <group ref={propellerRef} position={[0, -0.21, 0.485]}>
          {/* Propeller Bullet Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.014, 0.018, 0.028, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* 4 Hydrodynamic Swept & Cupped Propeller Blades */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
            <group key={`prop-blade-${i}`} rotation={[0, 0, angle]}>
              <mesh position={[0, 0.034, 0]} rotation={[0.28, 0, 0]}>
                <boxGeometry args={[0.014, 0.048, 0.0035]} />
                <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.15} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Planing Spray Rooster Tail (Hydrofoil high-speed surface aeration) */}
        <group ref={sternSprayRef} position={[0, -0.18, 0.6]} visible={false}>
          <mesh rotation={[-Math.PI / 2.3, 0, 0]}>
            <coneGeometry args={[0.2, 0.48, 10]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
          </mesh>
        </group>

        {/* ===================================================
            8. ADVANCED LIGHTING & NAVIGATION POSITION LEDS
            =================================================== */}
        {/* Dual Bi-Xenon Projector Headlights with Chrome Bezels & Halo Rings */}
        {/* Left Headlight */}
        <group position={[-0.11, 0.088, -0.52]}>
          {/* Polished Chrome Reflector Housing */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.018, 0.02, 16]} />
            <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.05} />
          </mesh>
          {/* Projector Glass Convex Lens */}
          <mesh position={[0, 0, -0.01]}>
            <sphereGeometry args={[0.018, 14, 14]} />
            <meshBasicMaterial color={isNight ? '#fef9c3' : '#d1d5db'} />
          </mesh>
          {/* DRL Halo Accent Ring */}
          <mesh position={[0, 0, -0.011]}>
            <ringGeometry args={[0.02, 0.023, 20]} />
            <meshBasicMaterial color={isNight ? '#fef08a' : '#e5e7eb'} />
          </mesh>
        </group>
        <spotLight
          ref={leftHeadlightRef}
          target={targetLeftRef.current}
          position={[-0.11, 0.12, -0.53]}
          color="#fff8db"
          angle={0.44}
          penumbra={0.65}
          distance={8.5}
          intensity={0.0}
        />

        {/* Right Headlight */}
        <group position={[0.11, 0.088, -0.52]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.018, 0.02, 16]} />
            <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0, 0, -0.01]}>
            <sphereGeometry args={[0.018, 14, 14]} />
            <meshBasicMaterial color={isNight ? '#fef9c3' : '#d1d5db'} />
          </mesh>
          <mesh position={[0, 0, -0.011]}>
            <ringGeometry args={[0.02, 0.023, 20]} />
            <meshBasicMaterial color={isNight ? '#fef08a' : '#e5e7eb'} />
          </mesh>
        </group>
        <spotLight
          ref={rightHeadlightRef}
          target={targetRightRef.current}
          position={[0.11, 0.12, -0.53]}
          color="#fff8db"
          angle={0.44}
          penumbra={0.65}
          distance={8.5}
          intensity={0.0}
        />

        {/* Flush Stainless Navigation Running Lights (Port Ruby / Starboard Emerald) */}
        {/* Port (Ruby Red) */}
        <group position={[-0.194, 0.092, -0.28]}>
          <mesh>
            <boxGeometry args={[0.006, 0.018, 0.046]} />
            <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.08} />
          </mesh>
          <mesh position={[-0.002, 0, 0]}>
            <boxGeometry args={[0.004, 0.012, 0.038]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
        {/* Starboard (Emerald Green) */}
        <group position={[0.194, 0.092, -0.28]}>
          <mesh>
            <boxGeometry args={[0.006, 0.018, 0.046]} />
            <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.08} />
          </mesh>
          <mesh position={[0.002, 0, 0]}>
            <boxGeometry args={[0.004, 0.012, 0.038]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>

        {/* Lumishore-Style Underwater Transom Luminescence Lights (Cyan Glow in Wake) */}
        {/* Left Transom Puck */}
        <mesh position={[-0.12, -0.12, 0.49]}>
          <circleGeometry args={[0.018, 16]} />
          <meshBasicMaterial color={isNight ? '#06b6d4' : '#0891b2'} />
        </mesh>
        <pointLight
          ref={underwaterLightLeftRef}
          position={[-0.12, -0.12, 0.5]}
          color="#06b6d4"
          distance={3.2}
          intensity={0.0}
        />

        {/* Right Transom Puck */}
        <mesh position={[0.12, -0.12, 0.49]}>
          <circleGeometry args={[0.018, 16]} />
          <meshBasicMaterial color={isNight ? '#06b6d4' : '#0891b2'} />
        </mesh>
        <pointLight
          ref={underwaterLightRightRef}
          position={[0.12, -0.12, 0.5]}
          color="#06b6d4"
          distance={3.2}
          intensity={0.0}
        />
      </group>
    </>
  );
}
