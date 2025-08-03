import { type NextRequest, NextResponse } from "next/server"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    })

    // Verify this session is for our quiz product
    const isQuizProduct = session.line_items?.data?.some(
      (item: any) => item.price?.product?.id === "prod_Sn4hQJD9yvuW8H",
    )

    if (!isQuizProduct) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 })
    }

    return NextResponse.json({
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      amount: session.amount_total,
      currency: session.currency,
      productId: "prod_Sn4hQJD9yvuW8H",
      metadata: session.metadata,
      createdAt: session.created,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
