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

  // Ultra-High-Fidelity Fragment shader - cymatic mandala with fluid iridescence
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

    #define PI 3.14159265359

    // Simplified thin-film interference / iridescence palette
    vec3 getIridescence(float t, float angle) {
      // Gasoline palette: Cyan, Magenta, Gold, Teal
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.00, 0.33, 0.67); // Cyan-Teal shift
      
      // Secondary shift based on angle and time
      vec3 col = a + b * cos(2.0 * PI * (c * t + d + angle * 0.1));
      
      // Inject Gold/Orange at specific frequencies
      float goldMask = smoothstep(0.4, 0.6, sin(t * 10.0 + angle));
      return mix(col, vec3(1.0, 0.7, 0.1), goldMask * 0.3);
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
      for (int i = 0; i < 6; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    // Domain warping for liquid motion
    float pattern_noise(vec2 p, float t, out vec2 q, out vec2 r) {
      q = vec2(fbm(p + vec2(0.0, 0.0) + t),
               fbm(p + vec2(5.2, 1.3) + t));

      r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.5),
               fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.3));

      return fbm(p + 4.0 * r + t * 0.2);
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
      
      // Warped space for liquid feel
      vec2 p = vec2(cos(a), sin(a)) * dist;
      vec2 q, r_noise;
      float t = u_time * (0.05 + u_velocity * 0.1);
      
      float noise_val = pattern_noise(p * 4.0, t, q, r_noise);
      
      // CYMATIC INTERFERENCE PATTERN
      // Base frequency density from seed and pressure
      float freq = 15.0 + u_seed * 10.0 + u_pressure * 5.0;
      float wave = sin(dist * freq - u_time * 2.0 + noise_val * 3.0);
      
      // Lobes / Petals
      float lobes = cos(a * symmetry * 1.5 + noise_val * 2.0);
      float interference = wave * lobes;
      
      // Sharpen to extract "nodal lines"
      float sharpness = 4.0 + (u_clarity * 6.0);
      float nodal = pow(1.0 - abs(interference), sharpness);
      
      // COLOR COMPOSITION (Gasoline on Concrete)
      // Background: Concrete-like texture
      float concrete = fbm(uv * 100.0) * 0.05;
      vec3 color = vec3(0.02 + concrete); // Dark concrete base
      
      // Oily iridescence based on warped noise and nodal pattern
      vec3 irid = getIridescence(noise_val + dist, angle);
      
      // Highlight the nodal lines (Electric Cyan effect)
      vec3 electricCyan = vec3(0.0, 0.9, 1.0);
      color = mix(color, irid * 0.8, smoothstep(0.1, 0.6, nodal));
      color += electricCyan * pow(nodal, 12.0) * 1.5; // Core glow
      
      // Add "Gasoline hotspots" (Gold/Orange)
      float hotspot = smoothstep(0.8, 1.0, noise_val * interference);
      color += vec3(1.0, 0.5, 0.0) * hotspot * u_pressure;
      
      // Central "Source" glow
      float center = 1.0 / (dist * 20.0 + 0.1);
      color += electricCyan * center * 0.5;
      
      // Coherence - controls the "clarity" of the structure vs the liquid chaos
      color = mix(vec3(dot(color, vec3(0.299, 0.587, 0.114))), color, 0.5 + u_coherence * 0.5);

      // Vignette
      color *= smoothstep(1.3, 0.4, dist);
      
      // Final polish: smooth clipping
      color = smoothstep(0.0, 1.0, color);

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
