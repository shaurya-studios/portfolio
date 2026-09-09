import { useRef, useEffect } from 'react';
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
  const { flyInComplete, setFlyInComplete, isCruising, focusedTarget } = useScenery();

  const initialTime = useRef<number | null>(null);
  const currentPos = useRef(new THREE.Vector3(0.6, 16, 22)); // High-altitude cinematic entry
  const currentTarget = useRef(new THREE.Vector3(2.2, 0, 0));

  // Blender-style free viewport orbit refs
  const isRightDown = useRef(false);
  const isFreeOrbiting = useRef(false);
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const orbitSpherical = useRef(new THREE.Spherical(12, 1.1, 0));
  const targetOrbitSpherical = useRef(new THREE.Spherical(12, 1.1, 0));
  const orbitCenter = useRef(new THREE.Vector3(2.2, 0.4, 0));
  const scrollAtRelease = useRef(0);

  // Waypoints for the biomes (Island offset at x = 2.2 so left 50% is pure typography)
  const heroPos = new THREE.Vector3(0.6, 3.8, 8.0);
  const heroTarget = new THREE.Vector3(2.2, 0.2, 0.0);

  const workPos = new THREE.Vector3(3.2, 2.4, 4.6);
  const workTarget = new THREE.Vector3(2.4, 0.8, -0.2);

  const servicesPos = new THREE.Vector3(0.6, 2.3, 4.8);
  const servicesTarget = new THREE.Vector3(1.8, 0.7, 0.4);

  const contactPos = new THREE.Vector3(1.6, 2.0, 5.4);
  const contactTarget = new THREE.Vector3(2.2, 0.4, 0.0);

  // Global listeners for Blender-style Right-Click Viewport Orbiting
  useEffect(() => {
    // Suppress context menu so right-click drag is never interrupted by the browser menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button === 2) {
        e.preventDefault();
        isRightDown.current = true;
        lastPointerPos.current = { x: e.clientX, y: e.clientY };

        // Determine pivot point: vessel in cruise mode, or current section target
        if (isCruising) {
          orbitCenter.current.set(boatPosRef.current.x, 0.35, boatPosRef.current.y);
        } else {
          orbitCenter.current.copy(currentTarget.current);
        }

        // Calculate spherical angles from current camera position relative to pivot
        const offset = new THREE.Vector3().subVectors(camera.position, orbitCenter.current);
        const spherical = new THREE.Spherical().setFromVector3(offset);

        // Clamp phi so we don't start below ocean level or looking straight down gimbal lock
        spherical.phi = THREE.MathUtils.clamp(spherical.phi, 0.08, Math.PI / 2 - 0.03);
        spherical.radius = THREE.MathUtils.clamp(spherical.radius, 2.5, 45.0);

        orbitSpherical.current.copy(spherical);
        targetOrbitSpherical.current.copy(spherical);
        isFreeOrbiting.current = true;

        if (!flyInComplete) {
          setFlyInComplete(true);
        }

        document.body.classList.add('blender-orbit-active');
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isRightDown.current) return;

      const dx = e.clientX - lastPointerPos.current.x;
      const dy = e.clientY - lastPointerPos.current.y;
      lastPointerPos.current = { x: e.clientX, y: e.clientY };

      if (e.shiftKey) {
        // Blender-style Pan: Shift + Right Drag pans the camera target
        const panSpeed = targetOrbitSpherical.current.radius * 0.0015;
        const right = new THREE.Vector3();
        camera.getWorldDirection(right);
        right.cross(camera.up).normalize();

        orbitCenter.current.addScaledVector(right, -dx * panSpeed);
        orbitCenter.current.y += dy * panSpeed;
        orbitCenter.current.y = Math.max(orbitCenter.current.y, 0.1);
      } else {
        // Blender-style Orbit: Right Drag rotates azimuth and elevation
        const rotSpeed = 0.0055;
        targetOrbitSpherical.current.theta -= dx * rotSpeed;
        targetOrbitSpherical.current.phi -= dy * rotSpeed;

        // Keep camera above water plane y=0 and prevent inverted flip
        targetOrbitSpherical.current.phi = THREE.MathUtils.clamp(
          targetOrbitSpherical.current.phi,
          0.08,
          Math.PI / 2 - 0.03
        );
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.button === 2) {
        isRightDown.current = false;
        scrollAtRelease.current = scrollYProgress.get();
        document.body.classList.remove('blender-orbit-active');
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Zoom with wheel when holding right click or when cruising in free orbit
      if (isRightDown.current || (isCruising && isFreeOrbiting.current)) {
        const zoomSpeed = 0.01;
        targetOrbitSpherical.current.radius = THREE.MathUtils.clamp(
          targetOrbitSpherical.current.radius + e.deltaY * zoomSpeed,
          2.5,
          45.0
        );
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape or R resets free orbit back to default view
      if (e.key === 'Escape' || e.key === 'r' || e.key === 'R') {
        if (isFreeOrbiting.current && !isCruising) {
          isFreeOrbiting.current = false;
        }
      }
    };

    const handleBlur = () => {
      isRightDown.current = false;
      document.body.classList.remove('blender-orbit-active');
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      document.body.classList.remove('blender-orbit-active');
    };
  }, [camera, isCruising, flyInComplete, setFlyInComplete, scrollYProgress, boatPosRef]);

  useFrame((state) => {
    if (initialTime.current === null) {
      initialTime.current = state.clock.elapsedTime;
    }
    const elapsed = state.clock.elapsedTime - initialTime.current;

    let targetCamPos = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3();

    // ========================================================
    // MODE 0: BLENDER-STYLE FREE VIEWPORT ORBIT
    // ========================================================
    if (isFreeOrbiting.current) {
      // Smooth spherical interpolation (damping)
      orbitSpherical.current.theta = THREE.MathUtils.lerp(
        orbitSpherical.current.theta,
        targetOrbitSpherical.current.theta,
        0.14
      );
      orbitSpherical.current.phi = THREE.MathUtils.lerp(
        orbitSpherical.current.phi,
        targetOrbitSpherical.current.phi,
        0.14
      );
      orbitSpherical.current.radius = THREE.MathUtils.lerp(
        orbitSpherical.current.radius,
        targetOrbitSpherical.current.radius,
        0.14
      );

      // In cruise mode, keep orbit center anchored to the hydrofoil vessel
      if (isCruising) {
        const bx = boatPosRef.current.x;
        const bz = boatPosRef.current.y;
        orbitCenter.current.lerp(new THREE.Vector3(bx, 0.35, bz), 0.12);

        // When user releases right click and drives forward, smoothly resume chase camera
        if (!isRightDown.current && boatSpeedRef.current > 0.08) {
          isFreeOrbiting.current = false;
        }
      } else {
        // In portfolio view, if user scrolls page noticeably after release, return to choreography
        if (!isRightDown.current) {
          const currentScroll = scrollYProgress.get();
          if (Math.abs(currentScroll - scrollAtRelease.current) > 0.02) {
            isFreeOrbiting.current = false;
          }
        }
      }

      // Convert spherical coordinates to 3D Cartesian space
      const r = orbitSpherical.current.radius;
      const phi = orbitSpherical.current.phi;
      const theta = orbitSpherical.current.theta;

      const camX = orbitCenter.current.x + r * Math.sin(phi) * Math.sin(theta);
      const camY = Math.max(orbitCenter.current.y + r * Math.cos(phi), 0.3);
      const camZ = orbitCenter.current.z + r * Math.sin(phi) * Math.cos(theta);

      targetCamPos.set(camX, camY, camZ);
      targetLookAt.copy(orbitCenter.current);

      currentPos.current.lerp(targetCamPos, 0.12);
      currentTarget.current.lerp(targetLookAt, 0.12);
    }
    // ========================================================
    // MODE A: BRUNO SIMON-STYLE 3RD-PERSON CHASE CAMERA
    // ========================================================
    else if (isCruising) {
      const bx = boatPosRef.current.x;
      const bz = boatPosRef.current.y;
      const heading = boatHeadingRef.current;
      const speed = boatSpeedRef.current;

      // Dynamic camera trailing distance expands slightly at higher speed
      const followDist = 4.2 + Math.min(speed * 0.3, 1.4);
      const followHeight = 2.2 + Math.min(speed * 0.15, 0.5);

      targetCamPos.set(
        bx + Math.sin(heading) * followDist,
        followHeight,
        bz + Math.cos(heading) * followDist
      );

      targetLookAt.set(
        bx - Math.sin(heading) * 2.0,
        0.2,
        bz - Math.cos(heading) * 2.0
      );

      // Smooth cinematic camera lag
      currentPos.current.lerp(targetCamPos, 0.08);
      currentTarget.current.lerp(targetLookAt, 0.09);
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

      // Synchronized 2D-to-3D Focus: hover on project or capability cards pivots view towards the monument
      if (focusedTarget === 'editify') {
        // Spotlight West Basalt Sea-Stack & Lighthouse
        targetCamPos.lerp(new THREE.Vector3(-0.8, 3.4, 6.2), 0.45);
        targetLookAt.lerp(new THREE.Vector3(-4.5, 1.2, -2.5), 0.45);
      } else if (focusedTarget === 'thumbpilot') {
        // Spotlight East Coral Reef & Creative Outpost
        targetCamPos.lerp(new THREE.Vector3(2.6, 3.2, 6.4), 0.45);
        targetLookAt.lerp(new THREE.Vector3(4.8, 0.9, -1.8), 0.45);
      } else if (focusedTarget === 'sanctuary') {
        // Spotlight Kinetic Sanctuary
        targetCamPos.lerp(new THREE.Vector3(-1.0, 3.6, 5.6), 0.45);
        targetLookAt.lerp(new THREE.Vector3(-3.5, 1.4, -2.0), 0.45);
      } else if (focusedTarget === 'villa') {
        // Spotlight Central Architectural Villa
        targetCamPos.lerp(new THREE.Vector3(0.5, 4.2, 7.5), 0.45);
        targetLookAt.lerp(new THREE.Vector3(0, 1.0, 0), 0.45);
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
  const { scene } = useThree();

  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);

  // Shared boat state refs for 60fps rendering without React re-render thrashing
  const boatPosRef = useRef<THREE.Vector2>(new THREE.Vector2(1.4, 4.0));
  const boatHeadingRef = useRef<number>(0.0);
  const boatSpeedRef = useRef<number>(0);
  const lastSpeedUpdate = useRef<number>(0);

  const handlePositionUpdate = (pos: THREE.Vector2, speed: number, heading: number) => {
    boatPosRef.current.copy(pos);
    boatSpeedRef.current = speed;
    boatHeadingRef.current = heading;

    // Throttle React state update for the HUD speedometer to 10Hz (100ms)
    const now = performance.now();
    if (now - lastSpeedUpdate.current > 100) {
      lastSpeedUpdate.current = now;
      setBoatSpeed(speed);
    }
  };

  useFrame(() => {
    // 1. Determine clean target colors and intensities for all 3 atmosphere modes
    const targetSunColor = isNight
      ? new THREE.Color('#93c5fd')
      : isSunset
      ? new THREE.Color('#f59e0b')
      : new THREE.Color('#ffffff');

    const targetSunIntensity = isNight ? 0.85 : isSunset ? 1.85 : 1.7;

    const targetHemiSky = isNight
      ? new THREE.Color('#1e293b')
      : isSunset
      ? new THREE.Color('#fed7aa')
      : new THREE.Color('#f8fafc');

    const targetHemiGround = isNight
      ? new THREE.Color('#030712')
      : isSunset
      ? new THREE.Color('#0c4a6e')
      : new THREE.Color('#94a3b8');

    const targetHemiIntensity = isNight ? 0.32 : isSunset ? 0.6 : 0.72;

    const targetRimColor = isNight
      ? new THREE.Color('#38bdf8')
      : isSunset
      ? new THREE.Color('#f43f5e')
      : new THREE.Color('#cbd5e1');

    const targetRimIntensity = isNight ? 0.55 : isSunset ? 0.65 : 0.45;

    const targetFogColor = isNight
      ? new THREE.Color('#070b12')
      : isSunset
      ? new THREE.Color('#211529')
      : new THREE.Color('#edf2f7');

    // 2. Smoothly lerp all active light properties for pristine, clean transitions
    if (dirLightRef.current) {
      dirLightRef.current.color.lerp(targetSunColor, 0.05);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        targetSunIntensity,
        0.05
      );
    }

    if (hemiLightRef.current) {
      hemiLightRef.current.color.lerp(targetHemiSky, 0.05);
      hemiLightRef.current.groundColor.lerp(targetHemiGround, 0.05);
      hemiLightRef.current.intensity = THREE.MathUtils.lerp(
        hemiLightRef.current.intensity,
        targetHemiIntensity,
        0.05
      );
    }

    if (rimLightRef.current) {
      rimLightRef.current.color.lerp(targetRimColor, 0.05);
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        rimLightRef.current.intensity,
        targetRimIntensity,
        0.05
      );
    }

    // 3. Smoothly dissolve background and atmospheric fog
    if (scene.fog && 'color' in scene.fog) {
      scene.fog.color.lerp(targetFogColor, 0.05);
    }
    if (scene.background && scene.background instanceof THREE.Color) {
      scene.background.lerp(targetFogColor, 0.05);
    }
  });

  return (
    <>
      <CameraController
        boatPosRef={boatPosRef}
        boatHeadingRef={boatHeadingRef}
        boatSpeedRef={boatSpeedRef}
      />

      {/* Pristine Studio Horizon Fog and Background */}
      <color attach="background" args={[isNight ? '#070b12' : isSunset ? '#211529' : '#edf2f7']} />
      <fog attach="fog" args={[isNight ? '#070b12' : isSunset ? '#211529' : '#edf2f7', 24, 85]} />

      {/* Key Directional Sun / Moon Light with Clean 2K Shadow Penumbra */}
      <directionalLight
        ref={dirLightRef}
        position={isSunset ? [16, 6, 8] : isNight ? [-8, 16, 8] : [10, 16, 8]}
        intensity={isSunset ? 1.85 : isNight ? 0.85 : 1.7}
        color={isSunset ? '#f59e0b' : isNight ? '#93c5fd' : '#ffffff'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1.0}
        shadow-camera-far={48}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.00015}
      />

      {/* Natural Hemisphere Fill: Sky-to-Ground Gradient for Clean Studio GI */}
      <hemisphereLight
        ref={hemiLightRef}
        args={['#f8fafc', '#94a3b8', 0.72]}
      />

      {/* Clean High-Angle Silhouette Rim Light (Scupting silhouettes from above) */}
      <directionalLight
        ref={rimLightRef}
        position={[-10, 12, -8]}
        intensity={0.45}
        color="#cbd5e1"
      />

      {/* Atmospheric Floating Dust / Bioluminescent Fireflies */}
      <AtmosphericParticles boatPosition={boatPosRef.current} />

      {/* Refined Architectural Ocean with Gerstner Waves & Boat Wake (60fps Ref-Driven) */}
      <StylizedWater
        boatPosRef={boatPosRef}
        boatSpeedRef={boatSpeedRef}
      />

      {/* The Procedural Floating Architectural Island */}
      <IslandTerrain boatPosRef={boatPosRef} />

      {/* Drivable Luxury Electric Hydrofoil Tender (The Bruno Simon Engine) */}
      <HydrofoilVessel
        onPositionUpdate={handlePositionUpdate}
        onCruiseToggle={(active) => setIsCruising(active)}
      />
    </>
  );
}
