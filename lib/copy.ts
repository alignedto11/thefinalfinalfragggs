// Canonical copy module - all surface language imports from here
// No esoteric/mystical language. Neutral, relatable, editorial tone.

export const oldWiseTales = {
  hero: {
    headline: "The Resonance of Being.",
    subhead: "Surface the recurring patterns in your timing, energy, and relationships. Not to predict the future, but to master the present. Move from reactive chaos to rhythmic alignment.",
    hook: "DEFRAG",
    cta: "Start Calibration",
  },

  wisdomFragments: {
    highPressure: [
      "When the water is turbulent, wait for it to settle before you can see the bottom.",
      "A bow drawn too tight will snap. A bow never drawn grows stiff.",
      "The reed that bends survives the storm. The oak that resists may fall.",
    ],
    lowClarity: [
      "In fog, move slowly. The path reveals itself one step at a time.",
      "When you cannot see far, see near. When you cannot see near, stand still.",
      "The confused mind makes clear decisions poorly.",
    ],
    highVelocity: [
      "Swift water runs shallow. Deep water runs slow.",
      "The arrow loosed cannot be recalled. Consider before you draw.",
      "Speed feels like progress. Progress feels like peace.",
    ],
    lowCoherence: [
      "Scattered seeds grow into scattered gardens. First, prepare the soil.",
      "Many paths, one destination. Choose the path, walk it fully.",
      "When everything matters, nothing matters. Narrow your focus.",
    ],
    balanced: [
      "Still water reflects truly. This is a moment of clarity.",
      "The door is open. Whether you walk through is your choice.",
      "Conditions favor action. Trust your preparation.",
    ],
    calm: [
      "Rest is not absence. Rest is preparation.",
      "The field lies fallow to return fertile.",
      "In stillness, the next move reveals itself.",
    ],
  },

  value: {
    title: "Orientation, not prediction.",
    items: [
      {
        label: "Pattern recognition",
        description: "Surface recurring themes from your personal history without interpretation.",
        icon: "waves",
      },
      {
        label: "Timing context",
        description: "Understand when conditions favor action versus when pause serves better.",
        icon: "clock",
      },
      {
        label: "Relational clarity",
        description: "Map your constellation of connections. See weather, not blame.",
        icon: "users",
      },
    ],
  },

  how: {
    title: "How it works",
    steps: [
      {
        number: "01",
        title: "Calibrate",
        description: "Provide your timing context. We compute your baseline pattern. No judgment, just math.",
      },
      {
        number: "02",
        title: "Observe",
        description: "Receive a daily read tuned to current conditions. Watch how the mandala shifts.",
      },
      {
        number: "03",
        title: "Decide",
        description: "The system suggests windows. You decide what to do with them. Agency remains yours.",
      },
    ],
  },

  trust: {
    title: "What this is. What it isn't.",
    statements: [
      "Structured self-reflection.",
      "Not predictive. Not diagnostic.",
      "Not a substitute for professional care.",
    ],
    expanded: [
      "DEFRAG uses pattern recognition to surface timing context from your personal data.",
      "It does not predict the future. It does not diagnose conditions.",
      "Think of it as a weather report for internal conditions—useful for planning, not prophecy.",
      "If you're experiencing distress, please consult a qualified professional.",
    ],
  },

  pricing: {
    title: "Choose your depth",
    tiers: [
      {
        name: "Passive",
        price: "Free",
        description: "Observe your patterns",
        features: ["Daily state snapshot", "Mandala visualization", "Basic timing windows"],
      },
      {
        name: "Guided",
        price: "$9",
        period: "/month",
        description: "Structured reflection",
        features: ["Everything in Passive", "Voice-guided briefings", "Spiral event tracking", "Constellation mapping"],
        recommended: true,
      },
      {
        name: "Active",
        price: "$19",
        period: "/month",
        description: "Full integration",
        features: [
          "Everything in Guided",
          "AI action proposals",
          "Priority timing windows",
          "Apple Wallet card",
          "Ask synthesis interface",
        ],
      },
    ],
  },

  footer: {
    tagline: "Structured self-reflection.",
    legal: "Not predictive. Not diagnostic. Not a substitute for professional care.",
    links: [
      { label: "Trust", href: "/trust" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: "/contact-ethics" },
    ],
  },

  terms: {
    title: "Terms of Service",
    effectiveDate: "January 2025",
    sections: [
      {
        title: "What DEFRAG Is",
        content: [
          "DEFRAG is an educational and exploratory tool for structured self-reflection.",
          "It uses pattern recognition to surface timing context from your personal data.",
          "Think of it as a calibration instrument—helping you observe your patterns, not predict your future.",
        ],
      },
      {
        title: "What DEFRAG Is Not",
        content: [
          "DEFRAG is not a substitute for licensed clinical therapy, counseling, or medical care.",
          "It does not diagnose mental health conditions, medical conditions, or any other conditions.",
          "It does not predict outcomes, events, or the behavior of other people.",
          "It does not provide treatment recommendations or medical advice.",
        ],
      },
      {
        title: "Your Responsibility",
        content: [
          "You retain full agency over all decisions you make.",
          "DEFRAG provides observations, not instructions. What you do with them is entirely your choice.",
          "If you are experiencing distress, crisis, or health concerns, please consult a qualified professional.",
        ],
      },
      {
        title: "Data & Privacy",
        content: [
          "We store the minimum data required for the system to work.",
          "Your personal data is used only to compute your patterns and provide the service.",
          "We do not share, sell, or monetize your personal data.",
          "You can export or delete your data at any time from Settings.",
        ],
      },
      {
        title: "The System's Limitations",
        content: [
          "DEFRAG's observations are based on patterns, not certainties.",
          "Timing windows are contextual suggestions, not guarantees.",
          "The accuracy of any reading depends on the accuracy of the data you provide.",
          "Like any tool, it works best when used with judgment and self-awareness.",
        ],
      },
    ],
    acceptance: "By using DEFRAG, you acknowledge that you have read and understood these terms.",
  },

  safetyNotice: {
    short: "Not predictive. Not diagnostic. Not a substitute for professional care.",
    full: [
      "DEFRAG is an educational tool for structured self-reflection.",
      "It is not therapy and does not replace professional mental health care.",
      "If you're in crisis, please reach out to a qualified professional or crisis line.",
    ],
  },
}

export const surface = {
  // State labels - never expose raw numbers
  pressure: {
    low: "Settled",
    moderate: "Active",
    elevated: "Elevated",
    high: "Intensive",
  },

  clarity: {
    low: "Diffuse",
    moderate: "Mixed",
    good: "Clear",
    excellent: "Crystalline",
  },

  velocity: {
    slow: "Slow",
    moderate: "Steady",
    fast: "Rapid",
    intense: "Accelerated",
  },

  coherence: {
    fragmented: "Fragmented",
    partial: "Partial",
    aligned: "Aligned",
    unified: "Unified",
  },

  // Action types
  actions: {
    play_audio: "Listen",
    log_event: "Note",
    schedule_prompt: "Schedule",
    open_module: "Begin",
    breathwork: "Breathwork",
    journaling: "Journaling",
    walking: "Walking",
  },

  // Time labels
  windows: {
    now: "Now",
    soon: "Soon",
    later: "Later",
    tomorrow: "Tomorrow",
  },

  // Navigation
  nav: {
    dashboard: "Today",
    ask: "Ask",
    spiral: "Spiral",
    constellations: "Connections",
    settings: "Settings",
  },

  explainMode: {
    whatYouSee: {
      title: "What you're seeing",
      mandala:
        "This mandala reflects your current state—pressure, clarity, pace, and coherence. The patterns shift as conditions change.",
      stateCard:
        "These four dimensions describe current conditions. They're not judgments—just observations of the pattern.",
      windows:
        "Windows are periods when conditions tend to favor certain kinds of action. They're contextual, not predictive.",
    },
    howToUse: {
      title: "How to use this",
      mandala: "Watch for shifts over time. A calmer mandala often means steadier conditions for decisions.",
      stateCard: "Use these as a check-in, not a directive. High pressure isn't bad; low clarity isn't failure.",
      windows: "These are suggestions, not schedules. If a window doesn't feel right, trust your judgment.",
    },
    whatNotToDo: {
      title: "What not to do right now",
      highPressure: "When pressure is elevated, avoid forcing decisions that can wait. Space helps.",
      lowClarity: "When clarity is diffuse, information-gathering works better than commitment.",
      fragmented: "When coherence is fragmented, consolidation matters more than expansion.",
    },
    whenToCheck: {
      title: "When to check again",
      content:
        "Conditions shift throughout the day. Morning and late afternoon often show different patterns. Check in when you feel uncertain, not compulsively.",
    },
  },

  confidence: {
    approximate: "Approximate",
    confident: "Confident",
    approximateTooltip: "Some timing data was estimated. Results may vary.",
  },
}
