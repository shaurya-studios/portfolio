import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScroll } from '@react-three/drei';

export default function RealisticThreadSkein() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollData = useScroll();

  // Generate realistic plied yarn cords and multi-strand silk filament bundles
  const { pliedYarns, silkFilaments } = useMemo(() => {
    // 1. PLIED TWISTED YARN CORDS (Like real spun wool & silk cords in Image 1 & 2)
    // Each cord consists of 3 plied strands spiraling around a central spine curve.
    const pliedYarnData: Array<{
      strands: THREE.TubeGeometry[];
      color: string;
      sheenColor: string;
    }> = [];

    // Master guide paths for the heavy yarn cords
    const cordPaths = [
      // Cord 1: Looping gracefully around top-left across the center
      [
        new THREE.Vector3(-6.5, 4.5, -1.0),
        new THREE.Vector3(-3.5, 2.5, 1.2),
        new THREE.Vector3(0.0, 0.5, 1.8),
        new THREE.Vector3(3.8, -1.5, 0.5),
        new THREE.Vector3(6.5, -4.0, -1.5),
      ],
      // Cord 2: Deep catenary drape along the bottom
      [
        new THREE.Vector3(-5.5, 0.5, -0.5),
        new THREE.Vector3(-2.0, -3.2, 1.0),
        new THREE.Vector3(1.5, -3.6, 1.2),
        new THREE.Vector3(4.5, -2.0, 0.2),
        new THREE.Vector3(6.0, 1.5, -1.0),
      ],
      // Cord 3: S-curve framing the right side
      [
        new THREE.Vector3(3.0, 5.0, -1.5),
        new THREE.Vector3(4.8, 2.2, 0.8),
        new THREE.Vector3(3.5, -0.8, 1.4),
        new THREE.Vector3(4.2, -3.8, 0.2),
        new THREE.Vector3(2.5, -5.5, -1.2),
      ]
    ];

    const cordColors = [
      { color: '#b91c1c', sheen: '#fca5a5' }, // Rich Crimson Silk Cord
      { color: '#d97706', sheen: '#fef08a' }, // Antique Saffron Gold Cord
      { color: '#1d4ed8', sheen: '#93c5fd' }, // Peacock Indigo Cord
    ];

    cordPaths.forEach((pathPoints, cordIdx) => {
      const spineCurve = new THREE.CatmullRomCurve3(pathPoints, false, 'catmullrom', 0.5);
      const numSamples = 120;
      const points = spineCurve.getPoints(numSamples);

      const strandsGeo: THREE.TubeGeometry[] = [];
      const numStrands = 3;
      const helixRadius = 0.045; // Radius of strand twist
      const twistFreq = 18.0;   // Number of full helical twists along the cord

      for (let s = 0; s < numStrands; s++) {
        const strandPoints: THREE.Vector3[] = [];
        const strandOffsetAngle = (s / numStrands) * Math.PI * 2;

        for (let i = 0; i < points.length; i++) {
          const t = i / (points.length - 1);
          const pt = points[i];
          const tangent = spineCurve.getTangent(t);

          // Build orthonormal basis (Normal & Binormal)
          const up = new THREE.Vector3(0, 1, 0);
          const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();
          if (normal.lengthSq() < 0.001) {
            normal.set(1, 0, 0);
          }
          const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

          // Helical offset around spine
          const angle = t * twistFreq * Math.PI * 2 + strandOffsetAngle;
          const offset = new THREE.Vector3()
            .addScaledVector(normal, Math.cos(angle) * helixRadius)
            .addScaledVector(binormal, Math.sin(angle) * helixRadius);

          strandPoints.push(new THREE.Vector3().addVectors(pt, offset));
        }

        const strandCurve = new THREE.CatmullRomCurve3(strandPoints);
        // Tube radius for each plied strand: 0.024
        const tube = new THREE.TubeGeometry(strandCurve, 96, 0.024, 6, false);
        strandsGeo.push(tube);
      }

      pliedYarnData.push({
        strands: strandsGeo,
        color: cordColors[cordIdx % cordColors.length].color,
        sheenColor: cordColors[cordIdx % cordColors.length].sheen,
      });
    });

    // 2. DENSE MULTI-STRAND SILK FILAMENTS (64 fine hair-like threads)
    const silkData: Array<{
      geometry: THREE.TubeGeometry;
      color: string;
      sheen: string;
    }> = [];

    const filamentPalette = [
      { color: '#dc2626', sheen: '#fecaca' }, // Crimson
      { color: '#f59e0b', sheen: '#fef08a' }, // Raw Saffron Gold
      { color: '#2563eb', sheen: '#bfdbfe' }, // Peacock Blue
      { color: '#059669', sheen: '#a7f3d0' }, // Emerald Rani
      { color: '#f8fafc', sheen: '#ffffff' }, // Pure Silver Zari
      { color: '#ea580c', sheen: '#fed7aa' }, // Spiced Copper
    ];

    // Generate 64 fine silk filament strands flowing along realistic natural drape paths
    for (let i = 0; i < 64; i++) {
      const paletteItem = filamentPalette[i % filamentPalette.length];
      const radius = 0.004 + (i % 3) * 0.0012; // Ultra-fine 0.004 - 0.0064

      // 4 stream clusters draping through space
      const cluster = i % 4;
      const angleOffset = (i / 64) * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 1.8;

      let basePoints: THREE.Vector3[] = [];

      if (cluster === 0) {
        // Stream 0: Flowing from top-left, wrapping gently around the central 3D fabric
        basePoints = [
          new THREE.Vector3(-7.0 + spread, 5.0 + Math.sin(angleOffset) * 0.5, -2.0),
          new THREE.Vector3(-4.0 + spread * 0.8, 2.2, 0.5),
          new THREE.Vector3(-1.0 + spread * 0.4, 0.8, 1.6),
          new THREE.Vector3(2.5 + spread * 0.6, -1.5, 0.8),
          new THREE.Vector3(5.5 + spread, -4.5, -1.5),
        ];
      } else if (cluster === 1) {
        // Stream 1: Draped catenary hammock under the 3D fabric
        basePoints = [
          new THREE.Vector3(-6.0 + spread, 1.2, -1.0),
          new THREE.Vector3(-2.5 + spread * 0.7, -2.8, 1.0),
          new THREE.Vector3(1.2 + spread * 0.5, -3.2, 1.2),
          new THREE.Vector3(4.5 + spread * 0.8, -1.5, 0.4),
          new THREE.Vector3(6.5 + spread, 2.0, -1.2),
        ];
      } else if (cluster === 2) {
        // Stream 2: Elegant diagonal sweep framing the background depth
        basePoints = [
          new THREE.Vector3(5.0 + spread, 5.2, -1.8),
          new THREE.Vector3(2.5 + spread * 0.6, 2.0, -0.4),
          new THREE.Vector3(-0.5 + spread * 0.4, -0.5, 0.6),
          new THREE.Vector3(-3.8 + spread * 0.8, -3.0, -0.8),
          new THREE.Vector3(-6.2 + spread, -5.5, -2.2),
        ];
      } else {
        // Stream 3: Soft vertical draping filaments with micro-waves
        basePoints = [
          new THREE.Vector3(3.2 + spread * 0.8, 4.5, -0.8),
          new THREE.Vector3(4.5 + spread * 0.5, 1.5, 0.8),
          new THREE.Vector3(3.8 + spread * 0.6, -1.8, 1.1),
          new THREE.Vector3(4.8 + spread * 0.4, -4.2, 0.2),
        ];
      }

      const curve = new THREE.CatmullRomCurve3(basePoints, false, 'chordal');
      const tubeGeo = new THREE.TubeGeometry(curve, 72, radius, 6, false);

      silkData.push({
        geometry: tubeGeo,
        color: paletteItem.color,
        sheen: paletteItem.sheen,
      });
    }

    return { pliedYarns: pliedYarnData, silkFilaments: silkData };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      // Organic swaying of yarn cords
      groupRef.current.position.y = Math.sin(t * 0.45) * 0.18;
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.02;
      // Scroll parallax
      groupRef.current.position.y += scrollData.offset * 8.0;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. PLIED TWISTED YARN CORDS */}
      {pliedYarns.map((cord, cordIdx) => (
        <group key={`cord-${cordIdx}`}>
          {cord.strands.map((strandGeo, strandIdx) => (
            <mesh key={`strand-${strandIdx}`} geometry={strandGeo} castShadow>
              <meshPhysicalMaterial 
                color={cord.color}
                roughness={0.45} // Tactile spun wool/silk fiber
                metalness={0.25}
                sheen={1.0}
                sheenColor={new THREE.Color(cord.sheenColor)}
                sheenRoughness={0.35}
                clearcoat={0.6}
                clearcoatRoughness={0.12}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* 2. DENSE REALISTIC SILK FILAMENT THREADS */}
      {silkFilaments.map((filament, idx) => (
        <mesh key={`filament-${idx}`} geometry={filament.geometry}>
          <meshPhysicalMaterial 
            color={filament.color}
            roughness={0.18} // High glossy silk luster
            metalness={0.4}
            sheen={1.0}
            sheenColor={new THREE.Color(filament.sheen)}
            sheenRoughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.06}
          />
        </mesh>
      ))}
    </group>
  );
}
