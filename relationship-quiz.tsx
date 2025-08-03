"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, MessageCircle, Star, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { VersionBadge } from "@/components/version-badge"

interface Question {
  id: number
  question: string
  options: { text: string; points: number }[]
  icon: React.ReactNode
}

const questions: Question[] = [
  {
    id: 1,
    question: "Qual é a base mais importante para um relacionamento duradouro?",
    options: [
      { text: "💋 Atração física intensa", points: 1 },
      { text: "💬 Comunicação profunda e sincera", points: 3 },
      { text: "💰 Estabilidade financeira", points: 2 },
      { text: "🎯 Interesses e sonhos em comum", points: 2 },
    ],
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: 2,
    question: "Como você lida com conflitos no relacionamento?",
    options: [
      { text: "🙈 Evito discussões a todo custo", points: 1 },
      { text: "🗣️ Converso abertamente sobre tudo", points: 3 },
      { text: "⏰ Espero que o tempo cure as feridas", points: 1 },
      { text: "👑 Busco sempre ter razão", points: 0 },
    ],
    icon: <MessageCircle className="w-6 h-6" />,
  },
  {
    id: 3,
    question: "O que você considera mais importante na comunicação?",
    options: [
      { text: "🗣️ Falar mais que escutar", points: 0 },
      { text: "👂 Escutar com o coração aberto", points: 3 },
      { text: "💡 Dar conselhos constantemente", points: 1 },
      { text: "😌 Concordar sempre para manter a paz", points: 1 },
    ],
    icon: <Users className="w-6 h-6" />,
  },
  {
    id: 4,
    question: "Como você demonstra amor e carinho?",
    options: [
      { text: "💕 Apenas com palavras doces", points: 1 },
      { text: "🤗 Através de ações e gestos", points: 2 },
      { text: "🎭 Conhecendo a linguagem do amor dele(a)", points: 3 },
      { text: "💎 Comprando presentes caros", points: 1 },
    ],
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: 5,
    question: "Qual sua atitude em relação ao crescimento pessoal no relacionamento?",
    options: [
      { text: "🚶 Cada um deve crescer sozinho", points: 1 },
      { text: "🌱 Crescemos juntos, apoiando um ao outro", points: 3 },
      { text: "🤷 Não penso muito sobre isso", points: 0 },
      { text: "🔄 Espero que meu parceiro mude por mim", points: 0 },
    ],
    icon: <Target className="w-6 h-6" />,
  },
]

export default function Component() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const handleAnswer = (points: number) => {
    const newAnswers = [...answers, points]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
      } else {
        // Salva as respostas e redireciona para página de vendas
        const totalScore = newAnswers.reduce((sum, points) => sum + points, 0)
        const maxScore = questions.length * 3
        const percentage = (totalScore / maxScore) * 100

        let level = ""
        if (percentage >= 80) level = "Expert em Relacionamentos"
        else if (percentage >= 60) level = "Bom Conhecimento"
        else if (percentage >= 40) level = "Conhecimento Básico"
        else level = "Iniciante"

        localStorage.setItem(
          "quizData",
          JSON.stringify({
            score: totalScore,
            maxScore,
            percentage,
            level,
            answers: newAnswers,
          }),
        )

        router.push("/resultado")
      }
    }, 500)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Version Badge */}
      <VersionBadge />

      {/* Elementos decorativos de fundo */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-16 h-16 bg-rose-200 rounded-full opacity-30 animate-bounce"></div>

      <Card className="w-full max-w-2xl backdrop-blur-sm bg-white/90 shadow-2xl border-0 relative overflow-hidden">
        {/* Gradiente decorativo no topo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400"></div>

        <CardHeader className="relative">
          <div className="flex items-center justify-between mb-6">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-200 px-4 py-2 rounded-full font-medium"
            >
              ✨ Pergunta {currentQuestion + 1} de {questions.length}
            </Badge>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full text-white shadow-lg">
              {questions[currentQuestion].icon}
            </div>
          </div>

          <div className="relative mb-6">
            <Progress value={progress} className="h-3 bg-pink-100 rounded-full overflow-hidden" />
            <div
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-relaxed">
            {questions[currentQuestion].question}
          </CardTitle>
          <CardDescription className="text-center text-gray-600 mt-3 text-lg">
            💖 Escolha a opção que mais toca seu coração
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="group relative">
                <Button
                  variant="outline"
                  className={`w-full p-6 h-auto text-left justify-start transition-all duration-300 ease-out transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden border-2 ${
                    selectedOption === index
                      ? "bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white border-transparent shadow-2xl scale-[1.02] -translate-y-1"
                      : "hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 border-pink-200 hover:border-pink-300 bg-white hover:shadow-xl"
                  } rounded-2xl`}
                  onClick={() => {
                    setSelectedOption(index)
                    handleAnswer(option.points)
                  }}
                >
                  {/* Efeito de brilho */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${selectedOption === index ? "animate-pulse" : ""}`}
                  ></div>

                  {/* Conteúdo do botão */}
                  <div className="relative z-10 flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        selectedOption === index
                          ? "bg-white shadow-lg"
                          : "bg-gradient-to-r from-pink-300 to-purple-300 group-hover:from-pink-400 group-hover:to-purple-400"
                      }`}
                    ></div>
                    <span
                      className={`text-lg font-medium transition-all duration-300 ${
                        selectedOption === index ? "text-white" : "text-gray-700 group-hover:text-gray-800"
                      }`}
                    >
                      {option.text}
                    </span>
                  </div>

                  {/* Efeito de coração flutuante */}
                  {selectedOption === index && (
                    <div className="absolute top-2 right-4 text-white animate-bounce">💖</div>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Indicador de progresso visual */}
          <div className="flex justify-center mt-8 space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentQuestion ? "bg-gradient-to-r from-pink-400 to-purple-500 shadow-lg" : "bg-pink-200"
                }`}
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
