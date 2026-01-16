import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DEFRAG - Structured Self-Reflection",
  description:
    "Fix the receiver. A calibration instrument for navigating uncertainty with pattern recognition and timing context.",
  generator: "v0.app",
  applicationName: "DEFRAG",
  keywords: ["self-reflection", "pattern recognition", "timing", "mindfulness", "calibration"],
  authors: [{ name: "DEFRAG" }],
  creator: "DEFRAG",
  publisher: "DEFRAG",
  metadataBase: new URL("https://defrag.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://defrag.app",
    siteName: "DEFRAG",
    title: "DEFRAG - Fix the Receiver",
    description: "A calibration instrument for navigating uncertainty. Structured self-reflection, not prediction.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DEFRAG - Structured Self-Reflection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEFRAG - Fix the Receiver",
    description: "A calibration instrument for navigating uncertainty.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DEFRAG",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background text-foreground">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
