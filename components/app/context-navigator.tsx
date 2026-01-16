"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, X, ChevronRight, Lightbulb } from "lucide-react"
import { surface } from "@/lib/copy"
import type { MandalaState } from "@/lib/state"

type ExplainTarget = "mandala" | "stateCard" | "windows" | "general"
type ExplainMode = "whatYouSee" | "howToUse" | "whatNotToDo" | "whenToCheck"

interface ContextNavigatorProps {
  state?: MandalaState
  currentPage?: string
}

export function ContextNavigator({ state, currentPage = "dashboard" }: ContextNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTarget, setActiveTarget] = useState<ExplainTarget | null>(null)
  const [activeMode, setActiveMode] = useState<ExplainMode>("whatYouSee")

  const getExplanation = useCallback(
    (target: ExplainTarget, mode: ExplainMode): string => {
      const { explainMode } = surface

      // Target-specific explanations
      if (target === "mandala") {
        if (mode === "whatYouSee") return explainMode.whatYouSee.mandala
        if (mode === "howToUse") return explainMode.howToUse.mandala
      }

      if (target === "stateCard") {
        if (mode === "whatYouSee") return explainMode.whatYouSee.stateCard
        if (mode === "howToUse") return explainMode.howToUse.stateCard
      }

      if (target === "windows") {
        if (mode === "whatYouSee") return explainMode.whatYouSee.windows
        if (mode === "howToUse") return explainMode.howToUse.windows
      }

      // State-dependent "what not to do" advice
      if (mode === "whatNotToDo" && state) {
        if (state.pressure > 0.65) return explainMode.whatNotToDo.highPressure
        if (state.clarity < 0.35) return explainMode.whatNotToDo.lowClarity
        if (state.coherence < 0.35) return explainMode.whatNotToDo.fragmented
        return "Current conditions don't suggest any particular caution. Trust your judgment."
      }

      if (mode === "whenToCheck") {
        return explainMode.whenToCheck.content
      }

      return "Select a specific element to learn more about what you're seeing."
    },
    [state],
  )

  const getModeTitle = (mode: ExplainMode): string => {
    const { explainMode } = surface
    switch (mode) {
      case "whatYouSee":
        return explainMode.whatYouSee.title
      case "howToUse":
        return explainMode.howToUse.title
      case "whatNotToDo":
        return explainMode.whatNotToDo.title
      case "whenToCheck":
        return explainMode.whenToCheck.title
      default:
        return "Explain"
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-colors hover:bg-muted md:bottom-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open context help"
      >
        <HelpCircle className="h-5 w-5 text-muted-foreground" />
      </motion.button>

      {/* Overlay panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-4 bottom-4 z-50 md:inset-x-auto md:bottom-8 md:right-8 md:w-96"
            >
              <Card className="border-border shadow-xl">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Context</span>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Target selection */}
                  <div className="border-b border-border p-4">
                    <p className="mb-3 text-xs text-muted-foreground">What do you want to understand?</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "mandala" as const, label: "Mandala" },
                        { id: "stateCard" as const, label: "State readings" },
                        { id: "windows" as const, label: "Timing windows" },
                        { id: "general" as const, label: "General" },
                      ].map((target) => (
                        <button
                          key={target.id}
                          onClick={() => setActiveTarget(target.id)}
                          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                            activeTarget === target.id
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-transparent hover:bg-muted"
                          }`}
                        >
                          {target.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode tabs */}
                  {activeTarget && (
                    <div className="border-b border-border p-4">
                      <div className="flex gap-1 overflow-x-auto">
                        {(["whatYouSee", "howToUse", "whatNotToDo", "whenToCheck"] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setActiveMode(mode)}
                            className={`whitespace-nowrap rounded px-3 py-1.5 text-xs transition-colors ${
                              activeMode === mode ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted/50"
                            }`}
                          >
                            {getModeTitle(mode)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explanation content */}
                  <div className="p-4">
                    {activeTarget ? (
                      <motion.div
                        key={`${activeTarget}-${activeMode}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {getExplanation(activeTarget, activeMode)}
                        </p>
                      </motion.div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Select an element above to learn what it means and how to use it.
                      </p>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="border-t border-border p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 bg-transparent"
                        onClick={() => {
                          setIsOpen(false)
                          // Navigate to trust page
                          window.location.href = "/trust"
                        }}
                      >
                        Learn more
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
