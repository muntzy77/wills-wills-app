import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!secret || !priceId) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY or STRIPE_PRICE_ID" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/paywall`,
  });

  return NextResponse.json({ url: session.url });
}
