"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export function VersionBadge() {
  const [version, setVersion] = useState<string>("")
  const [buildInfo, setBuildInfo] = useState<any>(null)

  useEffect(() => {
    // Versão do app
    const appVersion = "v2.1.0"
    setVersion(appVersion)

    // Informações de build
    const buildData = {
      version: appVersion,
      buildDate: new Date().toLocaleDateString("pt-BR"),
      environment: process.env.NODE_ENV || "development",
      vercelEnv: process.env.VERCEL_ENV || "local",
    }
    setBuildInfo(buildData)
  }, [])

  return (
    <div className="fixed top-4 left-4 z-50 space-y-2">
      <Badge
        variant="outline"
        className="bg-white/90 backdrop-blur-sm text-gray-700 border-gray-300 shadow-lg hover:bg-gray-50 transition-all duration-200"
      >
        🚀 {version}
      </Badge>

      {buildInfo && (
        <div className="hidden md:block">
          <Badge variant="secondary" className="bg-blue-100/90 backdrop-blur-sm text-blue-800 border-blue-200 text-xs">
            {buildInfo.environment === "development" ? "🏠 DEV" : "🌐 PROD"}
          </Badge>
        </div>
      )}
    </div>
  )
}
