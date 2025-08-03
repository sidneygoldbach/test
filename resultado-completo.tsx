"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, Star, Trophy, Target, CheckCircle, Sparkles, Crown, ArrowRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

function ResultadoCompletoContent() {
  const [quizData, setQuizData] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [paymentVerified, setPaymentVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id")

      if (sessionId) {
        try {
          const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
          const data = await response.json()

          if (data.paymentStatus === "paid") {
            setPaymentVerified(true)

            // Get quiz data from metadata or localStorage
            if (data.metadata) {
              setQuizData({
                score: Number.parseInt(data.metadata.quizScore),
                maxScore: 15, // Assuming max score
                percentage: Number.parseFloat(data.metadata.quizPercentage),
                level: data.metadata.quizLevel,
              })
            } else {
              // Fallback to localStorage
              const savedData = localStorage.getItem("quizData")
              if (savedData) {
                setQuizData(JSON.parse(savedData))
              }
            }
          } else {
            // Payment not completed, redirect back
            router.push("/resultado")
          }
        } catch (error) {
          console.error("Payment verification failed:", error)
          router.push("/resultado")
        }
      } else {
        // No session ID, check localStorage for development
        const savedData = localStorage.getItem("quizData")
        if (savedData) {
          setQuizData(JSON.parse(savedData))
          setPaymentVerified(true) // For development
        } else {
          router.push("/")
        }
      }

      setIsVerifying(false)
      setIsVisible(true)
    }

    verifyPayment()
  }, [router, searchParams])

  const getResultData = () => {
    if (!quizData) return null

    const { percentage } = quizData

    if (percentage >= 80) {
      return {
        level: "Expert em Relacionamentos",
        color: "from-green-500 to-emerald-600",
        icon: <Trophy className="w-8 h-8" />,
        description: "Parabéns! Você tem um conhecimento excepcional sobre relacionamentos saudáveis.",
        feedback:
          "Você entende profundamente os pilares de um relacionamento duradouro e sabe como aplicá-los na prática.",
        strengths: [
          "💬 Comunicação excepcional",
          "🤝 Resolução madura de conflitos",
          "💖 Demonstração equilibrada de amor",
          "🌱 Visão de crescimento conjunto",
        ],
        improvements: [
          "Continue sendo exemplo para outros casais",
          "Compartilhe seu conhecimento com amigos",
          "Mantenha-se atualizado sobre relacionamentos",
        ],
        tips: [
          "Considere fazer mentoria para outros casais",
          "Leia livros avançados sobre psicologia do amor",
          "Pratique gratidão diária pelo seu relacionamento",
        ],
      }
    } else if (percentage >= 60) {
      return {
        level: "Bom Conhecimento",
        color: "from-blue-500 to-indigo-600",
        icon: <Star className="w-8 h-8" />,
        description: "Você tem uma boa base sobre relacionamentos, mas ainda há espaço para crescer.",
        feedback: "Continue desenvolvendo suas habilidades de comunicação e inteligência emocional.",
        strengths: [
          "📚 Base sólida de conhecimento",
          "💭 Consciência sobre a importância da comunicação",
          "🎯 Interesse em melhorar o relacionamento",
        ],
        improvements: [
          "Desenvolver habilidades de escuta ativa",
          "Aprender mais sobre linguagens do amor",
          "Praticar resolução construtiva de conflitos",
        ],
        tips: [
          "Leia 'Os 5 Linguagens do Amor' de Gary Chapman",
          "Pratique 10 minutos de conversa profunda por dia",
          "Faça cursos sobre comunicação não-violenta",
        ],
      }
    } else if (percentage >= 40) {
      return {
        level: "Conhecimento Básico",
        color: "from-yellow-500 to-orange-600",
        icon: <Users className="w-8 h-8" />,
        description: "Você está no caminho certo, mas precisa aprender mais sobre relacionamentos saudáveis.",
        feedback: "Invista em seu desenvolvimento pessoal e aprenda técnicas de comunicação efetiva.",
        strengths: [
          "🌟 Disposição para aprender",
          "💪 Reconhece a importância do crescimento",
          "❤️ Tem amor para oferecer",
        ],
        improvements: [
          "Estudar os fundamentos de relacionamentos saudáveis",
          "Desenvolver inteligência emocional",
          "Aprender a comunicar necessidades e sentimentos",
        ],
        tips: [
          "Comece com livros básicos sobre relacionamentos",
          "Pratique expressar sentimentos de forma clara",
          "Busque terapia de casal se necessário",
        ],
      }
    } else {
      return {
        level: "Iniciante",
        color: "from-red-500 to-pink-600",
        icon: <Heart className="w-8 h-8" />,
        description: "É hora de investir seriamente no seu conhecimento sobre relacionamentos.",
        feedback: "Não se preocupe! Todo mundo começa de algum lugar. O importante é dar o primeiro passo.",
        strengths: [
          "🚀 Potencial imenso para crescimento",
          "💝 Coração aberto para aprender",
          "🎯 Motivação para melhorar",
        ],
        improvements: [
          "Aprender os conceitos básicos de relacionamentos",
          "Desenvolver autoconhecimento emocional",
          "Praticar comunicação empática",
        ],
        tips: [
          "Comece com autoconhecimento - conheça suas emoções",
          "Pratique ouvir mais e julgar menos",
          "Invista em terapia individual primeiro",
        ],
      }
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Verificando pagamento...</p>
        </div>
      </div>
    )
  }

  if (!paymentVerified || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Acesso não autorizado</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Voltar ao início
          </Button>
        </div>
      </div>
    )
  }

  const result = getResultData()
  if (!result) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-10 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-10 w-24 h-24 bg-rose-200 rounded-full opacity-15 animate-bounce delay-500"></div>

      {/* Header de Sucesso */}
      <section className="relative py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 text-lg mb-6 rounded-full shadow-lg">
              ✅ Pagamento Confirmado!
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent leading-tight">
              🎉 Seu Resultado Completo
            </h1>
          </div>
        </div>
      </section>

      {/* Resultado Principal */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400"></div>

            <CardHeader className="text-center space-y-6 relative">
              <div className="relative">
                <div
                  className={`w-24 h-24 bg-gradient-to-r ${result.color} rounded-full flex items-center justify-center text-white mx-auto shadow-2xl relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                  {result.icon}
                </div>
                <div className="absolute -top-2 -right-2 text-3xl animate-bounce">✨</div>
              </div>

              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {result.level}
              </CardTitle>

              <Badge
                variant="secondary"
                className="text-xl px-6 py-3 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200 rounded-full font-semibold shadow-lg"
              >
                {quizData.score}/{quizData.maxScore} pontos ({Math.round(quizData.percentage)}%)
              </Badge>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="relative">
                  <Progress value={quizData.percentage} className="h-6 bg-pink-100 rounded-full" />
                  <div
                    className={`absolute top-0 left-0 h-6 bg-gradient-to-r ${result.color} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: `${quizData.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6 text-center">
                <p className="text-xl font-semibold text-gray-700 leading-relaxed">{result.description}</p>
                <p className="text-gray-600 text-lg leading-relaxed">{result.feedback}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pontos Fortes */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-green-600 mr-3" />🌟 Seus Pontos Fortes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {result.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/60 p-4 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-gray-700 font-medium">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Áreas de Melhoria */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center">
                <Target className="w-8 h-8 text-orange-600 mr-3" />🎯 Áreas para Desenvolver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white/60 p-4 rounded-xl">
                    <ArrowRight className="w-6 h-6 text-orange-600 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed">{improvement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dicas Personalizadas */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center">
                <Crown className="w-8 h-8 text-purple-600 mr-3" />💡 Suas Dicas Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white/60 p-4 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-pink-100">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              💖 Pronto para Transformar seu Relacionamento?
            </h3>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Agora que você conhece seu perfil, que tal descobrir como aplicar essas informações na prática?
            </p>

            <Button
              className="w-full md:w-auto bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-bold py-6 px-16 text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-6"
              onClick={() => router.push("/")}
            >
              🚀 Fazer Novo Quiz
            </Button>

            <p className="text-sm text-gray-500">Compartilhe com amigos e descubram juntos!</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Carregando resultado...</p>
      </div>
    </div>
  )
}

export default function ResultadoCompleto() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultadoCompletoContent />
    </Suspense>
  )
}
