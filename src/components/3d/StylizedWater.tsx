import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScenery } from '../../context/SceneryContext';

// Custom Shader for Stylized Architectural Liquid
const WaterShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorDeep: { value: new THREE.Color('#d4cfc5') },
    uColorShallow: { value: new THREE.Color('#eae5dc') },
    uFoamColor: { value: new THREE.Color('#ffffff') },
    uOpacity: { value: 0.82 },
    uNightMode: { value: 0.0 }
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying float vWave;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Subtle architectural geometric ripples
      float wave1 = sin(pos.x * 0.8 + uTime * 1.2) * cos(pos.y * 0.8 + uTime * 1.0) * 0.06;
      float wave2 = sin(pos.x * 1.5 - uTime * 0.8) * 0.03;
      pos.z += wave1 + wave2;
      vWave = wave1 + wave2;

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorDeep;
    uniform vec3 uColorShallow;
    uniform vec3 uFoamColor;
    uniform float uOpacity;
    uniform float uNightMode;

    varying vec2 vUv;
    varying float vWave;
    varying vec3 vWorldPosition;

    void main() {
      // Distance from center of island
      float dist = length(vWorldPosition.xz);

      // Shoreline foam ring: procedural distance pulsation near island boundary (approx radius 2.6 - 3.4)
      float foamPulse = sin(uTime * 2.0 - dist * 4.0) * 0.5 + 0.5;
      float shoreMask = smoothstep(2.5, 3.2, dist) * (1.0 - smoothstep(3.2, 3.8, dist));
      float foam = shoreMask * (0.4 + 0.6 * foamPulse);

      // Liquid depth gradient
      vec3 waterColor = mix(uColorShallow, uColorDeep, smoothstep(2.0, 7.0, dist));
      
      // Add subtle wave highlights
      waterColor += vWave * 0.4;

      // Blend shoreline foam
      vec3 finalColor = mix(waterColor, uFoamColor, foam * 0.7);

      // Outer edge soft falloff
      float edgeFade = 1.0 - smoothstep(7.0, 8.5, dist);

      gl_FragColor = vec4(finalColor, uOpacity * edgeFade);
    }
  `
};

export default function StylizedWater() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { timeOfDay } = useScenery();

  // Colors for Golden Hour / Day and Midnight
  const dayColors = useMemo(() => ({
    deep: new THREE.Color('#dcd6cc'),
    shallow: new THREE.Color('#f0ece4'),
    foam: new THREE.Color('#ffffff')
  }), []);

  const nightColors = useMemo(() => ({
    deep: new THREE.Color('#07131b'),
    shallow: new THREE.Color('#0d2535'),
    foam: new THREE.Color('#88e5fa')
  }), []);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth transition between day and night water shader
    const targetNight = timeOfDay === 'night' ? 1.0 : 0.0;
    const currentNight = materialRef.current.uniforms.uNightMode.value;
    const newNight = THREE.MathUtils.lerp(currentNight, targetNight, 0.05);
    materialRef.current.uniforms.uNightMode.value = newNight;

    materialRef.current.uniforms.uColorDeep.value.lerp(
      timeOfDay === 'night' ? nightColors.deep : dayColors.deep,
      0.05
    );
    materialRef.current.uniforms.uColorShallow.value.lerp(
      timeOfDay === 'night' ? nightColors.shallow : dayColors.shallow,
      0.05
    );
    materialRef.current.uniforms.uFoamColor.value.lerp(
      timeOfDay === 'night' ? nightColors.foam : dayColors.foam,
      0.05
    );
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
      <circleGeometry args={[8.5, 64]} />
      <shaderMaterial
        ref={materialRef}
        args={[WaterShader]}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
