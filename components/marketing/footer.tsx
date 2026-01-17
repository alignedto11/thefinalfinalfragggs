import Link from "next/link"
import { oldWiseTales } from "@/lib/copy"
import { DefragLogo } from "@/components/ui/defrag-logo"

export function MarketingFooter() {
  const { footer } = oldWiseTales

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo - B/W Cymatic Mandala Style */}
          <div className="flex items-center gap-2">
            <DefragLogo size={20} className="text-foreground" />
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
