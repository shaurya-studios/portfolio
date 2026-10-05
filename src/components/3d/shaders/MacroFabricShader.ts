export const fabricVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fabricFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uScroll;
  
  varying vec2 vUv;

  // Generic 2D Hash/Noise
  float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
  }
  
  // Simplex-ish noise for fiber irregularities
  float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = fract((fract(((i.y + vec3(0.0, i1.y, 1.0)) * 34.0) + 1.0) * (i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)) * C.www);
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
  }

  void main() {
    // Correct aspect ratio
    vec2 st = vUv;
    
    // Scale defines the "zoom" level into the fabric. 
    // High scale = seeing individual woven threads.
    float scale = 150.0;
    vec2 scaledUv = st * scale;
    
    // Animate slightly with scroll to give a tactile panning feeling
    scaledUv.y += uScroll * 20.0;
    
    // ---- FABRIC STRUCTURE (WARP & WEFT) ----
    
    // Weft (Horizontal Threads)
    // Use a sine wave, but distort it slightly with noise for realism
    float noiseDistort = snoise(scaledUv * 0.5) * 0.5;
    float weftWave = sin((scaledUv.y + noiseDistort) * 3.1415);
    
    // Warp (Vertical Threads)
    float warpWave = sin((scaledUv.x + noiseDistort) * 3.1415);
    
    // Over/Under logic (Checkerboard weave pattern)
    // Adds a 3D depth to which thread is on top
    float weaveGrid = mod(floor(scaledUv.x) + floor(scaledUv.y), 2.0);
    
    // Thread shaping (giving them cylindrical volume)
    float weftVolume = abs(weftWave);
    float warpVolume = abs(warpWave);
    
    // Choose dominant thread based on weave grid
    float threadVolume = mix(warpVolume, weftVolume, weaveGrid);
    float isWeft = weaveGrid;
    
    // ---- COLOR PALETTE (INDIAN TEXTILE) ----
    // Rich Crimson / Saffron Saree Style
    vec3 weftColor = vec3(0.65, 0.08, 0.15); // Deep Crimson Red
    vec3 warpColor = vec3(0.95, 0.65, 0.15); // Saffron / Gold Silk
    
    // Base color of the pixel
    vec3 baseColor = mix(warpColor, weftColor, isWeft);
    
    // ---- MICROFIBER & SHEEN (LIGHTING) ----
    
    // Specular highlight (Silk Sheen)
    // Silk shines brightly on the peaks of the thread cylinders
    float sheen = pow(threadVolume, 8.0) * 1.5; 
    
    // Add micro-noise for individual fibers on the thread surface
    float fiberNoise = snoise(scaledUv * 5.0) * 0.3;
    
    // Darken the gaps between threads for depth/ambient occlusion
    float ao = smoothstep(0.2, 0.8, threadVolume);
    
    // Combine lighting
    vec3 finalColor = baseColor * ao;
    finalColor += sheen * (vec3(1.0, 0.9, 0.8) + fiberNoise); // Gold-ish sheen
    
    // ---- STRAY FIBERS (FUZZ) ----
    // Irregularities sticking out of the fabric
    float strayBase = snoise(st * 400.0 + uTime * 0.2);
    float strayMask = smoothstep(0.7, 0.9, strayBase);
    vec3 strayColor = vec3(0.8, 0.7, 0.6); // Light dust/cotton fuzz color
    
    finalColor = mix(finalColor, strayColor, strayMask * 0.5);
    
    // ---- CAMERA LENS EFFECTS ----
    // Vignette / Macro lens edge darkening
    float dist = length(vUv - 0.5);
    float vignette = smoothstep(0.7, 0.2, dist * 1.2);
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
