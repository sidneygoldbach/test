import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object

      // Verify this is for our quiz product
      if (session.metadata?.productId === "prod_Sn4hQJD9yvuW8H") {
        console.log("✅ Quiz payment successful:", session.id)

        // Save payment info to database
        await saveQuizPayment({
          sessionId: session.id,
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name,
          amount: session.amount_total,
          currency: session.currency,
          quizScore: session.metadata?.quizScore,
          quizLevel: session.metadata?.quizLevel,
          quizPercentage: session.metadata?.quizPercentage,
          productId: "prod_Sn4hQJD9yvuW8H",
          paymentStatus: "completed",
          paymentMethod: session.payment_method_types?.[0],
          createdAt: new Date(),
        })

        // Send confirmation email (optional)
        await sendQuizResultEmail({
          email: session.customer_details?.email,
          name: session.customer_details?.name,
          quizLevel: session.metadata?.quizLevel,
          sessionId: session.id,
        })
      }

      break

    case "payment_intent.payment_failed":
      const paymentIntent = event.data.object
      console.log("❌ Quiz payment failed:", paymentIntent.id)

      // Log failed payment for analysis
      await logFailedPayment({
        paymentIntentId: paymentIntent.id,
        customerEmail: paymentIntent.receipt_email,
        amount: paymentIntent.amount,
        failureReason: paymentIntent.last_payment_error?.message,
        failureCode: paymentIntent.last_payment_error?.code,
        createdAt: new Date(),
      })

      break

    case "checkout.session.expired":
      const expiredSession = event.data.object
      console.log("⏰ Checkout session expired:", expiredSession.id)
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

// Save quiz payment to database
async function saveQuizPayment(paymentData: any) {
  try {
    console.log("💾 Saving quiz payment:", paymentData)

    // Implement your database logic here
    // Example with Prisma:
    /*
    await prisma.quizPayment.create({
      data: paymentData
    })
    */

    // Example with Supabase:
    /*
    const { data, error } = await supabase
      .from('quiz_payments')
      .insert([paymentData])
    
    if (error) throw error
    */
  } catch (error) {
    console.error("Error saving quiz payment:", error)
  }
}

// Send confirmation email
async function sendQuizResultEmail(emailData: any) {
  try {
    console.log("📧 Sending quiz result email:", emailData)

    const emailContent = {
      to: emailData.email,
      subject: "🎉 Seu Resultado do Quiz de Relacionamento está Pronto!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e91e63;">Olá ${emailData.name || "querido(a)"}!</h2>
          <p>Seu pagamento foi confirmado com sucesso! 🎉</p>
          <p><strong>Seu Nível:</strong> ${emailData.quizLevel}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://relacionamentonota10.vercel.app/resultado-completo?session_id=${emailData.sessionId}" 
               style="background: linear-gradient(45deg, #e91e63, #9c27b0); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              💖 Ver Resultado Completo
            </a>
          </div>
          <p>Obrigado por usar nosso quiz de relacionamento!</p>
          <p style="color: #666; font-size: 12px;">
            Se você não conseguir clicar no botão, copie e cole este link no seu navegador:<br>
            https://relacionamentonota10.vercel.app/resultado-completo?session_id=${emailData.sessionId}
          </p>
        </div>
      `,
    }

    // Implement with your email service
    // await sendEmail(emailContent)
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

// Log failed payments for analysis
async function logFailedPayment(failureData: any) {
  try {
    console.log("📊 Logging failed payment:", failureData)

    // Save to database for analysis
    // This helps you understand why payments fail and improve conversion
  } catch (error) {
    console.error("Error logging failed payment:", error)
  }
}
