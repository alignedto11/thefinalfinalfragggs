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
    
    float t = u_time * 0.15;
    
    // REFERENCE-BASED CYMATIC PATTERN
    // Deep teal/green centers, orange/yellow highlights, geometric pods
    
    // 6-fold symmetry (matching reference image)
    float symmetry = 6.0;
    float symAngle = mod(angle + 3.14159, 3.14159 * 2.0 / symmetry) * symmetry;
    
    // Multiple Chladni frequency layers
    float freq1 = 4.0 + sin(t * 0.3) * 0.5;
    float freq2 = 6.0 + cos(t * 0.4) * 0.5;
    float freq3 = 3.0;
    
    // Chladni nodal patterns (where "sand" accumulates)
    float chladni1 = sin(freq1 * symAngle) * cos(freq1 * r * 8.0 * u_pressure);
    float chladni2 = cos(freq2 * symAngle) * sin(freq2 * r * 6.0 * u_coherence);
    float chladni3 = sin(freq3 * symAngle + t) * cos(freq3 * r * 10.0);
    
    // Combine for nodal lines
    float nodes = abs(chladni1) * 0.5 + abs(chladni2) * 0.3 + abs(chladni3) * 0.2;
    
    // Sharpen nodal lines significantly
    nodes = pow(nodes, 3.0);
    nodes = smoothstep(0.1, 0.6, nodes);
    
    // GEOMETRIC PODS (circular structures in reference)
    // Create repeating circular pods at specific radii
    float podDist1 = abs(r - 0.35) * 12.0;
    float podDist2 = abs(r - 0.55) * 10.0;
    float podDist3 = abs(r - 0.75) * 8.0;
    
    // Pods appear at symmetry points
    float podAngle = mod(angle + 3.14159, 3.14159 * 2.0 / symmetry);
    float podMask = smoothstep(0.5, 0.2, abs(podAngle - 3.14159 / symmetry));
    
    float pods1 = exp(-podDist1 * podDist1) * podMask;
    float pods2 = exp(-podDist2 * podDist2) * podMask;
    float pods3 = exp(-podDist3 * podDist3) * podMask;
    float pods = pods1 + pods2 * 0.7 + pods3 * 0.5;
    
    // Combine nodes and pods
    float pattern = nodes + pods * 2.0;
    pattern = clamp(pattern, 0.0, 1.0);
    
    // REFERENCE COLORS: Teal/Green centers with Orange/Yellow highlights
    // Base deep teal (dark water-like color)
    vec3 baseTeal = vec3(0.05, 0.25, 0.30);
    
    // Mid teal/cyan
    vec3 midTeal = vec3(0.15, 0.45, 0.50);
    
    // Bright cyan/blue
    vec3 brightCyan = vec3(0.25, 0.65, 0.75);
    
    // Orange highlights (like in reference)
    vec3 orange = vec3(0.85, 0.55, 0.25);
    
    // Yellow bright spots
    vec3 yellow = vec3(0.95, 0.85, 0.50);
    
    // Color based on pattern intensity (teal -> orange transition)
    vec3 color;
    if (pattern < 0.3) {
      color = mix(baseTeal, midTeal, pattern / 0.3);
    } else if (pattern < 0.6) {
      color = mix(midTeal, brightCyan, (pattern - 0.3) / 0.3);
    } else if (pattern < 0.8) {
      color = mix(brightCyan, orange, (pattern - 0.6) / 0.2);
    } else {
      color = mix(orange, yellow, (pattern - 0.8) / 0.2);
    }
    
    // Add pods with orange/yellow highlights
    color += pods * orange * 1.5;
    
    // Bright center glow (matching reference)
    float centerGlow = exp(-r * r * 3.0) * 0.4;
    color += yellow * centerGlow;
    
    // Outer edge glow (cyan/teal)
    float edgeGlow = exp(-(1.0 - r) * (1.0 - r) * 15.0) * 0.3;
    color += brightCyan * edgeGlow;
    
    // Flowing organic edges (like water movement in reference)
    float edgeFlow = sin(angle * 6.0 + t * 2.0) * cos(r * 10.0) * 0.1;
    color += vec3(edgeFlow * 0.2, edgeFlow * 0.3, edgeFlow * 0.35);
    
    // Vignette
    color *= smoothstep(1.0, 0.2, r);
    
    // Final brightness and saturation adjustment
    color = color * 1.8;
    color = color / (color + vec3(0.4)); // Tone mapping
    
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
