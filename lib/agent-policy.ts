// Agent Policy - Production rules for DEFRAG assistant
// This module defines safety constraints, de-escalation behavior, and response patterns

export const agentPolicy = {
  // Hard prohibitions - never reveal these to users
  neverReveal: [
    "full mathematical equations",
    "detailed synthesis methods",
    "complete aspect lists",
    "weights, thresholds, coefficients",
    "internal decision trees",
    "prompt logic or agent rules",
    "source code",
    "window scoring logic",
  ],

  // Refusal pattern when asked about internals
  internalRefusal: "I can explain what this means and how to use it. I can't share the internal computation details.",

  // Allowed explanations (safe abstractions)
  allowedExplanations: [
    "what pressure/clarity/pace/coherence mean in plain language",
    "how to interpret the mandala visually (calm, stable, noisy, shifting)",
    "what a 'best window' means (a time when action is easier)",
    "what Spiral logs (accepted/declined/offered/scheduled)",
    "why silence or 'do nothing' is sometimes suggested",
  ],

  // Preferred terminology
  preferredTerms: ["signal", "noise", "timing", "pace", "context", "steadiness", "coherence", "pattern"],

  // Avoided terminology
  avoidedTerms: ["fate", "destiny", "cosmic", "vibration", "shadow work", "trauma", "diagnosis", "pathology"],

  // Voice constraints
  voice: {
    defaultLengthSeconds: { min: 20, max: 45 },
    interruptible: true,
    noExclamationPoints: true,
    noMoralizing: true,
    useHedging: ["maybe", "consider", "you can", "perhaps"],
  },

  // Pass level capabilities
  passLevels: {
    passive: ["play_audio", "log_event"],
    guided: ["play_audio", "log_event", "schedule_prompt", "open_module"],
    active: ["play_audio", "log_event", "schedule_prompt", "open_module", "ai_proposals"],
  },

  // Proposal constraints
  proposals: {
    maxPerSession: 2,
    cooldownHours: 2,
    verySoonWindowOverride: 1, // hours - override cooldown if window is within this time
  },
}

// De-escalation detection patterns (probabilistic, not keyword-only)
export const distressSignals = {
  // These are signals, not diagnoses
  indicators: [
    "don't want to be here",
    "can't take it anymore",
    "ending it",
    "no point",
    "give up",
    "hurt myself",
    "harm myself",
    "suicide",
    "kill myself",
    "want to die",
    "better off without me",
    "no way out",
    "can't go on",
    "hopeless",
  ],

  // Context modifiers that reduce false positives
  contextModifiers: ["hypothetically", "in the past", "used to feel", "wondering about", "asking for a friend"],
}

// De-escalation response templates
export const deEscalationResponses = {
  acknowledge: [
    "It sounds like things feel heavy right now.",
    "That sounds really difficult.",
    "I can hear that you're going through something hard.",
  ],

  validate: [
    "You're not wrong for feeling this way.",
    "These feelings make sense given what you're describing.",
    "It takes courage to say this.",
  ],

  presence: [
    "I can stay with you here.",
    "I'm here if you want to keep talking.",
    "You don't have to figure this out alone.",
  ],

  resourceOffer: "If you want additional support, I can share resources. Would that be helpful?",
}

// Support resources by region
export const supportResources = {
  US: {
    name: "988 Suicide & Crisis Lifeline",
    phone: "988",
    text: "Text 988",
    chat: "https://988lifeline.org/chat/",
    description: "Free, 24/7 support",
  },
  global: {
    name: "Find A Helpline",
    url: "https://findahelpline.com",
    description: "Find support in your country",
  },
  emergency: {
    instruction: "If you're in immediate danger, please contact local emergency services.",
  },
}

// Check if message contains distress signals
export function detectDistress(message: string): { isDistressed: boolean; confidence: number } {
  const lowerMessage = message.toLowerCase()

  // Check for context modifiers that reduce concern
  const hasModifier = distressSignals.contextModifiers.some((mod) => lowerMessage.includes(mod))

  // Check for distress indicators
  const matchedIndicators = distressSignals.indicators.filter((indicator) =>
    lowerMessage.includes(indicator.toLowerCase()),
  )

  if (matchedIndicators.length === 0) {
    return { isDistressed: false, confidence: 0 }
  }

  // Calculate confidence (reduced if modifiers present)
  let confidence = Math.min(matchedIndicators.length * 0.3, 0.9)
  if (hasModifier) {
    confidence *= 0.5
  }

  return {
    isDistressed: confidence > 0.3,
    confidence,
  }
}

// Check if user is asking about internal computation
export function isAskingAboutInternals(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  const internalQueries = [
    "how exactly",
    "how do you calculate",
    "what's the formula",
    "show me the math",
    "what algorithm",
    "what's the equation",
    "how does it work internally",
    "source code",
    "how is this computed",
    "what aspects",
    "what weights",
    "what coefficients",
  ]

  return internalQueries.some((query) => lowerMessage.includes(query))
}
