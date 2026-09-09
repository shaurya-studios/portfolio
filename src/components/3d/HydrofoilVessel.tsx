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
  const targetLeftRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const targetRightRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const { timeOfDay } = useScenery();

  const isNight = timeOfDay === 'night';

  // Physical State of the Hydrofoil Tender
  const state = useRef({
    x: 0.85,
    z: 2.35,
    heading: 0.25, // Facing slightly towards open ocean
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

    // 1. ENGINE ACCELERATION & BRAKING
    const maxForwardSpeed = 3.8;
    const maxReverseSpeed = -1.2;
    const accel = 3.2;
    const drag = keys.brake ? 4.5 : 1.4;

    if (keys.forward) {
      s.speed += accel * dt;
      if (s.speed > maxForwardSpeed) s.speed = maxForwardSpeed;
    } else if (keys.backward) {
      s.speed -= accel * dt;
      if (s.speed < maxReverseSpeed) s.speed = maxReverseSpeed;
    } else {
      // Natural water friction drag
      if (s.speed > 0) {
        s.speed = Math.max(0, s.speed - drag * dt);
      } else if (s.speed < 0) {
        s.speed = Math.min(0, s.speed + drag * dt);
      }
    }

    // 2. STEERING WITH HYDROFOIL RUDDER
    const turnRate = 2.4;
    // Steering is more effective when moving, but retains slight harbor manoeuvrability
    const steerAuthority = Math.min(Math.abs(s.speed) * 0.7 + 0.35, 1.0);

    if (keys.left) {
      s.angularVel = THREE.MathUtils.lerp(s.angularVel, turnRate * steerAuthority, dt * 6.0);
    } else if (keys.right) {
      s.angularVel = THREE.MathUtils.lerp(s.angularVel, -turnRate * steerAuthority, dt * 6.0);
    } else {
      s.angularVel = THREE.MathUtils.lerp(s.angularVel, 0, dt * 5.0);
    }

    s.heading += s.angularVel * dt;

    // 3. VELOCITY VECTOR UPDATE
    const vx = -Math.sin(s.heading) * s.speed;
    const vz = -Math.cos(s.heading) * s.speed;

    s.x += vx * dt;
    s.z += vz * dt;

    // Boundaries: soft sea perimeter clamping
    const distFromOrigin = Math.sqrt(s.x * s.x + s.z * s.z);
    if (distFromOrigin > 8.5) {
      const angle = Math.atan2(s.z, s.x);
      s.x = Math.cos(angle) * 8.5;
      s.z = Math.sin(angle) * 8.5;
      s.speed *= 0.85;
    }

    // Island collision deflection (Island center approx at [1.2, 0], radius ~2.1)
    const dx = s.x - 1.2;
    const dz = s.z - 0.0;
    const islandDist = Math.sqrt(dx * dx + dz * dz);
    if (islandDist < 2.25) {
      const pushAngle = Math.atan2(dz, dx);
      s.x = 1.2 + Math.cos(pushAngle) * 2.26;
      s.z = 0.0 + Math.sin(pushAngle) * 2.26;
      s.speed *= 0.6; // Gentle harbor bumper recoil
    }

    // 4. HYDROFOIL WAVE BUOYANCY & KINETIC BANKING
    const t = sceneState.clock.elapsedTime;
    // Approximate Gerstner wave height at boat location
    const waveElev = 
      Math.sin(s.x * 0.75 + s.z * 0.5 + t * 1.2) * 0.04 +
      Math.sin(s.x * 1.35 - s.z * 0.85 + t * 1.6) * 0.025;

    // Foil lift: rises higher as speed increases
    const hydrofoilLift = Math.abs(s.speed) * 0.035;
    const targetY = -0.26 + waveElev + hydrofoilLift;

    // Banking roll (tilting into turns like a real racing tender)
    const targetRoll = -s.angularVel * 0.16;
    // Pitch (bow rises under acceleration)
    const targetPitch = (keys.forward ? 0.06 : 0) - (keys.backward ? 0.04 : 0);

    s.roll = THREE.MathUtils.lerp(s.roll, targetRoll, dt * 5.0);
    s.pitch = THREE.MathUtils.lerp(s.pitch, targetPitch, dt * 4.0);

    // Apply transformation
    groupRef.current.position.set(s.x, targetY, s.z);
    groupRef.current.rotation.y = s.heading;
    groupRef.current.rotation.z = s.roll;
    groupRef.current.rotation.x = s.pitch;

    // Inform parent scene for water wake & camera tracking
    onPositionUpdate?.(new THREE.Vector2(s.x, s.z), Math.abs(s.speed), s.heading);

    // 5. HEADLIGHT VOLUMETRIC TARGETS & NIGHT ILLUMINATION
    if (leftHeadlightRef.current && rightHeadlightRef.current) {
      const targetDist = 4.5;
      const targetX = s.x - Math.sin(s.heading) * targetDist;
      const targetZ = s.z - Math.cos(s.heading) * targetDist;

      targetLeftRef.current.position.set(targetX - 0.2, targetY - 0.2, targetZ);
      targetRightRef.current.position.set(targetX + 0.2, targetY - 0.2, targetZ);

      const targetIntensity = isNight ? 2.5 : 0.0;
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
  });

  return (
    <>
      <primitive object={targetLeftRef.current} />
      <primitive object={targetRightRef.current} />

      <group
        ref={groupRef}
        position={[0.85, -0.28, 2.35]}
        rotation={[0, 0.25, 0]}
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
            LUXURY ELECTRIC HYDROFOIL TENDER GEOMETRY
            =================================================== */}

        {/* 1. Main Faceted Monocoque Hull (Matte Onyx & Titanium) */}
        <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[0.32, 0.12, 0.82]} />
          <meshStandardMaterial
            color={isNight ? '#0a0d12' : '#1e2229'}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Sharpened Bow Nose */}
        <mesh position={[0, 0.045, -0.48]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.16, 0.26, 4]} />
          <meshStandardMaterial
            color={isNight ? '#0d1017' : '#232830'}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* 2. Teak Wood Deck Slatting (Quiet Luxury Detail) */}
        <mesh position={[0, 0.115, 0.02]} receiveShadow>
          <boxGeometry args={[0.26, 0.015, 0.62]} />
          <meshStandardMaterial
            color={isNight ? '#3a2d20' : '#8d6d4c'}
            roughness={0.65}
          />
        </mesh>

        {/* 3. Sleek Tinted Aerodynamic Windscreen */}
        <mesh position={[0, 0.155, -0.12]} rotation={[0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.26, 0.075, 0.03]} />
          <meshPhysicalMaterial
            color={isNight ? '#38bdf8' : '#111827'}
            transmission={0.85}
            opacity={0.9}
            transparent
            roughness={0.08}
            ior={1.52}
          />
        </mesh>

        {/* 4. Luxury Champagne Gold Trim Accents */}
        <mesh position={[0.165, 0.07, 0]}>
          <boxGeometry args={[0.012, 0.02, 0.76]} />
          <meshStandardMaterial color="#E9D8A6" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.165, 0.07, 0]}>
          <boxGeometry args={[0.012, 0.02, 0.76]} />
          <meshStandardMaterial color="#E9D8A6" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 5. Minimalist Glass Cockpit Instrument Console */}
        <mesh position={[0, 0.135, -0.06]} rotation={[-0.4, 0, 0]}>
          <planeGeometry args={[0.14, 0.05]} />
          <meshBasicMaterial color={isNight ? '#38bdf8' : '#e9d8a6'} />
        </mesh>

        {/* 6. Submerged Hydrofoil Struts (Below Waterline) */}
        <mesh position={[0, -0.09, -0.15]}>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
          <meshStandardMaterial color="#8E929E" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.17, -0.15]}>
          <boxGeometry args={[0.38, 0.012, 0.06]} />
          <meshStandardMaterial color="#C6B8A8" metalness={0.95} />
        </mesh>

        {/* 7. DUAL PROJECTOR HEADLIGHTS (Forward illumination in dark mode) */}
        {/* Left Projector */}
        <mesh position={[-0.1, 0.08, -0.44]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshBasicMaterial color={isNight ? '#fef08a' : '#C6B8A8'} />
        </mesh>
        <spotLight
          ref={leftHeadlightRef}
          target={targetLeftRef.current}
          position={[-0.1, 0.12, -0.45]}
          color="#fff8db"
          angle={0.45}
          penumbra={0.65}
          distance={8.0}
          intensity={0.0}
          castShadow
        />

        {/* Right Projector */}
        <mesh position={[0.1, 0.08, -0.44]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshBasicMaterial color={isNight ? '#fef08a' : '#C6B8A8'} />
        </mesh>
        <spotLight
          ref={rightHeadlightRef}
          target={targetRightRef.current}
          position={[0.1, 0.12, -0.45]}
          color="#fff8db"
          angle={0.45}
          penumbra={0.65}
          distance={8.0}
          intensity={0.0}
          castShadow
        />

        {/* 8. Stern Navigational Position Light (Ruby & Emerald) */}
        <mesh position={[-0.14, 0.09, 0.38]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.14, 0.09, 0.38]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>
    </>
  );
}
