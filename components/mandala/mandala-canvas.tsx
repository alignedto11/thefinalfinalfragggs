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
// Aesthetic: Gasoline on hot concrete, iridescent, electric structure
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

  // Constants for coloring
  const vec3 colVoid = vec3(0.01, 0.02, 0.03); 
  const vec3 colCyan = vec3(0.0, 1.0, 0.95); 
  const vec3 colElectricBlue = vec3(0.1, 0.6, 1.0);
  const vec3 colDeepTeal = vec3(0.0, 0.25, 0.28);
  const vec3 colGold = vec3(1.0, 0.75, 0.1);
  const vec3 colOrange = vec3(1.0, 0.35, 0.0);

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

  // Fractional Brownian Motion
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.1 + vec2(1.5, 4.2);
      a *= 0.48;
    }
    return v;
  }

  // Iridescent "Gasoline" color spectrum
  vec3 getGasolineColor(float t) {
    vec3 c1 = vec3(0.0, 0.8, 1.0); // Cyan
    vec3 c2 = vec3(0.5, 0.0, 1.0); // Purple
    vec3 c3 = vec3(1.0, 0.7, 0.0); // Gold
    vec3 c4 = vec3(0.0, 1.0, 0.5); // Green
    
    float mask1 = smoothstep(0.0, 0.25, t) * (1.0 - smoothstep(0.25, 0.5, t));
    float mask2 = smoothstep(0.25, 0.5, t) * (1.0 - smoothstep(0.5, 0.75, t));
    float mask3 = smoothstep(0.5, 0.75, t) * (1.0 - smoothstep(0.75, 1.0, t));
    float mask4 = smoothstep(0.75, 1.0, t);
    
    return c1 * mask1 + c2 * mask2 + c3 * mask3 + c4 * mask4;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
    float r = length(uv);
    float angle = atan(uv.y, uv.x);
    
    // Slow, organic time
    float t = u_time * (0.1 + u_velocity * 0.2);
    
    // 8-FOLD SYMMETRY
    float symmetry = 8.0;
    float segmentAngle = 6.28318 / symmetry;
    float a = mod(angle, segmentAngle) - segmentAngle * 0.5;
    a = abs(a); // Kaleidoscope mirror
    
    // Reconstruct symmetrical UV
    vec2 p = vec2(cos(a), sin(a)) * r;
    
    // DOMAIN WARPING (Fluid Motion)
    vec2 warp1 = vec2(fbm(p * 3.0 + t), fbm(p * 3.0 - t));
    vec2 warp2 = vec2(fbm(p * 6.0 + warp1 * 2.0 + t * 0.5), fbm(p * 6.0 + warp1 * 2.0 - t * 0.5));
    vec2 finalP = p + warp2 * 0.15 * u_coherence;
    
    // CYMATIC INTERFERENCE
    // Dynamic frequencies based on u_seed and u_pressure
    float freq1 = 12.0 + u_seed * 10.0;
    float freq2 = 24.0 + u_pressure * 15.0;
    
    float wave1 = sin(length(finalP) * freq1 - t * 3.0);
    float wave2 = cos(a * symmetry * 2.0 + length(finalP) * 5.0);
    float pattern = wave1 * wave2;
    
    // Interference refinement
    float interference = abs(pattern);
    interference = pow(interference, 0.8 + u_clarity * 0.5);
    
    // LAYERING COLORS
    // 1. VOID / CONCRETE (Background)
    float concreteNoise = fbm(uv * 50.0) * 0.05;
    vec3 color = colVoid + concreteNoise;
    
    // 2. OILY INTERIORS (Deep Teal + Iridescence)
    float interiorMask = smoothstep(0.1, 0.8, interference);
    vec3 oilyColor = mix(colDeepTeal, getGasolineColor(fract(r * 2.0 - t * 0.5)), 0.3);
    color = mix(color, oilyColor, interiorMask * 0.6);
    
    // 3. ELECTRIC LINES (Cyan Structure)
    float lineMask = 1.0 - smoothstep(0.0, 0.08, abs(interference - 0.1));
    lineMask *= smoothstep(0.0, 0.5, r); // Fade center
    color += colCyan * lineMask * 1.5;
    color += colElectricBlue * lineMask * 0.5;
    
    // 4. NODAL HIGHLIGHTS (Gold/Orange)
    float highlightMask = smoothstep(0.85, 1.0, interference);
    vec3 highlightCol = mix(colOrange, colGold, sin(t * 2.0) * 0.5 + 0.5);
    color += highlightCol * highlightMask * u_pressure;
    
    // 5. CENTER GLOW (The Source)
    float center = 1.0 - smoothstep(0.0, 0.15, r);
    color += colCyan * center * 2.0;
    color += vec3(1.0) * pow(center, 4.0); // Hard core
    
    // FINAL POLISH
    // Atmospheric "Heat Ripple"
    float ripple = sin(r * 40.0 - t * 10.0) * 0.005 * u_velocity;
    color *= (1.0 + ripple);
    
    // Vignette
    color *= smoothstep(1.0, 0.3, r);
    
    // Color breathing
    color *= 0.9 + 0.1 * sin(t * 0.5);

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
