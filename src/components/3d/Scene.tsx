import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';
import IslandTerrain from './IslandTerrain';
import StylizedWater from './StylizedWater';
import HydrofoilVessel from './HydrofoilVessel';
import AtmosphericParticles from './AtmosphericParticles';
import { useScenery } from '../../context/SceneryContext';

// Static constant colors to eliminate in-loop GC allocations
const SUN_COLOR_NIGHT = new THREE.Color('#93c5fd');
const SUN_COLOR_SUNSET = new THREE.Color('#f59e0b');
const SUN_COLOR_DAY = new THREE.Color('#ffffff');

const HEMI_SKY_NIGHT = new THREE.Color('#1e293b');
const HEMI_SKY_SUNSET = new THREE.Color('#fed7aa');
const HEMI_SKY_DAY = new THREE.Color('#f8fafc');

const HEMI_GROUND_NIGHT = new THREE.Color('#030712');
const HEMI_GROUND_SUNSET = new THREE.Color('#0c4a6e');
const HEMI_GROUND_DAY = new THREE.Color('#94a3b8');

const RIM_COLOR_NIGHT = new THREE.Color('#38bdf8');
const RIM_COLOR_SUNSET = new THREE.Color('#f43f5e');
const RIM_COLOR_DAY = new THREE.Color('#cbd5e1');

const FOG_COLOR_NIGHT = new THREE.Color('#070b12');
const FOG_COLOR_SUNSET = new THREE.Color('#211529');
const FOG_COLOR_DAY = new THREE.Color('#edf2f7');

// Constant Waypoints for Islands & Archipelago
const HERO_CAM_POS = new THREE.Vector3(0.6, 3.8, 8.0);
const HERO_CAM_TARGET = new THREE.Vector3(2.2, 0.2, 0.0);

const WORKS_CAM_POS = new THREE.Vector3(-1.4, 3.2, 3.8);
const WORKS_CAM_TARGET = new THREE.Vector3(-4.5, 0.8, -2.5);

const PRICING_CAM_POS = new THREE.Vector3(3.8, 3.2, 3.2);
const PRICING_CAM_TARGET = new THREE.Vector3(6.8, 0.7, -3.2);

const OVERVIEW_CAM_POS = new THREE.Vector3(1.2, 7.5, 14.0);
const OVERVIEW_CAM_TARGET = new THREE.Vector3(1.5, 0.0, -1.0);

// Pre-allocated scratch vectors for CameraController to eliminate GC pauses
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

// Shortest-arc angular damping helper for 100% glitch-free camera rotations
function dampAngle(current: number, target: number, lambda: number, dt: number): number {
  let diff = (target - current) % (Math.PI * 2);
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * (1 - Math.exp(-lambda * dt));
}

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
  const { flyInComplete, setFlyInComplete, isCruising, dockZone } = useScenery();

  const initialTime = useRef<number | null>(null);
  const currentPos = useRef(new THREE.Vector3(0.6, 16, 22)); // High-altitude cinematic entry
  const currentTarget = useRef(new THREE.Vector3(2.2, 0, 0));

  // Cinematic Docking Transition Tracking
  const wasCruising = useRef(false);
  const dockTransitionTime = useRef<number | null>(null);
  const dockFromPos = useRef(new THREE.Vector3());
  const dockFromTarget = useRef(new THREE.Vector3());
  const dockTargetZone = useRef<'works' | 'pricing' | 'hero'>('hero');

  // Smoothed camera follow angle on boom-arm for silky arcade chase camera
  const camFollowAngle = useRef(0.0);
  const isCruisingInit = useRef(false);

  // Blender-style free viewport orbit refs
  const isRightDown = useRef(false);
  const isFreeOrbiting = useRef(false);
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const orbitSpherical = useRef(new THREE.Spherical(12, 1.1, 0));
  const targetOrbitSpherical = useRef(new THREE.Spherical(12, 1.1, 0));
  const orbitCenter = useRef(new THREE.Vector3(2.2, 0.4, 0));
  const scrollAtRelease = useRef(0);


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

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    if (initialTime.current === null) {
      initialTime.current = state.clock.elapsedTime;
    }
    const elapsed = state.clock.elapsedTime - initialTime.current;

    // Detect transition from Cruise mode to Docked mode
    if (wasCruising.current && !isCruising) {
      dockTransitionTime.current = 0;
      dockFromPos.current.copy(camera.position);
      dockFromTarget.current.copy(currentTarget.current);
      dockTargetZone.current = (dockZone as 'works' | 'pricing' | 'hero') || 'hero';
    }
    wasCruising.current = isCruising;

    // ========================================================
    // MODE 0: BLENDER-STYLE FREE VIEWPORT ORBIT
    // ========================================================
    if (isFreeOrbiting.current) {
      // Smooth spherical interpolation (damping)
      orbitSpherical.current.theta = THREE.MathUtils.damp(
        orbitSpherical.current.theta,
        targetOrbitSpherical.current.theta,
        12.0,
        dt
      );
      orbitSpherical.current.phi = THREE.MathUtils.damp(
        orbitSpherical.current.phi,
        targetOrbitSpherical.current.phi,
        12.0,
        dt
      );
      orbitSpherical.current.radius = THREE.MathUtils.damp(
        orbitSpherical.current.radius,
        targetOrbitSpherical.current.radius,
        12.0,
        dt
      );

      // In cruise mode, keep orbit center anchored to the hydrofoil vessel
      if (isCruising) {
        const bx = boatPosRef.current.x;
        const bz = boatPosRef.current.y;
        orbitCenter.current.lerp(new THREE.Vector3(bx, 0.35, bz), 1 - Math.exp(-8.0 * dt));

        // When user releases right click and drives forward, smoothly resume chase camera
        if (!isRightDown.current && boatSpeedRef.current > 0.08) {
          // Initialize camFollowAngle to current relative camera angle to guarantee ZERO camera jump
          const currentAngle = Math.atan2(camera.position.x - bx, camera.position.z - bz);
          camFollowAngle.current = currentAngle;
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

      _targetCamPos.set(camX, camY, camZ);
      _targetLookAt.copy(orbitCenter.current);

      currentPos.current.lerp(_targetCamPos, 1 - Math.exp(-10.0 * dt));
      currentTarget.current.lerp(_targetLookAt, 1 - Math.exp(-10.0 * dt));
    }
    // ========================================================
    // MODE A: BUTTER-SMOOTH ARCADE CHASE CAMERA (SPHERICAL BOOM ARM)
    // ========================================================
    else if (isCruising) {
      const bx = boatPosRef.current.x;
      const bz = boatPosRef.current.y;
      const heading = boatHeadingRef.current;
      const speed = boatSpeedRef.current;

      if (!isCruisingInit.current) {
        isCruisingInit.current = true;
        camFollowAngle.current = heading;
      }

      // Shortest-arc angular damping tracks heading along an arc (never cuts chords or jitters)
      camFollowAngle.current = dampAngle(camFollowAngle.current, heading, 3.8, dt);

      // Trailing distance expands subtly with speed
      const followDist = 4.4 + Math.min(speed * 0.25, 1.2);
      const followHeight = 2.3 + Math.min(speed * 0.12, 0.4);

      // Camera sits on a constant-radius spherical boom arm behind the boat
      _targetCamPos.set(
        bx + Math.sin(camFollowAngle.current) * followDist,
        followHeight,
        bz + Math.cos(camFollowAngle.current) * followDist
      );

      // Target looks ahead along the vessel hull for dynamic horizon view
      _targetLookAt.set(
        bx - Math.sin(heading) * 1.5,
        0.35,
        bz - Math.cos(heading) * 1.5
      );

      // Framerate-independent fluid damping
      currentPos.current.lerp(_targetCamPos, 1 - Math.exp(-10.0 * dt));
      currentTarget.current.lerp(_targetLookAt, 1 - Math.exp(-12.0 * dt));
    }
    // ========================================================
    // MODE A.2: CINEMATIC DOCKING TRANSITION EASE (LOCKED TARGET)
    // ========================================================
    else if (dockTransitionTime.current !== null) {
      isCruisingInit.current = false;
      dockTransitionTime.current += dt;
      const duration = 1.25;
      const progress = Math.min(dockTransitionTime.current / duration, 1.0);
      const ease = 1 - Math.pow(1 - progress, 3);

      let destCamPos = HERO_CAM_POS;
      let destLookAt = HERO_CAM_TARGET;
      if (dockTargetZone.current === 'works') {
        destCamPos = WORKS_CAM_POS;
        destLookAt = WORKS_CAM_TARGET;
      } else if (dockTargetZone.current === 'pricing') {
        destCamPos = PRICING_CAM_POS;
        destLookAt = PRICING_CAM_TARGET;
      }

      _targetCamPos.lerpVectors(dockFromPos.current, destCamPos, ease);
      _targetLookAt.lerpVectors(dockFromTarget.current, destLookAt, ease);

      currentPos.current.copy(_targetCamPos);
      currentTarget.current.copy(_targetLookAt);

      if (progress >= 1.0) {
        dockTransitionTime.current = null;
      }
    }
    // ========================================================
    // MODE B: CINEMATIC FLY-IN INTRO
    // ========================================================
    else if (elapsed < 2.4) {
      const progress = Math.min(elapsed / 2.4, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      _targetCamPos.lerpVectors(new THREE.Vector3(1.2, 16, 22), HERO_CAM_POS, ease);
      _targetLookAt.lerpVectors(new THREE.Vector3(1.2, 0, 0), HERO_CAM_TARGET, ease);

      if (progress >= 0.99 && !flyInComplete) {
        setFlyInComplete(true);
      }

      currentPos.current.lerp(_targetCamPos, 1 - Math.exp(-4.5 * dt));
      currentTarget.current.lerp(_targetLookAt, 1 - Math.exp(-4.5 * dt));
    }
    // ========================================================
    // MODE C: EDITORIAL 3-ISLAND SCROLL CHOREOGRAPHY
    // ========================================================
    else {
      const scroll = scrollYProgress.get();

      if (scroll < 0.32) {
        // Hero Section (Main Studio Island) -> Works Island
        const t = scroll / 0.32;
        _targetCamPos.lerpVectors(HERO_CAM_POS, WORKS_CAM_POS, t);
        _targetLookAt.lerpVectors(HERO_CAM_TARGET, WORKS_CAM_TARGET, t);
      } else if (scroll < 0.68) {
        // Works Island -> Pricing & Telemetry Atoll
        const t = (scroll - 0.32) / 0.36;
        _targetCamPos.lerpVectors(WORKS_CAM_POS, PRICING_CAM_POS, t);
        _targetLookAt.lerpVectors(WORKS_CAM_TARGET, PRICING_CAM_TARGET, t);
      } else {
        // Pricing Atoll -> Full Archipelago Panoramic Overview
        const t = Math.min((scroll - 0.68) / 0.32, 1.0);
        _targetCamPos.lerpVectors(PRICING_CAM_POS, OVERVIEW_CAM_POS, t);
        _targetLookAt.lerpVectors(PRICING_CAM_TARGET, OVERVIEW_CAM_TARGET, t);
      }

      // Gentle organic mouse parallax damping (never jerks or snaps)
      _targetCamPos.x += state.pointer.x * 0.26;
      _targetCamPos.y += state.pointer.y * 0.16;

      currentPos.current.lerp(_targetCamPos, 1 - Math.exp(-4.0 * dt));
      currentTarget.current.lerp(_targetLookAt, 1 - Math.exp(-4.0 * dt));
    }

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

export default function Scene() {
  const { timeOfDay, setIsCruising, setBoatSpeed, setFirstFrameRendered } = useScenery();
  const { scene, invalidate } = useThree();

  useEffect(() => {
    const triggerRender = () => invalidate();
    window.addEventListener('invalidate-frame', triggerRender);
    window.addEventListener('mousemove', triggerRender); // Also render if they move the mouse (hover effects)
    return () => {
      window.removeEventListener('invalidate-frame', triggerRender);
      window.removeEventListener('mousemove', triggerRender);
    };
  }, [invalidate]);

  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  
  const hasRenderedFirstFrame = useRef(false);
  useFrame(() => {
    if (!hasRenderedFirstFrame.current) {
      hasRenderedFirstFrame.current = true;
      setFirstFrameRendered(true);
    }
  });

  // Shared boat state refs for 60fps rendering without React re-render thrashing
  const boatPosRef = useRef<THREE.Vector2>(new THREE.Vector2(1.4, 4.0));
  const boatHeadingRef = useRef<number>(0.0);
  const boatSpeedRef = useRef<number>(0);
  const lastSpeedUpdate = useRef<number>(0);

  const handlePositionUpdate = (pos: THREE.Vector2, speed: number, heading: number) => {
    boatPosRef.current.copy(pos);
    boatSpeedRef.current = speed;
    boatHeadingRef.current = heading;

    // Emits speed to HUD telemetry subscriber without React re-render thrashing
    const now = performance.now();
    if (now - lastSpeedUpdate.current > 50) {
      lastSpeedUpdate.current = now;
      setBoatSpeed(speed);
    }
  };

  useFrame(() => {
    // 1. Static constant colors eliminate all in-loop GC allocations
    const targetSunColor = isNight ? SUN_COLOR_NIGHT : isSunset ? SUN_COLOR_SUNSET : SUN_COLOR_DAY;
    const targetSunIntensity = isNight ? 0.85 : isSunset ? 1.85 : 1.7;

    const targetHemiSky = isNight ? HEMI_SKY_NIGHT : isSunset ? HEMI_SKY_SUNSET : HEMI_SKY_DAY;
    const targetHemiGround = isNight ? HEMI_GROUND_NIGHT : isSunset ? HEMI_GROUND_SUNSET : HEMI_GROUND_DAY;
    const targetHemiIntensity = isNight ? 0.32 : isSunset ? 0.6 : 0.72;

    const targetRimColor = isNight ? RIM_COLOR_NIGHT : isSunset ? RIM_COLOR_SUNSET : RIM_COLOR_DAY;
    const targetRimIntensity = isNight ? 0.55 : isSunset ? 0.65 : 0.45;

    const targetFogColor = isNight ? FOG_COLOR_NIGHT : isSunset ? FOG_COLOR_SUNSET : FOG_COLOR_DAY;

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
