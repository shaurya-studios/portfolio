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
      float t = uTime * 0.3 + aPhase;

      // Gentle organic drift clustered around trees
      pos.x += sin(t * 0.7 + pos.y * 0.5) * 0.2 + aVelocity.x * uTime * 0.02;
      pos.y += cos(t * 0.5 + pos.x * 0.4) * 0.15;
      pos.z += sin(t * 0.6 + pos.x * 0.5) * 0.2 + aVelocity.z * uTime * 0.02;

      // Repulsion from boat position in night mode
      vec2 boatDistVec = pos.xz - uBoatPos;
      float boatDist = length(boatDistVec);
      if (boatDist < 1.4) {
        vec2 push = normalize(boatDistVec) * (1.4 - boatDist) * 0.5;
        pos.x += push.x;
        pos.z += push.y;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Pinpoint tiny particle scale (never big orbs!)
      gl_PointSize = aScale * (15.0 / -mvPosition.z) * uNightMode;

      // Absolutely zero orbs in day mode! Only discreet micro-fireflies at night
      float pulse = sin(uTime * 2.0 + aPhase * 6.28) * 0.3 + 0.7;
      vAlpha = pulse * 0.6 * uNightMode;
    }
  `,
  fragmentShader: `
    uniform vec3 uColorNight;
    varying float vAlpha;

    void main() {
      // Circular soft point with sharp core
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;

      float soft = 1.0 - smoothstep(0.1, 0.5, dist);
      gl_FragColor = vec4(uColorNight, soft * vAlpha);
    }
  `,
};

export default function AtmosphericParticles({ boatPosition }: AtmosphericParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { timeOfDay } = useScenery();

  const isNight = timeOfDay === 'night';
  // Reduced from 280 down to just 24 tiny subtle night fireflies!
  const particleCount = 24;

  const [positions, scales, velocities, phases] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sca = new Float32Array(particleCount);
    const vel = new Float32Array(particleCount * 3);
    const pha = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Clustered close to the garden flora and terrace at x=2.2
      const radius = 0.6 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      const height = 0.2 + Math.random() * 1.6;

      pos[i * 3 + 0] = 2.2 + Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      sca[i] = 0.5 + Math.random() * 0.7; // Very small size

      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.2;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

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
