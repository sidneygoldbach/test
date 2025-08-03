"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"

export function TestModeDetector() {
  const [isTestMode, setIsTestMode] = useState(false)
  const [environment, setEnvironment] = useState<string>("")
  const searchParams = useSearchParams()

  useEffect(() => {
    // Detectar modo teste via URL params
    const testParam = searchParams.get("test")
    const debugParam = searchParams.get("debug")

    // Detectar ambiente
    const isVercel = window.location.hostname.includes("vercel.app")
    const isLocal = window.location.hostname === "localhost"

    setIsTestMode(!!(testParam || debugParam))
    setEnvironment(isVercel ? "vercel" : isLocal ? "local" : "other")
  }, [searchParams])

  if (!isTestMode) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
        🧪 MODO TESTE ATIVO
      </Badge>
      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
        {environment === "vercel" ? "🚀 VERCEL" : environment === "local" ? "🏠 LOCAL" : "🌍 OUTRO"}
      </Badge>
    </div>
  )
}
