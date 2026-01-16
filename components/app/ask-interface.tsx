"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import type { MandalaState } from "@/lib/state"

interface AskInterfaceProps {
  state?: MandalaState
}

const suggestedQuestions = [
  "What's creating pressure today?",
  "Is this a good moment to engage?",
  "What's repeating lately?",
  "Where should I focus?",
]

export function AskInterface({ state }: AskInterfaceProps) {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [supportMode, setSupportMode] = useState(false)
  const [resources, setResources] = useState<any>(null)

  const handleAsk = async (q?: string) => {
    const questionToAsk = q || question
    if (!questionToAsk.trim()) return

    setIsLoading(true)
    setResponse(null)
    setSupportMode(false)
    setResources(null)

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionToAsk, state }),
      })

      if (!res.ok) throw new Error("Failed to get response")

      const data = await res.json()
      setResponse(data.answer)
      if (data.supportMode) {
        setSupportMode(true)
        setResources(data.resources)
      }
      setQuestion("")
    } catch (error) {
      console.error("Ask error:", error)
      setResponse("Unable to process your question right now. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Suggested</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleAsk(q)}
              disabled={isLoading}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-muted disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Textarea
          placeholder="Ask a grounded question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className="resize-none pr-12"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleAsk()
            }
          }}
        />
        <Button
          size="icon"
          className="absolute bottom-2 right-2 h-8 w-8"
          onClick={() => handleAsk()}
          disabled={!question.trim() || isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {response && (
        <Card className={`border-border/50 ${supportMode ? "border-muted-foreground/30 bg-muted/20" : ""}`}>
          <CardContent className="p-4">
            {supportMode && (
              <div className="mb-3 flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">Support resources available</p>
              </div>
            )}
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{response}</p>

            {supportMode && resources && (
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <p className="text-xs font-medium">Resources:</p>
                <div className="flex flex-col gap-2">
                  {resources.US && (
                    <a
                      href={`tel:${resources.US.phone}`}
                      className="flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <span>{resources.US.name}</span>
                      <span className="text-muted-foreground">· {resources.US.phone}</span>
                    </a>
                  )}
                  {resources.global && (
                    <a
                      href={resources.global.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <span>{resources.global.name}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Not predictive. Not diagnostic. Structured reflection only.
      </p>
    </div>
  )
}
