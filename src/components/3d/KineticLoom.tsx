import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { threadVertexShader, threadFragmentShader } from './shaders/LoomShaders';

const THREAD_COUNT = 8000;

export default function KineticLoom() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.RawShaderMaterial>(null);
  
  // Drei's scroll data
  const scrollData = useScroll();

  // Pre-calculate positions and attributes for the threads
  const { targetPositions, randomPositions, threadIds, instanceLengths, transformMatrices } = useMemo(() => {
    const targets = new Float32Array(THREAD_COUNT * 3);
    const randoms = new Float32Array(THREAD_COUNT * 3);
    const ids = new Float32Array(THREAD_COUNT);
    const lengths = new Float32Array(THREAD_COUNT);
    
    // We need a base matrix for InstancedMesh to be valid, even though we override translations in the vertex shader.
    // We will set rotations here so they form a woven cross-hatch pattern in their "target" state.
    const matrices = new Float32Array(THREAD_COUNT * 16);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < THREAD_COUNT; i++) {
      // 1. Target Position (Woven Fabric Panel)
      // We create a central fabric panel grid
      const gridX = 40;
      const gridY = 200;
      
      const isHorizontal = i % 2 === 0;
      
      let tx, ty, tz;
      if (isHorizontal) {
        // Horizontal threads spanning X
        tx = 0; // Center
        ty = ((i / 2) % gridY) * 0.05 - (gridY * 0.05 * 0.5);
        tz = 0.02 * Math.sin(i); // slight layering
        
        dummy.rotation.set(0, 0, Math.PI / 2); // Horizontal
        lengths[i] = 6.0; // Width of the panel
      } else {
        // Vertical threads spanning Y
        tx = ((i / 2) % gridX) * 0.15 - (gridX * 0.15 * 0.5);
        ty = 0; // Center
        tz = -0.02 * Math.sin(i); // slight layering behind
        
        dummy.rotation.set(0, 0, 0); // Vertical
        lengths[i] = 10.0; // Height of the panel
      }
      
      targets[i * 3 + 0] = tx;
      targets[i * 3 + 1] = ty;
      targets[i * 3 + 2] = tz;
      
      // 2. Random Position (Chaotic Void)
      const r = 15 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      randoms[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      randoms[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      randoms[i * 3 + 2] = r * Math.cos(phi);

      ids[i] = i;
      
      // Apply rotation to dummy and update matrix array
      dummy.position.set(0, 0, 0); // Translations handled in shader
      dummy.scale.set(1, 1, 1); // Length handled via instanceLength in shader
      dummy.updateMatrix();
      dummy.matrix.toArray(matrices, i * 16);
    }

    return { 
      targetPositions: targets, 
      randomPositions: randoms, 
      threadIds: ids, 
      instanceLengths: lengths,
      transformMatrices: matrices 
    };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      // Pass the scroll offset [0, 1] to the shader
      // Offset represents how far down the user has scrolled
      materialRef.current.uniforms.uScroll.value = scrollData.offset;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, THREAD_COUNT]} frustumCulled={false}>
      <cylinderGeometry args={[0.008, 0.008, 1, 4]} />
      <instancedBufferAttribute attach="instanceMatrix" args={[transformMatrices, 16]} />
      <instancedBufferAttribute attach="attributes-targetPosition" args={[targetPositions, 3]} />
      <instancedBufferAttribute attach="attributes-randomPosition" args={[randomPositions, 3]} />
      <instancedBufferAttribute attach="attributes-threadId" args={[threadIds, 1]} />
      <instancedBufferAttribute attach="attributes-instanceLength" args={[instanceLengths, 1]} />
      
      <rawShaderMaterial
        ref={materialRef}
        vertexShader={threadVertexShader}
        fragmentShader={threadFragmentShader}
        uniforms={{
          uScroll: { value: 0 },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color('#3a3a40') }, // Dark charcoal cotton
          uHighlightColor: { value: new THREE.Color('#94a3b8') } // Silvery sheen
        }}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
