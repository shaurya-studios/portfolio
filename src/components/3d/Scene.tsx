import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';
import IslandTerrain from './IslandTerrain';
import StylizedWater from './StylizedWater';
import { useScenery } from '../../context/SceneryContext';

function CameraController() {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();
  const { flyInComplete, setFlyInComplete } = useScenery();

  // Camera animation refs
  const initialTime = useRef<number | null>(null);
  const currentPos = useRef(new THREE.Vector3(0, 18, 24)); // High-altitude intro position
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Waypoints for the biomes
  // 1. Hero: Wide panoramic isometric view
  const heroPos = new THREE.Vector3(2.6, 3.6, 6.2);
  const heroTarget = new THREE.Vector3(0, 0.2, 0);

  // 2. Work: Close focus on Tech Outpost (right cliff) & Pier
  const workPos = new THREE.Vector3(2.4, 2.3, 3.8);
  const workTarget = new THREE.Vector3(0.75, 1.0, -0.4);

  // 3. Capabilities: Orbit to frame Kinetic Beacon (left terrace)
  const servicesPos = new THREE.Vector3(-2.2, 2.4, 4.2);
  const servicesTarget = new THREE.Vector3(-0.8, 0.9, 0.4);

  // 4. Contact & Pricing: Dramatic low-angle architectural perspective
  const contactPos = new THREE.Vector3(0.5, 1.8, 4.6);
  const contactTarget = new THREE.Vector3(0.2, 0.7, 0);

  useFrame((state) => {
    if (initialTime.current === null) {
      initialTime.current = state.clock.elapsedTime;
    }
    const elapsed = state.clock.elapsedTime - initialTime.current;

    let targetCamPos = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3();

    // PHASE 1: Cinematic Fly-in Camera Intro (First 2.5 seconds)
    if (elapsed < 2.5) {
      const progress = Math.min(elapsed / 2.5, 1);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      
      targetCamPos.lerpVectors(new THREE.Vector3(0, 18, 22), heroPos, ease);
      targetLookAt.lerpVectors(new THREE.Vector3(0, 0, 0), heroTarget, ease);
      
      if (progress >= 0.99 && !flyInComplete) {
        setFlyInComplete(true);
      }
    } else {
      // PHASE 2: Scroll-Driven Drone Navigation across Biomes
      const scroll = scrollYProgress.get();

      if (scroll < 0.28) {
        // Hero Biome
        const t = scroll / 0.28;
        targetCamPos.lerpVectors(heroPos, workPos, t);
        targetLookAt.lerpVectors(heroTarget, workTarget, t);
      } else if (scroll < 0.62) {
        // Work Biome -> Capabilities Biome
        const t = (scroll - 0.28) / 0.34;
        targetCamPos.lerpVectors(workPos, servicesPos, t);
        targetLookAt.lerpVectors(workTarget, servicesTarget, t);
      } else {
        // Capabilities -> Contact & Pricing Biome
        const t = (scroll - 0.62) / 0.38;
        targetCamPos.lerpVectors(servicesPos, contactPos, Math.min(t, 1));
        targetLookAt.lerpVectors(servicesTarget, contactTarget, Math.min(t, 1));
      }

      // Add gentle interactive mouse parallax
      targetCamPos.x += (state.pointer.x * 0.4);
      targetCamPos.y += (state.pointer.y * 0.3);
    }

    // Smoothly interpolate current camera position
    currentPos.current.lerp(targetCamPos, 0.06);
    currentTarget.current.lerp(targetLookAt, 0.06);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

export default function Scene() {
  const { timeOfDay } = useScenery();
  const isNight = timeOfDay === 'night';

  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);

  // Smoothly lerp lighting when toggling between Golden Hour & Midnight
  useFrame(() => {
    if (dirLightRef.current) {
      const targetColor = isNight ? new THREE.Color('#E0FBFC') : new THREE.Color('#FFF6E5');
      dirLightRef.current.color.lerp(targetColor, 0.05);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        isNight ? 1.4 : 2.4,
        0.05
      );
    }

    if (ambientLightRef.current) {
      const targetAmbColor = isNight ? new THREE.Color('#0d1726') : new THREE.Color('#F7F5F0');
      ambientLightRef.current.color.lerp(targetAmbColor, 0.05);
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        isNight ? 0.45 : 0.95,
        0.05
      );
    }

    if (rimLightRef.current) {
      const targetRimColor = isNight ? new THREE.Color('#5eead4') : new THREE.Color('#C6B8A8');
      rimLightRef.current.color.lerp(targetRimColor, 0.05);
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        rimLightRef.current.intensity,
        isNight ? 0.9 : 0.6,
        0.05
      );
    }
  });

  return (
    <>
      <CameraController />

      {/* Atmospheric Fog and Sky color */}
      <color attach="background" args={[isNight ? '#0A0B0E' : '#F7F5F0']} />
      <fog attach="fog" args={[isNight ? '#0A0B0E' : '#FBF9F6', 8, 26]} />

      {/* Key Directional Sun / Moon Light */}
      <directionalLight
        ref={dirLightRef}
        position={[8, 14, 8]}
        intensity={2.4}
        color="#FFF6E5"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      {/* Fill Ambient Light */}
      <ambientLight ref={ambientLightRef} intensity={0.9} color="#F7F5F0" />

      {/* Soft Rim / Bounce Light */}
      <directionalLight
        ref={rimLightRef}
        position={[-8, -6, -8]}
        intensity={0.6}
        color="#C6B8A8"
      />

      {/* Stylized Ocean Base */}
      <StylizedWater />

      {/* The Procedural Floating Architectural Island */}
      <IslandTerrain />
    </>
  );
}
