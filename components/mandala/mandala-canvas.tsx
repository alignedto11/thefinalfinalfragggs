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

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
    float r = length(uv);
    float angle = atan(uv.y, uv.x);
    
    float t = u_time * 0.15; // Slightly faster for organic feel
    
    // STRICT 8-FOLD SYMMETRY ENFORCEMENT
    float symmetry = 8.0;
    float segmentAngle = 3.14159 * 2.0 / symmetry;
    float a = mod(angle, segmentAngle) - segmentAngle * 0.5;
    a = abs(a); // Mirror symmetry within segment for perfect 8-fold caleidoscope
    
    // Polar coordinates in symmetry space
    vec2 p = vec2(cos(a), sin(a)) * r;
    
    // Domain warping for organic "fluid" cymatics
    // We warp the coordinate space itself before drawing the pattern
    vec2 warp = vec2(
        fbm(p * 5.0 + t * 0.5),
        fbm(p * 5.0 - t * 0.5)
    ) * 0.1 * u_coherence;
    
    // CYMATIC WAVE FUNCTIONS
    // 1. Radial resonance (Standing waves)
    float radial = sin(r * 20.0 - t * 2.0 + warp.x * 5.0);
    
    // 2. Angular resonance (Petals/Spokes)
    float angular = cos(a * 4.0 * symmetry); 
    
    // 3. Interference Pattern (Chladni Plate approximation)
    float interference = radial * angular;
    
    // Incorporate "Seed" and "Clarity" state from user
    interference += sin(r * 30.0 * u_seed + a * 10.0) * 0.2;
    
    // CELLULAR STRUCTURE DEFINITION
    // We want clear separation between "nodes" (lines) and "antinodes" (spaces)
    float cellWall = abs(interference);
    // Sharpen the walls drastically
    float sharpness = 4.0 + (u_clarity * 4.0); // Dynamic sharpness
    cellWall = pow(smoothstep(0.0, 0.2, cellWall), 0.5); // Normalize
    
    // Define the distinct regions
    // 1. LINES (Electric Cyan) - The nodes where vibration is minimal (sand gathers) mechanism inverted for light
    float lines = 1.0 - smoothstep(0.02, 0.05, cellWall); 
    
    // 2. INTERIORS (Deep Teal) - The vibrating plates
    float interior = smoothstep(0.05, 0.5, cellWall);
    
    // 3. HIGHLIGHTS (Gold/Orange) - High energy intersection points
    float highlightMask = smoothstep(0.8, 1.0, abs(radial * angular));
    
    // COLOR PALETTE
    vec3 colVoid = vec3(0.0, 0.02, 0.04); // Almost black
    
    // Electric Cyan (#00FFFF base)
    vec3 colCyan = vec3(0.0, 1.0, 1.0); 
    vec3 colElectricBlue = vec3(0.0, 0.8, 1.0);
    
    // Deep Teal (#003333 base)
    vec3 colDeepTeal = vec3(0.0, 0.2, 0.25);
    vec3 colBrightTeal = vec3(0.0, 0.4, 0.5);
    
    // Gold/Orange
    vec3 colGold = vec3(1.0, 0.8, 0.2);
    vec3 colOrange = vec3(1.0, 0.4, 0.0);
    
    // COMPOSITION
    vec3 color = colVoid;
    
    // Add Interior (Teal fluid)
    // Add subtle variation within the ink
    float inkVar = fbm(uv * 10.0 + t);
    vec3 inkColor = mix(colDeepTeal, colBrightTeal, inkVar * 0.5 + 0.5);
    color += inkColor * interior * 0.8;
    
    // Add Lines (Electric Cyan Structure)
    // Make them glow
    color += colElectricBlue * lines * 2.0;
    color += colCyan * lines * 0.5; // Core brightness
    
    // Add Highlights (Gold Energy)
    float pulse = 0.5 + 0.5 * sin(t * 5.0);
    color += mix(colOrange, colGold, pulse) * highlightMask * interior * u_pressure;
    
    // Central "Source" Glow
    float centerGlow = 1.0 / (r * 10.0 + 0.1);
    centerGlow *= smoothstep(0.5, 0.0, r);
    color += colCyan * centerGlow * 0.5;
    
    // Vignette
    color *= smoothstep(1.2, 0.2, r);
    
    // Output
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
