// Dynamic old-wise-tale generation tied to Mandala state
// Non-religious, emotionally relatable, timeless and neutral

import type { MandalaState } from "./state"

interface WisdomEntry {
  saying: string
  context: string // When to use
}

// State-mapped wisdom sayings
const wisdomByState = {
  // High pressure states
  highPressure: [
    { saying: "The river does not rush to reach the sea.", context: "patience under pressure" },
    { saying: "What presses hardest often passes fastest.", context: "transience of intensity" },
    { saying: "Tension held too long becomes the knot, not the thread.", context: "release" },
    { saying: "The tightest grip leaves the deepest marks.", context: "letting go" },
  ],

  // Low pressure states
  lowPressure: [
    { saying: "Still water runs where it must.", context: "natural flow" },
    { saying: "The pause is part of the pattern.", context: "rest is valid" },
    { saying: "Some seeds need frost before they grow.", context: "dormancy" },
    { saying: "Emptiness makes room for what arrives.", context: "receptivity" },
  ],

  // High clarity states
  highClarity: [
    { saying: "When the path is visible, the step is simple.", context: "clear action" },
    { saying: "Light travels faster than intention.", context: "seize clarity" },
    { saying: "What is seen cannot be unseen. Choose when to look.", context: "timing of insight" },
    { saying: "The clearest water shows the deepest stones.", context: "depth in clarity" },
  ],

  // Low clarity states
  lowClarity: [
    { saying: "Fog lifts when it lifts.", context: "patience with confusion" },
    { saying: "Not all questions have today's answers.", context: "uncertainty tolerance" },
    { saying: "The path exists before you can see it.", context: "trust in obscurity" },
    { saying: "Sometimes the compass spins before settling.", context: "disorientation is temporary" },
  ],

  // High velocity states
  highVelocity: [
    { saying: "Speed reveals what stillness hides.", context: "momentum" },
    { saying: "Not every wind needs a sail.", context: "selective engagement" },
    { saying: "The fastest current carries the most debris.", context: "caution in speed" },
    { saying: "What accelerates also decelerates.", context: "cycles" },
  ],

  // Low velocity states
  slowVelocity: [
    { saying: "The slowest season prepares the longest harvest.", context: "preparation" },
    { saying: "Roots grow in the quiet.", context: "unseen growth" },
    { saying: "Not all movement is visible.", context: "internal work" },
    { saying: "The pause before the next breath is still breathing.", context: "continuity in stillness" },
  ],

  // High coherence states
  highCoherence: [
    { saying: "When the parts agree, the whole speaks.", context: "alignment" },
    { saying: "Harmony is not uniformity.", context: "integration" },
    { saying: "The clearest bell rings from one strike.", context: "unified action" },
    { saying: "What aligns inside, arranges outside.", context: "inner-outer correspondence" },
  ],

  // Low coherence states
  lowCoherence: [
    { saying: "Scattered seeds still find their soil.", context: "fragmentation is not failure" },
    { saying: "The symphony includes dissonance.", context: "integration of parts" },
    { saying: "What is pulling apart may be sorting itself.", context: "necessary separation" },
    { saying: "Not every thread belongs in every weave.", context: "selective integration" },
  ],

  // Combined states
  pressureClarity: {
    highHigh: [
      { saying: "Clear sight under pressure reveals character.", context: "testing ground" },
      { saying: "The hardest diamond catches the most light.", context: "pressure + clarity" },
    ],
    highLow: [
      { saying: "Pressure without clarity is weight without direction.", context: "slow down" },
      { saying: "The heaviest fog lifts when the storm passes.", context: "wait" },
    ],
    lowHigh: [
      { saying: "Ease and insight are uncommon companions. Use them.", context: "act now" },
      { saying: "Calm water reflects furthest.", context: "advantage of peace" },
    ],
    lowLow: [
      { saying: "Rest is its own wisdom.", context: "allow dormancy" },
      { saying: "The seed knows when to wake.", context: "trust timing" },
    ],
  },

  // General / fallback
  general: [
    { saying: "The pattern repeats until it doesn't.", context: "change" },
    { saying: "What you observe, you influence.", context: "attention" },
    { saying: "Timing is not everything, but it is something.", context: "conditions matter" },
    { saying: "The map is not the territory.", context: "humility" },
    { saying: "Stillness is not the absence of motion.", context: "presence" },
  ],
}

// Generate wisdom based on current state
export function generateWisdom(state: MandalaState): WisdomEntry {
  const { pressure, clarity, velocity, coherence } = state

  // Determine dominant state dimensions
  const isHighPressure = pressure > 0.65
  const isLowPressure = pressure < 0.35
  const isHighClarity = clarity > 0.65
  const isLowClarity = clarity < 0.35
  const isHighVelocity = velocity > 0.65
  const isSlowVelocity = velocity < 0.35
  const isHighCoherence = coherence > 0.65
  const isLowCoherence = coherence < 0.35

  // Try combined states first
  if (isHighPressure && isHighClarity) {
    return randomFrom(wisdomByState.pressureClarity.highHigh)
  }
  if (isHighPressure && isLowClarity) {
    return randomFrom(wisdomByState.pressureClarity.highLow)
  }
  if (isLowPressure && isHighClarity) {
    return randomFrom(wisdomByState.pressureClarity.lowHigh)
  }
  if (isLowPressure && isLowClarity) {
    return randomFrom(wisdomByState.pressureClarity.lowLow)
  }

  // Single dimension states
  if (isHighPressure) return randomFrom(wisdomByState.highPressure)
  if (isLowPressure) return randomFrom(wisdomByState.lowPressure)
  if (isHighClarity) return randomFrom(wisdomByState.highClarity)
  if (isLowClarity) return randomFrom(wisdomByState.lowClarity)
  if (isHighVelocity) return randomFrom(wisdomByState.highVelocity)
  if (isSlowVelocity) return randomFrom(wisdomByState.slowVelocity)
  if (isHighCoherence) return randomFrom(wisdomByState.highCoherence)
  if (isLowCoherence) return randomFrom(wisdomByState.lowCoherence)

  // Fallback to general
  return randomFrom(wisdomByState.general)
}

// Get wisdom for empty states / loading
export function getEmptyStateWisdom(): string {
  const emptyStateWisdom = [
    "Silence is valid data.",
    "The pattern emerges in its own time.",
    "What arrives, arrives.",
    "Begin where you are.",
  ]
  return randomFrom(emptyStateWisdom.map((s) => ({ saying: s, context: "empty" }))).saying
}

// Get wisdom for hero/landing sections
export function getHeroWisdom(): WisdomEntry {
  const heroWisdom = [
    { saying: "A mirror, not a map.", context: "core identity" },
    { saying: "Fix the receiver.", context: "self-calibration" },
    { saying: "Orientation, not prediction.", context: "purpose" },
    { saying: "The signal is yours to interpret.", context: "agency" },
  ]
  return randomFrom(heroWisdom)
}

// Helper to get random item from array
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Get multiple unique wisdom entries
export function getWisdomSet(state: MandalaState, count: number): WisdomEntry[] {
  const seen = new Set<string>()
  const results: WisdomEntry[] = []

  while (results.length < count && results.length < 10) {
    const wisdom = generateWisdom(state)
    if (!seen.has(wisdom.saying)) {
      seen.add(wisdom.saying)
      results.push(wisdom)
    }
  }

  return results
}
