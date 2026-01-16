"use client"

import { useEffect, useRef, useCallback } from "react"
import type { MandalaState } from "@/lib/state"

interface MandalaCanvasProps {
  state: MandalaState
  seed?: number
  size?: number
  className?: string
  reducedMotion?: boolean
}

// Vertex shader - simple fullscreen quad
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

// Enhanced Fragment shader - cymatic mandala with fluid somatic animation
const fragmentShaderSource = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform float u_time;
  uniform vec2 u_res;
  uniform float u_pressure;
  uniform float u_clarity;
  uniform float u_velocity;
  uniform float u_coherence;
  uniform float u_seed;

  // Improved hash for smoother noise
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  // Smooth noise function
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Smoothstep
    
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Enhanced FBM with more octaves for smoother result
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  // Water surface displacement
  float waterSurface(vec2 p, float t) {
    float wave1 = sin(p.x * 3.0 + t * 0.4) * sin(p.y * 2.5 + t * 0.3);
    float wave2 = sin(p.x * 5.0 - t * 0.5) * sin(p.y * 4.5 + t * 0.45);
    float wave3 = sin((p.x + p.y) * 2.0 + t * 0.35);
    return (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
  }

  // Chladni Plate Formula (Math.cos(n*x)*Math.cos(m*y) - Math.cos(m*x)*Math.cos(n*y))
  // Creates authentic cymatic nodal patterns
  float chladni(vec2 p, float n, float m, float t) {
    // Rotate domain slightly for variety
    float c = cos(t * 0.1);
    float s = sin(t * 0.1);
    mat2 rot = mat2(c, -s, s, c);
    p = rot * p;

    float v = cos(n * p.x) * cos(m * p.y) - cos(m * p.x) * cos(n * p.y);
    return v;
  }

  // Cymatic standing wave interference pattern - Authentic Chladni
  float cymatic(vec2 p, float k, float t) {
    // Map State to Chladni harmonics (n, m)
    // k is frequency density
    float n = k; 
    float m = k * 1.5; // Harmonic relationship

    float val = chladni(p, n, m, t);
    
    // Sharpen to create nodal lines (sand valleys)
    // 0.0 is the node.
    return val;
  }

  // Breathing modulation
  float breathe(float t, float rate) {
    return 0.5 + 0.5 * sin(t * rate * 6.28318);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // State → visual controls with smoother mapping
    float fHz = mix(0.08, 0.8, clamp(0.6 * u_velocity + 0.4 * u_pressure, 0.0, 1.0));
    float rippleAmp = mix(0.005, 0.025, clamp(u_pressure, 0.0, 1.0));
    float contrast = mix(0.2, 0.55, clamp(u_clarity, 0.0, 1.0));
    float noiseAmt = mix(0.025, 0.08, clamp(1.0 - u_coherence, 0.0, 1.0));
    float tight = mix(1.2, 2.4, clamp(u_pressure, 0.0, 1.0));

    // Slow time - "water surface" feel with breathing
    float breatheRate = mix(0.08, 0.15, u_velocity);
    float breatheMod = breathe(u_time, breatheRate);
    float t = u_time * (6.28318 * fHz) * 0.08;
    
    vec2 p = uv;

    // Water surface displacement (subtle, organic)
    float waterDisp = waterSurface(p * 3.0 + u_seed, t * 0.5) * rippleAmp;
    p += normalize(p + 1e-6) * waterDisp;

    // Secondary organic displacement from fbm
    float organicDisp = fbm(p * 2.5 + u_seed * 10.0 + t * 0.1) * rippleAmp * 0.5;
    p += vec2(cos(angle), sin(angle)) * organicDisp;

    // Cymatic interference in radial domain
    // Cymatic interference (Chladni)
    float k = mix(3.0, 12.0, tight); // Frequency
    float w = cymatic(p * 2.0, k, t);

    // Chladni Sand/Nodes: Where vibration (w) is close to 0
    float sandWidth = mix(0.02, 0.08, 1.0 - contrast);
    float sand = smoothstep(sandWidth, 0.0, abs(w));
    
    // Complexify with secondary harmonic
    float w2 = cymatic(p * 2.0, k * 1.5, t);
    float sand2 = smoothstep(sandWidth * 0.7, 0.0, abs(w2));
    
    // Combine
    float pattern = sand + sand2 * 0.5;
    
    // Rings are less relevant for Chladni, but we keep a subtle boundary
    float rings = smoothstep(0.95, 0.8, r); // Fade edges
    
    float lines = pattern * contrast; // Apply clarity contrast

    // Smooth vignette with breathing
    float vigEdge = 0.95 + breatheMod * 0.05;
    float vig = smoothstep(vigEdge, 0.15, r);
    
    // Soft fog wash
    float fog = mix(0.94, 0.82, r * r);

    // Film grain noise - very subtle
    float grain = fbm(gl_FragCoord.xy * 0.02 + u_time * 0.03) * noiseAmt;

    // Final monochrome ink composition
    float ink = (0.04 + lines * 0.88) * vig;
    ink = mix(ink, ink + grain, 0.6);
    ink = mix(ink, 1.0, 0.12 * fog);

    // Subtle inner glow at center
    float centerGlow = exp(-r * r * 8.0) * 0.08 * breatheMod;
    
    // --- REALISTIC CYMATIC (Water + Light) ---
    // Use radial bands for coherent color rings
    // Modulate with Chladni pattern for water-ripple effect
    
    // ROYGBP Realistic Spectrum (Red-Orange-Yellow-Green-Blue-Purple)
    // Map radial distance to hue (0.0 = Red, 0.16 = Orange, 0.33 = Yellow, 0.5 = Green, 0.66 = Blue, 0.83 = Purple)
    float hue = fract(r * 2.5 - t * 0.15 + pattern * 0.3); // Cycle through spectrum radially
    
    // HSV to RGB conversion
    vec3 hsvColor = vec3(hue, 0.7, 1.0); // Saturation 0.7 for realistic tones
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p_hsv = abs(fract(hsvColor.xxx + K.xyz) * 6.0 - K.www);
    vec3 baseColor = hsvColor.z * mix(K.xxx, clamp(p_hsv - K.xxx, 0.0, 1.0), hsvColor.y);
    
    // Apply pattern as water ripples
    // Sharp pattern = bright water crest, low pattern = dark trough
    float waterIntensity = pattern * 0.8 + 0.2; // Keep some ambient visibility
    
    // Final composition
    vec3 finalColor = baseColor * waterIntensity * 3.0;
    
    // Add specular highlights (like light reflecting on water)
    float specular = pow(pattern, 8.0) * 2.0;
    finalColor += vec3(1.0) * specular;
    
    // Center glow (soft white like a light source)
    finalColor += vec3(0.9, 0.95, 1.0) * centerGlow * 2.0;
    
    // Vignette (dark edges)
    finalColor *= smoothstep(1.1, 0.4, r);

    // Tone map (soft clamp)
    finalColor = finalColor / (finalColor + vec3(0.5));
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

export function MandalaCanvas({ state, seed = 0.5, size, className = "", reducedMotion = false }: MandalaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({})
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(Date.now())
  const stateRef = useRef(state)

  // Keep state ref updated
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Initialize WebGL
  const initGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
    })
    if (!gl) {
      console.error("WebGL not supported")
      return false
    }

    glRef.current = gl

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) return false

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return false

    programRef.current = program

    // Get uniform locations
    uniformsRef.current = {
      u_time: gl.getUniformLocation(program, "u_time"),
      u_res: gl.getUniformLocation(program, "u_res"),
      u_pressure: gl.getUniformLocation(program, "u_pressure"),
      u_clarity: gl.getUniformLocation(program, "u_clarity"),
      u_velocity: gl.getUniformLocation(program, "u_velocity"),
      u_coherence: gl.getUniformLocation(program, "u_coherence"),
      u_seed: gl.getUniformLocation(program, "u_seed"),
    }

    // Create fullscreen quad
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    return true
  }, [])

  // Resize canvas
  const resize = useCallback(() => {
    const canvas = canvasRef.current
    const gl = glRef.current
    if (!canvas || !gl) return

    const dpr = Math.min(window.devicePixelRatio, 2)
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    gl.viewport(0, 0, canvas.width, canvas.height)
  }, [])

  // Render frame
  const render = useCallback(() => {
    const gl = glRef.current
    const uniforms = uniformsRef.current
    const canvas = canvasRef.current
    if (!gl || !canvas) return

    const currentState = stateRef.current
    const elapsed = (Date.now() - startTimeRef.current) / 1000

    // Set uniforms
    gl.uniform1f(uniforms.u_time, reducedMotion ? 0 : elapsed)
    gl.uniform2f(uniforms.u_res, canvas.width, canvas.height)
    gl.uniform1f(uniforms.u_pressure, currentState.pressure)
    gl.uniform1f(uniforms.u_clarity, currentState.clarity)
    gl.uniform1f(uniforms.u_velocity, currentState.velocity)
    gl.uniform1f(uniforms.u_coherence, currentState.coherence)
    gl.uniform1f(uniforms.u_seed, seed)

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    // Continue animation at 30fps for battery efficiency
    if (!reducedMotion) {
      animationRef.current = requestAnimationFrame(render)
    }
  }, [seed, reducedMotion])

  // Setup effect
  useEffect(() => {
    if (!initGL()) return

    resize()
    window.addEventListener("resize", resize)

    // Start animation
    animationRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initGL, resize, render])

  // Handle reduced motion changes
  useEffect(() => {
    if (reducedMotion) {
      cancelAnimationFrame(animationRef.current)
    } else {
      animationRef.current = requestAnimationFrame(render)
    }
  }, [reducedMotion, render])

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = glRef.current
    if (!canvas || !gl) return

    const program = programRef.current
    if (!program) return

    gl.useProgram(program)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      style={{ touchAction: "none", width: size, height: size }}
      aria-label="Cymatic mandala visualization reflecting your current state"
      role="img"
    />
  )
}
