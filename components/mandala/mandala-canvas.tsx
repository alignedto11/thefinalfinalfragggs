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
    
    float t = u_time * 0.12;
    
    // REFERENCE MATCHING: 8-FOLD SYMMETRY
    float symmetry = 8.0;
    
    // Fold space to create 8 segments
    float segmentAngle = 3.14159 * 2.0 / symmetry;
    float a = mod(angle, segmentAngle) - segmentAngle * 0.5;
    vec2 p = vec2(cos(a), sin(a)) * r;
    
    // CYMATIC GRID PATTERN (Cellular/Chladni)
    // We want sharp lines defining distinct pods
    
    // Base frequencies for 8-fold resonance
    float freq1 = 4.0; 
    float freq2 = 8.0;
    
    // Domain warping for organic "fluid" feel within structure
    vec2 warp = vec2(
        sin(p.y * 10.0 + t),
        cos(p.x * 10.0 - t)
    ) * 0.05;
    
    // Cellular Pattern Construction
    // 1. Radial waves (concentric rings)
    float radialWave = sin(r * 20.0 - t * 2.0);
    
    // 2. Angular waves (petals)
    float angularWave = cos(a * freq2); // 8-fold variation within segment
    
    // 3. Combine into interference pattern
    float interference = sin(r * 15.0 - t) * cos(a * 12.0) + sin(r * 25.0 + t) * sin(a * 4.0);
    
    // Create sharp "Cell Walls" (Cymatic Nodal Lines)
    // The reference has bright lines separating dark cells
    float cellStructure = abs(interference);
    cellStructure = 1.0 - smoothstep(0.0, 0.15, cellStructure); // Invert: 1.0 = sharp line, 0.0 = cell interior
    
    // SHARPEN LINES (Electric Cyan Borders)
    float lines = pow(cellStructure, 8.0); // Very thin, sharp lines
    
    // CELL INTERIORS (Deep Teal/Green)
    // The space between lines
    float interior = 1.0 - lines;
    interior *= smoothstep(0.2, 0.8, sin(r * 10.0 + a * 4.0 + t)); // Variation inside cells
    
    // COLOR PALETTE (Strict adherence to reference)
    // Background: Deep Black/Void
    vec3 colBackground = vec3(0.0, 0.02, 0.05);
    
    // Cell Centers: Deep Teal/Green
    vec3 colTeal = vec3(0.0, 0.35, 0.4); 
    vec3 colDarkTeal = vec3(0.0, 0.15, 0.2);
    
    // Lines: Electric Cyan/Blue
    vec3 colCyan = vec3(0.2, 0.8, 1.0);
    
    // Highlights: Gold/Orange (at intersections/peaks)
    vec3 colGold = vec3(1.0, 0.7, 0.2);
    vec3 colOrange = vec3(1.0, 0.4, 0.1);
    
    // COMPOSITING
    vec3 color = colBackground;
    
    // Add Teal interiors (soft glow inside cells)
    float interiorGlow = sin(r * 12.0 - t * 0.5) * cos(a * 8.0);
    interiorGlow = smoothstep(0.0, 1.0, interiorGlow);
    color += mix(colDarkTeal, colTeal, interiorGlow) * interior * 0.8;
    
    // Add Electric Cyan lines (sharp borders)
    color += colCyan * lines * 1.5; // High intensity
    
    // Add Gold Highlights (at interaction points/nodes)
    // Gold appears where interference is highest/lowest
    float goldMask = smoothstep(0.8, 1.0, abs(sin(r * 20.0) * cos(a * 10.0)));
    color += colGold * goldMask * interior * 1.2;
    
    // Central Star/Flower (8-pointed)
    float centerStar = smoothstep(0.5, 0.0, abs(r - 0.15 - sin(a * 8.0) * 0.05));
    color += mix(colOrange, colGold, centerStar) * centerStar * 2.0;
    
    // Vignette & Outer Fade
    color *= smoothstep(0.9, 0.4, r);
    
    // Contrast & Saturation Boost
    color = pow(color, vec3(1.2)); // increase contrast
    color *= 1.4; // boost brightness
    
    gl_FragColor = vec4(color, 1.0);
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
