"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { surface } from "@/lib/copy"
import { Home, MessageCircle, Waves, Users, Settings } from "lucide-react"

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
    <div className="flex min-h-screen flex-col bg-background">
      {/* Main content */}
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom navigation (mobile-first) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
        <div
          className="mx-auto flex h-16 max-w-lg items-center justify-around px-2"
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
                  "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
