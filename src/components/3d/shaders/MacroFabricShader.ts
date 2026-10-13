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
  
  // Simplex-ish noise for fiber irregularities and organic weave variation
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
    vec2 st = vUv;
    
    // Zoom scale: 72.0 gives an intimate macro view where individual woven yarn coils are distinctly seen
    float scale = 72.0;
    vec2 scaledUv = st * scale;
    
    // Smooth scroll panning
    scaledUv.y += uScroll * 14.0;
    
    // Organic thread path distortion (simulating raw spun silk handloom irregularity)
    float threadWobble = snoise(scaledUv * 0.15) * 0.35;
    
    // Coordinates within thread grid
    vec2 threadUv = scaledUv + threadWobble;
    
    // ---- WARP & WEFT WEAVE STRUCTURE ----
    // Weft (Horizontal Yarn)
    float weftPhase = fract(threadUv.y);
    float weftCylinder = sin(weftPhase * 3.14159);
    
    // Warp (Vertical Yarn)
    float warpPhase = fract(threadUv.x);
    float warpCylinder = sin(warpPhase * 3.14159);
    
    // Checkerboard over/under interlacing pattern
    float cellX = floor(threadUv.x);
    float cellY = floor(threadUv.y);
    float isOver = mod(cellX + cellY, 2.0); // 1 = Warp on top, 0 = Weft on top
    
    // Micro-fibers: fine parallel filament striations along each thread bundle (like wound spool thread)
    float microWarp = sin((threadUv.y + snoise(threadUv * 1.5) * 0.2) * 45.0) * 0.12;
    float microWeft = sin((threadUv.x + snoise(threadUv * 1.5) * 0.2) * 45.0) * 0.12;
    
    float warpProfile = max(0.0, warpCylinder + microWarp);
    float weftProfile = max(0.0, weftCylinder + microWeft);
    
    float threadProfile = mix(weftProfile, warpProfile, isOver);
    
    // ---- INDIAN SILK PALETTE (Royal Crimson, Saffron Zari & Deep Maroon) ----
    // Deep Sindoor / Crimson Silk
    vec3 crimsonSilk = vec3(0.52, 0.05, 0.12);
    // Raw Saffron Gold / Antique Zari Silk
    vec3 saffronGold = vec3(0.85, 0.58, 0.14);
    // Deep weave shadow gap
    vec3 shadowGap   = vec3(0.08, 0.01, 0.03);
    
    // Slight thread-to-thread organic dye variation
    float dyeVariance = snoise(vec2(cellX * 0.3, cellY * 0.3)) * 0.1;
    vec3 currentWeftColor = clamp(crimsonSilk + vec3(dyeVariance, -dyeVariance * 0.5, 0.0), 0.0, 1.0);
    vec3 currentWarpColor = clamp(saffronGold + vec3(dyeVariance * 0.8, dyeVariance * 0.6, -dyeVariance), 0.0, 1.0);
    
    vec3 baseColor = mix(currentWeftColor, currentWarpColor, isOver);
    
    // ---- SILK SHEEN & ANISOTROPIC LIGHTING ----
    // Tight specular glint on the curved apex of the silk thread
    float sheen = pow(threadProfile, 6.0) * 1.6;
    vec3 sheenColor = mix(vec3(1.0, 0.85, 0.6), vec3(1.0, 0.95, 0.9), isOver);
    
    // Inter-thread contact shadows (ambient occlusion between threads)
    float ao = smoothstep(0.12, 0.75, threadProfile);
    
    // Surface fiber texture / fuzzy tactile specs
    float fuzz = hash(vUv * 600.0 + uTime * 0.05) * 0.06;
    
    vec3 finalColor = (baseColor * ao) + (sheen * sheenColor) + fuzz;
    
    // Stray surface filaments (fine loose fibers across the fabric face)
    float strayBase = snoise(st * 180.0 + uTime * 0.15);
    float strayMask = smoothstep(0.72, 0.92, strayBase);
    vec3 strayFiberColor = vec3(0.9, 0.75, 0.5);
    finalColor = mix(finalColor, strayFiberColor, strayMask * 0.35);
    
    // ---- CONTRAST & READABILITY CALIBRATION ----
    // Controlled center vignette / soft dark scrim so foreground text has pristine readability
    vec2 center = vUv - 0.5;
    float dist = length(center);
    
    // Macro depth-of-field lens vignette
    float lensVignette = smoothstep(0.9, 0.15, dist * 1.1);
    
    // Soft center dimming: gently darkens the central reading zone by ~35%
    // so crisp white typography and cards float with maximum contrast and zero visual clash
    float centerScrim = 0.68 + 0.32 * smoothstep(0.0, 0.55, dist);
    
    finalColor *= lensVignette * centerScrim;
    
    // Soft deep tone curve
    finalColor = pow(finalColor, vec3(1.05));

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
