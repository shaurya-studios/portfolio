import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScenery } from '../../context/SceneryContext';

// Hyper-Detailed Trochoidal Gerstner Ocean Engine
const GerstnerWaterShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uBoatPos: { value: new THREE.Vector2(0.85, 2.4) },
    uBoatVel: { value: new THREE.Vector2(0, 0) },
    uBoatSpeed: { value: 0.0 },
    uIslandCenter: { value: new THREE.Vector2(1.2, 0.0) },
    uNightMode: { value: 0.0 },
    // Day palette (The Editorial Alabaster & Ocean)
    uDeepDay: { value: new THREE.Color('#466874') },
    uShallowDay: { value: new THREE.Color('#d4e8ea') },
    uSkyDay: { value: new THREE.Color('#F7F5F0') },
    uSunDirDay: { value: new THREE.Vector3(7, 12, 6).normalize() },
    // Night palette (Onyx & Bioluminescent Cyan)
    uDeepNight: { value: new THREE.Color('#02060b') },
    uShallowNight: { value: new THREE.Color('#092232') },
    uSkyNight: { value: new THREE.Color('#080d15') },
    uMoonDirNight: { value: new THREE.Vector3(-5, 11, -5).normalize() },
  },
  vertexShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uBoatPos;
    uniform vec2 uBoatVel;
    uniform float uBoatSpeed;

    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormalWS;
    varying float vWaveHeight;

    // Gerstner Wave Structure
    // dir: normalized wave direction (x, y)
    // steepness Q, amp A, freq w, speed S
    vec3 calculateGerstner(
      vec2 dir, float steepness, float amplitude, float frequency, float speed,
      vec2 pos, float time,
      inout vec3 tangent, inout vec3 bitangent
    ) {
      float phase = dot(dir, pos) * frequency + time * speed;
      float c = cos(phase);
      float s = sin(phase);

      // Horizontal and vertical trochoidal displacement
      float dx = steepness * amplitude * dir.x * c;
      float dy = steepness * amplitude * dir.y * c;
      float dz = amplitude * s;

      // Accumulate analytical derivatives for exact normal derivation
      tangent += vec3(
        -steepness * dir.x * dir.x * s,
        -steepness * dir.x * dir.y * s,
        amplitude * frequency * dir.x * c
      );

      bitangent += vec3(
        -steepness * dir.x * dir.y * s,
        -steepness * dir.y * dir.y * s,
        amplitude * frequency * dir.y * c
      );

      return vec3(dx, dy, dz);
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      float t = uTime * 0.9;

      vec3 tangent = vec3(1.0, 0.0, 0.0);
      vec3 bitangent = vec3(0.0, 1.0, 0.0);

      // 4-OCTAVE GERSTNER WAVE SPECTRUM
      // Octave 1: Primary deep ocean swell
      vec3 w1 = calculateGerstner(normalize(vec2(0.8, 0.5)), 0.35, 0.055, 0.75, 1.2, pos.xy, t, tangent, bitangent);
      // Octave 2: Secondary cross swell (creates pyramidal peaks)
      vec3 w2 = calculateGerstner(normalize(vec2(-0.4, 0.85)), 0.28, 0.035, 1.35, 1.6, pos.xy, t, tangent, bitangent);
      // Octave 3: Harmonic chop
      vec3 w3 = calculateGerstner(normalize(vec2(0.6, -0.7)), 0.22, 0.018, 2.4, 2.1, pos.xy, t, tangent, bitangent);
      // Octave 4: Fine surface capillary ripple
      vec3 w4 = calculateGerstner(normalize(vec2(-0.7, -0.3)), 0.15, 0.008, 4.8, 3.2, pos.xy, t, tangent, bitangent);

      vec3 totalDisp = w1 + w2 + w3 + w4;

      // INTERACTIVE BOAT KELVIN WAKE
      // In local coordinates (pos.x is world x, pos.y is -world z)
      vec2 worldPlanePos = vec2(pos.x, -pos.y);
      vec2 boatDistVec = worldPlanePos - uBoatPos;
      float distToBoat = length(boatDistVec);

      // Expanding V-wake trailing the boat
      if (uBoatSpeed > 0.05 && distToBoat < 6.0) {
        float boatWake = sin(distToBoat * 8.0 - t * 6.0) * exp(-distToBoat * 0.8) * min(uBoatSpeed * 0.06, 0.08);
        totalDisp.z += boatWake;
      }

      // INTERACTIVE MOUSE SURFACE DISTURBANCE
      vec2 mouseDistVec = worldPlanePos - uMouse;
      float distToMouse = length(mouseDistVec);
      if (distToMouse < 4.0) {
        float mouseRipple = sin(distToMouse * 10.0 - t * 5.0) * exp(-distToMouse * 1.2) * 0.028;
        totalDisp.z += mouseRipple;
      }

      pos.xy += totalDisp.xy;
      pos.z += totalDisp.z;
      vWaveHeight = totalDisp.z;

      // Analytical surface normal (orthogonal cross product of surface tangents)
      vec3 normal = normalize(cross(bitangent, tangent));

      // Transform normal to world space
      // Plane is rotated -PI/2 around X:
      // Local (x, y, z) -> World (x, z, -y)
      vNormalWS = normalize(vec3(normal.x, normal.z, -normal.y));

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uNightMode;
    uniform vec2 uIslandCenter;
    uniform vec2 uBoatPos;
    uniform float uBoatSpeed;

    uniform vec3 uDeepDay;
    uniform vec3 uShallowDay;
    uniform vec3 uSkyDay;
    uniform vec3 uSunDirDay;

    uniform vec3 uDeepNight;
    uniform vec3 uShallowNight;
    uniform vec3 uSkyNight;
    uniform vec3 uMoonDirNight;

    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormalWS;
    varying float vWaveHeight;

    // Procedural Fractal Noise for Organic Shorelines
    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float organicNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));

      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      // 1. DYNAMIC COLOR PALETTE BLEND
      vec3 deepColor = mix(uDeepDay, uDeepNight, uNightMode);
      vec3 shallowColor = mix(uShallowDay, uShallowNight, uNightMode);
      vec3 skyColor = mix(uSkyDay, uSkyNight, uNightMode);
      vec3 lightDir = normalize(mix(uSunDirDay, uMoonDirNight, uNightMode));

      // 2. ORGANIC DISTANCE TO ARCHIPELAGO
      vec2 relPos = vWorldPosition.xz - uIslandCenter;
      float rawDist = length(relPos);

      // Perturb shoreline distance with 2 octaves of noise to contour naturally around rocks
      float shoreNoise = (organicNoise(vWorldPosition.xz * 2.2) - 0.5) * 0.45;
      float pierInfluence = max(0.0, 1.0 - length(vWorldPosition.xz - vec2(0.85, 1.85)) * 0.6);
      float organicDist = rawDist + shoreNoise - pierInfluence * 0.35;

      // 3. DEPTH ABSORPTION GRADIENT
      float depthFactor = smoothstep(1.8, 6.8, organicDist);
      vec3 waterColor = mix(shallowColor, deepColor, depthFactor);

      // 4. PROCEDURAL SEABED CAUSTICS (in shallow crystalline waters)
      if (depthFactor < 0.85) {
        vec2 cUv1 = vWorldPosition.xz * 4.5 + vec2(uTime * 0.4, uTime * 0.3);
        vec2 cUv2 = vWorldPosition.xz * 5.2 - vec2(uTime * 0.35, -uTime * 0.4);
        float caustics = pow(abs(sin(cUv1.x + sin(cUv1.y)) + cos(cUv2.x + sin(cUv2.y))), 2.2) * 0.18;
        caustics *= (1.0 - depthFactor);

        vec3 causticTint = mix(vec3(0.9, 0.98, 1.0), vec3(0.2, 0.9, 0.8), uNightMode);
        waterColor += caustics * causticTint;
      }

      // 5. BIOLUMINESCENT BENTHIC GLOW (Night Mode near submerged reefs)
      if (uNightMode > 0.05) {
        float reefGlow = smoothstep(3.2, 1.6, rawDist) * uNightMode;
        waterColor += vec3(0.02, 0.14, 0.22) * reefGlow;
      }

      // 6. FRESNEL TRANSMISSION & SKY REFLECTION (Schlick's approximation)
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 normal = normalize(vNormalWS);
      float NdotV = max(dot(normal, viewDir), 0.0);
      float fresnel = 0.02 + 0.98 * pow(1.0 - NdotV, 4.5);

      waterColor = mix(waterColor, skyColor, fresnel * (uNightMode > 0.5 ? 0.45 : 0.7));

      // 7. DUAL-OCTAVE SPECULAR SUN & MOON GLINTS
      vec3 halfVec = normalize(lightDir + viewDir);
      float NdotH = max(dot(normal, halfVec), 0.0);

      // Sharp solar/lunar core glint
      float sharpSpec = pow(NdotH, 128.0) * 1.2;
      // Soft shimmering halo
      float broadSpec = pow(NdotH, 18.0) * 0.25;

      vec3 specTint = mix(vec3(1.0, 0.97, 0.9), vec3(0.75, 0.92, 1.0), uNightMode);
      waterColor += (sharpSpec + broadSpec) * specTint;

      // 8. NON-CIRCULAR ORGANIC SHORELINE FOAM
      float tidalPulse = sin(uTime * 1.8 - organicDist * 4.5) * 0.5 + 0.5;
      float shoreBand = smoothstep(2.4, 2.7, organicDist) * (1.0 - smoothstep(2.7, 3.1, organicDist));
      float shorelineFoam = shoreBand * smoothstep(0.35, 0.85, tidalPulse) * 0.48;

      // Wave crest foam (spindrift on sharp wave peaks)
      float waveCrestFoam = smoothstep(0.045, 0.08, vWaveHeight) * 0.35;

      // Boat hull wake foam
      float distToBoat = length(vWorldPosition.xz - uBoatPos);
      float boatWakeFoam = smoothstep(1.5, 0.2, distToBoat) * min(uBoatSpeed * 0.6, 0.75);

      float totalFoam = clamp(shorelineFoam + waveCrestFoam + boatWakeFoam, 0.0, 1.0);
      vec3 foamColor = mix(vec3(0.98, 0.98, 0.97), vec3(0.8, 0.95, 1.0), uNightMode);
      waterColor = mix(waterColor, foamColor, totalFoam);

      // 9. RADIAL EDGE DISSOLVE
      float outerFade = 1.0 - smoothstep(8.5, 12.0, length(vWorldPosition.xz));

      // Translucency in shallows, density in deep abyss
      float alpha = mix(0.78, 0.94, depthFactor) * outerFade;

      gl_FragColor = vec4(waterColor, alpha);
    }
  `
};

interface StylizedWaterProps {
  boatPosition?: THREE.Vector2;
  boatSpeed?: number;
}

export default function StylizedWater({ boatPosition, boatSpeed = 0 }: StylizedWaterProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { timeOfDay } = useScenery();

  const isNight = timeOfDay === 'night';

  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Track pointer world coordinate
    materialRef.current.uniforms.uMouse.value.set(
      state.pointer.x * 6.0 + 1.2,
      -state.pointer.y * 6.0
    );

    // Track boat position & speed
    if (boatPosition) {
      materialRef.current.uniforms.uBoatPos.value.copy(boatPosition);
      materialRef.current.uniforms.uBoatSpeed.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uBoatSpeed.value,
        boatSpeed,
        0.1
      );
    }

    // Smooth Day / Night transition
    const targetNight = isNight ? 1.0 : 0.0;
    const currentNight = materialRef.current.uniforms.uNightMode.value;
    materialRef.current.uniforms.uNightMode.value = THREE.MathUtils.lerp(currentNight, targetNight, 0.05);
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.32, 0]}
      receiveShadow
    >
      <planeGeometry args={[25, 25, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        args={[GerstnerWaterShader]}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
