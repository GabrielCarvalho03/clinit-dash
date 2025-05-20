import { stripeCliente } from "@/lib/stripe/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await stripeCliente.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency: "brl",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Consulta Odontológica",
            },
            unit_amount: 50000,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {},

      success_url: `https://clinitt.vercel.app/success`,
      cancel_url: `https://clinitt.vercel.app/success/cancel`,
    });

    return NextResponse.json(
      {
        url: session.url,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Erro ao criar sessão:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
