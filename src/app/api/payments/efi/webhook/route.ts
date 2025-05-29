import { api } from "@/lib/axios/axios";
import { db } from "@/lib/firebase/firebase-admin";
import { stripeCliente } from "@/lib/stripe/stripe";
import { hashPassword } from "@/utils/passwordhash";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const Passwordhashd = hashPassword("12345678");

  try {
    if (!sig) throw new Error("Assinatura do Stripe não encontrada!");

    const event = stripeCliente.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // 🚀 Trate os eventos conforme necessário
    if (event.type === "checkout.session.completed") {
      const customId = uuid();
      const session = event.data.object;

      console.log("session", session.metadata);

      if (session.metadata?.clinicId) {
        const userData = await db
          .collection("users")
          .where("id", "==", session.metadata?.clinicId)
          .get();

        const userId = userData.docs[0].id;
        await db.collection("users").doc(userId).update({
          password: Passwordhashd,
          active: true,
          firstLogin: true,
        });
      } else {
        console.log("session", session.metadata);
        const userData = await db.collection("users").add({
          id: customId,
          email: session.customer_details?.email,
          password: Passwordhashd,
          active: true,
          firstLogin: true,
        });
      }
      const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bem-vindo(a) à Clinitt</title>
  <style>
    body {
      background-color: #f0f4f8;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0; padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #333;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px 30px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      max-width: 400px;
      width: 90%;
      text-align: center;
    }
    h1 {
      color: #2b6cb0;
      margin-bottom: 24px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .credentials {
      background: #bee3f8;
      padding: 20px;
      border-radius: 10px;
      font-size: 18px;
      font-weight: 600;
      color: #2c5282;
      margin-bottom: 32px;
    }
    .credentials p {
      margin: 12px 0;
    }
    .footer {
      font-size: 14px;
      color: #718096;
    }
  </style>
  </head>
  <body>
    <div class="container">
      <h1>Bem-vindo(a) à Clinitt!</h1>
      <p>Seus dados de acesso para começar:</p>
      <div class="credentials">
        <p><strong>E-mail:</strong> ${session.customer_details?.email}</p>
        <p><strong>Senha:</strong> ${"12345678"}</p>
      </div>
      <p>Não se preocupe! Na primeira vez que acessar, você poderá trocar sua senha para garantir sua segurança.</p>
      <div class="footer">
        <p>Equipe Clinitt</p>
      </div>
    </div>
  </body>
  </html>
  `;
      const sendMail = await api.post("/send-email", {
        email: session.customer_details?.email,
        subject: "Bem-vindo",
        html: html,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Erro no Webhook:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
