
export const threadVertexShader = `
  uniform float uScroll;
  uniform float uTime;
  
  attribute vec3 targetPosition;
  attribute vec3 randomPosition;
  attribute float threadId;
  attribute float instanceLength;

  varying vec2 vUv;
  varying float vThreadId;
  varying vec3 vViewPosition;

  // 3D Noise function for organic thread wiggle
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vThreadId = threadId;

    // The scroll controls the interpolation from chaotic (random) to structured (target)
    // We add a stagger effect based on threadId so they weave in sequentially
    float weaveProgress = clamp((uScroll * 2.0) - (threadId * 0.5), 0.0, 1.0);
    
    // Smoothstep for elegant ease-in-out weaving
    float ease = smoothstep(0.0, 1.0, weaveProgress);

    // Chaotic float animation
    vec3 floatingNoise = vec3(
      snoise(vec3(threadId, uTime * 0.2, 0.0)),
      snoise(vec3(threadId + 10.0, uTime * 0.2, 0.0)),
      snoise(vec3(threadId + 20.0, uTime * 0.2, 0.0))
    ) * 2.0;
    
    vec3 loosePos = randomPosition + floatingNoise;
    
    // Interpolate base position
    vec3 basePos = mix(loosePos, targetPosition, ease);
    
    // Calculate final vertex position by applying the instance matrix and scaling
    vec3 transformed = position;
    
    // Scale the cylinder length based on state. 
    // In random state, threads are shorter. In woven state, they stretch.
    float currentLength = mix(1.0, instanceLength, ease);
    transformed.y *= currentLength;

    // Apply rotation/position of the instanced mesh (basePos is the translation)
    mat4 instanceTransform = instanceMatrix;
    instanceTransform[3][0] = basePos.x;
    instanceTransform[3][1] = basePos.y;
    instanceTransform[3][2] = basePos.z;

    vec4 worldPosition = modelMatrix * instanceTransform * vec4(transformed, 1.0);
    
    // Add micro-vibration based on scroll velocity (simulated via uTime and weave progress)
    if (weaveProgress > 0.0 && weaveProgress < 1.0) {
        worldPosition.x += sin(uTime * 10.0 + position.y) * 0.02 * (1.0 - ease);
    }

    vViewPosition = -(modelViewMatrix * instanceTransform * vec4(transformed, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const threadFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uHighlightColor;
  uniform float uTime;
  
  varying vec2 vUv;
  varying float vThreadId;
  varying vec3 vViewPosition;

  void main() {
    // Basic anisotropic sheen calculation
    vec3 viewDir = normalize(vViewPosition);
    // Assuming thread is roughly vertical for simple normals in instance space
    vec3 normal = vec3(0.0, 0.0, 1.0); 
    
    float rim = 1.0 - max(dot(viewDir, normal), 0.0);
    rim = smoothstep(0.6, 1.0, rim);
    
    // Add micro-noise for fiber texture
    float fiberNoise = fract(sin(dot(vUv * vec2(100.0, 1.0) + vThreadId, vec2(12.9898, 78.233))) * 43758.5453);
    
    vec3 baseColor = mix(uColor, uHighlightColor, rim * 0.5);
    baseColor -= fiberNoise * 0.05; // subtle dark specs

    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

export const fuzzBackgroundVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fuzzBackgroundFragment = `
  uniform float uTime;
  varying vec2 vUv;
  
  // Hash function for noise
  float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
  }

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    
    // Deep dark charcoal/blue base
    vec3 color = vec3(0.03, 0.03, 0.04);
    
    // Add animated macro-fuzz noise
    float fuzz = hash(vUv * 500.0 + uTime * 0.1);
    color += fuzz * 0.02;
    
    // Vignette
    color *= smoothstep(0.8, 0.2, dist);

    gl_FragColor = vec4(color, 1.0);
  }
`;
