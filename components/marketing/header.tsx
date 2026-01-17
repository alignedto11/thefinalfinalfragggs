"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Trust", href: "/trust" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact-ethics" },
]

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo - Cymatic Mandala Style */}
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer ring */}
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.5" className="text-foreground" opacity="0.3" />
            {/* Middle ring */}
            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="0.5" className="text-foreground" opacity="0.5" />
            {/* Inner ring */}
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="0.5" className="text-foreground" opacity="0.7" />
            {/* Center dot */}
            <circle cx="12" cy="12" r="1.5" fill="currentColor" className="text-foreground" />
            {/* Radiating lines - cymatic pattern */}
            <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="0.3" className="text-foreground" opacity="0.4" />
            <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="0.3" className="text-foreground" opacity="0.4" />
            <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="0.3" className="text-foreground" opacity="0.3" />
            <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="0.3" className="text-foreground" opacity="0.3" />
          </svg>
          <span className="font-medium tracking-tight">DEFRAG</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/sign-up">Get started</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/sign-up">Get started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
