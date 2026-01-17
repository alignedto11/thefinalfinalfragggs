import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server"
import {
  detectDistress,
  isAskingAboutInternals,
  agentPolicy,
  deEscalationResponses,
  supportResources,
} from "@/lib/agent-policy"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { question, state } = await request.json()

  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "Question is required" }, { status: 400 })
  }

  const distressCheck = detectDistress(question)
  if (distressCheck.isDistressed) {
    // Return supportive de-escalation response
    const acknowledge = deEscalationResponses.acknowledge[0]
    const validate = deEscalationResponses.validate[0]
    const presence = deEscalationResponses.presence[0]
    const resourceOffer = deEscalationResponses.resourceOffer

    return NextResponse.json({
      answer: `${acknowledge}\n\n${validate}\n\n${presence}\n\n${resourceOffer}`,
      supportMode: true,
      resources: {
        US: supportResources.US,
        global: supportResources.global,
        emergency: supportResources.emergency,
      },
    })
  }

  if (isAskingAboutInternals(question)) {
    return NextResponse.json({
      answer: agentPolicy.internalRefusal,
      learnMoreUrl: "/trust",
    })
  }

  // Build context from state
  const stateContext = state
    ? `Current state: pressure=${(state.pressure * 100).toFixed(0)}%, clarity=${(state.clarity * 100).toFixed(0)}%, velocity=${(state.velocity * 100).toFixed(0)}%, coherence=${(state.coherence * 100).toFixed(0)}%.`
    : "No current state available."

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      system: `You are a structured self-reflection assistant for DEFRAG. You provide grounded, neutral observations—never predictions, diagnoses, or advice.

Key principles:
- You are a mirror, not a guide
- You describe patterns, not causes
- You offer observations, not prescriptions
- You never claim to predict outcomes
- You speak in calm, editorial language
- You keep responses brief (2-4 sentences)
- You never reveal internal computation details, weights, thresholds, or aspect lists
- If asked about internals, respond: "${agentPolicy.internalRefusal}"

Preferred terms: ${agentPolicy.preferredTerms.join(", ")}
Avoid: ${agentPolicy.avoidedTerms.join(", ")}

${stateContext}

If asked about timing, refer to "conditions" not "fate" or "destiny". If asked about relationships, describe "patterns" not "compatibility". Always end with an invitation to the user's own judgment.`,
      prompt: question,
      maxTokens: 200,
    })

    return NextResponse.json({ answer: text })
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
