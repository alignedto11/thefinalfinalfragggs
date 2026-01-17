"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Pause, Volume2, Loader2 } from "lucide-react"

interface VoiceBriefingProps {
  brief: string
  script?: string // Optional pre-generated script
}

export function VoiceBriefing({ brief, script }: VoiceBriefingProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    setIsLoading(true)

    // Use the prosodic script if available, otherwise fallback to the brief
    const textToSpeak = script || brief
    const utterance = new SpeechSynthesisUtterance(textToSpeak)

    // Slower, more rhythmic rate for "Atmospheric" feel
    utterance.rate = 0.85
    utterance.pitch = 0.95
    utterance.volume = 0.8

    // Find a calm voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      (v) => (v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Daniel") || v.name.includes("Natural")) && v.lang.startsWith("en")
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => {
      setIsLoading(false)
      setIsPlaying(true)
    }

    utterance.onend = () => {
      setIsPlaying(false)
    }

    utterance.onerror = () => {
      setIsLoading(false)
      setIsPlaying(false)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-10 px-4 gap-3 bg-white/[0.03] border border-white/5 rounded-full text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/5 transition-all group"
      onClick={handlePlay}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPlaying ? (
        <Pause className="h-4 w-4 fill-current" />
      ) : (
        <Volume2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
      )}
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
        {isLoading ? "Preparing..." : isPlaying ? "Silence" : "Audio Brief"}
      </span>
    </Button>
  )
}

