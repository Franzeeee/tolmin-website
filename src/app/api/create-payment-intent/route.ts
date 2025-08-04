import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
    try {
        const { email, deliveryMethod, items } = await req.json();

        // Calculate amount from items
        let amount = Array.isArray(items)
            ? items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0)
            : 1000; // fallback

        // Stripe requires minimum amount of 50 cents (500 in smallest unit for EUR)
        if (amount < 50) {
            amount = 50;
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount, // calculated amount in cents
            currency: "eur",
            receipt_email: email,
            metadata: { deliveryMethod },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (err: unknown) {
        console.error("Napaka v API POST /api/create-payment-intent:", err);
        return NextResponse.json({ error: (err as Error).message || "Notranja napaka" }, { status: 500 });
    }
}
