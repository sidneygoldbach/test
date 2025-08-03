"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XCircle, ArrowLeft, CreditCard, RefreshCw, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PagamentoCancelado() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleTryAgain = () => {
    router.push("/resultado")
  }

  const handleBackToQuiz = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-pink-200 rounded-full opacity-10 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-10 w-24 h-24 bg-rose-200 rounded-full opacity-15 animate-bounce delay-500"></div>

      {/* Main Content */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 text-lg mb-6 rounded-full shadow-lg">
              ❌ Pagamento Cancelado
            </Badge>

            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
              <XCircle className="w-12 h-12" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-pink-500 to-rose-600 bg-clip-text text-transparent leading-tight">
              Ops! Pagamento Cancelado
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed">
              Não se preocupe! Seu resultado ainda está esperando por você.
              <br />
              <span className="font-bold text-pink-600">Que tal tentar novamente?</span>
            </p>
          </div>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 relative overflow-hidden mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <Heart className="w-8 h-8 text-pink-500 mr-3" />💡 Por que isso aconteceu?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-800">Possíveis motivos:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <span className="text-pink-500">•</span>
                      <span>Você fechou a página de pagamento</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-pink-500">•</span>
                      <span>Mudou de ideia sobre a compra</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-pink-500">•</span>
                      <span>Problema técnico temporário</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-pink-500">•</span>
                      <span>Sessão de pagamento expirou</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-800">Não tem problema!</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>Seu quiz não foi perdido</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>Você pode tentar novamente</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>Pagamento 100% seguro</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>Suporte disponível</span>
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
          <Card className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <CardContent className="p-12 text-center relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">💖 Seu Resultado Ainda Te Espera!</h3>

              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Por apenas R$ 2,00, descubra insights únicos sobre seu perfil amoroso
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Button
                  className="bg-white text-pink-600 hover:bg-pink-50 font-bold py-6 px-12 text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
                  onClick={handleTryAgain}
                >
                  <CreditCard className="w-6 h-6" />
                  <span>💳 Tentar Pagamento Novamente</span>
                </Button>

                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-pink-600 font-bold py-6 px-12 text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
                  onClick={handleBackToQuiz}
                >
                  <ArrowLeft className="w-6 h-6" />
                  <span>🔄 Fazer Quiz Novamente</span>
                </Button>
              </div>

              <div className="flex items-center justify-center text-sm opacity-80 mt-6 space-x-4">
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sem cobrança adicional
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Suporte 24/7
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-100/50 to-purple-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-pink-100">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              🤝 Precisa de Ajuda?
            </h3>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Nossa equipe está aqui para ajudar você a descobrir seus segredos do amor!
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Chat Online</h4>
                <p className="text-gray-600 text-sm">Resposta imediata</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Email</h4>
                <p className="text-gray-600 text-sm">suporte@relacionamentonota10.com</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">WhatsApp</h4>
                <p className="text-gray-600 text-sm">Atendimento personalizado</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
