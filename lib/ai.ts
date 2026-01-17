import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { MandalaState } from "./state"
import { PlanetaryPosition } from "./engine/astronomy"

export interface InsightContext {
    state: MandalaState
    positions: PlanetaryPosition[]
    birthPositions?: PlanetaryPosition[]
    sunGate?: any
}

export async function generateInsightBrief(context: InsightContext): Promise<string> {
    const { state, positions, sunGate } = context

    const stateDesc = `current state is: pressure=${(state.pressure * 100).toFixed(0)}%, clarity=${(state.clarity * 100).toFixed(0)}%, velocity=${(state.velocity * 100).toFixed(0)}%, coherence=${(state.coherence * 100).toFixed(0)}%`

    const sunGateDesc = sunGate ? `The Sun is currently in Gate ${sunGate.id} (${sunGate.name}), which transitions from "${sunGate.shadow}" to "${sunGate.gift}".` : ""

    const prompt = `
    Context:
    - ${stateDesc}
    - ${sunGateDesc}
    
    Task: Write a highly personalized, grounded 3-sentence insight about today's patterns. 
    Tone: Calm, editorial, neutral. 
    Rule: Never predict the future or give advice. Use "we observe" or "the pattern suggests" instead of "you should".
    Style: Minimalist.
  `

    try {
        const { text } = await generateText({
            model: google("gemini-1.5-pro"),
            prompt,
        })
        return text.trim()
    } catch (error) {
        console.error("AI Insight Error:", error)
        return "The current field shows mixed conditions. Observe the shift in pressure before proceeding."
    }
}

export async function generateBaselineWelcome(birthDate: string): Promise<string> {
    const prompt = `
    The user has just calibrated their natal baseline for ${birthDate}.
    Write a 2-sentence welcoming greeting that acknowledges the establishment of their "Standard Shape".
    Tone: Slightly eerie but comforting, clinical, "Fix the receiver" aesthetic.
    Rule: No fluff or marketing speak.
  `

    try {
        const { text } = await generateText({
            model: google("gemini-1.5-flash"),
            prompt,
        })
        return text.trim()
    } catch (error) {
        return "Baseline established. Your personal pattern is now ready for observation."
    }
}

export async function generateVoiceScript(brief: string): Promise<string> {
    const prompt = `
    Transform the following insight brief into a prosodic, rhythmic script for text-to-speech. 
    Focus on adding slight pauses (represented by commas or ellipses) and ensuring a calm, clinical delivery.
    Brief: "${brief}"
    Script Style: Ethereal, low-velocity, authoritative.
  `

    try {
        const { text } = await generateText({
            model: google("gemini-1.5-flash"),
            prompt,
        })
        return text.trim()
    } catch (error) {
        return brief
    }
}

