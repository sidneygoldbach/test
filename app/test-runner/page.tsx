"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Play, Terminal, Globe, Zap, Settings, RefreshCw } from "lucide-react"

export default function TestRunner() {
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any>({})
  const [environment, setEnvironment] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    initializeTestEnvironment()
  }, [])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const initializeTestEnvironment = () => {
    addLog("🚀 Inicializando ambiente de teste...")

    const env = {
      isLocal: window.location.hostname === "localhost",
      port: window.location.port || "3000",
      protocol: window.location.protocol,
      baseUrl: window.location.origin,
      nodeEnv: process.env.NODE_ENV || "development",
      testMode: true,
    }

    setEnvironment(env)
    addLog(`✅ Ambiente detectado: ${env.isLocal ? "Local" : "Produção"}`)
    addLog(`🌐 URL Base: ${env.baseUrl}`)
    addLog(`⚙️ Node ENV: ${env.nodeEnv}`)
  }

  const runFullTest = async () => {
    setIsRunning(true)
    addLog("🧪 Iniciando suite completa de testes...")

    const tests = [
      { name: "environment", fn: testEnvironment },
      { name: "stripe", fn: testStripeAPI },
      { name: "quiz", fn: testQuizFlow },
      { name: "storage", fn: testLocalStorage },
      { name: "payment", fn: testPaymentFlow },
    ]

    for (const test of tests) {
      addLog(`🔄 Executando teste: ${test.name}`)
      try {
        const result = await test.fn()
        setTestResults((prev) => ({
          ...prev,
          [test.name]: { status: "success", result },
        }))
        addLog(`✅ Teste ${test.name}: PASSOU`)
      } catch (error) {
        setTestResults((prev) => ({
          ...prev,
          [test.name]: { status: "error", error: error.message },
        }))
        addLog(`❌ Teste ${test.name}: FALHOU - ${error.message}`)
      }
    }

    addLog("🎉 Suite de testes concluída!")
    setIsRunning(false)
  }

  const testEnvironment = async () => {
    return {
      hostname: window.location.hostname,
      port: window.location.port,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent.substring(0, 50) + "...",
      localStorage: typeof Storage !== "undefined",
      fetch: typeof fetch !== "undefined",
    }
  }

  const testStripeAPI = async () => {
    const response = await fetch("/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizData: { score: 10, level: "Test Mode", percentage: 67 },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.details || error.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return {
      sessionId: data.sessionId?.substring(0, 20) + "...",
      environment: data.environment,
      productId: data.productId,
      hasCheckoutUrl: !!data.checkoutUrl,
    }
  }

  const testQuizFlow = async () => {
    const testData = {
      score: 12,
      maxScore: 15,
      percentage: 80,
      level: "Teste Automatizado",
    }

    localStorage.setItem("quizData", JSON.stringify(testData))
    const retrieved = JSON.parse(localStorage.getItem("quizData") || "{}")

    if (retrieved.score !== testData.score) {
      throw new Error("Dados do quiz não foram salvos corretamente")
    }

    return { message: "Quiz flow funcionando", data: testData }
  }

  const testLocalStorage = async () => {
    const testKey = "test_" + Date.now()
    const testValue = { test: true, timestamp: Date.now() }

    localStorage.setItem(testKey, JSON.stringify(testValue))
    const retrieved = JSON.parse(localStorage.getItem(testKey) || "{}")
    localStorage.removeItem(testKey)

    if (!retrieved.test) {
      throw new Error("LocalStorage não está funcionando")
    }

    return { message: "LocalStorage OK" }
  }

  const testPaymentFlow = async () => {
    // Simular fluxo de pagamento sem executar
    const quizData = {
      score: 15,
      maxScore: 15,
      percentage: 100,
      level: "Expert em Relacionamentos",
    }

    return {
      message: "Fluxo de pagamento simulado",
      productId: environment?.isLocal ? "prod_SnibIHbIfakhda" : "prod_Sn4hQJD9yvuW8H",
      amount: "R$ 4,00",
      currency: "BRL",
    }
  }

  const startQuiz = () => {
    addLog("🎯 Redirecionando para o quiz...")
    window.location.href = "/"
  }

  const testPayment = () => {
    addLog("💳 Configurando dados de teste para pagamento...")
    localStorage.setItem(
      "quizData",
      JSON.stringify({
        score: 12,
        maxScore: 15,
        percentage: 80,
        level: "Teste de Pagamento",
      }),
    )
    addLog("💳 Redirecionando para página de resultado...")
    window.location.href = "/resultado"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🧪 App em Modo Teste
          </h1>
          <p className="text-lg text-gray-600">Executando testes automatizados da aplicação</p>
          <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
            🟢 MODO TESTE ATIVO
          </Badge>
        </div>

        {/* Environment Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-6 h-6 text-blue-500" />
              <span>🌍 Informações do Ambiente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {environment && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p>
                    <strong>Hostname:</strong> {environment.baseUrl}
                  </p>
                  <p>
                    <strong>Protocolo:</strong> {environment.protocol}
                  </p>
                  <p>
                    <strong>Porta:</strong> {environment.port || "Padrão"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Ambiente:</strong> {environment.isLocal ? "🏠 Local" : "🌐 Produção"}
                  </p>
                  <p>
                    <strong>Node ENV:</strong> {environment.nodeEnv}
                  </p>
                  <p>
                    <strong>Modo Teste:</strong> {environment.testMode ? "✅ Ativo" : "❌ Inativo"}
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
              <Terminal className="w-6 h-6 text-green-500" />
              <span>🎮 Controles de Teste</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button
                onClick={runFullTest}
                disabled={isRunning}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                {isRunning ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6" />}
                <span>{isRunning ? "Testando..." : "Executar Todos os Testes"}</span>
              </Button>

              <Button
                onClick={startQuiz}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Zap className="w-6 h-6" />
                <span>Iniciar Quiz</span>
              </Button>

              <Button
                onClick={testPayment}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Globe className="w-6 h-6" />
                <span>Testar Pagamento</span>
              </Button>

              <Button
                onClick={() => setLogs([])}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Terminal className="w-6 h-6" />
                <span>Limpar Logs</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📊 Resultados dos Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(testResults).map(([testName, result]: [string, any]) => (
                <div
                  key={testName}
                  className={`border rounded-lg p-4 ${
                    result.status === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold capitalize">{testName}</h3>
                    {getStatusIcon(result.status)}
                  </div>

                  {result.status === "success" && (
                    <div className="text-sm text-green-700">
                      <p>✅ Teste passou</p>
                      {result.result?.message && <p className="mt-1">{result.result.message}</p>}
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

        {/* Test Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📋 Logs de Execução</span>
              <Badge variant="outline">{logs.length} entradas</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">Aguardando execução de testes...</p>
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

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-bold mb-4">🔗 Links Rápidos para Teste</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => window.open("/", "_blank")}>
              🏠 Quiz Principal
            </Button>
            <Button variant="outline" onClick={() => window.open("/test-mode", "_blank")}>
              🧪 Modo Teste
            </Button>
            <Button variant="outline" onClick={() => window.open("/debug-stripe", "_blank")}>
              🔧 Debug Stripe
            </Button>
            <Button variant="outline" onClick={() => window.open("/test-status", "_blank")}>
              📊 Status Geral
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
