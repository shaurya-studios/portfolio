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

    // Inform parent scene for water wake & camera tracking
    onPositionUpdate?.(new THREE.Vector2(s.x, s.z), Math.abs(s.speed), s.heading);

    // 6. HEADLIGHT VOLUMETRIC TARGETS & NIGHT ILLUMINATION
    if (leftHeadlightRef.current && rightHeadlightRef.current) {
      const targetDist = 5.0;
      const targetX = s.x - Math.sin(s.heading) * targetDist;
      const targetZ = s.z - Math.cos(s.heading) * targetDist;

      targetLeftRef.current.position.set(targetX - 0.25, targetY - 0.25, targetZ);
      targetRightRef.current.position.set(targetX + 0.25, targetY - 0.25, targetZ);

      const targetIntensity = isNight ? 2.8 : 0.0;
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

    // Underwater transom lights
    if (underwaterLightLeftRef.current && underwaterLightRightRef.current) {
      const underwaterTarget = isNight ? 2.2 : 0.0;
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
      const cockpitTarget = isNight ? 1.5 : 0.2;
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
        {/* ===================================================
            1. MULTI-FACETED AXE-BOW HULL (Carbon & Titanium)
            =================================================== */}
        {/* Main Monocoque Hull Body */}
        <mesh castShadow receiveShadow position={[0, 0.06, 0.02]}>
          <boxGeometry args={[0.38, 0.14, 0.88]} />
          <meshStandardMaterial
            color={isNight ? '#0b0e14' : '#1a1e26'}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Sharp Axe-Bow Knife-Edge Prow */}
        <mesh position={[0, 0.05, -0.52]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.19, 0.32, 4]} />
          <meshStandardMaterial
            color={isNight ? '#0d1017' : '#222731'}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Starboard & Port Spray Chine Strakes (Planing Ledges) */}
        <mesh position={[0.195, 0.015, -0.05]} rotation={[0, 0.04, 0]}>
          <boxGeometry args={[0.02, 0.015, 0.82]} />
          <meshStandardMaterial color="#8E929E" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[-0.195, 0.015, -0.05]} rotation={[0, -0.04, 0]}>
          <boxGeometry args={[0.02, 0.015, 0.82]} />
          <meshStandardMaterial color="#8E929E" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Satin Champagne Gold Waterline Accent Stripe */}
        <mesh position={[0, 0.005, 0.02]}>
          <boxGeometry args={[0.388, 0.018, 0.87]} />
          <meshStandardMaterial
            color="#E9D8A6"
            metalness={0.95}
            roughness={0.15}
            emissive="#E9D8A6"
            emissiveIntensity={isNight ? 0.35 : 0.05}
          />
        </mesh>

        {/* Aft Teak Swim Platform & Transom Terrace */}
        <mesh position={[0, 0.02, 0.49]} receiveShadow>
          <boxGeometry args={[0.34, 0.025, 0.14]} />
          <meshStandardMaterial color={isNight ? '#2e2319' : '#825f3e'} roughness={0.7} />
        </mesh>

        {/* Stainless Steel Swim Ladder Details on Transom */}
        <mesh position={[0.11, 0.015, 0.53]}>
          <boxGeometry args={[0.05, 0.01, 0.04]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* ===================================================
            2. TEAK DECKING WITH CAULKING & COCKPIT RECESS
            =================================================== */}
        {/* Foredeck Teak Inlay */}
        <mesh position={[0, 0.134, -0.32]} receiveShadow>
          <boxGeometry args={[0.3, 0.012, 0.26]} />
          <meshStandardMaterial color={isNight ? '#382b1e' : '#8d6d4c'} roughness={0.65} />
        </mesh>

        {/* Flush Tinted Foredeck Skylight Hatch */}
        <mesh position={[0, 0.142, -0.34]}>
          <boxGeometry args={[0.14, 0.006, 0.14]} />
          <meshPhysicalMaterial
            color="#0F1115"
            metalness={0.3}
            roughness={0.1}
            transmission={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Cockpit Floor Teak Planking */}
        <mesh position={[0, 0.065, 0.12]} receiveShadow>
          <boxGeometry args={[0.29, 0.015, 0.44]} />
          <meshStandardMaterial color={isNight ? '#35281b' : '#856645'} roughness={0.7} />
        </mesh>

        {/* Under-Gunwale Concealed LED Strip (Glows along cockpit coaming) */}
        {isNight && (
          <>
            <mesh position={[-0.145, 0.115, 0.12]}>
              <boxGeometry args={[0.008, 0.008, 0.42]} />
              <meshBasicMaterial color="#fde68a" />
            </mesh>
            <mesh position={[0.145, 0.115, 0.12]}>
              <boxGeometry args={[0.008, 0.008, 0.42]} />
              <meshBasicMaterial color="#fde68a" />
            </mesh>
          </>
        )}
        <pointLight
          ref={cockpitAmbientLightRef}
          position={[0, 0.18, 0.12]}
          color="#fef3c7"
          distance={1.6}
          intensity={0.2}
        />

        {/* ===================================================
            3. ERGONOMIC PILOT HELM & TWIN SPORTS BUCKET SEATS
            =================================================== */}
        {/* Port Bucket Seat (Driver) */}
        <group position={[-0.075, 0.14, 0.04]}>
          {/* Carbon Fiber Shell Backing */}
          <mesh castShadow>
            <boxGeometry args={[0.11, 0.14, 0.025]} />
            <meshStandardMaterial color="#111317" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Stitched Saddle Leather Cushion */}
          <mesh position={[0, -0.045, 0.05]}>
            <boxGeometry args={[0.105, 0.04, 0.1]} />
            <meshStandardMaterial color={isNight ? '#543d2b' : '#9a6b47'} roughness={0.65} />
          </mesh>
          {/* Back Cushion */}
          <mesh position={[0, 0.015, 0.015]}>
            <boxGeometry args={[0.095, 0.11, 0.02]} />
            <meshStandardMaterial color={isNight ? '#543d2b' : '#9a6b47'} roughness={0.65} />
          </mesh>
        </group>

        {/* Starboard Bucket Seat (Navigator) */}
        <group position={[0.075, 0.14, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[0.11, 0.14, 0.025]} />
            <meshStandardMaterial color="#111317" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.045, 0.05]}>
            <boxGeometry args={[0.105, 0.04, 0.1]} />
            <meshStandardMaterial color={isNight ? '#543d2b' : '#9a6b47'} roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.015, 0.015]}>
            <boxGeometry args={[0.095, 0.11, 0.02]} />
            <meshStandardMaterial color={isNight ? '#543d2b' : '#9a6b47'} roughness={0.65} />
          </mesh>
        </group>

        {/* Aft Sun-Lounge Daybed */}
        <group position={[0, 0.11, 0.32]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.28, 0.05, 0.18]} />
            <meshStandardMaterial color={isNight ? '#1e2430' : '#dedad3'} roughness={0.6} />
          </mesh>
          {/* Bolster Cushion */}
          <mesh position={[0, 0.04, -0.07]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.27, 12]} />
            <meshStandardMaterial color={isNight ? '#2a3344' : '#c8c2b7'} roughness={0.5} />
          </mesh>
        </group>

        {/* ===================================================
            4. ACTIVE HELM STATION & CONTROLS
            =================================================== */}
        {/* Modernist Sculpted Dashboard Console */}
        <mesh position={[0, 0.165, -0.1]}>
          <boxGeometry args={[0.29, 0.07, 0.06]} />
          <meshStandardMaterial color="#11141a" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Dual Multi-Function Displays (MFDs) */}
        {/* Left Primary Display (Radar / Speed Telemetry) */}
        <mesh position={[-0.07, 0.185, -0.07]} rotation={[-0.45, 0, 0]}>
          <planeGeometry args={[0.085, 0.04]} />
          <meshBasicMaterial color={isNight ? '#38bdf8' : '#0284c7'} />
        </mesh>
        {/* Right Secondary Display (Engine Diagnostics) */}
        <mesh position={[0.07, 0.185, -0.07]} rotation={[-0.45, 0, 0]}>
          <planeGeometry args={[0.085, 0.04]} />
          <meshBasicMaterial color={isNight ? '#f59e0b' : '#d97706'} />
        </mesh>

        {/* 3-Spoke Sports Steering Wheel (Rotates with A/D input) */}
        <group ref={steeringWheelRef} position={[-0.075, 0.165, -0.04]} rotation={[-0.45, 0, 0]}>
          {/* Wheel Rim */}
          <mesh castShadow>
            <torusGeometry args={[0.032, 0.005, 12, 24]} />
            <meshStandardMaterial color="#1f242e" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Champagne Gold Center Hub & Spokes */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.012, 12]} />
            <meshStandardMaterial color="#E9D8A6" metalness={0.95} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.058, 0.004, 0.004]} />
            <meshStandardMaterial color="#E9D8A6" metalness={0.95} />
          </mesh>
        </group>

        {/* Polished Throttle Binnacle & Levers (Pitches with W/S input) */}
        <group ref={throttleLeverRef} position={[0.0, 0.155, -0.04]}>
          <mesh>
            <boxGeometry args={[0.024, 0.015, 0.03]} />
            <meshStandardMaterial color="#0F1115" metalness={0.9} />
          </mesh>
          {/* Twin Polished Metal Levers */}
          <mesh position={[-0.006, 0.02, 0]}>
            <cylinderGeometry args={[0.002, 0.002, 0.035, 6]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.006, 0.02, 0]}>
            <cylinderGeometry args={[0.002, 0.002, 0.035, 6]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Spherical Dome Magnetic Compass */}
        <mesh position={[0, 0.205, -0.09]}>
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.9} roughness={0.1} transparent />
        </mesh>

        {/* ===================================================
            5. FRAMELESS AERODYNAMIC TINTED WINDSCREEN
            =================================================== */}
        <mesh position={[0, 0.205, -0.16]} rotation={[0.48, 0, 0]} castShadow>
          <boxGeometry args={[0.33, 0.095, 0.022]} />
          <meshPhysicalMaterial
            color={isNight ? '#38bdf8' : '#0F1115'}
            transmission={0.9}
            opacity={0.88}
            transparent
            roughness={0.05}
            ior={1.52}
          />
        </mesh>
        {/* Windscreen Titanium Clamp Trim */}
        <mesh position={[0, 0.16, -0.14]}>
          <boxGeometry args={[0.335, 0.012, 0.02]} />
          <meshStandardMaterial color="#C6B8A8" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* ===================================================
            6. EXTERIOR HARDWARE, CLEATS & ANTENNA
            =================================================== */}
        {/* Bow Stainless Anchor Roller & Miniature Plow Anchor */}
        <mesh position={[0, 0.065, -0.66]}>
          <boxGeometry args={[0.028, 0.018, 0.06]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.045, -0.69]} rotation={[0.4, 0, 0]}>
          <coneGeometry args={[0.018, 0.04, 3]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Pop-Up Stainless Mooring Cleats */}
        {/* Bow Port & Starboard */}
        <mesh position={[-0.14, 0.138, -0.42]}>
          <boxGeometry args={[0.012, 0.008, 0.038]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} />
        </mesh>
        <mesh position={[0.14, 0.138, -0.42]}>
          <boxGeometry args={[0.012, 0.008, 0.038]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} />
        </mesh>
        {/* Stern Port & Starboard */}
        <mesh position={[-0.17, 0.128, 0.4]}>
          <boxGeometry args={[0.012, 0.008, 0.038]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} />
        </mesh>
        <mesh position={[0.17, 0.128, 0.4]}>
          <boxGeometry args={[0.012, 0.008, 0.038]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} />
        </mesh>

        {/* Slender Stern VHF Whip Antenna with Nav Light */}
        <mesh position={[0.165, 0.35, 0.44]}>
          <cylinderGeometry args={[0.003, 0.006, 0.46, 6]} />
          <meshStandardMaterial color="#8E929E" metalness={0.9} />
        </mesh>
        <mesh position={[0.165, 0.59, 0.44]}>
          <sphereGeometry args={[0.009, 8, 8]} />
          <meshBasicMaterial color={isNight ? '#fde68a' : '#C6B8A8'} />
        </mesh>

        {/* ===================================================
            7. RETRACTABLE HYDROFOIL WINGS & PROPULSION POD
            =================================================== */}
        {/* Forward Main Hydrofoil Assembly */}
        {/* Twin Vertical Carbon Struts */}
        <mesh position={[-0.14, -0.12, -0.12]}>
          <cylinderGeometry args={[0.012, 0.015, 0.22, 8]} />
          <meshStandardMaterial color="#1a1e26" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0.14, -0.12, -0.12]}>
          <cylinderGeometry args={[0.012, 0.015, 0.22, 8]} />
          <meshStandardMaterial color="#1a1e26" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Swept Main Hydrofoil Wing (Inverted-T with Winglets) */}
        <mesh position={[0, -0.22, -0.12]}>
          <boxGeometry args={[0.48, 0.014, 0.075]} />
          <meshStandardMaterial color="#C6B8A8" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Port Winglet */}
        <mesh position={[-0.24, -0.19, -0.12]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.012, 0.065, 0.06]} />
          <meshStandardMaterial color="#E9D8A6" metalness={0.95} />
        </mesh>
        {/* Starboard Winglet */}
        <mesh position={[0.24, -0.19, -0.12]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.012, 0.065, 0.06]} />
          <meshStandardMaterial color="#E9D8A6" metalness={0.95} />
        </mesh>

        {/* Aft Rudder Strut & Electric Torpedo Pod Motor */}
        <mesh position={[0, -0.11, 0.36]}>
          <boxGeometry args={[0.016, 0.22, 0.065]} />
          <meshStandardMaterial color="#1a1e26" metalness={0.9} />
        </mesh>
        {/* Torpedo Motor Housing */}
        <mesh position={[0, -0.21, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.16, 16]} />
          <meshStandardMaterial color="#0F1115" metalness={0.9} />
        </mesh>

        {/* 4-Blade Spinning Propeller (Spins with boat velocity!) */}
        <group ref={propellerRef} position={[0, -0.21, 0.45]}>
          {/* Propeller Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.016, 0.024, 12]} />
            <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* 4 Swept Blades */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
            <mesh key={`prop-blade-${i}`} rotation={[0, 0, angle]} position={[0, 0.032, 0]}>
              <boxGeometry args={[0.012, 0.048, 0.004]} />
              <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.1} />
            </mesh>
          ))}
        </group>

        {/* Stern Planing Spray Rooster Tail (Visible when moving fast) */}
        <group ref={sternSprayRef} position={[0, -0.18, 0.58]} visible={false}>
          <mesh rotation={[-Math.PI / 2.3, 0, 0]}>
            <coneGeometry args={[0.18, 0.45, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.45} />
          </mesh>
        </group>

        {/* ===================================================
            8. ADVANCED LIGHTING & NAVIGATION POSITION LEDS
            =================================================== */}
        {/* Dual Forward Focused Projector Headlights */}
        <mesh position={[-0.11, 0.085, -0.52]}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshBasicMaterial color={isNight ? '#fef08a' : '#C6B8A8'} />
        </mesh>
        <spotLight
          ref={leftHeadlightRef}
          target={targetLeftRef.current}
          position={[-0.11, 0.13, -0.53]}
          color="#fff8db"
          angle={0.42}
          penumbra={0.6}
          distance={8.5}
          intensity={0.0}
        />

        <mesh position={[0.11, 0.085, -0.52]}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshBasicMaterial color={isNight ? '#fef08a' : '#C6B8A8'} />
        </mesh>
        <spotLight
          ref={rightHeadlightRef}
          target={targetRightRef.current}
          position={[0.11, 0.13, -0.53]}
          color="#fff8db"
          angle={0.42}
          penumbra={0.6}
          distance={8.5}
          intensity={0.0}
        />

        {/* Recessed Port (Ruby Red) & Starboard (Emerald Green) Navigation Lights */}
        <mesh position={[-0.192, 0.09, -0.28]}>
          <boxGeometry args={[0.008, 0.016, 0.04]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.192, 0.09, -0.28]}>
          <boxGeometry args={[0.008, 0.016, 0.04]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>

        {/* Dual Underwater Transom Luminescence Lights (Cyan glow in water wake) */}
        <pointLight
          ref={underwaterLightLeftRef}
          position={[-0.12, -0.12, 0.48]}
          color="#06b6d4"
          distance={3.0}
          intensity={0.0}
        />
        <pointLight
          ref={underwaterLightRightRef}
          position={[0.12, -0.12, 0.48]}
          color="#06b6d4"
          distance={3.0}
          intensity={0.0}
        />
      </group>
    </>
  );
}
