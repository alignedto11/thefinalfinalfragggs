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
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

// THE CYMATIC ENGINE - Ultra High Fidelity
// Based on real-world cymatics (standing waves) and deterministic archetypes
const fragmentShaderSource = `
    #ifdef GL_ES
    precision highp float;
    #endif

    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_res;
    uniform float u_pressure;
    uniform float u_clarity;
    uniform float u_velocity;
    uniform float u_coherence;
    uniform float u_seed;

    // Spec Uniforms
    uniform float u_symmetry;
    uniform float u_layers;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    uniform vec3 u_colorC;
    uniform float u_shapeFamily; // [0: orb, 1: petal, 2: star, 3: lattice, 4: wave]

    #define PI 3.14159265359

    // Prismatic Spectrum dispersion
    vec3 spectrum(float t) {
      vec3 col = 0.5 + 0.5 * cos(2.0 * PI * (vec3(1.0, 0.6, 0.3) * t + vec3(0.0, 0.33, 0.67)));
      return col;
    }

    // High fidelity iridescence based on thin-film interference
    vec3 getIridescence(float t, float dist) {
      // Gasoline/Oil slick palette: Deep Teals, Electric Cyans, Magentas, and Gold
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.3, 0.2, 0.2); // Phase shifts
      
      // Animate phase based on time and distance
      vec3 col = a + b * cos(2.0 * PI * (c * t + d + dist * 0.4));
      
      // Boost Cyans and Teals
      col = mix(col, vec3(0.0, 0.8, 0.9), 0.25);
      
      return col;
    }

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 7; i++) {
        v += a * noise(p);
        p *= 2.05;
        a *= 0.48;
      }
      return v;
    }

    // Domain warping for fluid motion
    float pattern_noise(vec2 p, float t, out vec2 q, out vec2 r) {
      q = vec2(fbm(p + vec2(0.0, 0.0) + t * 0.1),
               fbm(p + vec2(5.2, 1.3) + t * 0.15));

      r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 0.05),
               fbm(p + 3.2 * q + vec2(8.3, 2.8) + t * 0.07));

      return fbm(p + 2.8 * r + t * 0.03);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
      float dist = length(uv);
      float angle = atan(uv.y, uv.x);
      
      // 8-FOLD SYMMETRY
      float symmetry = 8.0;
      float slice = PI * 2.0 / symmetry;
      float a = mod(angle, slice) - slice * 0.5;
      a = abs(a); // Kaleidoscope mirror
      
      // Warped space
      vec2 p = vec2(cos(a), sin(a)) * dist;
      vec2 q, r_noise;
      float t = u_time * (0.02 + u_velocity * 0.06);
      
      float noise_val = pattern_noise(p * 2.8, t, q, r_noise);
      
      // CYMATIC INTERFERENCE
      // Higher pressure = tighter waves, Higher clarity = sharper lines
      float freq = 14.0 + u_seed * 8.0 + u_pressure * 16.0;
      float wave = sin(dist * freq - u_time * 2.2 + noise_val * 4.2);
      
      // 8-fold interference lobes
      float lobes = cos(a * symmetry * 1.0 + noise_val * 1.5);
      float interference = wave * lobes;
      
      // Sharpness extracted from clarity
      float sharpness = 4.0 + (u_clarity * 14.0);
      float nodal = pow(max(0.0, 1.0 - abs(interference)), sharpness);
      
      // COLOR: Gasoline on Concrete
      // Base: Concrete/Asphalt texture - refined
      float concrete = fbm(uv * 180.0) * 0.04 + fbm(uv * 320.0) * 0.015;
      vec3 color = vec3(0.02 + concrete); // Darker textured gray
      
      // Iridescent fluid
      vec3 irid = getIridescence(noise_val * 0.5 + wave * 0.3, dist);
      
      // Highlight nodal lines: Electric Cyan
      vec3 electricCyan = vec3(0.1, 0.98, 1.0);
      vec3 deepTeal = vec3(0.0, 0.18, 0.22);
      
      // Mix iridescence based on interference - more fluid
      float iridMask = smoothstep(0.12, 0.88, nodal + noise_val * 0.35);
      color = mix(color, irid * 0.85, iridMask);
      
      // Interior of patterns: Deep Teal
      color = mix(color, deepTeal, (1.0 - nodal) * 0.25 * u_coherence);
      
      // Core glow of nodal lines - sharper and more electric
      color += electricCyan * pow(nodal, 12.0) * (1.6 + u_clarity * 0.6);
      
      // Gasoline Hotspots: Amber/Gold
      float goldMask = smoothstep(0.78, 0.99, noise_val * wave * (1.1 + u_pressure * 0.6));
      color += vec3(1.0, 0.6, 0.1) * goldMask * u_pressure * 1.2 * u_coherence;
      
      // Central Source Glow
      float center = 0.01 / (dist + 0.01);
      color += electricCyan * center * 0.4;
      
      // Global Coherence: Mix between monochrome and vibrant
      float gray = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(gray), color, 0.3 + u_coherence * 0.7);

      // Vignette
      color *= smoothstep(1.5, 0.35, dist);
      
      // Final clip/polish
      color = clamp(color, 0.0, 1.0);
      gl_FragColor = vec4(color, 1.0);
    }

    vec3 deepmix(vec3 a, vec3 b, float t) {
       return a * (1.0 - t) + b * t;
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
      u_symmetry: gl.getUniformLocation(program, "u_symmetry"),
      u_layers: gl.getUniformLocation(program, "u_layers"),
      u_shapeFamily: gl.getUniformLocation(program, "u_shapeFamily"),
      u_colorA: gl.getUniformLocation(program, "u_colorA"),
      u_colorB: gl.getUniformLocation(program, "u_colorB"),
      u_colorC: gl.getUniformLocation(program, "u_colorC"),
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

  // Helper to convert hex to RGB vec3
  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    return [r, g, b]
  }

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

    // Map shape family to float
    const familyMap = { orb: 0, petal: 1, star: 2, lattice: 3, wave: 4 }
    const shapeFamilyIdx = familyMap[currentState.shapeFamily || 'orb']

    // Set uniforms
    gl.uniform1f(uniforms.u_time, reducedMotion ? 0 : elapsed)
    gl.uniform2f(uniforms.u_res, canvas.width, canvas.height)
    gl.uniform1f(uniforms.u_pressure, currentState.pressure)
    gl.uniform1f(uniforms.u_clarity, currentState.clarity)
    gl.uniform1f(uniforms.u_velocity, currentState.velocity)
    gl.uniform1f(uniforms.u_coherence, currentState.coherence)
    gl.uniform1f(uniforms.u_seed, seed)

    // New Spec Uniforms
    gl.uniform1f(uniforms.u_symmetry, currentState.symmetry || 8.0)
    gl.uniform1f(uniforms.u_layers, currentState.layers || 3.0)
    gl.uniform1f(uniforms.u_shapeFamily, shapeFamilyIdx)

    const colors = currentState.colors || ["#00ffff", "#0088ff", "#ffffff"]
    gl.uniform3fv(uniforms.u_colorA, hexToRgb(colors[0]))
    gl.uniform3fv(uniforms.u_colorB, hexToRgb(colors[1]))
    gl.uniform3fv(uniforms.u_colorC, hexToRgb(colors[2]))

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
