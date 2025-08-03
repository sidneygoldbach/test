import { type NextRequest, NextResponse } from "next/server"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function GET(request: NextRequest) {
  try {
    // Get analytics for your quiz product
    const charges = await stripe.charges.list({
      limit: 100,
      expand: ["data.payment_intent.metadata"],
    })

    // Filter charges for your quiz product
    const quizCharges = charges.data.filter(
      (charge: any) =>
        charge.metadata?.productId === "prod_Sn4hQJD9yvuW8H" ||
        charge.payment_intent?.metadata?.productId === "prod_Sn4hQJD9yvuW8H",
    )

    const analytics = {
      totalSales: quizCharges.length,
      totalRevenue: quizCharges.reduce((sum: number, charge: any) => sum + charge.amount, 0) / 100,
      currency: "BRL",
      productId: "prod_Sn4hQJD9yvuW8H",
      averageQuizScore: calculateAverageScore(quizCharges),
      levelDistribution: calculateLevelDistribution(quizCharges),
      recentSales: quizCharges.slice(0, 10).map((charge: any) => ({
        id: charge.id,
        amount: charge.amount / 100,
        customerEmail: charge.billing_details?.email,
        quizLevel: charge.metadata?.quizLevel || charge.payment_intent?.metadata?.quizLevel,
        createdAt: new Date(charge.created * 1000),
      })),
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

function calculateAverageScore(charges: any[]) {
  const scores = charges
    .map((charge) => {
      const score = charge.metadata?.quizScore || charge.payment_intent?.metadata?.quizScore
      return score ? Number.parseInt(score) : null
    })
    .filter((score) => score !== null)

  return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
}

function calculateLevelDistribution(charges: any[]) {
  const levels = charges
    .map((charge) => charge.metadata?.quizLevel || charge.payment_intent?.metadata?.quizLevel)
    .filter((level) => level)

  const distribution: { [key: string]: number } = {}
  levels.forEach((level) => {
    distribution[level] = (distribution[level] || 0) + 1
  })

  return distribution
}
