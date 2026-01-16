// Natal baseline computation (developer-only)
// This module computes initial state from birth data
// NEVER expose these equations or internals to end users

export interface NatalInput {
  birthDate: string // YYYY-MM-DD
  birthTime?: string // HH:MM (optional)
  birthLocation: {
    lat: number
    lon: number
    tz: string
  }
}

export interface NatalBaseline {
  pressure0: number
  clarity0: number
  velocity0: number
  coherence0: number
  confidence: "approximate" | "confident"
}

// Sigmoid function for squashing
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

// Linear interpolation
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// Clamp to [0, 1]
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

// Wrap angle to [-PI, PI]
function wrapAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI
  while (angle < -Math.PI) angle += 2 * Math.PI
  return angle
}

// Compute planetary longitudes from birth data
// In production, use Swiss Ephemeris or similar
function computePlanetaryLongitudes(input: NatalInput): number[] {
  // This is a placeholder - in production, use an ephemeris library
  // For now, return mock data that varies by birth date
  const date = new Date(input.birthDate + "T" + (input.birthTime || "12:00"))
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)

  // Generate deterministic but varied longitudes based on date
  const seed = dayOfYear + date.getFullYear() * 365
  const planets: number[] = []

  for (let i = 0; i < 10; i++) {
    // Generate pseudo-random longitude for each planet
    const phase = ((seed * (i + 1) * 37) % 360) * (Math.PI / 180)
    planets.push(phase)
  }

  return planets
}

// Compute aspect energy (tension vs harmony)
function computeAspectEnergy(longitudes: number[]): { tension: number; harmony: number } {
  const n = longitudes.length
  const nPairs = (n * (n - 1)) / 2

  // Aspect definitions: [target angle in radians, orb, weight, sign (+1 harmonic, -1 tense)]
  const aspects = [
    [0, 0.15, 1.2, -1], // conjunction (can be tense)
    [Math.PI, 0.15, 1.0, -1], // opposition (tense)
    [Math.PI / 2, 0.13, 1.1, -1], // square (tense)
    [(2 * Math.PI) / 3, 0.1, 0.9, 1], // trine (harmonic)
    [Math.PI / 3, 0.08, 0.7, 1], // sextile (harmonic)
  ]

  let tensionSum = 0
  let harmonySum = 0

  // Calculate aspects between all planet pairs
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const delta = wrapAngle(longitudes[i] - longitudes[j])

      for (const [targetAngle, orb, weight, sign] of aspects) {
        const distance = Math.min(Math.abs(delta - (targetAngle as number)), Math.abs(delta + (targetAngle as number)))

        // Gaussian closeness
        const sigma = (orb as number) / 2.355
        const closeness = Math.exp(-(distance * distance) / (2 * sigma * sigma))

        if ((sign as number) < 0) {
          tensionSum += (weight as number) * closeness
        } else {
          harmonySum += (weight as number) * closeness
        }
      }
    }
  }

  return {
    tension: tensionSum / nPairs,
    harmony: harmonySum / nPairs,
  }
}

// Compute baseline state from natal data
export function computeNatalBaseline(input: NatalInput): NatalBaseline {
  const longitudes = computePlanetaryLongitudes(input)
  const { tension, harmony } = computeAspectEnergy(longitudes)

  // Confidence based on whether birth time was provided
  const confidenceTime = input.birthTime ? 1.0 : 0.5
  const confidence = confidenceTime > 0.7 ? "confident" : "approximate"

  // Constants (internal-only, from spec)
  const alpha = 2.2
  const beta = 0.9
  const gamma = 1.8
  const delta = 1.2
  const b = -0.4
  const c = 0.1
  const vMin = 0.18
  const vUncertainty = 0.22

  // Compute state variables
  const pressure0 = sigmoid(alpha * tension - beta * harmony + b)
  const clarity0 = sigmoid(gamma * harmony - delta * tension + c)
  const velocity0 = vMin + (1 - confidenceTime) * vUncertainty
  const coherence0 = clamp01(0.5 * clarity0 + 0.5 * (1 - pressure0))

  return {
    pressure0,
    clarity0,
    velocity0,
    coherence0,
    confidence: confidence as "approximate" | "confident",
  }
}

// Generate starter read from baseline state (user-facing, safe)
export function generateStarterRead(baseline: NatalBaseline): string {
  const { pressure0, clarity0 } = baseline

  if (pressure0 > 0.72 && clarity0 < 0.45) {
    return "Go slower. Don't force decisions today."
  } else if (pressure0 < 0.45 && clarity0 > 0.62) {
    return "Good conditions for simple forward motion."
  } else if (pressure0 > 0.6) {
    return "Elevated pressure. Consider what can wait."
  } else if (clarity0 < 0.4) {
    return "Diffuse conditions. Gather information before committing."
  } else {
    return "Mixed conditions. Observe before acting."
  }
}
