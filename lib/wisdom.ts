// Dynamic wisdom generation tied to mandala state
// Non-religious, emotionally relatable, timeless sayings

import type { MandalaState } from "./state"

export interface WisdomSaying {
  text: string
  category: "timing" | "pressure" | "stillness" | "motion" | "coherence"
}

// State bins for selecting appropriate wisdom
function getStateBin(state: MandalaState): {
  pressureBin: "low" | "moderate" | "elevated" | "high"
  clarityBin: "low" | "moderate" | "good" | "excellent"
  velocityBin: "slow" | "moderate" | "fast"
  coherenceBin: "fragmented" | "partial" | "aligned"
} {
  return {
    pressureBin:
      state.pressure < 0.3 ? "low" : state.pressure < 0.5 ? "moderate" : state.pressure < 0.7 ? "elevated" : "high",
    clarityBin:
      state.clarity < 0.3 ? "low" : state.clarity < 0.5 ? "moderate" : state.clarity < 0.75 ? "good" : "excellent",
    velocityBin: state.velocity < 0.35 ? "slow" : state.velocity < 0.65 ? "moderate" : "fast",
    coherenceBin: state.coherence < 0.35 ? "fragmented" : state.coherence < 0.65 ? "partial" : "aligned",
  }
}

// Wisdom by state conditions
const wisdomByCondition = {
  // High pressure conditions
  highPressure: [
    { text: "When the pot boils, step back from the stove.", category: "pressure" as const },
    { text: "Pressure reveals. It does not require immediate action.", category: "pressure" as const },
    { text: "The tightest knot unwinds more easily with patience.", category: "pressure" as const },
    { text: "Heavy weather passes. Shelter is not surrender.", category: "pressure" as const },
  ],

  // Low clarity conditions
  lowClarity: [
    { text: "Fog is weather, not failure.", category: "stillness" as const },
    { text: "When the picture is unclear, gathering light is work.", category: "stillness" as const },
    { text: "Confusion is the moment before understanding.", category: "stillness" as const },
    { text: "You cannot force clarity. You can stop muddying the water.", category: "stillness" as const },
  ],

  // Fast velocity
  fastVelocity: [
    { text: "Speed is a condition, not a virtue.", category: "motion" as const },
    { text: "The river moves fastest before it bends.", category: "motion" as const },
    { text: "Momentum asks: where are we going?", category: "motion" as const },
  ],

  // Slow velocity
  slowVelocity: [
    { text: "Stillness is motion at a different scale.", category: "timing" as const },
    { text: "Seeds do their work underground.", category: "timing" as const },
    { text: "Winter is not wasted time.", category: "timing" as const },
    { text: "Slow is not the same as stuck.", category: "timing" as const },
  ],

  // Good coherence
  goodCoherence: [
    { text: "When the pieces align, trust the direction.", category: "coherence" as const },
    { text: "Coherence is temporary. Use it while it lasts.", category: "coherence" as const },
    { text: "Clarity does not mean certainty.", category: "coherence" as const },
  ],

  // Fragmented coherence
  fragmentedCoherence: [
    { text: "Fragmentation is data. Not chaos.", category: "coherence" as const },
    { text: "You don't need to hold everything at once.", category: "coherence" as const },
    { text: "Scattered attention gathers in its own time.", category: "coherence" as const },
  ],

  // Balanced conditions
  balanced: [
    { text: "Good conditions are still conditions.", category: "timing" as const },
    { text: "Stability is a window, not a state.", category: "timing" as const },
    { text: "When the way is clear, the work is lighter.", category: "motion" as const },
  ],

  // Default wisdom
  default: [
    { text: "Fix the receiver.", category: "stillness" as const },
    { text: "Pattern reveals itself to patience.", category: "timing" as const },
    { text: "You are not the weather.", category: "stillness" as const },
    { text: "Observe first. Decide second.", category: "timing" as const },
  ],
}

// Select wisdom based on current state
export function getWisdomForState(state: MandalaState): WisdomSaying {
  const bins = getStateBin(state)
  const candidates: WisdomSaying[] = []

  // High pressure takes priority
  if (bins.pressureBin === "high" || bins.pressureBin === "elevated") {
    candidates.push(...wisdomByCondition.highPressure)
  }

  // Low clarity
  if (bins.clarityBin === "low") {
    candidates.push(...wisdomByCondition.lowClarity)
  }

  // Velocity
  if (bins.velocityBin === "fast") {
    candidates.push(...wisdomByCondition.fastVelocity)
  } else if (bins.velocityBin === "slow") {
    candidates.push(...wisdomByCondition.slowVelocity)
  }

  // Coherence
  if (bins.coherenceBin === "aligned") {
    candidates.push(...wisdomByCondition.goodCoherence)
  } else if (bins.coherenceBin === "fragmented") {
    candidates.push(...wisdomByCondition.fragmentedCoherence)
  }

  // Balanced conditions
  if (bins.pressureBin === "moderate" && bins.clarityBin === "good" && bins.coherenceBin === "aligned") {
    candidates.push(...wisdomByCondition.balanced)
  }

  // Fall back to default if no specific conditions matched
  if (candidates.length === 0) {
    candidates.push(...wisdomByCondition.default)
  }

  // Select deterministically based on state values
  const index =
    Math.floor((state.pressure + state.clarity + state.velocity + state.coherence) * candidates.length) %
    candidates.length
  return candidates[index]
}

// Get random wisdom for empty states
export function getRandomWisdom(): WisdomSaying {
  const all = [...wisdomByCondition.default, ...wisdomByCondition.balanced]
  return all[Math.floor(Math.random() * all.length)]
}
