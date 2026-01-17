"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Mandala } from "@/components/mandala/mandala"
import { demoState } from "@/lib/state"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEnvReady, setIsEnvReady] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Quick check to see if env vars are loaded on the client
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      console.error("Supabase environment variables missing on client:", { url: !!url, key: !!key })
      setIsEnvReady(false)
      setError("System configuration error. Please contact support.")
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEnvReady) return

    setIsLoading(true)
    setError(null)

    try {
      // 1. Initialize client (will throw if env vars missing)
      const supabase = createClient()

      // 2. Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Normalize error messages
        if (error.message === "Invalid login credentials") {
          throw new Error("Invalid email or password")
        }
        throw error
      }

      if (data?.session) {
        // Successful login
        router.push("/dashboard")
        router.refresh() // Ensure server components re-run
      } else {
        throw new Error("No session created. Please check your email for confirmation or try again.")
      }

    } catch (error: unknown) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 overflow-hidden bg-black/95">
      {/* Background mandala */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
        <div className="h-[800px] w-[800px] animate-pulse-slow">
          <Mandala state={demoState} size="full" seed={0.42} />
        </div>
      </div>

      <div className="relative w-full max-w-sm z-10 backdrop-blur-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
            <div className="h-8 w-8 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all duration-500" />
            <span className="text-lg font-medium tracking-tight text-white">DEFRAG</span>
          </Link>
        </div>

        <Card className="border-white/10 bg-black/50 shadow-2xl backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl text-white font-light tracking-wide">Welcome back</CardTitle>
            <CardDescription className="text-white/60">Sign in to continue your reflection</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white/80">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-white/80">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/50"
                  />
                </div>

                {error && <p className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-200 text-center animate-in fade-in slide-in-from-top-1">{error}</p>}

                <Button
                  type="submit"
                  className="h-11 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium tracking-wide shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all duration-300"
                  disabled={isLoading || !isEnvReady}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>

              <div className="mt-6 text-center text-sm text-white/40">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-[10px] text-white/20 uppercase tracking-widest">
          Structured Self-Reflection
        </p>
      </div>
    </div>
  )
}
