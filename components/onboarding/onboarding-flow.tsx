"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MandalaCanvas } from "@/components/mandala/mandala-canvas"
import { oldWiseTales } from "@/lib/copy"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface OnboardingFlowProps {
  userId: string
}

type OnboardingStep = "intro" | "terms" | "profile" | "calibrating" | "complete"

export function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const [step, setStep] = useState<OnboardingStep>("intro")
  const [birthDate, setBirthDate] = useState("")
  const [birthTime, setBirthTime] = useState("")
  const [birthLocation, setBirthLocation] = useState("")
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [seed, setSeed] = useState(0.5)
  const router = useRouter()

  // Generate seed from user ID for consistent visuals
  useEffect(() => {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    setSeed(Math.abs(hash) / 2147483647)
  }, [userId])

  const handleCalibrate = async () => {
    setStep("calibrating")
    setIsCalibrating(true)

    const supabase = createClient()

    // Update profile with birth data
    await supabase
      .from("profiles")
      .update({
        birth_date: birthDate || null,
        birth_time: birthTime || null,
        birth_location: birthLocation || null,
        onboarding_completed: true,
      })
      .eq("id", userId)

    // Simulate calibration (in production, this would trigger backend state computation)
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setStep("complete")
    setIsCalibrating(false)
  }

  const handleComplete = () => {
    router.push("/dashboard")
  }

  return (
    <div className="fixed inset-0 bg-background">
      <AnimatePresence mode="wait">
        {step === "intro" && <IntroStep key="intro" seed={seed} onContinue={() => setStep("terms")} />}

        {step === "terms" && <TermsStep key="terms" onAccept={() => setStep("profile")} />}

        {step === "profile" && (
          <ProfileStep
            key="profile"
            birthDate={birthDate}
            birthTime={birthTime}
            birthLocation={birthLocation}
            setBirthDate={setBirthDate}
            setBirthTime={setBirthTime}
            setBirthLocation={setBirthLocation}
            onCalibrate={handleCalibrate}
          />
        )}

        {step === "calibrating" && <CalibratingStep key="calibrating" seed={seed} />}

        {step === "complete" && <CompleteStep key="complete" seed={seed} onContinue={handleComplete} />}
      </AnimatePresence>
    </div>
  )
}

// Intro step with mandala emergence
function IntroStep({ seed, onContinue }: { seed: number; onContinue: () => void }) {
  const [showText, setShowText] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 1500)
    const buttonTimer = setTimeout(() => setShowButton(true), 3000)
    return () => {
      clearTimeout(textTimer)
      clearTimeout(buttonTimer)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center px-4"
    >
      {/* Mandala emergence */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute -inset-8 rounded-full bg-gradient-to-b from-muted/20 to-transparent blur-2xl" />
        <MandalaCanvas
          state={{ pressure: 0.3, clarity: 0.6, velocity: 0.2, coherence: 0.7 }}
          seed={seed}
          size={240}
          className="relative"
        />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
        transition={{ duration: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-lg font-medium tracking-tight">Fix the receiver.</p>
        <p className="mt-2 text-muted-foreground">A calibration instrument for uncertain times.</p>
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showButton ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="mt-12"
      >
        <Button onClick={onContinue} variant="outline" size="lg">
          Begin
        </Button>
      </motion.div>
    </motion.div>
  )
}

// Terms acceptance step
function TermsStep({ onAccept }: { onAccept: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col items-center justify-center px-4"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-medium">Before we begin</h1>
          <p className="mt-2 text-muted-foreground">Please understand what DEFRAG is—and what it isn't.</p>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          {oldWiseTales.trust.statements.map((statement, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
              <p className="text-sm leading-relaxed text-muted-foreground">{statement}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4 text-sm text-muted-foreground">
          {oldWiseTales.trust.expanded.map((text, idx) => (
            <p key={idx} className="leading-relaxed">
              {text}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={onAccept} className="w-full">
            I understand
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you accept our{" "}
            <a href="/terms" className="underline underline-offset-2" target="_blank" rel="noreferrer">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-2" target="_blank" rel="noreferrer">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Profile setup step
function ProfileStep({
  birthDate,
  birthTime,
  birthLocation,
  setBirthDate,
  setBirthTime,
  setBirthLocation,
  onCalibrate,
}: {
  birthDate: string
  birthTime: string
  birthLocation: string
  setBirthDate: (v: string) => void
  setBirthTime: (v: string) => void
  setBirthLocation: (v: string) => void
  onCalibrate: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col items-center justify-center px-4"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-medium">Calibrate your baseline</h1>
          <p className="mt-2 text-muted-foreground">This information helps compute your personal pattern.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth date</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthTime">
              Birth time <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="birthTime"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="h-12"
            />
            <p className="text-xs text-muted-foreground">If unknown, we'll use a reasonable estimate.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthLocation">
              Birth location <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="birthLocation"
              type="text"
              placeholder="City, Country"
              value={birthLocation}
              onChange={(e) => setBirthLocation(e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={onCalibrate} className="w-full" size="lg" disabled={!birthDate}>
            Calibrate
          </Button>
          <p className="text-center text-xs text-muted-foreground">Your data is stored securely and never shared.</p>
        </div>
      </div>
    </motion.div>
  )
}

// Calibrating step with animated mandala
function CalibratingStep({ seed }: { seed: number }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % 3)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const messages = ["Reading baseline patterns...", "Computing personal state...", "Establishing coherence..."]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center px-4"
    >
      {/* Animated mandala */}
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="relative"
      >
        <div className="absolute -inset-8 rounded-full bg-gradient-to-b from-muted/30 to-transparent blur-2xl" />
        <MandalaCanvas
          state={{ pressure: 0.4 + phase * 0.1, clarity: 0.5, velocity: 0.3 + phase * 0.1, coherence: 0.6 }}
          seed={seed}
          size={200}
          className="relative"
        />
      </motion.div>

      {/* Status message */}
      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mt-12 text-muted-foreground"
      >
        {messages[phase]}
      </motion.p>
    </motion.div>
  )
}

// Complete step
function CompleteStep({ seed, onContinue }: { seed: number; onContinue: () => void }) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center px-4"
    >
      {/* Stabilized mandala */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative"
      >
        <div className="absolute -inset-8 rounded-full bg-gradient-to-b from-muted/20 to-transparent blur-2xl" />
        <MandalaCanvas
          state={{ pressure: 0.35, clarity: 0.65, velocity: 0.3, coherence: 0.75 }}
          seed={seed}
          size={200}
          className="relative"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
        transition={{ duration: 0.8 }}
        className="mt-12 text-center"
      >
        <h1 className="text-2xl font-medium">Baseline established</h1>
        <p className="mt-3 max-w-xs text-muted-foreground">
          Your personal pattern is ready. Check in daily to observe how conditions shift.
        </p>
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12"
      >
        <Button onClick={onContinue} size="lg">
          View today's read
        </Button>
      </motion.div>
    </motion.div>
  )
}
