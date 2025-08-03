import { type NextRequest, NextResponse } from "next/server"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

// Função para obter a URL base automaticamente
function getBaseUrl() {
  // Em produção no Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // URL configurada manualmente
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }

  // Fallback para desenvolvimento local
  return "http://localhost:3000"
}

// Função para determinar o ambiente
function getEnvironment() {
  const isLocal =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_BASE_URL?.includes("localhost") ||
    process.env.VERCEL_ENV === "development"

  return {
    isLocal,
    isProduction: !isLocal && (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production"),
  }
}

// Função para obter o Product ID baseado no ambiente
function getProductId() {
  const env = getEnvironment()

  if (env.isLocal) {
    // Ambiente de teste/desenvolvimento
    return "prod_SnibIHbIfakhda"
  } else {
    // Ambiente de produção
    return "prod_Sn4hQJD9yvuW8H"
  }
}

// Função para validar a chave do Stripe
function validateStripeKey(key: string | undefined) {
  if (!key) {
    return { valid: false, error: "STRIPE_SECRET_KEY não está definida" }
  }

  // Verificar se não é um exemplo
  if (key.includes("here") || key.includes("your_key") || key.includes("example")) {
    return { valid: false, error: "Chave parece ser um exemplo (contém 'here', 'your_key' ou 'example')" }
  }

  // Verificar formato básico
  if (!key.startsWith("sk_")) {
    return { valid: false, error: "Chave deve começar com 'sk_'" }
  }

  // Verificar se é muito curta (chaves reais são longas)
  if (key.length < 50) {
    return { valid: false, error: "Chave muito curta (chaves reais têm 100+ caracteres)" }
  }

  // Verificar se termina com caracteres válidos
  const lastChars = key.slice(-10)
  if (lastChars.includes("here") || lastChars.includes("***")) {
    return { valid: false, error: "Chave termina com texto de exemplo" }
  }

  return { valid: true, error: null }
}

export async function POST(request: NextRequest) {
  console.log("🔥 API create-payment called")

  try {
    // Determinar ambiente e produto
    const env = getEnvironment()
    const productId = getProductId()

    console.log("🌍 Environment Info:")
    console.log("- Is Local:", env.isLocal)
    console.log("- Is Production:", env.isProduction)
    console.log("- Product ID:", productId)
    console.log("- NODE_ENV:", process.env.NODE_ENV)
    console.log("- VERCEL_ENV:", process.env.VERCEL_ENV)

    // Validar chave do Stripe ANTES de usar
    const keyValidation = validateStripeKey(process.env.STRIPE_SECRET_KEY)

    console.log("🔧 Stripe Key Validation:")
    console.log("- Valid:", keyValidation.valid)
    if (!keyValidation.valid) {
      console.log("- Error:", keyValidation.error)
    }
    console.log("- Key starts with:", process.env.STRIPE_SECRET_KEY?.substring(0, 10) || "undefined")
    console.log("- Key ends with:", process.env.STRIPE_SECRET_KEY?.slice(-10) || "undefined")
    console.log("- Key length:", process.env.STRIPE_SECRET_KEY?.length || 0)

    if (!keyValidation.valid) {
      return NextResponse.json(
        {
          error: "Stripe key configuration error",
          details: keyValidation.error,
          keyInfo: {
            defined: !!process.env.STRIPE_SECRET_KEY,
            length: process.env.STRIPE_SECRET_KEY?.length || 0,
            startsCorrectly: process.env.STRIPE_SECRET_KEY?.startsWith("sk_") || false,
            endsWithExample: process.env.STRIPE_SECRET_KEY?.includes("here") || false,
          },
        },
        { status: 500 },
      )
    }

    const { quizData } = await request.json()
    console.log("📊 Received quiz data:", quizData)

    const baseUrl = getBaseUrl()
    console.log("🌐 Base URL:", baseUrl)

    console.log("💳 Creating Stripe session...")

    // Create Stripe Checkout Session using environment-specific product
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product: productId, // Environment-specific Product ID
            unit_amount: 400, // R$ 4.00 in cents (4.00 * 100 = 400)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/resultado-completo?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pagamento-cancelado`,
      metadata: {
        quizScore: quizData?.score?.toString() || "0",
        quizLevel: quizData?.level || "Unknown",
        quizPercentage: quizData?.percentage?.toString() || "0",
        productId: productId,
        environment: env.isLocal ? "test" : "production",
      },
      // Enable Brazilian payment methods
      payment_method_options: {
        boleto: {
          expires_after_days: 3,
        },
      },
      // Add customer email collection
      customer_creation: "always",
      billing_address_collection: "required",
      // Configure for Brazilian market
      locale: "pt-BR",
      // Set expiration time (24 hours)
      expires_at: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    })

    console.log("✅ Stripe session created:", session.id)
    console.log("🔗 Checkout URL:", session.url)

    return NextResponse.json({
      sessionId: session.id,
      checkoutUrl: session.url,
      success: true,
      environment: env.isLocal ? "test" : "production",
      productId: productId,
    })
  } catch (error) {
    console.error("💥 Stripe error:", error)

    // Return detailed error for debugging
    return NextResponse.json(
      {
        error: "Failed to create payment session",
        details: error.message,
        type: error.type || "unknown",
        code: error.code || "unknown",
        stripeKeyInfo: {
          defined: !!process.env.STRIPE_SECRET_KEY,
          length: process.env.STRIPE_SECRET_KEY?.length || 0,
          startsCorrectly: process.env.STRIPE_SECRET_KEY?.startsWith("sk_") || false,
        },
      },
      { status: 500 },
    )
  }
}
