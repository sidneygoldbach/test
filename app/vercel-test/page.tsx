"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Globe, Zap, Settings, RefreshCw, ExternalLink } from "lucide-react"

export default function VercelTest() {
  const [environment, setEnvironment] = useState<any>(null)
  const [testResults, setTestResults] = useState<any>({})
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    detectEnvironment()
  }, [])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const detectEnvironment = () => {
    const env = {
      isVercel: window.location.hostname.includes("vercel.app") || window.location.hostname.includes("vercel.com"),
      isLocal: window.location.hostname === "localhost",
      hostname: window.location.hostname,
      origin: window.location.origin,
      vercelEnv: process.env.VERCEL_ENV || "unknown",
      nodeEnv: process.env.NODE_ENV || "unknown",
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || window.location.origin,
    }

    setEnvironment(env)
    addLog(`🌍 Ambiente detectado: ${env.isVercel ? "Vercel" : env.isLocal ? "Local" : "Outro"}`)
    addLog(`🔗 URL: ${env.origin}`)
  }

  const runVercelTests = async () => {
    setIsRunning(true)
    addLog("🚀 Iniciando testes no servidor Vercel...")

    const tests = [
      { name: "vercel-api", fn: testVercelAPI },
      { name: "stripe-prod", fn: testStripeProd },
      { name: "environment", fn: testEnvironmentVars },
      { name: "quiz-flow", fn: testQuizFlow },
    ]

    for (const test of tests) {
      addLog(`🔄 Testando: ${test.name}`)
      try {
        const result = await test.fn()
        setTestResults((prev) => ({
          ...prev,
          [test.name]: { status: "success", result },
        }))
        addLog(`✅ ${test.name}: PASSOU`)
      } catch (error) {
        setTestResults((prev) => ({
          ...prev,
          [test.name]: { status: "error", error: error.message },
        }))
        addLog(`❌ ${test.name}: FALHOU - ${error.message}`)
      }
    }

    addLog("🎉 Testes no Vercel concluídos!")
    setIsRunning(false)
  }

  const testVercelAPI = async () => {
    const response = await fetch("/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizData: { score: 10, level: "Vercel Test", percentage: 67 },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.details || error.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return {
      environment: data.environment,
      productId: data.productId,
      hasCheckoutUrl: !!data.checkoutUrl,
      sessionCreated: !!data.sessionId,
    }
  }

  const testStripeProd = async () => {
    // Test with production-like data
    const response = await fetch("/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizData: {
          score: 15,
          level: "Expert em Relacionamentos",
          percentage: 100,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Stripe API failed")
    }

    return {
      productId: data.productId,
      environment: data.environment,
      stripeWorking: !!data.checkoutUrl,
    }
  }

  const testEnvironmentVars = async () => {
    return {
      hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      vercelEnv: process.env.VERCEL_ENV,
      nodeEnv: process.env.NODE_ENV,
      isVercelDeployment: environment?.isVercel,
    }
  }

  const testQuizFlow = async () => {
    const testData = {
      score: 12,
      maxScore: 15,
      percentage: 80,
      level: "Vercel Test Mode",
    }

    localStorage.setItem("vercelTestData", JSON.stringify(testData))
    const retrieved = JSON.parse(localStorage.getItem("vercelTestData") || "{}")
    localStorage.removeItem("vercelTestData")

    if (retrieved.score !== testData.score) {
      throw new Error("LocalStorage não funcionou")
    }

    return { message: "Quiz flow OK no Vercel" }
  }

  const startQuizOnVercel = () => {
    addLog("🎯 Iniciando quiz no servidor Vercel...")
    window.location.href = "/?test=true"
  }

  const testPaymentOnVercel = () => {
    addLog("💳 Configurando teste de pagamento no Vercel...")
    localStorage.setItem(
      "quizData",
      JSON.stringify({
        score: 12,
        maxScore: 15,
        percentage: 80,
        level: "Teste Vercel",
      }),
    )
    window.location.href = "/resultado?test=true"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🌐 Teste no Servidor Vercel
          </h1>
          <p className="text-lg text-gray-600">Executando testes na aplicação deployada</p>
          <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-800">
            {environment?.isVercel ? "🚀 VERCEL" : environment?.isLocal ? "🏠 LOCAL" : "🌍 OUTRO"}
          </Badge>
        </div>

        {/* Environment Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-6 h-6 text-purple-500" />
              <span>🌍 Informações do Servidor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {environment && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p>
                    <strong>Hostname:</strong> {environment.hostname}
                  </p>
                  <p>
                    <strong>Origin:</strong> {environment.origin}
                  </p>
                  <p>
                    <strong>Base URL:</strong> {environment.baseUrl}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>É Vercel:</strong> {environment.isVercel ? "✅ Sim" : "❌ Não"}
                  </p>
                  <p>
                    <strong>Vercel ENV:</strong> {environment.vercelEnv}
                  </p>
                  <p>
                    <strong>Node ENV:</strong> {environment.nodeEnv}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-green-500" />
              <span>🎮 Controles de Teste Vercel</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button
                onClick={runVercelTests}
                disabled={isRunning}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                {isRunning ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Globe className="w-6 h-6" />}
                <span>{isRunning ? "Testando..." : "Testar Vercel"}</span>
              </Button>

              <Button
                onClick={startQuizOnVercel}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <ExternalLink className="w-6 h-6" />
                <span>Quiz no Vercel</span>
              </Button>

              <Button
                onClick={testPaymentOnVercel}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Zap className="w-6 h-6" />
                <span>Pagamento Vercel</span>
              </Button>

              <Button
                onClick={() => setLogs([])}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Settings className="w-6 h-6" />
                <span>Limpar Logs</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📊 Resultados dos Testes Vercel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(testResults).map(([testName, result]: [string, any]) => (
                <div
                  key={testName}
                  className={`border rounded-lg p-4 ${
                    result.status === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{testName.replace("-", " ").toUpperCase()}</h3>
                    {getStatusIcon(result.status)}
                  </div>

                  {result.status === "success" && (
                    <div className="text-sm text-green-700">
                      <p>✅ Teste passou no Vercel</p>
                      {result.result?.environment && <p>🌍 Ambiente: {result.result.environment}</p>}
                      {result.result?.productId && <p>💳 Product ID: {result.result.productId}</p>}
                    </div>
                  )}

                  {result.status === "error" && (
                    <div className="text-sm text-red-700">
                      <p>❌ {result.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📋 Logs do Servidor Vercel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">Aguardando testes no Vercel...</p>
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

        {/* URLs for Testing */}
        <Card>
          <CardHeader>
            <CardTitle>🔗 URLs para Teste no Vercel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold mb-2">🎯 URLs Principais:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a href="/?test=true" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                        🏠 Quiz com Modo Teste
                      </a>
                    </li>
                    <li>
                      <a
                        href="/resultado?test=true"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        💳 Resultado com Teste
                      </a>
                    </li>
                    <li>
                      <a href="/vercel-test" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                        🧪 Esta Página de Teste
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-2">🔧 URLs de Debug:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a
                        href="/debug-stripe"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        🔧 Debug Stripe
                      </a>
                    </li>
                    <li>
                      <a href="/test-status" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                        📊 Status Geral
                      </a>
                    </li>
                    <li>
                      <a href="/test-mode" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                        🌍 Modo Teste Interativo
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
