import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScenery } from '../../context/SceneryContext';

// Advanced Procedural Architectural Ocean Shader
const AdvancedWaterShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColorDeep: { value: new THREE.Color('#c5bdb0') },
    uColorShallow: { value: new THREE.Color('#e8e2d8') },
    uColorNightDeep: { value: new THREE.Color('#051017') },
    uColorNightShallow: { value: new THREE.Color('#0c2b3d') },
    uFoamColor: { value: new THREE.Color('#ffffff') },
    uFoamNightColor: { value: new THREE.Color('#00f0ff') },
    uSunDirection: { value: new THREE.Vector3(8, 14, 8).normalize() },
    uSunColor: { value: new THREE.Color('#fff6e5') },
    uNightMode: { value: 0.0 }
  },
  vertexShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vWaveHeight;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // 1. Multi-layered Harmonic Waves
      float w1 = sin(pos.x * 0.9 + uTime * 1.4) * cos(pos.y * 0.7 + uTime * 1.1) * 0.07;
      float w2 = sin(pos.x * 1.8 - pos.y * 1.2 + uTime * 1.8) * 0.035;
      float w3 = cos(pos.x * 3.0 + pos.y * 2.5 + uTime * 2.4) * 0.015;

      // 2. Interactive Mouse Ripple
      vec2 mouseDist = pos.xy - uMouse * 4.0;
      float mDist = length(mouseDist);
      float mouseRipple = sin(mDist * 6.0 - uTime * 5.0) * exp(-mDist * 0.8) * 0.05;

      float totalDisplacement = w1 + w2 + w3 + mouseRipple;
      pos.z += totalDisplacement;
      vWaveHeight = totalDisplacement;

      // 3. Procedural Normal for Specular & Fresnel Reflections
      float dx = cos(pos.x * 0.9 + uTime * 1.4) * 0.09 + cos(pos.x * 1.8 - pos.y * 1.2 + uTime * 1.8) * 0.05;
      float dy = -sin(pos.y * 0.7 + uTime * 1.1) * 0.07 - cos(pos.x * 1.8 - pos.y * 1.2 + uTime * 1.8) * 0.04;
      vNormal = normalize(vec3(-dx, -dy, 1.0));

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorDeep;
    uniform vec3 uColorShallow;
    uniform vec3 uColorNightDeep;
    uniform vec3 uColorNightShallow;
    uniform vec3 uFoamColor;
    uniform vec3 uFoamNightColor;
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform float uNightMode;

    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vWaveHeight;

    void main() {
      // Distance from center of the island
      float dist = length(vWorldPosition.xz);

      // Interpolate colors based on Day / Night mode
      vec3 waterDeep = mix(uColorDeep, uColorNightDeep, uNightMode);
      vec3 waterShallow = mix(uColorShallow, uColorNightShallow, uNightMode);
      vec3 foamTone = mix(uFoamColor, uFoamNightColor, uNightMode);

      // Depth Gradient
      float depthFactor = smoothstep(1.8, 6.8, dist);
      vec3 baseWater = mix(waterShallow, waterDeep, depthFactor);

      // Dynamic Tidal Shoreline Foam (Multi-frequency wash against cliffs)
      float tide1 = sin(uTime * 1.8 - dist * 3.5) * 0.5 + 0.5;
      float tide2 = cos(uTime * 2.5 + dist * 5.0) * 0.3;
      float shoreZone = smoothstep(2.3, 3.2, dist) * (1.0 - smoothstep(3.2, 3.9, dist));
      float shoreFoam = shoreZone * smoothstep(0.35, 0.75, tide1 + tide2);

      // Wave Crest Foam (whitecaps on high wave peaks)
      float crestFoam = smoothstep(0.045, 0.09, vWaveHeight);

      // Total Foam Intensity
      float totalFoam = clamp(shoreFoam + crestFoam * 0.8, 0.0, 1.0);

      // Specular Sunlight / Moonlight Glint
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 normalWS = normalize(vec3(vNormal.x, vNormal.z, -vNormal.y)); // Convert to world space
      vec3 halfDir = normalize(uSunDirection + viewDir);
      float spec = pow(max(dot(normalWS, halfDir), 0.0), 32.0);
      vec3 specularColor = uSunColor * spec * (1.0 + uNightMode * 1.5);

      // Fresnel Reflection (grazing angles catch reflections)
      float fresnel = pow(1.0 - max(dot(viewDir, normalWS), 0.0), 3.0);
      vec3 skyReflectColor = mix(vec3(0.97, 0.96, 0.94), vec3(0.06, 0.18, 0.28), uNightMode);

      // Compose final liquid color
      vec3 finalColor = baseWater;
      finalColor = mix(finalColor, skyReflectColor, fresnel * 0.45);
      finalColor += specularColor * 0.75;
      finalColor = mix(finalColor, foamTone, totalFoam * 0.85);

      // Bioluminescent Glow in Night Mode on Shoreline
      if (uNightMode > 0.05) {
        finalColor += uFoamNightColor * shoreFoam * uNightMode * 1.2;
      }

      // Smooth outer radius circular falloff
      float edgeAlpha = 1.0 - smoothstep(7.5, 9.2, dist);

      gl_FragColor = vec4(finalColor, 0.88 * edgeAlpha);
    }
  `
};

export default function StylizedWater() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { timeOfDay } = useScenery();

  const isNight = timeOfDay === 'night';

  const daySunDir = useMemo(() => new THREE.Vector3(8, 14, 8).normalize(), []);
  const nightMoonDir = useMemo(() => new THREE.Vector3(-6, 12, -6).normalize(), []);

  useFrame((state) => {
    if (!materialRef.current) return;

    // Time increment
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Interactive mouse tracking on water plane
    materialRef.current.uniforms.uMouse.value.lerp(
      new THREE.Vector2(state.pointer.x, state.pointer.y),
      0.05
    );

    // Smooth transition between Day and Night uniforms
    const targetNight = isNight ? 1.0 : 0.0;
    const curNight = materialRef.current.uniforms.uNightMode.value;
    materialRef.current.uniforms.uNightMode.value = THREE.MathUtils.lerp(curNight, targetNight, 0.04);

    // Sun / Moon light direction and specular color
    materialRef.current.uniforms.uSunDirection.value.lerp(
      isNight ? nightMoonDir : daySunDir,
      0.04
    );
    materialRef.current.uniforms.uSunColor.value.lerp(
      isNight ? new THREE.Color('#e0fbfc') : new THREE.Color('#fff6e5'),
      0.04
    );
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.38, 0]}>
      <circleGeometry args={[9.2, 128]} />
      <shaderMaterial
        ref={materialRef}
        args={[AdvancedWaterShader]}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
