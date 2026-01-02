import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nova Studio - AI-Powered Film Production',
  description: 'Transform your creative vision into reality with AI-powered film production tools. Script to screen, faster than ever.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
