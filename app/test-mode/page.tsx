"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Play, Settings, Globe, Laptop } from "lucide-react"

export default function TestMode() {
  const [environment, setEnvironment] = useState<any>(null)
  const [testResults, setTestResults] = useState<any>({})

  useEffect(() => {
    checkEnvironment()
  }, [])

  const checkEnvironment = () => {
    const env = {
      isLocal: window.location.hostname === "localhost",
      isDevelopment: process.env.NODE_ENV === "development",
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || window.location.origin,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      currentUrl: window.location.href,
    }
    setEnvironment(env)
  }

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setTestResults((prev) => ({ ...prev, [testName]: { status: "running" } }))

    try {
      const result = await testFn()
      setTestResults((prev) => ({
        ...prev,
        [testName]: { status: "success", result },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [testName]: { status: "error", error: error.message },
      }))
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
      throw new Error(error.details || error.error)
    }

    return await response.json()
  }

  const testQuizFlow = async () => {
    // Simular dados do quiz
    const quizData = {
      score: 12,
      maxScore: 15,
      percentage: 80,
      level: "Bom Conhecimento",
    }

    localStorage.setItem("quizData", JSON.stringify(quizData))
    return { message: "Quiz data saved to localStorage", data: quizData }
  }

  const testLocalStorage = async () => {
    const testData = { test: "data", timestamp: Date.now() }
    localStorage.setItem("test", JSON.stringify(testData))
    const retrieved = JSON.parse(localStorage.getItem("test") || "{}")
    localStorage.removeItem("test")

    if (retrieved.test === "data") {
      return { message: "LocalStorage working correctly" }
    } else {
      throw new Error("LocalStorage test failed")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "running":
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
            🧪 Modo de Teste
          </h1>
          <p className="text-lg text-gray-600">Ambiente de desenvolvimento e testes</p>
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Ambiente Local:</span>
                    <Badge variant={environment.isLocal ? "default" : "secondary"}>
                      {environment.isLocal ? (
                        <>
                          <Laptop className="w-4 h-4 mr-1" />
                          Local
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4 mr-1" />
                          Produção
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Modo Desenvolvimento:</span>
                    <Badge variant={environment.isDevelopment ? "default" : "secondary"}>
                      {environment.isDevelopment ? "✅ Sim" : "❌ Não"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">URL Base:</span>
                    <p className="text-sm text-gray-600 break-all">{environment.baseUrl}</p>
                  </div>
                  <div>
                    <span className="font-medium">URL Atual:</span>
                    <p className="text-sm text-gray-600 break-all">{environment.currentUrl}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Suite */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-6 h-6 text-green-500" />
              <span>🧪 Suite de Testes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Test Buttons */}
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  onClick={() => runTest("stripe", testStripeAPI)}
                  disabled={testResults.stripe?.status === "running"}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  {getStatusIcon(testResults.stripe?.status)}
                  <span>Testar Stripe API</span>
                </Button>

                <Button
                  onClick={() => runTest("quiz", testQuizFlow)}
                  disabled={testResults.quiz?.status === "running"}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  {getStatusIcon(testResults.quiz?.status)}
                  <span>Testar Fluxo do Quiz</span>
                </Button>

                <Button
                  onClick={() => runTest("storage", testLocalStorage)}
                  disabled={testResults.storage?.status === "running"}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  {getStatusIcon(testResults.storage?.status)}
                  <span>Testar LocalStorage</span>
                </Button>
              </div>

              {/* Test Results */}
              <div className="space-y-4">
                {Object.entries(testResults).map(([testName, result]: [string, any]) => (
                  <div
                    key={testName}
                    className={`border rounded-lg p-4 ${
                      result.status === "success"
                        ? "bg-green-50 border-green-200"
                        : result.status === "error"
                          ? "bg-red-50 border-red-200"
                          : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold capitalize">{testName} Test</h3>
                      <Badge
                        variant={
                          result.status === "success"
                            ? "default"
                            : result.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {result.status}
                      </Badge>
                    </div>

                    {result.status === "success" && result.result && (
                      <div className="text-sm text-green-700">
                        <p>✅ Teste passou com sucesso!</p>
                        {result.result.checkoutUrl && (
                          <p className="mt-1">
                            <strong>Checkout URL gerada:</strong> {result.result.checkoutUrl.substring(0, 50)}...
                          </p>
                        )}
                        {result.result.message && <p className="mt-1">{result.result.message}</p>}
                      </div>
                    )}

                    {result.status === "error" && (
                      <div className="text-sm text-red-700">
                        <p>❌ Erro: {result.error}</p>
                      </div>
                    )}

                    {result.status === "running" && (
                      <div className="text-sm text-blue-700">
                        <p>🔄 Executando teste...</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Play className="w-6 h-6" />
                <span>Iniciar Quiz</span>
              </Button>

              <Button
                onClick={() => {
                  localStorage.setItem(
                    "quizData",
                    JSON.stringify({
                      score: 12,
                      maxScore: 15,
                      percentage: 80,
                      level: "Bom Conhecimento",
                    }),
                  )
                  window.location.href = "/resultado"
                }}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Settings className="w-6 h-6" />
                <span>Ir para Resultado</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
