"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, CheckCircle, Shield, Sparkles, Crown, Lock, Eye, Zap, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { VersionBadge } from "@/components/version-badge"

export default function ResultadoVendas() {
  const [quizData, setQuizData] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [environment, setEnvironment] = useState<string>("unknown")
  const router = useRouter()

  useEffect(() => {
    const savedData = localStorage.getItem("quizData")
    if (savedData) {
      setQuizData(JSON.parse(savedData))
    }

    // Detectar ambiente
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.port === "3000"
    setEnvironment(isLocal ? "test" : "production")

    setIsVisible(true)
  }, [])

  const getProductId = () => {
    return environment === "test" ? "prod_SnibIHbIfakhda" : "prod_Sn4hQJD9yvuW8H"
  }

  const handlePayment = async () => {
    console.log("🚀 [PAYMENT] Iniciando pagamento...")
    console.log("🚀 [PAYMENT] Environment:", environment)
    console.log("🚀 [PAYMENT] Product ID:", getProductId())
    console.log("🚀 [PAYMENT] Quiz Data:", quizData)

    setIsProcessingPayment(true)
    setDebugInfo({ step: "Iniciando...", environment, productId: getProductId() })

    try {
      setDebugInfo({ step: "Enviando requisição para API...", environment, productId: getProductId() })
      console.log("🚀 [PAYMENT] Fazendo fetch para /api/create-payment")

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizData: quizData,
        }),
      })

      console.log("🚀 [PAYMENT] Response status:", response.status)
      console.log("🚀 [PAYMENT] Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("🚀 [PAYMENT] API Error:", errorText)
        setDebugInfo({ step: "Erro na API", error: errorText, environment, productId: getProductId() })
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      setDebugInfo({ step: "Processando resposta...", environment, productId: getProductId() })
      const data = await response.json()
      console.log("🚀 [PAYMENT] API Response:", data)

      if (data.checkoutUrl) {
        console.log("🚀 [PAYMENT] Redirecionando para:", data.checkoutUrl)
        setDebugInfo({
          step: "Redirecionando para Stripe...",
          environment: data.environment || environment,
          productId: data.productId || getProductId(),
        })

        // Redirect to Stripe Checkout
        console.log("🚀 [PAYMENT] Executando window.location.href...")
        window.location.href = data.checkoutUrl
      } else {
        console.error("🚀 [PAYMENT] No checkout URL received:", data)
        setDebugInfo({ step: "Erro: Sem URL de checkout", data, environment, productId: getProductId() })
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("🚀 [PAYMENT] Payment error:", error)
      setDebugInfo({ step: "Erro capturado", error: error.message, environment, productId: getProductId() })

      alert(`Erro ao processar pagamento: ${error.message}\n\nTente novamente ou entre em contato com o suporte.`)
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Version Badge */}
      <VersionBadge />

      {/* Debug Info - Remove in production */}
      {debugInfo && (
        <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-sm max-w-sm z-50">
          <h4 className="font-bold mb-2">🔍 Debug Info:</h4>
          <p>
            <strong>Step:</strong> {debugInfo.step}
          </p>
          <p>
            <strong>Environment:</strong> {debugInfo.environment}
          </p>
          <p>
            <strong>Product ID:</strong> {debugInfo.productId}
          </p>
          {debugInfo.error && (
            <p>
              <strong>Error:</strong> {debugInfo.error}
            </p>
          )}
          {debugInfo.data && (
            <p>
              <strong>Data:</strong> {JSON.stringify(debugInfo.data, null, 2)}
            </p>
          )}
        </div>
      )}

      {/* Environment Badge */}
      <div className="fixed top-20 left-4 z-50">
        <Badge
          variant={environment === "test" ? "secondary" : "default"}
          className={environment === "test" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}
        >
          {environment === "test" ? "🧪 TESTE" : "🚀 PRODUÇÃO"}
        </Badge>
      </div>

      {/* Elementos decorativos de fundo */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-10 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-10 w-24 h-24 bg-rose-200 rounded-full opacity-15 animate-bounce delay-500"></div>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 text-lg mb-6 rounded-full shadow-lg">
              ✨ Quiz Concluído com Sucesso!
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent leading-tight">
              🔒 Seu Resultado Está Pronto!
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Descobrimos informações <span className="font-bold text-pink-600">surpreendentes</span> sobre seu perfil
              amoroso...
            </p>

            {/* Debug Quiz Data */}
            {quizData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
                <h3 className="font-bold text-blue-800 mb-2">📊 Dados do Quiz:</h3>
                <p className="text-blue-700 text-sm">
                  Score: {quizData.score}/{quizData.maxScore}
                </p>
                <p className="text-blue-700 text-sm">Level: {quizData.level}</p>
                <p className="text-blue-700 text-sm">Percentage: {quizData.percentage}%</p>
                <p className="text-blue-700 text-sm">Environment: {environment}</p>
                <p className="text-blue-700 text-sm">Product ID: {getProductId()}</p>
              </div>
            )}

            {/* Preview do resultado */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-100 mb-12 max-w-2xl mx-auto relative overflow-hidden">
              {/* Overlay de blur */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/90 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                  <p className="text-xl font-bold text-gray-800 mb-2">Resultado Bloqueado</p>
                  <p className="text-gray-600">Desbloqueie para ver sua análise completa</p>
                </div>
              </div>

              {/* Conteúdo borrado */}
              <div className="blur-sm">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 text-yellow-500 mr-2" />
                  <span className="text-xl font-semibold text-gray-800">
                    Seu Nível: {quizData?.level || "Carregando..."}
                  </span>
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-4">
                  {quizData?.score || "?"}/{quizData?.maxScore || "?"} pontos
                </div>
                <div className="w-full bg-pink-200 rounded-full h-4 mb-6">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-4 rounded-full"
                    style={{ width: `${quizData?.percentage || 0}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 mb-4">
                  Sua análise personalizada revela aspectos únicos sobre como você se relaciona...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Oferta Principal */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <CardContent className="p-12 text-center relative z-10">
              <div className="flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 mr-3" />
                <span className="text-2xl font-bold">🔓 Desbloqueie Seu Resultado</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold mb-6">Descubra Seus Segredos do Amor!</h3>

              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Sua análise personalizada está pronta e contém insights únicos sobre:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>💖 Seu perfil amoroso detalhado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>🎯 Pontos fortes no relacionamento</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>⚠️ Áreas para melhorar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>💡 Dicas personalizadas</span>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 inline-block">
                <div className="text-2xl font-bold mb-2">🔥 OFERTA ESPECIAL</div>
                <div className="text-5xl font-bold">R$ 4,00</div>
                <div className="text-lg opacity-80">Acesso imediato ao resultado</div>
                <div className="text-sm opacity-70 mt-2">
                  ID do Produto: {getProductId()}
                  {environment === "test" && <span className="ml-2 text-yellow-300">(TESTE)</span>}
                </div>
              </div>

              <Button
                className="bg-white text-pink-600 hover:bg-pink-50 font-bold py-6 px-12 text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-4 flex items-center justify-center space-x-3 w-full md:w-auto"
                onClick={handlePayment}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
                    <span>Processando pagamento...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    <span>🚀 Pagar R$ 4,00 - Ver Resultado</span>
                  </>
                )}
              </Button>

              <div className="flex flex-col md:flex-row items-center justify-center text-sm opacity-80 space-y-2 md:space-y-0 md:space-x-6">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Pagamento seguro via Stripe
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Cartão, PIX ou Boleto
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Acesso imediato
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Test API Button - Remove in production */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const response = await fetch("/api/create-payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ quizData: { score: 10, level: "Test", percentage: 67 } }),
                })
                const data = await response.json()
                console.log("🧪 Test API Response:", data)
                alert(
                  `API Test: ${response.ok ? "✅ Success" : "❌ Error"}\nEnvironment: ${data.environment}\nProduct ID: ${data.productId}\n${JSON.stringify(data, null, 2)}`,
                )
              } catch (error) {
                console.error("🧪 Test API Error:", error)
                alert(`API Test Error: ${error.message}`)
              }
            }}
            className="mb-4"
          >
            🧪 Testar API (Debug)
          </Button>
        </div>
      </section>

      {/* Environment Variables Check */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 rounded-lg p-4 text-sm">
            <h3 className="font-bold mb-2">🔧 Verificação de Ambiente:</h3>
            <p>Environment: {environment}</p>
            <p>Product ID: {getProductId()}</p>
            <p>Base URL: {process.env.NEXT_PUBLIC_BASE_URL || "❌ Não configurada"}</p>
            <p>Stripe Key: {process.env.STRIPE_SECRET_KEY ? "✅ Configurada" : "❌ Não configurada"}</p>
          </div>
        </div>
      </section>

      {/* Resto do conteúdo permanece igual... */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              💎 O que você vai descobrir
            </h2>
            <p className="text-lg text-gray-600">Análise completa baseada nas suas respostas</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Heart className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">Perfil Amoroso Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">
                  Descubra como você ama, seus padrões de comportamento e o que te faz único nos relacionamentos.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">Pontos de Melhoria</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">
                  Identifique exatamente onde focar para transformar seus relacionamentos de forma rápida.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Sparkles className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">Dicas Personalizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">
                  Receba estratégias específicas para seu perfil, criadas especialmente para você.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Urgência */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-100/50 to-purple-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-pink-100">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Por Apenas R$ 4,00
            </h3>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Milhares de pessoas já descobriram seus segredos do amor.
              <br />
              <strong>Não fique de fora!</strong>
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Acesso Imediato</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Análise Completa</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Dicas Exclusivas</span>
              </div>
            </div>

            <Button
              className="w-full md:w-auto bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-bold py-6 px-16 text-2xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-6 flex items-center justify-center space-x-3"
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6" />
                  <span>💖 Desbloquear Resultado - R$ 4,00</span>
                </>
              )}
            </Button>

            <p className="text-sm text-gray-500">🔒 Pagamento seguro e protegido pelo Stripe</p>
          </div>
        </div>
      </section>
    </div>
  )
}
