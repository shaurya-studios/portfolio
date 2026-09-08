import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScenery } from '../../context/SceneryContext';

// Refined Architectural Liquid Shader — Clean, Elegant, No Cartoon Halos
const RealisticWaterShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColorDeepDay: { value: new THREE.Color('#9ab8be') },
    uColorShallowDay: { value: new THREE.Color('#dce7e9') },
    uColorDeepNight: { value: new THREE.Color('#03080d') },
    uColorShallowNight: { value: new THREE.Color('#081824') },
    uSunDirDay: { value: new THREE.Vector3(6, 12, 6).normalize() },
    uMoonDirNight: { value: new THREE.Vector3(-4, 10, -4).normalize() },
    uIslandCenter: { value: new THREE.Vector2(1.2, 0.0) }, // Island offset
    uNightMode: { value: 0.0 }
  },
  vertexShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vWave;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // 1. Organic Multi-Scale Water Waves
      float t = uTime * 0.8;
      float w1 = sin(pos.x * 0.7 + t * 1.2) * cos(pos.y * 0.6 + t * 0.9) * 0.05;
      float w2 = sin(pos.x * 1.5 - pos.y * 1.1 + t * 1.6) * 0.025;
      float w3 = cos(pos.x * 2.8 + pos.y * 2.1 + t * 2.2) * 0.012;

      // 2. Interactive Mouse Wave Disturbance
      vec2 mPos = uMouse * 5.0;
      float mDist = length(pos.xy - mPos);
      float mWave = sin(mDist * 5.0 - t * 4.0) * exp(-mDist * 0.9) * 0.04;

      float totalWave = w1 + w2 + w3 + mWave;
      pos.z += totalWave;
      vWave = totalWave;

      // 3. Smooth Analytical Normal Calculation (prevents banding/streaks)
      float dX = cos(pos.x * 0.7 + t * 1.2) * 0.035 + cos(pos.x * 1.5 - pos.y * 1.1 + t * 1.6) * 0.037;
      float dY = -sin(pos.y * 0.6 + t * 0.9) * 0.030 - cos(pos.x * 1.5 - pos.y * 1.1 + t * 1.6) * 0.027;
      vNormal = normalize(vec3(-dX, -dY, 1.0));

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorDeepDay;
    uniform vec3 uColorShallowDay;
    uniform vec3 uColorDeepNight;
    uniform vec3 uColorShallowNight;
    uniform vec3 uSunDirDay;
    uniform vec3 uMoonDirNight;
    uniform vec2 uIslandCenter;
    uniform float uNightMode;

    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vWave;

    void main() {
      // Distance from island center
      vec2 relPos = vWorldPosition.xz - uIslandCenter;
      float distToIsland = length(relPos);

      // Interpolate water base colors according to day / night
      vec3 deepColor = mix(uColorDeepDay, uColorDeepNight, uNightMode);
      vec3 shallowColor = mix(uColorShallowDay, uColorShallowNight, uNightMode);
      
      // Depth gradient based on distance from island shore
      float depth = smoothstep(1.5, 6.5, distToIsland);
      vec3 waterColor = mix(shallowColor, deepColor, depth);

      // Subtle surface caustics pattern in shallow water
      float caustics = sin(relPos.x * 8.0 + uTime * 1.5) * sin(relPos.y * 8.0 + uTime * 1.2);
      caustics = smoothstep(0.4, 0.9, caustics) * (1.0 - depth) * 0.12;
      waterColor += caustics;

      // Normal in world space
      vec3 normalWS = normalize(vec3(vNormal.x, vNormal.z, -vNormal.y));
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);

      // Fresnel reflection (glancing camera angles catch sky reflection)
      float fresnel = pow(1.0 - max(dot(viewDir, normalWS), 0.0), 3.5);
      vec3 skyReflection = mix(vec3(0.97, 0.96, 0.94), vec3(0.06, 0.12, 0.18), uNightMode);
      waterColor = mix(waterColor, skyReflection, fresnel * 0.5);

      // Specular Sunlight / Moonlight Glint
      vec3 lightDir = normalize(mix(uSunDirDay, uMoonDirNight, uNightMode));
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normalWS, halfVec), 0.0), 64.0);
      vec3 specColor = mix(vec3(1.0, 0.96, 0.88), vec3(0.85, 0.95, 1.0), uNightMode);
      waterColor += specColor * spec * 0.85;

      // Delicate, realistic shoreline foam (subtle lapping line, NOT a glowing halo)
      float tide = sin(uTime * 2.0 - distToIsland * 4.0) * 0.5 + 0.5;
      float shoreEdge = smoothstep(2.4, 2.75, distToIsland) * (1.0 - smoothstep(2.75, 3.05, distToIsland));
      float foam = shoreEdge * smoothstep(0.4, 0.8, tide) * 0.45;
      vec3 foamColor = mix(vec3(1.0, 1.0, 1.0), vec3(0.7, 0.9, 1.0), uNightMode);
      waterColor = mix(waterColor, foamColor, foam);

      // Outer boundary smooth transparency fade
      float outerFade = 1.0 - smoothstep(8.0, 10.5, length(vWorldPosition.xz));

      // Water opacity (transparent in shallows, richer in depths)
      float alpha = mix(0.75, 0.92, depth) * outerFade;

      gl_FragColor = vec4(waterColor, alpha);
    }
  `
};

export default function StylizedWater() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { timeOfDay } = useScenery();

  const isNight = timeOfDay === 'night';

  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Track mouse coordinates
    materialRef.current.uniforms.uMouse.value.lerp(
      new THREE.Vector2(state.pointer.x, state.pointer.y),
      0.05
    );

    // Smooth Day / Night transition
    const targetNight = isNight ? 1.0 : 0.0;
    const currentNight = materialRef.current.uniforms.uNightMode.value;
    materialRef.current.uniforms.uNightMode.value = THREE.MathUtils.lerp(currentNight, targetNight, 0.05);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
      <circleGeometry args={[10.5, 128]} />
      <shaderMaterial
        ref={materialRef}
        args={[RealisticWaterShader]}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
