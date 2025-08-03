import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TestModeDetector } from "@/components/test-mode-detector"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quiz de Relacionamento",
  description: "Descubra seu perfil amoroso",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <TestModeDetector />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
