"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"

export default function TestStripe() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [autoTested, setAutoTested] = useState(false)

  // Auto-test on page load
  useEffect(() => {
    if (!autoTested) {
      testStripeConfiguration()
      setAutoTested(true)
    }
  }, [autoTested])

  const testStripeConfiguration = async () => {
    setLoading(true)
    console.log("🧪 Testando configuração do Stripe...")

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizData: {
            score: 12,
            level: "Teste de Configuração",
            percentage: 80,
          },
        }),
      })

      const data = await response.json()

      console.log("🧪 Resultado do teste:", {
        status: response.status,
        ok: response.ok,
        data: data,
      })

      setTestResult({
        status: response.status,
        ok: response.ok,
        data: data,
        timestamp: new Date().toLocaleString(),
      })
    } catch (error) {
      console.error("🧪 Erro no teste:", error)
      setTestResult({
        status: "network_error",
        ok: false,
        data: { error: error.message },
        timestamp: new Date().toLocaleString(),
      })
    }
    setLoading(false)
  }

  const getStatusIcon = () => {
    if (loading) return <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
    if (!testResult) return <AlertTriangle className="w-6 h-6 text-yellow-500" />
    if (testResult.ok) return <CheckCircle className="w-6 h-6 text-green-500" />
    return <XCircle className="w-6 h-6 text-red-500" />
  }

  const getStatusColor = () => {
    if (loading) return "bg-blue-50 border-blue-200"
    if (!testResult) return "bg-yellow-50 border-yellow-200"
    if (testResult.ok) return "bg-green-50 border-green-200"
    return "bg-red-50 border-red-200"
  }

  const getStatusText = () => {
    if (loading) return "Testando..."
    if (!testResult) return "Aguardando teste"
    if (testResult.ok) return "✅ Chave do Stripe CORRIGIDA!"
    return "❌ Chave do Stripe com PROBLEMA"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🔧 Teste de Configuração Stripe
          </h1>
          <p className="text-lg text-gray-600">Verificando se a chave do Stripe foi corrigida</p>
        </div>

        {/* Status Card */}
        <Card className={`mb-8 border-2 ${getStatusColor()}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Button onClick={testStripeConfiguration} disabled={loading} variant="outline">
                {loading ? "Testando..." : "🔄 Testar Novamente"}
              </Button>
              {testResult && <Badge variant="secondary">Testado em: {testResult.timestamp}</Badge>}
            </div>

            {testResult && (
              <div className="space-y-4">
                {/* Status Summary */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-bold mb-2">📊 Status HTTP</h3>
                    <p className={`text-2xl font-bold ${testResult.ok ? "text-green-600" : "text-red-600"}`}>
                      {testResult.status}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-bold mb-2">🎯 Resultado</h3>
                    <p className={`text-lg font-semibold ${testResult.ok ? "text-green-600" : "text-red-600"}`}>
                      {testResult.ok ? "SUCESSO" : "ERRO"}
                    </p>
                  </div>
                </div>

                {/* Success Details */}
                {testResult.ok && testResult.data.checkoutUrl && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-green-800 mb-2">🎉 Configuração Correta!</h3>
                    <ul className="space-y-1 text-green-700">
                      <li>✅ Chave do Stripe válida</li>
                      <li>✅ API funcionando</li>
                      <li>✅ Sessão de pagamento criada</li>
                      <li>✅ URL do checkout gerada</li>
                    </ul>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-green-800">URL do Checkout:</p>
                      <p className="text-xs text-green-600 break-all bg-green-100 p-2 rounded mt-1">
                        {testResult.data.checkoutUrl}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Details */}
                {!testResult.ok && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-bold text-red-800 mb-2">❌ Problema Detectado</h3>

                    {testResult.data.error && (
                      <div className="mb-3">
                        <p className="font-medium text-red-700">Erro Principal:</p>
                        <p className="text-red-600">{testResult.data.error}</p>
                      </div>
                    )}

                    {testResult.data.details && (
                      <div className="mb-3">
                        <p className="font-medium text-red-700">Detalhes:</p>
                        <p className="text-red-600">{testResult.data.details}</p>
                      </div>
                    )}

                    {/* Key Info */}
                    {(testResult.data.keyInfo || testResult.data.stripeKeyInfo) && (
                      <div className="mt-3">
                        <p className="font-medium text-red-700 mb-2">Informações da Chave:</p>
                        <div className="bg-red-100 p-3 rounded">
                          {testResult.data.keyInfo && (
                            <ul className="space-y-1 text-sm">
                              <li>Definida: {testResult.data.keyInfo.defined ? "✅" : "❌"}</li>
                              <li>Comprimento: {testResult.data.keyInfo.length} caracteres</li>
                              <li>Formato correto: {testResult.data.keyInfo.startsCorrectly ? "✅" : "❌"}</li>
                              <li>
                                Contém "here":{" "}
                                {testResult.data.keyInfo.endsWithExample ? "❌ SIM (PROBLEMA!)" : "✅ Não"}
                              </li>
                            </ul>
                          )}
                          {testResult.data.stripeKeyInfo && (
                            <ul className="space-y-1 text-sm">
                              <li>Definida: {testResult.data.stripeKeyInfo.defined ? "✅" : "❌"}</li>
                              <li>Comprimento: {testResult.data.stripeKeyInfo.length} caracteres</li>
                              <li>Formato correto: {testResult.data.stripeKeyInfo.startsCorrectly ? "✅" : "❌"}</li>
                            </ul>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Solutions */}
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="font-medium text-yellow-800 mb-2">🔧 Como corrigir:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                        <li>Vá para o Dashboard do Stripe</li>
                        <li>Copie a chave Secret Key completa</li>
                        <li>Configure no Vercel (Environment Variables)</li>
                        <li>Faça redeploy do projeto</li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* Raw Response */}
                <details className="bg-gray-50 border border-gray-200 rounded-lg">
                  <summary className="p-3 cursor-pointer font-medium text-gray-700">
                    🔍 Ver resposta completa da API
                  </summary>
                  <div className="p-3 border-t border-gray-200">
                    <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            {testResult?.ok ? (
              <div className="text-green-700">
                <p className="font-semibold mb-2">🎉 Tudo funcionando!</p>
                <p>Sua chave do Stripe está configurada corretamente. Você pode:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Voltar para o quiz e testar o pagamento</li>
                  <li>O botão "Pagar" agora deve redirecionar para o Stripe</li>
                </ul>
              </div>
            ) : (
              <div className="text-red-700">
                <p className="font-semibold mb-2">🔧 Ação necessária:</p>
                <p>Sua chave do Stripe precisa ser corrigida. Siga estes passos:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Acesse: https://dashboard.stripe.com/</li>
                  <li>Vá em Developers → API Keys</li>
                  <li>Copie a Secret Key (começa com sk_test_ ou sk_live_)</li>
                  <li>Configure no Vercel em Environment Variables</li>
                  <li>Faça redeploy e teste novamente</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
