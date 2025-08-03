"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Play, RefreshCw, Zap } from "lucide-react"

export default function TestStatus() {
  const [status, setStatus] = useState<any>({
    server: "checking",
    stripe: "checking",
    environment: "checking",
    quiz: "checking",
  })

  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    checkAllSystems()
  }, [])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const checkAllSystems = async () => {
    addLog("🚀 Iniciando verificação de sistemas...")

    // Check Environment
    addLog("🌍 Verificando ambiente...")
    const envStatus = checkEnvironment()
    setStatus((prev) => ({ ...prev, environment: envStatus }))

    // Check Server
    addLog("🖥️ Verificando servidor...")
    const serverStatus = await checkServer()
    setStatus((prev) => ({ ...prev, server: serverStatus }))

    // Check Stripe
    addLog("💳 Verificando Stripe...")
    const stripeStatus = await checkStripe()
    setStatus((prev) => ({ ...prev, stripe: stripeStatus }))

    // Check Quiz Flow
    addLog("🧠 Verificando fluxo do quiz...")
    const quizStatus = checkQuizFlow()
    setStatus((prev) => ({ ...prev, quiz: quizStatus }))

    addLog("✅ Verificação completa!")
  }

  const checkEnvironment = () => {
    try {
      const isLocal = window.location.hostname === "localhost"
      const hasBaseUrl = !!process.env.NEXT_PUBLIC_BASE_URL
      const isDev = process.env.NODE_ENV === "development"

      if (isLocal && isDev) {
        addLog("✅ Ambiente local configurado corretamente")
        return "success"
      } else {
        addLog("⚠️ Ambiente não está em modo de desenvolvimento")
        return "warning"
      }
    } catch (error) {
      addLog(`❌ Erro ao verificar ambiente: ${error.message}`)
      return "error"
    }
  }

  const checkServer = async () => {
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      })

      if (response.ok || response.status === 400) {
        addLog("✅ Servidor respondendo")
        return "success"
      } else {
        addLog(`⚠️ Servidor com problemas: ${response.status}`)
        return "warning"
      }
    } catch (error) {
      addLog(`❌ Servidor não responde: ${error.message}`)
      return "error"
    }
  }

  const checkStripe = async () => {
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizData: { score: 1, level: "Test", percentage: 1 },
        }),
      })

      const data = await response.json()

      if (response.ok && data.checkoutUrl) {
        addLog("✅ Stripe funcionando - URL de checkout gerada")
        return "success"
      } else if (data.error && data.error.includes("Invalid API Key")) {
        addLog("❌ Chave do Stripe inválida")
        return "error"
      } else {
        addLog(`⚠️ Stripe com problemas: ${data.error || "Erro desconhecido"}`)
        return "warning"
      }
    } catch (error) {
      addLog(`❌ Erro ao testar Stripe: ${error.message}`)
      return "error"
    }
  }

  const checkQuizFlow = () => {
    try {
      // Test localStorage
      const testData = { test: true, timestamp: Date.now() }
      localStorage.setItem("test", JSON.stringify(testData))
      const retrieved = JSON.parse(localStorage.getItem("test") || "{}")
      localStorage.removeItem("test")

      if (retrieved.test) {
        addLog("✅ LocalStorage funcionando")
        return "success"
      } else {
        addLog("❌ LocalStorage com problemas")
        return "error"
      }
    } catch (error) {
      addLog(`❌ Erro no fluxo do quiz: ${error.message}`)
      return "error"
    }
  }

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "success":
        return "bg-green-50 border-green-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const startQuiz = () => {
    addLog("🎯 Redirecionando para o quiz...")
    window.location.href = "/"
  }

  const testPayment = () => {
    addLog("💳 Redirecionando para teste de pagamento...")
    // Simular dados do quiz
    localStorage.setItem(
      "quizData",
      JSON.stringify({
        score: 12,
        maxScore: 15,
        percentage: 80,
        level: "Teste de Pagamento",
      }),
    )
    window.location.href = "/resultado"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            🧪 Aplicação em Modo Teste
          </h1>
          <p className="text-lg text-gray-600">Status dos sistemas e componentes</p>
          <Badge variant="secondary" className="mt-2">
            Ambiente: {window.location.hostname === "localhost" ? "Local" : "Produção"}
          </Badge>
        </div>

        {/* System Status */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(status).map(([system, statusValue]) => (
            <Card key={system} className={`border-2 ${getStatusColor(statusValue)}`}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">{getStatusIcon(statusValue)}</div>
                <h3 className="font-semibold capitalize mb-1">{system}</h3>
                <Badge
                  variant={
                    statusValue === "success"
                      ? "default"
                      : statusValue === "warning"
                        ? "secondary"
                        : statusValue === "error"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {statusValue === "checking" ? "Verificando..." : statusValue}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span>🚀 Ações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button onClick={startQuiz} className="h-auto p-6 flex flex-col items-center space-y-2">
                <Play className="w-8 h-8" />
                <span className="text-lg font-semibold">Iniciar Quiz</span>
                <span className="text-sm opacity-80">Testar fluxo completo</span>
              </Button>

              <Button
                onClick={testPayment}
                variant="outline"
                className="h-auto p-6 flex flex-col items-center space-y-2 bg-transparent"
              >
                <CheckCircle className="w-8 h-8" />
                <span className="text-lg font-semibold">Testar Pagamento</span>
                <span className="text-sm opacity-80">Ir direto para resultado</span>
              </Button>

              <Button
                onClick={checkAllSystems}
                variant="outline"
                className="h-auto p-6 flex flex-col items-center space-y-2 bg-transparent"
              >
                <RefreshCw className="w-8 h-8" />
                <span className="text-lg font-semibold">Verificar Novamente</span>
                <span className="text-sm opacity-80">Atualizar status</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📋 Logs do Sistema</span>
              <Button onClick={() => setLogs([])} variant="outline" size="sm" className="text-xs">
                Limpar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">Nenhum log ainda...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>🧪 Modo de teste ativo - Todas as transações são simuladas</p>
          <p className="text-sm mt-1">
            Para sair do modo teste, acesse a versão de produção ou configure NODE_ENV=production
          </p>
        </div>
      </div>
    </div>
  )
}
