// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const { email, deliveryMethod, items } = await req.json();

    // Calculate total in euros then convert to cents
    const totalEuros = Array.isArray(items)
      ? items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0)
      : 10; // fallback: €10 if items not provided

    // Convert to cents
    let amount = Math.round(totalEuros * 100);

    // Ensure minimum of 50 cents
    if (amount < 50) {
      amount = 50;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-07-30.basil",
    });

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "eur",
        receipt_email: email,
        metadata: { deliveryMethod },
        payment_method_types: ["card"], // Only allow card payments
    });


    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    console.error("Napaka v API POST /api/create-payment-intent:", err);
    return NextResponse.json({ error: (err as Error).message || "Notranja napaka" }, { status: 500 });
  }
}
