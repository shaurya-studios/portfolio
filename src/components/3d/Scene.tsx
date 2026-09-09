import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';
import IslandTerrain from './IslandTerrain';
import StylizedWater from './StylizedWater';
import HydrofoilVessel from './HydrofoilVessel';
import AtmosphericParticles from './AtmosphericParticles';
import { useScenery } from '../../context/SceneryContext';

function CameraController({
  boatPosRef,
  boatHeadingRef,
  boatSpeedRef,
}: {
  boatPosRef: React.MutableRefObject<THREE.Vector2>;
  boatHeadingRef: React.MutableRefObject<number>;
  boatSpeedRef: React.MutableRefObject<number>;
}) {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();
  const { flyInComplete, setFlyInComplete, isCruising } = useScenery();

  const initialTime = useRef<number | null>(null);
  const currentPos = useRef(new THREE.Vector3(1.2, 16, 22)); // High-altitude cinematic entry
  const currentTarget = useRef(new THREE.Vector3(1.2, 0, 0));

  // Waypoints for the biomes (Island offset at x = 1.2 for asymmetrical layout)
  const heroPos = new THREE.Vector3(1.2, 3.8, 6.6);
  const heroTarget = new THREE.Vector3(1.2, 0.15, 0);

  const workPos = new THREE.Vector3(2.4, 2.3, 4.2);
  const workTarget = new THREE.Vector3(1.9, 0.85, -0.35);

  const servicesPos = new THREE.Vector3(-0.4, 2.2, 4.4);
  const servicesTarget = new THREE.Vector3(0.4, 0.75, 0.35);

  const contactPos = new THREE.Vector3(1.2, 1.9, 4.8);
  const contactTarget = new THREE.Vector3(1.2, 0.55, 0);

  useFrame((state) => {
    if (initialTime.current === null) {
      initialTime.current = state.clock.elapsedTime;
    }
    const elapsed = state.clock.elapsedTime - initialTime.current;

    let targetCamPos = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3();

    // ========================================================
    // MODE A: BRUNO SIMON-STYLE 3RD-PERSON CHASE CAMERA
    // ========================================================
    if (isCruising) {
      const bx = boatPosRef.current.x;
      const bz = boatPosRef.current.y;
      const heading = boatHeadingRef.current;
      const speed = boatSpeedRef.current;

      // Dynamic camera trailing distance expands slightly at higher speed
      const followDist = 3.6 + Math.min(speed * 0.3, 1.2);
      const followHeight = 1.6 + Math.min(speed * 0.1, 0.5);

      targetCamPos.set(
        bx + Math.sin(heading) * followDist,
        followHeight,
        bz + Math.cos(heading) * followDist
      );

      targetLookAt.set(
        bx - Math.sin(heading) * 1.8,
        0.2,
        bz - Math.cos(heading) * 1.8
      );

      // Subtle turn banking on camera
      currentPos.current.lerp(targetCamPos, 0.075);
      currentTarget.current.lerp(targetLookAt, 0.08);
    }
    // ========================================================
    // MODE B: CINEMATIC FLY-IN INTRO
    // ========================================================
    else if (elapsed < 2.4) {
      const progress = Math.min(elapsed / 2.4, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      targetCamPos.lerpVectors(new THREE.Vector3(1.2, 16, 22), heroPos, ease);
      targetLookAt.lerpVectors(new THREE.Vector3(1.2, 0, 0), heroTarget, ease);

      if (progress >= 0.99 && !flyInComplete) {
        setFlyInComplete(true);
      }

      currentPos.current.lerp(targetCamPos, 0.06);
      currentTarget.current.lerp(targetLookAt, 0.06);
    }
    // ========================================================
    // MODE C: EDITORIAL SCROLL CHOREOGRAPHY
    // ========================================================
    else {
      const scroll = scrollYProgress.get();

      if (scroll < 0.28) {
        const t = scroll / 0.28;
        targetCamPos.lerpVectors(heroPos, workPos, t);
        targetLookAt.lerpVectors(heroTarget, workTarget, t);
      } else if (scroll < 0.62) {
        const t = (scroll - 0.28) / 0.34;
        targetCamPos.lerpVectors(workPos, servicesPos, t);
        targetLookAt.lerpVectors(workTarget, servicesTarget, t);
      } else {
        const t = (scroll - 0.62) / 0.38;
        targetCamPos.lerpVectors(servicesPos, contactPos, Math.min(t, 1));
        targetLookAt.lerpVectors(servicesTarget, contactTarget, Math.min(t, 1));
      }

      // Gentle mouse parallax damping
      targetCamPos.x += state.pointer.x * 0.32;
      targetCamPos.y += state.pointer.y * 0.22;

      currentPos.current.lerp(targetCamPos, 0.055);
      currentTarget.current.lerp(targetLookAt, 0.055);
    }

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

export default function Scene() {
  const { timeOfDay, setIsCruising, setBoatSpeed } = useScenery();
  const isNight = timeOfDay === 'night';

  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);

  // Shared boat state refs for 60fps rendering without React re-render thrashing
  const boatPosRef = useRef<THREE.Vector2>(new THREE.Vector2(0.85, 2.35));
  const boatHeadingRef = useRef<number>(0.25);
  const boatSpeedRef = useRef<number>(0);

  const handlePositionUpdate = (pos: THREE.Vector2, speed: number, heading: number) => {
    boatPosRef.current.copy(pos);
    boatSpeedRef.current = speed;
    boatHeadingRef.current = heading;
    setBoatSpeed(speed);
  };

  useFrame(() => {
    // Smooth lighting transition between Day and Night
    if (dirLightRef.current) {
      const targetColor = isNight ? new THREE.Color('#d6f1f5') : new THREE.Color('#fff8ed');
      dirLightRef.current.color.lerp(targetColor, 0.05);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        isNight ? 1.2 : 2.2,
        0.05
      );
    }

    if (ambientLightRef.current) {
      const targetAmbColor = isNight ? new THREE.Color('#0a131c') : new THREE.Color('#F7F5F0');
      ambientLightRef.current.color.lerp(targetAmbColor, 0.05);
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        isNight ? 0.38 : 0.85,
        0.05
      );
    }

    if (rimLightRef.current) {
      const targetRimColor = isNight ? new THREE.Color('#38bdf8') : new THREE.Color('#C6B8A8');
      rimLightRef.current.color.lerp(targetRimColor, 0.05);
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        rimLightRef.current.intensity,
        isNight ? 0.7 : 0.4,
        0.05
      );
    }
  });

  return (
    <>
      <CameraController
        boatPosRef={boatPosRef}
        boatHeadingRef={boatHeadingRef}
        boatSpeedRef={boatSpeedRef}
      />

      {/* Atmospheric Fog and Sky Color */}
      <color attach="background" args={[isNight ? '#0A0B0E' : '#F7F5F0']} />
      <fog attach="fog" args={[isNight ? '#0A0B0E' : '#FBF9F6', 8, 26]} />

      {/* Key Directional Sun / Moon Light */}
      <directionalLight
        ref={dirLightRef}
        position={[8, 14, 8]}
        intensity={2.2}
        color="#fff8ed"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Fill Ambient Light */}
      <ambientLight ref={ambientLightRef} intensity={0.85} color="#F7F5F0" />

      {/* Rim / Bounce Light */}
      <directionalLight
        ref={rimLightRef}
        position={[-8, -5, -8]}
        intensity={0.4}
        color="#C6B8A8"
      />

      {/* Atmospheric Floating Dust / Bioluminescent Fireflies */}
      <AtmosphericParticles boatPosition={boatPosRef.current} />

      {/* Refined Architectural Ocean with Gerstner Waves & Boat Wake */}
      <StylizedWater
        boatPosition={boatPosRef.current}
        boatSpeed={boatSpeedRef.current}
      />

      {/* The Procedural Floating Architectural Island */}
      <IslandTerrain boatPosition={boatPosRef.current} />

      {/* Drivable Luxury Electric Hydrofoil Tender (The Bruno Simon Engine) */}
      <HydrofoilVessel
        onPositionUpdate={handlePositionUpdate}
        onCruiseToggle={(active) => setIsCruising(active)}
      />
    </>
  );
}
