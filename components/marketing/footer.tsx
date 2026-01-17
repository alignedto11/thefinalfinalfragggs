import Link from "next/link"
import { oldWiseTales } from "@/lib/copy"

export function MarketingFooter() {
  const { footer } = oldWiseTales

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo - Cymatic Mandala Style */}
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          </div>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground">{footer.tagline}</p>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Legal disclaimer */}
          <p className="max-w-md text-xs text-muted-foreground/70">{footer.legal}</p>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/50">© {new Date().getFullYear()} DEFRAG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
