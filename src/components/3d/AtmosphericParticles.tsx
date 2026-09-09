import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScenery } from '../../context/SceneryContext';

interface AtmosphericParticlesProps {
  boatPosition?: THREE.Vector2;
}

const ParticleShader = {
  uniforms: {
    uTime: { value: 0 },
    uNightMode: { value: 0 },
    uBoatPos: { value: new THREE.Vector2(0, 0) },
    uColorDay: { value: new THREE.Color('#e9d8a6') },
    uColorNight: { value: new THREE.Color('#38bdf8') },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uNightMode;
    uniform vec2 uBoatPos;

    attribute float aScale;
    attribute vec3 aVelocity;
    attribute float aPhase;

    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      vec3 pos = position;
      float t = uTime * 0.4 + aPhase;

      // Organic 3D harmonic drift
      pos.x += sin(t * 0.8 + pos.y * 0.5) * 0.35 + aVelocity.x * uTime * 0.05;
      pos.y += cos(t * 0.6 + pos.x * 0.4) * 0.25;
      pos.z += sin(t * 0.7 + pos.x * 0.6) * 0.35 + aVelocity.z * uTime * 0.05;

      // Wrap around bounding volume
      pos.x = mod(pos.x + 8.0, 16.0) - 8.0 + 1.2;
      pos.z = mod(pos.z + 8.0, 16.0) - 8.0;

      // Repulsion from boat position in night mode
      vec2 boatDistVec = pos.xz - uBoatPos;
      float boatDist = length(boatDistVec);
      if (boatDist < 1.5) {
        vec2 push = normalize(boatDistVec) * (1.5 - boatDist) * 0.6;
        pos.x += push.x;
        pos.z += push.y;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Distance attenuation for delicate microscopic particle scale
      gl_PointSize = aScale * (32.0 / -mvPosition.z) * (uNightMode > 0.5 ? 1.3 : 0.85);

      // Delicate golden hour dust in day, pulsing fireflies at night
      float pulse = sin(uTime * 2.5 + aPhase * 6.28) * 0.4 + 0.6;
      vAlpha = mix(0.2, pulse * 0.8, uNightMode);
    }
  `,
  fragmentShader: `
    uniform float uNightMode;
    uniform vec3 uColorDay;
    uniform vec3 uColorNight;

    varying float vAlpha;

    void main() {
      // Circular soft particle disc with soft radial falloff
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;

      float soft = 1.0 - smoothstep(0.1, 0.5, dist);
      vec3 col = mix(uColorDay, uColorNight, uNightMode);

      gl_FragColor = vec4(col, soft * vAlpha);
    }
  `,
};

export default function AtmosphericParticles({ boatPosition }: AtmosphericParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { timeOfDay } = useScenery();

  const isNight = timeOfDay === 'night';
  const particleCount = 280;

  const [positions, scales, velocities, phases] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sca = new Float32Array(particleCount);
    const vel = new Float32Array(particleCount * 3);
    const pha = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Scatter in a dome around the island
      const radius = 1.5 + Math.random() * 6.5;
      const angle = Math.random() * Math.PI * 2;
      const height = -0.1 + Math.random() * 3.5;

      pos[i * 3 + 0] = 1.2 + Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      sca[i] = 0.8 + Math.random() * 1.6;

      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      pha[i] = Math.random() * Math.PI * 2;
    }

    return [pos, sca, vel, pha];
  }, [particleCount]);

  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    if (boatPosition) {
      materialRef.current.uniforms.uBoatPos.value.copy(boatPosition);
    }

    const targetNight = isNight ? 1.0 : 0.0;
    materialRef.current.uniforms.uNightMode.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uNightMode.value,
      targetNight,
      0.05
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aScale"
          args={[scales, 1]}
        />
        <bufferAttribute
          attach="attributes-aVelocity"
          args={[velocities, 3]}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        args={[ParticleShader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
