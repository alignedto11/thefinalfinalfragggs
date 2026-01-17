// State computation utilities
// Deterministic mapping from raw values to visual parameters

export interface MandalaState {
  pressure: number // 0-1
  clarity: number // 0-1
  velocity: number // 0-1
  coherence: number // 0-1
  longitudes?: number[] // For relational geometry
  giftRatio?: number // For vector scale (0 = shadow, 1 = gift)
}

export interface MandalaUniforms {
  fHz: number
  rippleAmp: number
  lineContrast: number
  noise: number
  ringTightness: number
}

// Linear interpolation
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// Clamp to [0, 1]
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

// Compute visual uniforms from state
export function computeUniforms(state: MandalaState): MandalaUniforms {
  const { pressure, clarity, velocity, coherence } = state

  return {
    // fHz = lerp(0.12, 1.35, clamp(0.65*velocity + 0.35*pressure))
    fHz: lerp(0.12, 1.35, clamp01(0.65 * velocity + 0.35 * pressure)),

    // rippleAmp = lerp(0.008, 0.03, clamp(pressure))
    rippleAmp: lerp(0.008, 0.03, clamp01(pressure)),

    // lineContrast = lerp(0.25, 0.6, clamp(clarity))
    lineContrast: lerp(0.25, 0.6, clamp01(clarity)),

    // noise = lerp(0.04, 0.12, 1-coherence)
    noise: lerp(0.04, 0.12, clamp01(1 - coherence)),

    // ringTightness = lerp(1.4, 2.6, clamp(pressure))
    ringTightness: lerp(1.4, 2.6, clamp01(pressure)),
  }
}

// Convert state value to human label
export function getStateLabel(dimension: "pressure" | "clarity" | "velocity" | "coherence", value: number): string {
  const { surface } = require("./copy")

  const thresholds = {
    pressure: [
      [0.25, surface.pressure.low],
      [0.5, surface.pressure.moderate],
      [0.75, surface.pressure.elevated],
      [1, surface.pressure.high],
    ],
    clarity: [
      [0.25, surface.clarity.low],
      [0.5, surface.clarity.moderate],
      [0.75, surface.clarity.good],
      [1, surface.clarity.excellent],
    ],
    velocity: [
      [0.25, surface.velocity.slow],
      [0.5, surface.velocity.moderate],
      [0.75, surface.velocity.fast],
      [1, surface.velocity.intense],
    ],
    coherence: [
      [0.25, surface.coherence.fragmented],
      [0.5, surface.coherence.partial],
      [0.75, surface.coherence.aligned],
      [1, surface.coherence.unified],
    ],
  }

  const levels = thresholds[dimension]
  for (const [threshold, label] of levels) {
    if (value <= (threshold as number)) {
      return label as string
    }
  }
  return levels[levels.length - 1][1] as string
}

// Generate stable hash from user ID for visual seed
export function generateSeed(userId: string): number {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash) / 2147483647
}

// Demo state for non-authenticated users
export const demoState: MandalaState = {
  pressure: 0.45,
  clarity: 0.62,
  velocity: 0.38,
  coherence: 0.71,
}
