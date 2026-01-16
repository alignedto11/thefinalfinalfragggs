"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Pause, Volume2 } from "lucide-react"

interface VoiceBriefingProps {
  brief: string
}

export function VoiceBriefing({ brief }: VoiceBriefingProps) {
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

    const utterance = new SpeechSynthesisUtterance(brief)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    // Find a calm voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      (v) => v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Daniel"),
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
      className="h-9 gap-2 text-muted-foreground hover:text-foreground"
      onClick={handlePlay}
      disabled={isLoading}
    >
      {isPlaying ? (
        <>
          <Pause className="h-4 w-4" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4" />
          <span>Listen</span>
        </>
      )}
    </Button>
  )
}
