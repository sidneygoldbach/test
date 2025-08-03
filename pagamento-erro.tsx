"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowLeft, RefreshCw, Heart, Shield } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

function PagamentoErroContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [errorDetails, setErrorDetails] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsVisible(true)

    // Get error details from URL params
    const error = searchParams.get("error")
    const errorCode = searchParams.get("error_code")
    const errorMessage = searchParams.get("error_message")

    setErrorDetails({
      error,
      errorCode,
      errorMessage,
    })
  }, [searchParams])

  const handleTryAgain = () => {
    router.push("/resultado")
  }

  const handleBackToQuiz = () => {
    router.push("/")
  }

  const getErrorMessage = () => {
    if (errorDetails?.errorCode) {
      switch (errorDetails.errorCode) {
        case "card_declined":
          return "Seu cartão foi recusado. Tente outro cartão ou método de pagamento."
        case "insufficient_funds":
          return "Saldo insuficiente. Verifique seu saldo ou tente outro cartão."
        case "expired_card":
          return "Cartão expirado. Use um cartão válido."
        case "incorrect_cvc":
          return "Código de segurança incorreto. Verifique o CVC do seu cartão."
        case "processing_error":
          return "Erro no processamento. Tente novamente em alguns minutos."
        default:
          return errorDetails.errorMessage || "Ocorreu um erro inesperado durante o pagamento."
      }
    }
    return "Ocorreu um erro durante o processamento do pagamento."
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-orange-200 rounded-full opacity-10 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-10 w-24 h-24 bg-yellow-200 rounded-full opacity-15 animate-bounce delay-500"></div>

      {/* Main Content */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-2 text-lg mb-6 rounded-full shadow-lg">
              ⚠️ Erro no Pagamento
            </Badge>

            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
              <AlertTriangle className="w-12 h-12" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-600 bg-clip-text text-transparent leading-tight">
              Oops! Algo Deu Errado
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Não conseguimos processar seu pagamento.
              <br />
              <span className="font-bold text-orange-600">Mas não se preocupe, vamos resolver isso!</span>
            </p>

            {/* Error Details */}
            {errorDetails && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="font-bold text-red-800 mb-2">Detalhes do Erro:</h3>
                <p className="text-red-700">{getErrorMessage()}</p>
                {errorDetails.errorCode && (
                  <p className="text-red-600 text-sm mt-2">Código: {errorDetails.errorCode}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 relative overflow-hidden mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-500 mr-3" />🔧 Como Resolver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-800">Tente estas soluções:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500">1.</span>
                      <span>Verifique os dados do seu cartão</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500">2.</span>
                      <span>Tente outro cartão ou método de pagamento</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500">3.</span>
                      <span>Verifique se há saldo suficiente</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500">4.</span>
                      <span>Entre em contato com seu banco</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-800">Métodos disponíveis:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500">💳</span>
                      <span>Cartão de Crédito/Débito</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500">📱</span>
                      <span>PIX (Instantâneo)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500">🏦</span>
                      <span>Boleto Bancário</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500">🔒</span>
                      <span>100% Seguro via Stripe</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <CardContent className="p-12 text-center relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">💪 Vamos Tentar Novamente!</h3>

              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Seu resultado do quiz ainda está esperando por você. Apenas R$ 4,00!
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Button
                  className="bg-white text-orange-600 hover:bg-orange-50 font-bold py-6 px-12 text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
                  onClick={handleTryAgain}
                >
                  <RefreshCw className="w-6 h-6" />
                  <span>🔄 Tentar Novamente</span>
                </Button>

                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-6 px-12 text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
                  onClick={handleBackToQuiz}
                >
                  <ArrowLeft className="w-6 h-6" />
                  <span>🏠 Voltar ao Quiz</span>
                </Button>
              </div>

              <div className="flex items-center justify-center text-sm opacity-80 mt-6 space-x-4">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Pagamento 100% seguro
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Suporte disponível
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-100/50 to-red-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-orange-100">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              🆘 Ainda com Problemas?
            </h3>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Nossa equipe de suporte está pronta para ajudar você!
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Chat Ao Vivo</h4>
                <p className="text-gray-600 text-sm">Resposta em segundos</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Email</h4>
                <p className="text-gray-600 text-sm">suporte@relacionamentonota10.com</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">WhatsApp</h4>
                <p className="text-gray-600 text-sm">Suporte técnico especializado</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function PagamentoErroFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Carregando página de erro...</p>
      </div>
    </div>
  )
}

export default function PagamentoErro() {
  return (
    <Suspense fallback={<PagamentoErroFallback />}>
      <PagamentoErroContent />
    </Suspense>
  )
}
