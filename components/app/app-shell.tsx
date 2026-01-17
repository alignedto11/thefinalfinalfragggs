"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { surface } from "@/lib/copy"
import { Home, MessageCircle, Waves, Users, Settings } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  { href: "/dashboard", label: surface.nav.dashboard, icon: Home },
  { href: "/ask", label: surface.nav.ask, icon: MessageCircle },
  { href: "/spiral", label: surface.nav.spiral, icon: Waves },
  { href: "/constellations", label: surface.nav.constellations, icon: Users },
  { href: "/settings", label: surface.nav.settings, icon: Settings },
]

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-cyan-500/10">
      {/* Main content */}
      <main className="flex-1 pb-24">{children}</main>

      {/* Bottom navigation (mobile-first) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-xl">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />

        <div
          className="mx-auto flex h-16 max-w-lg items-center justify-around px-4"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1.5 px-3 py-1 transition-all duration-300",
                  isActive ? "text-foreground scale-110" : "text-muted-foreground hover:text-foreground/70",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -inset-x-1 -inset-y-1 rounded-xl bg-muted z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="relative z-10 h-5 w-5" strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="relative z-10 text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
