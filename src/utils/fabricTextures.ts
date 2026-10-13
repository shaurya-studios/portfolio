import * as THREE from 'three';

// Generates a high-resolution procedural micro-weave bump texture
// for photorealistic wool and raw silk fabric surfaces.
export function createWovenFabricTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const dummy = new THREE.CanvasTexture(canvas);
    return dummy;
  }

  // Base neutral grey for bump map
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  // Twill weave frequency
  const threadWidth = 8;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Warp (vertical yarn) and Weft (horizontal yarn)
      const xPhase = (x % threadWidth) / threadWidth;
      const yPhase = (y % threadWidth) / threadWidth;

      const cellX = Math.floor(x / threadWidth);
      const cellY = Math.floor(y / threadWidth);

      // Twill 2x2 weave interlacing pattern
      const isOver = ((cellX + cellY) % 2 === 0);

      // Thread curvature profile (cylindrical cross-section)
      const weftCylinder = Math.sin(yPhase * Math.PI);
      const warpCylinder = Math.sin(xPhase * Math.PI);

      const dominant = isOver ? warpCylinder : weftCylinder;

      // Micro-fiber noise (hair-like surface grain of raw wool/silk)
      const fiberNoise = (Math.random() - 0.5) * 45;

      // Inter-thread contact shadow (crevice)
      const crevice = isOver 
        ? Math.abs(xPhase - 0.5) * 2 
        : Math.abs(yPhase - 0.5) * 2;

      let val = 128 + (dominant * 55) - (crevice * 35) + fiberNoise;
      val = Math.max(0, Math.min(255, val));

      data[idx] = val;     // R
      data[idx + 1] = val; // G
      data[idx + 2] = val; // B
      data[idx + 3] = 255; // A
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  texture.needsUpdate = true;

  return texture;
}
