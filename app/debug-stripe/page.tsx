"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugStripe() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testStripeKey = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizData: {
            score: 10,
            level: "Test",
            percentage: 67,
          },
        }),
      })

      const data = await response.json()
      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
      })
    } catch (error) {
      setResult({
        status: "error",
        ok: false,
        data: { error: error.message },
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Debug Stripe Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testStripeKey} disabled={loading} className="w-full">
              {loading ? "Testando..." : "🧪 Testar Chave do Stripe"}
            </Button>

            {result && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Resultado do Teste:</h3>
                <div
                  className={`p-4 rounded-lg ${result.ok ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  <p>
                    <strong>Status:</strong> {result.status}
                  </p>
                  <p>
                    <strong>Success:</strong> {result.ok ? "✅ Sim" : "❌ Não"}
                  </p>

                  {result.data.error && (
                    <div className="mt-2">
                      <p>
                        <strong>Erro:</strong> {result.data.error}
                      </p>
                      {result.data.details && (
                        <p>
                          <strong>Detalhes:</strong> {result.data.details}
                        </p>
                      )}
                    </div>
                  )}

                  {result.data.keyInfo && (
                    <div className="mt-2">
                      <p>
                        <strong>Info da Chave:</strong>
                      </p>
                      <ul className="ml-4">
                        <li>Definida: {result.data.keyInfo.defined ? "✅" : "❌"}</li>
                        <li>Comprimento: {result.data.keyInfo.length} caracteres</li>
                        <li>Começa com sk_: {result.data.keyInfo.startsCorrectly ? "✅" : "❌"}</li>
                        <li>Contém "here": {result.data.keyInfo.endsWithExample ? "❌ Sim (problema!)" : "✅ Não"}</li>
                      </ul>
                    </div>
                  )}

                  {result.data.stripeKeyInfo && (
                    <div className="mt-2">
                      <p>
                        <strong>Info da Chave Stripe:</strong>
                      </p>
                      <ul className="ml-4">
                        <li>Definida: {result.data.stripeKeyInfo.defined ? "✅" : "❌"}</li>
                        <li>Comprimento: {result.data.stripeKeyInfo.length} caracteres</li>
                        <li>Formato correto: {result.data.stripeKeyInfo.startsCorrectly ? "✅" : "❌"}</li>
                      </ul>
                    </div>
                  )}

                  {result.ok && result.data.checkoutUrl && (
                    <div className="mt-2">
                      <p>
                        <strong>✅ Sucesso!</strong> URL do Checkout gerada:
                      </p>
                      <p className="text-sm text-gray-600 break-all">{result.data.checkoutUrl}</p>
                    </div>
                  )}

                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">Ver resposta completa</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
